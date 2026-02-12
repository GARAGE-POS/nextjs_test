import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import WeatherClient from '../app/wheather/WeatherClient'
import axios from '../lib/axios'

jest.mock('../lib/axios', () => ({ get: jest.fn() }))

const mockedAxios = axios as jest.Mocked<typeof axios>

describe('WeatherClient', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('shows loading and then displays data', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { main: { temp: 30 }, weather: [{ description: 'sunny' }] },
    })

    render(<WeatherClient />)

    // loading indicator present
    expect(screen.getByText(/Loading/i)).toBeInTheDocument()

    // wait for temperature to appear
    const temp = await screen.findByText(/30/)
    expect(temp).toBeInTheDocument()
    expect(screen.getByText(/sunny/i)).toBeInTheDocument()

    expect(mockedAxios.get).toHaveBeenCalledWith('/weather')
  })

  it('shows error state when fetch fails', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'))

    render(<WeatherClient />)

    const err = await screen.findByText(/Error/i)
    expect(err).toBeInTheDocument()
  })

  it('refetches data when Refresh clicked', async () => {
    mockedAxios.get
      .mockResolvedValueOnce({ data: { main: { temp: 20 }, weather: [{ description: 'a' }] } })
      .mockResolvedValueOnce({ data: { main: { temp: 21 }, weather: [{ description: 'b' }] } })

    render(<WeatherClient />)

    await screen.findByText(/20/)

    const btn = screen.getByRole('button', { name: /Refresh/i })
    await userEvent.click(btn)

    const newTemp = await screen.findByText(/21/)
    expect(newTemp).toBeInTheDocument()
  })
})
