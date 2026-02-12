# Example API Integration Patterns

This document shows common patterns for integrating APIs in Next.js. Use these as reference, but implement your own solution!

## Pattern 1: Client-Side Fetch with useEffect

```typescript
'use client'
import { useState, useEffect } from 'react'

interface DataType {
  id: number
  name: string
  // Add your API response structure
}

export function ClientSideExample() {
  const [data, setData] = useState<DataType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const response = await fetch('https://api.example.com/data')

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const json = await response.json()
        setData(json)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, []) // Empty dependency array = run once on mount

  if (loading) {
    return (
      <div role="status" aria-live="polite">
        Loading...
      </div>
    )
  }

  if (error) {
    return (
      <div role="alert" className="text-red-600">
        Error: {error}
      </div>
    )
  }

  if (!data) {
    return <div>No data available</div>
  }

  return (
    <div data-testid="api-data">
      <h2>{data.name}</h2>
      {/* Render your data */}
    </div>
  )
}
```

## Pattern 2: Using Next.js API Routes (Recommended)

### Create API Route: `app/api/data/route.ts`

```typescript
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const apiKey = process.env.API_KEY // Server-side only
    const response = await fetch('https://api.example.com/data', {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch data' }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

### Use in Component

```typescript
'use client'
import { useState, useEffect } from 'react'

export function ComponentUsingApiRoute() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/data')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch')
        return res.json()
      })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  // Render logic...
}
```

## Pattern 3: Custom Hook (Best Practice)

### Create Hook: `hooks/useApiData.ts`

```typescript
import { useState, useEffect } from 'react'

interface UseApiDataResult<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useApiData<T>(url: string): UseApiDataResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refetchTrigger, setRefetchTrigger] = useState(0)

  useEffect(() => {
    let isMounted = true // Prevent state updates if component unmounts

    async function fetchData() {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const json = await response.json()

        if (isMounted) {
          setData(json)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unknown error')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [url, refetchTrigger])

  const refetch = () => setRefetchTrigger((prev) => prev + 1)

  return { data, loading, error, refetch }
}
```

### Use Hook in Component

```typescript
'use client'
import { useApiData } from '@/hooks/useApiData'

interface MyDataType {
  id: number
  title: string
}

export function ComponentWithHook() {
  const { data, loading, error, refetch } = useApiData<MyDataType>('/api/data')

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} onRetry={refetch} />
  if (!data) return <EmptyState />

  return <DataDisplay data={data} />
}
```

## Testing Patterns

### Unit Test for Component

```typescript
import { render, screen, waitFor } from '@testing-library/react'
import { ComponentUsingApi } from './component'

// Mock fetch
global.fetch = jest.fn()

describe('ComponentUsingApi', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear()
  })

  it('displays loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    )

    render(<ComponentUsingApi />)
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('displays data when fetch succeeds', async () => {
    const mockData = { id: 1, name: 'Test' }

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    })

    render(<ComponentUsingApi />)

    await waitFor(() => {
      expect(screen.getByText('Test')).toBeInTheDocument()
    })
  })

  it('displays error when fetch fails', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network error')
    )

    render(<ComponentUsingApi />)

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument()
    })
  })
})
```

### E2E Test with Playwright

```typescript
import { test, expect } from '@playwright/test'

test.describe('API Integration', () => {
  test('displays data from API', async ({ page }) => {
    await page.goto('/')

    // Wait for loading to disappear
    await expect(page.getByText(/loading/i)).toBeVisible()
    await expect(page.getByText(/loading/i)).not.toBeVisible({ timeout: 10000 })

    // Check if data is displayed
    await expect(page.getByTestId('api-data')).toBeVisible()
  })

  test('handles network errors gracefully', async ({ page, context }) => {
    // Simulate offline
    await context.setOffline(true)

    await page.goto('/')

    // Should show error message
    await expect(page.getByRole('alert')).toBeVisible()
  })

  test('can retry after error', async ({ page }) => {
    await page.goto('/')

    // Assuming there's a retry button
    await page.getByRole('button', { name: /retry/i }).click()

    await expect(page.getByText(/loading/i)).toBeVisible()
  })
})
```

## Error Handling Patterns

### User-Friendly Error Component

```typescript
interface ErrorMessageProps {
  error: string
  onRetry?: () => void
}

export function ErrorMessage({ error, onRetry }: ErrorMessageProps) {
  return (
    <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4">
      <h3 className="font-semibold text-red-800">Something went wrong</h3>
      <p className="text-sm text-red-600">{error}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          Try Again
        </button>
      )}
    </div>
  )
}
```

### Loading Skeleton

```typescript
export function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
  )
}
```

## TypeScript Tips

### Define API Response Types

```typescript
// types/api.ts
export interface ApiResponse<T> {
  data: T
  error?: string
  status: number
}

export interface User {
  id: number
  name: string
  email: string
}

// Use in component
const response: ApiResponse<User> = await fetchUser()
```

### Type Guards

```typescript
function isValidData(data: unknown): data is MyDataType {
  return typeof data === 'object' && data !== null && 'id' in data && 'name' in data
}

// Use it
const json = await response.json()
if (isValidData(json)) {
  setData(json) // TypeScript knows it's MyDataType
} else {
  throw new Error('Invalid data format')
}
```

## Environment Variables

### Setup

```bash
# .env.local (not committed)
NEXT_PUBLIC_API_URL=https://api.example.com
API_SECRET_KEY=secret123
```

### Usage

```typescript
// Server-side (API routes)
const secretKey = process.env.API_SECRET_KEY

// Client-side (must be prefixed with NEXT_PUBLIC_)
const apiUrl = process.env.NEXT_PUBLIC_API_URL
```

## Caching Pattern (Advanced)

```typescript
const cache = new Map<string, { data: unknown; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

async function fetchWithCache<T>(url: string): Promise<T> {
  const cached = cache.get(url)
  const now = Date.now()

  if (cached && now - cached.timestamp < CACHE_DURATION) {
    return cached.data as T
  }

  const response = await fetch(url)
  const data = await response.json()

  cache.set(url, { data, timestamp: now })

  return data
}
```

## Common APIs for Reference

### JSONPlaceholder (No API key needed)

```typescript
const response = await fetch('https://jsonplaceholder.typicode.com/users')
```

### Dog CEO API (No API key needed)

```typescript
const response = await fetch('https://dog.ceo/api/breeds/image/random')
```

### OpenWeather

```typescript
const response = await fetch(
  `https://api.openweathermap.org/data/2.5/weather?q=London&appid=${API_KEY}`
)
```

---

## Best Practices Checklist

- ✅ Always handle loading states
- ✅ Always handle error states
- ✅ Use TypeScript types for API responses
- ✅ Never expose API keys in client-side code
- ✅ Add `testid` attributes for testing
- ✅ Include retry functionality for errors
- ✅ Add proper ARIA attributes for accessibility
- ✅ Clean up subscriptions/listeners in useEffect
- ✅ Validate API responses before using them
- ✅ Add loading indicators for better UX

---

**Remember:** These are patterns to learn from. Implement your own solution based on your chosen API and requirements!
