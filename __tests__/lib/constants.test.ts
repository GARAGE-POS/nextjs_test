describe('BASE_PATH constant', () => {
  const originalEnv = process.env.NEXT_PUBLIC_BASE_PATH

  afterEach(() => {
    process.env.NEXT_PUBLIC_BASE_PATH = originalEnv
    // Clear module cache to get fresh import
    jest.resetModules()
  })

  it('should be empty string in development', () => {
    process.env.NEXT_PUBLIC_BASE_PATH = ''
    const { BASE_PATH } = require('../../lib/constants')
    expect(BASE_PATH).toBe('')
  })

  it('should be "/nextjs_test" in production', () => {
    process.env.NEXT_PUBLIC_BASE_PATH = '/nextjs_test'
    const { BASE_PATH } = require('../../lib/constants')
    expect(BASE_PATH).toBe('/nextjs_test')
  })

  it('should default to empty string when env var is not set', () => {
    delete process.env.NEXT_PUBLIC_BASE_PATH
    const { BASE_PATH } = require('../../lib/constants')
    expect(BASE_PATH).toBe('')
  })

  it('should handle any custom basePath value', () => {
    process.env.NEXT_PUBLIC_BASE_PATH = '/my-custom-repo'
    const { BASE_PATH } = require('../../lib/constants')
    expect(BASE_PATH).toBe('/my-custom-repo')
  })
})
