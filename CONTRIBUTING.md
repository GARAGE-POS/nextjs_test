# Contributing Guide

Thank you for taking the time to complete this technical assessment! This guide provides additional tips and guidelines to help you succeed.

## 🎯 Quick Start Checklist

- [ ] Dev Container is running
- [ ] Dependencies installed (`npm install`)
- [ ] Development server starts (`npm run dev`)
- [ ] All tests pass locally (`npm test`)
- [ ] Playwright tests run successfully (`npx playwright test`)
- [ ] Code is formatted (`npm run format`)
- [ ] No linting errors (`npm run lint`)
- [ ] No TypeScript errors (`npm run test:ts`)

## 💡 Development Tips

### Working with Dev Containers

The dev container includes:

- Node.js 22
- GitHub CLI (`gh`)
- Desktop environment for GUI applications (VNC on port 6080)
- Playwright VS Code extension

If you need to rebuild the container:

```bash
# Press F1 and select: "Dev Containers: Rebuild Container"
```

### API Integration Best Practices

When integrating your chosen public API:

1. **Use Environment Variables** for API keys (if needed)

   ```typescript
   // Create .env.local file (not committed to git)
   NEXT_PUBLIC_API_KEY = your_key_here

   // Access in code
   const apiKey = process.env.NEXT_PUBLIC_API_KEY
   ```

2. **Use Next.js API Routes** (optional but recommended)

   ```typescript
   // app/api/data/route.ts
   export async function GET() {
     const response = await fetch('https://api.example.com/data')
     const data = await response.json()
     return Response.json(data)
   }
   ```

3. **Handle Loading and Error States**

   ```typescript
   const [data, setData] = useState(null)
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState(null)
   ```

4. **Use TypeScript Types**
   ```typescript
   interface ApiResponse {
     // Define your API response structure
   }
   ```

### Writing Tests

#### Unit Tests (Jest + React Testing Library)

Create tests alongside your components:

```typescript
// app/components/MyComponent.test.tsx
import { render, screen } from '@testing-library/react'
import MyComponent from './MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

Test async behavior:

```typescript
it('fetches and displays data', async () => {
  render(<MyComponent />)

  // Wait for loading to finish
  expect(screen.getByText('Loading...')).toBeInTheDocument()

  // Wait for data to appear
  const data = await screen.findByText('Data loaded')
  expect(data).toBeInTheDocument()
})
```

Mock API calls:

```typescript
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ data: 'test' }),
  })
) as jest.Mock
```

#### E2E Tests (Playwright)

Create tests in the `e2e/` directory:

```typescript
// e2e/home.spec.ts
import { test, expect } from '@playwright/test'

test('home page displays API data', async ({ page }) => {
  await page.goto('http://localhost:3000')

  // Wait for data to load
  await expect(page.getByText('Loading...')).toBeVisible()

  // Check if data is displayed
  await expect(page.getByTestId('api-data')).toBeVisible()
})
```

### Code Formatting and Linting

Before committing, always run:

```bash
# Auto-format your code
npm run format

# Check for linting errors
npm run lint

# Fix auto-fixable linting errors
npm run lint -- --fix
```

### Commit Message Conventions

We use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Feature
git commit -m "feat: add weather API integration"

# Bug fix
git commit -m "fix: resolve data fetching error"

# Tests
git commit -m "test: add unit tests for API component"

# Documentation
git commit -m "docs: update README with setup instructions"

# Code style/formatting
git commit -m "style: format code with prettier"

# Refactoring
git commit -m "refactor: simplify API call logic"
```

The commit message will be validated automatically by commitlint.

## 🐛 Common Issues and Solutions

### Issue: Dev Container won't start

**Solution**: Ensure Docker Desktop is running and you have enough resources allocated (at least 4GB RAM, 2 CPUs)

### Issue: Port 3000 is already in use

**Solution**:

```bash
# Find and kill the process using port 3000
lsof -ti:3000 | xargs kill -9
```

### Issue: Playwright tests fail with "browser not found"

**Solution**:

```bash
npx playwright install --with-deps
```

### Issue: Tests pass locally but fail in CI

**Solution**:

- Check for hardcoded localhost URLs (use environment variables)
- Ensure all dependencies are in `package.json`, not globally installed
- Check for timezone or locale-specific code

### Issue: Module not found errors

**Solution**:

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: TypeScript errors in test files

**Solution**: Ensure `jest.setup.js` is configured and `@testing-library/jest-dom` is imported

## 📚 Helpful Resources

### Next.js

- [Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Loading UI](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)
- [Error Handling](https://nextjs.org/docs/app/building-your-application/routing/error-handling)

### Testing

- [React Testing Library Queries](https://testing-library.com/docs/queries/about)
- [Jest Expect API](https://jestjs.io/docs/expect)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright Locators](https://playwright.dev/docs/locators)

### Tailwind CSS

- [Utility Classes](https://tailwindcss.com/docs/utility-first)
- [Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [Dark Mode](https://tailwindcss.com/docs/dark-mode)

## 🎨 Code Quality Tips

1. **Keep Components Small**: Break large components into smaller, reusable ones
2. **Use Meaningful Names**: Variables and functions should clearly describe their purpose
3. **Add Comments**: Explain complex logic or business requirements
4. **Handle Errors**: Always handle potential errors gracefully
5. **Type Everything**: Use TypeScript types instead of `any`
6. **Test Edge Cases**: Don't just test the happy path
7. **Keep DRY**: Don't Repeat Yourself - extract common logic
8. **Progressive Enhancement**: Start with working code, then optimize

## ✅ Pre-PR Checklist

Before submitting your Pull Request:

- [ ] All tests pass: `npm test`
- [ ] Playwright tests pass: `npx playwright test`
- [ ] Code is formatted: `npm run format`
- [ ] No linting errors: `npm run lint`
- [ ] No TypeScript errors: `npm run test:ts`
- [ ] Application builds: `npm run build`
- [ ] Added new tests for your changes
- [ ] Updated documentation if needed
- [ ] Commits follow conventional commit format
- [ ] PR description explains what and why

## 🤝 Getting Help

If you're stuck:

1. **Check the error message** - Read it carefully, it often tells you exactly what's wrong
2. **Check the documentation** - Links are provided in this guide
3. **Use console.log** - Debug by logging values at different points
4. **Use the debugger** - VS Code has excellent debugging support
5. **Search online** - Someone has likely encountered the same issue

## 📞 Questions?

If you have questions about the requirements, create a GitHub Issue describing:

- What you're trying to achieve
- What you've tried so far
- The specific question or blocker

Good luck with your assessment! 🚀
