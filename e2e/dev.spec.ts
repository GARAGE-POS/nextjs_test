import { test, expect } from '@playwright/test'

test.describe('Dev server (local) checks', () => {
  test('homepage image path uses root (no basePath)', async ({ page }) => {
    await page.goto('/')
    const img = page.getByAltText('Next.js logo')
    await expect(img).toBeVisible()
    const src = await img.getAttribute('src')
    expect(src).toBeTruthy()
    // In dev we expect no /nextjs_test prefix
    expect(src).toContain('/next.svg')
    expect(src).not.toContain('/nextjs_test/')
  })
})
