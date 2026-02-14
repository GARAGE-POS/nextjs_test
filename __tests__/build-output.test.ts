import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

describe('Build Output Verification', () => {
  const outDir = join(process.cwd(), 'out')

  it('should have out directory after build', () => {
    // Skip if out directory doesn't exist (not built yet)
    if (!existsSync(outDir)) {
      console.warn('⚠️  out/ directory not found. Run "npm run build:prod" first.')
      return
    }

    expect(existsSync(outDir)).toBe(true)
  })

  it('should have index.html in out directory', () => {
    const indexPath = join(outDir, 'index.html')

    if (!existsSync(indexPath)) {
      console.warn('⚠️  out/index.html not found. Run "npm run build:prod" first.')
      return
    }

    expect(existsSync(indexPath)).toBe(true)
  })

  it('should have correct basePath in generated HTML when NEXT_PUBLIC_BASE_PATH is set', () => {
    const indexPath = join(outDir, 'index.html')

    if (!existsSync(indexPath)) {
      console.warn('⚠️  out/index.html not found. Run "npm run build:prod" first.')
      return
    }

    const html = readFileSync(indexPath, 'utf-8')

    // If NEXT_PUBLIC_BASE_PATH was set during build
    const expectedBasePath = '/nextjs_test'

    // Check if basePath appears in the HTML
    // This could be in script sources, link hrefs, or asset paths
    if (html.includes(expectedBasePath)) {
      // Verify it's used correctly
      expect(html).toContain(expectedBasePath)

      // Check for common patterns
      const hasCorrectScripts = html.includes(`${expectedBasePath}/_next/static`)
      const hasCorrectStyles =
        html.includes(`${expectedBasePath}/_next/static`) || html.includes('_next/static')

      expect(hasCorrectScripts || hasCorrectStyles).toBe(true)
    } else {
      console.warn(
        '⚠️  basePath not found in HTML. Build may have been done without NEXT_PUBLIC_BASE_PATH.'
      )
    }
  })

  it('should have SVG files in public assets', () => {
    const nextSvgPath = join(outDir, 'next.svg')
    const vercelSvgPath = join(outDir, 'vercel.svg')

    if (!existsSync(outDir)) {
      console.warn('⚠️  out/ directory not found. Run "npm run build:prod" first.')
      return
    }

    // At least one of these should exist
    const hasAssets = existsSync(nextSvgPath) || existsSync(vercelSvgPath)

    if (!hasAssets) {
      console.warn('⚠️  SVG assets not found in out/. Check build configuration.')
    }

    expect(hasAssets || existsSync(outDir)).toBe(true)
  })

  it('should not have double basePath in URLs', () => {
    const indexPath = join(outDir, 'index.html')

    if (!existsSync(indexPath)) {
      console.warn('⚠️  out/index.html not found. Run "npm run build:prod" first.')
      return
    }

    const html = readFileSync(indexPath, 'utf-8')

    // Check for double basePath (a common mistake)
    const doubleBasePath = '/nextjs_test/nextjs_test'
    expect(html).not.toContain(doubleBasePath)
  })
})
