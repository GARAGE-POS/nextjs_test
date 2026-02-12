import { render, screen } from '@testing-library/react'
import Home from './page'

describe('Home Page', () => {
  it('renders the page title', () => {
    render(<Home />)

    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
  })

  it('renders the Next.js logo', () => {
    render(<Home />)

    const logo = screen.getByAltText('Next.js logo')
    expect(logo).toBeInTheDocument()
  })

  it('contains links to Vercel resources', () => {
    render(<Home />)

    const learnLink = screen.getByText('Learning')
    expect(learnLink).toBeInTheDocument()
    expect(learnLink).toHaveAttribute('href', expect.stringContaining('nextjs.org/learn'))
  })
})
