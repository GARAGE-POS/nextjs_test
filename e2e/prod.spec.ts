import { test, expect } from '@playwright/test'

// Only run this test when PLAYWRIGHT_BASE_URL is set to a production URL
// that includes the `/nextjs_test` base path (e.g. http://localhost:3000/nextjs_test).
const baseURL = process.env.PLAYWRIGHT_BASE_URL || ''
test.skip(
  !baseURL.includes('/nextjs_test'),
  'Set PLAYWRIGHT_BASE_URL including /nextjs_test to run production checks'
)

test.describe('Production build checks', () => {
  test('homepage image path uses /nextjs_test basePath', async ({ page }) => {
    await page.goto('/')
    const img = page.getByAltText('Next.js logo')
    await expect(img).toBeVisible()
    const src = await img.getAttribute('src')
    expect(src).toBeTruthy()
    expect(src).toContain('/nextjs_test/next.svg')
  })
})
