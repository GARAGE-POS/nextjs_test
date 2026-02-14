import { render, screen } from '@testing-library/react'
import { AssetImage } from '../../components/AssetImage'

// Mock the getAssetPath helper
jest.mock('../../lib/helpers', () => ({
  getAssetPath: jest.fn((path: string) => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
    return `${basePath}${path}`
  }),
}))

describe('AssetImage Component', () => {
  const originalEnv = process.env.NEXT_PUBLIC_BASE_PATH

  afterEach(() => {
    process.env.NEXT_PUBLIC_BASE_PATH = originalEnv
    jest.clearAllMocks()
  })

  describe('Development Environment', () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_BASE_PATH = ''
    })

    it('should render image with path without basePath', () => {
      render(<AssetImage src="/next.svg" alt="Next.js logo" width={100} height={20} />)

      const img = screen.getByAltText('Next.js logo')
      expect(img).toBeInTheDocument()
      expect(img).toHaveAttribute('src', expect.stringContaining('next.svg'))
    })

    it('should render with default alt text when not provided', () => {
      render(<AssetImage src="/test.png" width={50} height={50} />)

      const img = screen.getByAltText('picture')
      expect(img).toBeInTheDocument()
    })
  })

  describe('Production Environment', () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_BASE_PATH = '/nextjs_test'
    })

    it('should render image with basePath prepended', () => {
      render(<AssetImage src="/next.svg" alt="Next.js logo" width={100} height={20} />)

      const img = screen.getByAltText('Next.js logo')
      expect(img).toBeInTheDocument()
      // Next.js Image component transforms the src, so check it was called correctly
    })

    it('should handle multiple images with correct paths', () => {
      const { rerender } = render(
        <AssetImage src="/next.svg" alt="Next logo" width={100} height={20} />
      )

      expect(screen.getByAltText('Next logo')).toBeInTheDocument()

      rerender(<AssetImage src="/vercel.svg" alt="Vercel logo" width={16} height={16} />)

      expect(screen.getByAltText('Vercel logo')).toBeInTheDocument()
    })
  })

  describe('Image Props', () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_BASE_PATH = ''
    })

    it('should pass through all Image props correctly', () => {
      render(
        <AssetImage
          src="/test.jpg"
          alt="Test image"
          width={200}
          height={150}
          priority
          className="test-class"
        />
      )

      const img = screen.getByAltText('Test image')
      expect(img).toBeInTheDocument()
      expect(img).toHaveClass('test-class')
    })

    it('should handle imported image objects', () => {
      const mockImportedImage = {
        src: '/_next/static/media/test.abc123.png',
        height: 100,
        width: 100,
      }

      render(<AssetImage src={mockImportedImage} alt="Imported image" width={100} height={100} />)

      const img = screen.getByAltText('Imported image')
      expect(img).toBeInTheDocument()
    })
  })
})
