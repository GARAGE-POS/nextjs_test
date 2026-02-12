import { test, expect } from '@playwright/test'

test.describe('Example Tests', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/.*/)
  })
})
