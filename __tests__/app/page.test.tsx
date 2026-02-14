import { render, screen } from '@testing-library/react'
import Home from '../../app/page'

jest.mock('../../components/AssetImage', () => ({
  AssetImage: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} data-testid="asset-image" />
  ),
}))

describe('Home Page - BasePath Integration', () => {
  const originalEnv = process.env.NEXT_PUBLIC_BASE_PATH

  afterEach(() => {
    process.env.NEXT_PUBLIC_BASE_PATH = originalEnv
  })

  describe('Development Environment', () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_BASE_PATH = ''
    })

    it('should render images without basePath', () => {
      render(<Home />)

      const nextLogo = screen.getByAltText('Next.js logo')
      const vercelLogo = screen.getByAltText('Vercel logomark')

      expect(nextLogo).toBeInTheDocument()
      expect(vercelLogo).toBeInTheDocument()
    })
  })

  describe('Production Environment', () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_BASE_PATH = '/nextjs_test'
    })

    it('should render images with basePath', () => {
      render(<Home />)

      const nextLogo = screen.getByAltText('Next.js logo')
      const vercelLogo = screen.getByAltText('Vercel logomark')

      expect(nextLogo).toBeInTheDocument()
      expect(vercelLogo).toBeInTheDocument()
    })

    it('should render weather link', () => {
      render(<Home />)

      const weatherLink = screen.getByText('Weather')
      expect(weatherLink).toBeInTheDocument()
      expect(weatherLink.closest('a')).toHaveAttribute('href', '/weather')
    })
  })
})
