# Quick Reference Card 📋

Print this or keep it open while working on the assessment!

## 🚀 Setup Commands

```bash
# Open in Dev Container (VS Code)
F1 → "Dev Containers: Reopen in Container"

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🧪 Testing Commands

```bash
# Unit tests
npm test                    # Run once
npm run test:watch         # Watch mode
npm run test:coverage      # With coverage

# E2E tests
npx playwright install --with-deps  # First time only
npx playwright test                  # Run all
npx playwright test --ui            # UI mode (recommended)
npx playwright test --headed        # See browser
```

## ✅ Pre-Commit Checklist

```bash
npm run format           # Auto-format code
npm run lint            # Check for linting errors
npm run test:ts         # Check TypeScript errors
npm test                # Run unit tests
npx playwright test     # Run E2E tests
npm run build           # Verify build works
```

## 📝 Commit Format

```bash
feat: add weather API integration
fix: resolve data fetching error
test: add unit tests for weather component
docs: update README
style: format code
refactor: simplify API call logic
```

## 🔍 Common Test Queries

```typescript
// React Testing Library
screen.getByRole('button', { name: /submit/i })
screen.getByText(/hello/i)
screen.getByLabelText(/email/i)
screen.getByTestId('my-element')
await screen.findByText(/loaded/i) // Async

// Playwright
page.goto('/')
await page.getByRole('button').click()
await expect(page.getByText('Hello')).toBeVisible()
await page.getByTestId('my-element').click()
```

## 🌐 Environment Variables

```bash
# Create .env.local (not committed)
NEXT_PUBLIC_API_KEY=your_key

# Use in code
const key = process.env.NEXT_PUBLIC_API_KEY
```

## 🎯 What You Need to Do

1. ✅ Set up Dev Container environment
2. ✅ Choose and integrate a public API
3. ✅ Display data with loading/error states
4. ✅ Add TypeScript types
5. ✅ Write unit tests for components
6. ✅ Write E2E tests for user flows
7. ✅ Fix any bugs you find
8. ✅ Ensure all CI checks pass
9. ✅ Create a clear Pull Request

## 🐛 Common Issues

**Port in use:**

```bash
lsof -ti:3000 | xargs kill -9
```

**Module not found:**

```bash
rm -rf node_modules package-lock.json && npm install
```

**Playwright browsers:**

```bash
npx playwright install --with-deps
```

## 📚 Quick Links

- [Next.js Docs](https://nextjs.org/docs)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Docs](https://playwright.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🎨 Example Component Structure

```typescript
'use client'
import { useState, useEffect } from 'react'

interface ApiData {
  // Define your types
}

export default function MyComponent() {
  const [data, setData] = useState<ApiData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(data => {
        setData(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!data) return <div>No data</div>

  return <div>{/* Your UI */}</div>
}
```

## ✨ Bonus Points

- Implement caching
- Add loading skeletons
- Add retry logic
- Make it responsive
- Add dark mode support
- Include accessibility features
- Add animations
- Implement pagination/search

## ⏱️ Time Management

- Setup: 15-30 min
- API Integration: 1-2 hours
- Testing: 1 hour
- Polish & CI: 30 min
- **Total: 2-4 hours**

## 🎯 Focus Areas

1. **Make it work** - Get basic functionality working
2. **Make it right** - Add tests, handle errors
3. **Make it good** - Polish, optimize, document

Don't spend too much time on perfection!

---

**Need Help?** Check the README.md and CONTRIBUTING.md

**Good luck! 🚀**
