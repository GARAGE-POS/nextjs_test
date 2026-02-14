import { test, expect } from '@playwright/test'

// Base URL for testing - adjust based on your local server
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'
const BASE_PATH = '/nextjs_test'
const FULL_URL = `${BASE_URL}${BASE_PATH}`

test.describe('BasePath Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app with basePath
    await page.goto(FULL_URL)
  })

  test('should load the home page with basePath', async ({ page }) => {
    // Check that the page loaded successfully
    await expect(page).toHaveURL(new RegExp(`${BASE_PATH}/?$`))

    // Check for main heading
    await expect(page.locator('h1')).toContainText('To get started')
  })

  test('Next.js logo image should load correctly', async ({ page }) => {
    // Find the Next.js logo
    const nextLogo = page.locator('img[alt="Next.js logo"]')

    // Check if visible
    await expect(nextLogo).toBeVisible()

    // Get the src attribute
    const src = await nextLogo.getAttribute('src')

    // Verify src includes basePath or is a Next.js optimized image path
    // Next.js Image component may transform the src
    expect(src).toBeTruthy()

    // Check that the image actually loaded (naturalWidth > 0 means loaded)
    const isLoaded = await nextLogo.evaluate((img: HTMLImageElement) => {
      return img.complete && img.naturalWidth > 0
    })

    expect(isLoaded).toBe(true)
  })

  test('Vercel logo image should load correctly', async ({ page }) => {
    // Find the Vercel logo
    const vercelLogo = page.locator('img[alt="Vercel logomark"]')

    // Check if visible
    await expect(vercelLogo).toBeVisible()

    // Check that the image loaded
    const isLoaded = await vercelLogo.evaluate((img: HTMLImageElement) => {
      return img.complete && img.naturalWidth > 0
    })

    expect(isLoaded).toBe(true)
  })

  test('Weather link should navigate with basePath', async ({ page }) => {
    // Click the Weather link
    await page.click('text=Weather')

    // Wait for navigation
    await page.waitForURL(new RegExp(`${BASE_PATH}/weather`))

    // Verify we're on the weather page
    await expect(page).toHaveURL(new RegExp(`${BASE_PATH}/weather`))

    // Check that weather page loaded
    await expect(page.locator('h1')).toContainText('Weather')
  })

  test('should not have 404 errors for static assets', async ({ page }) => {
    const failedRequests: string[] = []

    // Listen for failed requests
    page.on('response', (response) => {
      if (response.status() === 404) {
        failedRequests.push(response.url())
      }
    })

    // Navigate and wait for all resources to load
    await page.goto(FULL_URL)
    await page.waitForLoadState('networkidle')

    // Check that no critical assets failed to load
    const criticalAssetsFailed = failedRequests.filter(
      (url) =>
        url.includes('.js') || url.includes('.css') || url.includes('.svg') || url.includes('.png')
    )

    expect(criticalAssetsFailed).toHaveLength(0)
  })

  test('external links should work correctly', async ({ page }) => {
    // Check that external links exist and have correct attributes
    const vercelLink = page.locator('a:has-text("Deploy Now")')

    await expect(vercelLink).toBeVisible()
    await expect(vercelLink).toHaveAttribute('target', '_blank')
    await expect(vercelLink).toHaveAttribute('rel', 'noopener noreferrer')
  })
})

test.describe('BasePath - Navigation', () => {
  test('should maintain basePath across navigation', async ({ page }) => {
    // Start at home
    await page.goto(FULL_URL)

    // Navigate to weather
    await page.click('text=Weather')
    await page.waitForURL(new RegExp(`${BASE_PATH}/weather`))

    // Go back (if there's a back button or we can use browser back)
    await page.goBack()
    await page.waitForURL(new RegExp(`${BASE_PATH}/?$`))

    // Verify we're back at home with basePath
    await expect(page.locator('h1')).toContainText('To get started')
  })
})
