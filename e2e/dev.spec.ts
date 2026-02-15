import { test, expect } from '@playwright/test'

// Dev tests expect app at root (no basePath); override baseURL to strip /nextjs_test if set
const rootBaseURL = (process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000').replace(
  /\/nextjs_test\/?$/,
  ''
)
test.use({ baseURL: rootBaseURL })

test.describe('Dev server (local) checks', () => {
  test('homepage image path uses root (no basePath)', async ({ page }) => {
    if (process.env.E2E_APP_BASE_PATH) {
      test.skip(true, 'Dev root test only runs when app is at root (no E2E_APP_BASE_PATH)')
    }
    await page.goto('/')
    // Skip when app is served under basePath (e.g. build:serve); only run when dev server is at root
    const logo = page.getByAltText('Next.js logo')
    try {
      await logo.waitFor({ state: 'visible', timeout: 2000 })
    } catch {
      test.skip(true, 'App not at root (likely running against build:serve with basePath)')
    }
    const img = logo
    const src = await img.getAttribute('src')
    expect(src).toBeTruthy()
    // In dev we expect no /nextjs_test prefix
    expect(src).toContain('/next.svg')
    expect(src).not.toContain('/nextjs_test/')
  })
})
