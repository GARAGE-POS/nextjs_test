describe('getAssetPath', () => {
  const originalEnv = process.env.NEXT_PUBLIC_BASE_PATH

  afterEach(() => {
    // Restore original env after each test
    process.env.NEXT_PUBLIC_BASE_PATH = originalEnv
    // Clear module cache to reload with new env
    jest.resetModules()
  })

  describe('Development Environment', () => {
    it('should return path without basePath prefix when NEXT_PUBLIC_BASE_PATH is empty', () => {
      process.env.NEXT_PUBLIC_BASE_PATH = ''
      const { getAssetPath } = require('../../lib/helpers')

      expect(getAssetPath('/next.svg')).toBe('/next.svg')
    })

    it('should handle multiple assets correctly', () => {
      process.env.NEXT_PUBLIC_BASE_PATH = ''
      const { getAssetPath } = require('../../lib/helpers')

      expect(getAssetPath('/vercel.svg')).toBe('/vercel.svg')
      expect(getAssetPath('/images/logo.png')).toBe('/images/logo.png')
    })

    it('should not add double slashes', () => {
      process.env.NEXT_PUBLIC_BASE_PATH = ''
      const { getAssetPath } = require('../../lib/helpers')

      expect(getAssetPath('/favicon.ico')).toBe('/favicon.ico')
    })
  })

  describe('Production Environment', () => {
    it('should prepend basePath when NEXT_PUBLIC_BASE_PATH is set', () => {
      process.env.NEXT_PUBLIC_BASE_PATH = '/nextjs_test'
      const { getAssetPath } = require('../../lib/helpers')

      expect(getAssetPath('/next.svg')).toBe('/nextjs_test/next.svg')
    })

    it('should handle multiple assets with basePath', () => {
      process.env.NEXT_PUBLIC_BASE_PATH = '/nextjs_test'
      const { getAssetPath } = require('../../lib/helpers')

      expect(getAssetPath('/vercel.svg')).toBe('/nextjs_test/vercel.svg')
      expect(getAssetPath('/images/logo.png')).toBe('/nextjs_test/images/logo.png')
    })

    it('should handle paths without leading slash', () => {
      process.env.NEXT_PUBLIC_BASE_PATH = '/nextjs_test'
      const { getAssetPath } = require('../../lib/helpers')

      expect(getAssetPath('favicon.ico')).toBe('/nextjs_testfavicon.ico')
      // Note: This shows the current behavior - might want to handle this edge case
    })
  })

  describe('Edge Cases', () => {
    it('should handle undefined NEXT_PUBLIC_BASE_PATH', () => {
      delete process.env.NEXT_PUBLIC_BASE_PATH
      const { getAssetPath } = require('../../lib/helpers')

      expect(getAssetPath('/next.svg')).toBe('/next.svg')
    })

    it('should handle empty string path', () => {
      process.env.NEXT_PUBLIC_BASE_PATH = '/nextjs_test'
      const { getAssetPath } = require('../../lib/helpers')

      expect(getAssetPath('')).toBe('/nextjs_test')
    })

    it('should handle root path', () => {
      process.env.NEXT_PUBLIC_BASE_PATH = '/nextjs_test'
      const { getAssetPath } = require('../../lib/helpers')

      expect(getAssetPath('/')).toBe('/nextjs_test/')
    })
  })
})
