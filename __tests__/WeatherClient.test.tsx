import React from 'react'
import { render, screen } from '@testing-library/react'
import WeatherClient from '../app/weather/WeatherClient'
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

    // loading indicator present (there are multiple "Loading..." texts)
    const loadingElements = screen.getAllByText(/Loading/i)
    expect(loadingElements.length).toBeGreaterThan(0)

    // wait for temperature to appear
    const temp = await screen.findByText(/30/)
    expect(temp).toBeInTheDocument()
    expect(screen.getByText(/sunny/i)).toBeInTheDocument()

    // Verify axios was called with /weather and a signal (AbortController)
    expect(mockedAxios.get).toHaveBeenCalledWith(
      '/weather',
      expect.objectContaining({
        signal: expect.any(Object),
      })
    )
  })

  it('shows error state when fetch fails', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'))

    render(<WeatherClient />)

    const err = await screen.findByText(/Error/i)
    expect(err).toBeInTheDocument()
  })

  it('displays weather data correctly', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { main: { temp: 20 }, weather: [{ description: 'cloudy' }] },
    })

    render(<WeatherClient />)

    // Wait for data to load
    const temp = await screen.findByText(/20/)
    expect(temp).toBeInTheDocument()
    expect(screen.getByText(/cloudy/i)).toBeInTheDocument()

    // Verify the structure
    expect(screen.getByText(/Temperature:/i)).toBeInTheDocument()
    expect(screen.getByText(/Condition:/i)).toBeInTheDocument()
  })
})
