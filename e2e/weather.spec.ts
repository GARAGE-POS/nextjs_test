import { test, expect } from '@playwright/test'

// When E2E_APP_BASE_PATH is set (e.g. /nextjs_test), app is under basePath. When unset, app is at root (dev/CI).
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'
const APP_BASE = `${BASE_URL}${process.env.E2E_APP_BASE_PATH || ''}`

test.describe('Weather page', () => {
  test('shows weather data when API returns success', async ({ page }) => {
    await page.route('**/api.openweathermap.org/**', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ main: { temp: 25 }, weather: [{ description: 'clear sky' }] }),
      })
    )

    await page.goto(APP_BASE + '/weather')

    await expect(page.locator('text=Temperature:')).toBeVisible()
    await expect(page.locator('text=25')).toBeVisible()
    await expect(page.locator('text=clear sky')).toBeVisible()
  })

  test('shows error when API fails', async ({ page }) => {
    await page.route('**/api.openweathermap.org/**', (route) =>
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'server error' }),
      })
    )

    await page.goto(APP_BASE + '/weather')

    await expect(page.locator('text=Error:')).toBeVisible()
  })
})
