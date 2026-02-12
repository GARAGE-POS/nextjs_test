import '@testing-library/jest-dom'

// Configure React act environment for React 18+
globalThis.IS_REACT_ACT_ENVIRONMENT = true

// Polyfill ResizeObserver for tests
global.ResizeObserver = class ResizeObserver {
  constructor(cb) {
    this.cb = cb
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Polyfill hasPointerCapture for jsdom/Radix UI compatibility
if (typeof Element !== 'undefined' && !Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = function () {
    return false
  }
  Element.prototype.setPointerCapture = function () {}
  Element.prototype.releasePointerCapture = function () {}
}

// Polyfill scrollIntoView for jsdom/Radix UI compatibility
if (typeof Element !== 'undefined' && !Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = function () {}
}

// Polyfill URL.createObjectURL for tests
if (!URL.createObjectURL) {
  URL.createObjectURL = jest.fn(() => 'blob:mock-url')
}

// Polyfill URL.revokeObjectURL for tests
if (!URL.revokeObjectURL) {
  URL.revokeObjectURL = jest.fn()
}

// Polyfill crypto.randomUUID for tests (Node.js 14+ has it, but Jest may not)
if (!global.crypto) {
  global.crypto = {}
}
if (!global.crypto.randomUUID) {
  global.crypto.randomUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }
}

// Polyfill crypto.getRandomValues for tests
if (!global.crypto.getRandomValues) {
  global.crypto.getRandomValues = (array) => {
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256)
    }
    return array
  }
}

// Suppress React 19 AggregateError and act() warnings in tests
const originalError = console.error
const originalWarn = console.warn
global.beforeAll(() => {
  console.error = (...args) => {
    const message = args[0]
    // Suppress AggregateError from React 19
    if (typeof message === 'string' && message.includes('AggregateError')) {
      return
    }
    // Suppress act() environment warnings from Radix UI components
    if (typeof message === 'string' && message.includes('not configured to support act')) {
      return
    }
    // Suppress "not wrapped in act" warnings (Radix UI internal state)
    if (typeof message === 'string' && message.includes('not wrapped in act')) {
      return
    }
    // Suppress React development warnings
    if (
      typeof message === 'string' &&
      (message.includes('Warning:') || message.includes('Error:'))
    ) {
      return
    }
    originalError(...args)
  }
  console.warn = (...args) => {
    const message = args[0]
    // Suppress controlled/uncontrolled component warnings from Radix UI
    if (
      typeof message === 'string' &&
      message.includes('is changing from uncontrolled to controlled')
    ) {
      return
    }
    if (
      typeof message === 'string' &&
      message.includes('is changing from controlled to uncontrolled')
    ) {
      return
    }
    // Suppress Radix UI Dialog accessibility warning (we handle this in production)
    if (
      typeof message === 'string' &&
      message.includes('Missing `Description` or `aria-describedby')
    ) {
      return
    }
    originalWarn(...args)
  }
})

global.afterAll(() => {
  console.error = originalError
  console.warn = originalWarn
})

// Mock @tanstack/react-query globally with default implementations
// Tests can override these mocks with specific return values as needed
const mockUseQuery = jest.fn()
const mockUseMutation = jest.fn()
const mockUseQueryClient = jest.fn()

jest.mock('@tanstack/react-query', () => {
  const actual = jest.requireActual('@tanstack/react-query')
  return {
    ...actual,
    useQuery: mockUseQuery,
    useMutation: mockUseMutation,
    useQueryClient: mockUseQueryClient,
  }
})

// Reset mock return values before each test
global.beforeEach(() => {
  mockUseQuery.mockReturnValue({
    data: { Data: [], TotalPages: 1, Page: 1, PageSize: 10, TotalCount: 0 },
    isLoading: false,
    isError: false,
    error: null,
    refetch: jest.fn(),
    isFetching: false,
    isSuccess: true,
    status: 'success',
    fetchStatus: 'idle',
  })
  mockUseMutation.mockReturnValue({
    mutate: jest.fn(),
    mutateAsync: jest.fn().mockResolvedValue({}),
    isLoading: false,
    isPending: false,
    isError: false,
    error: null,
    isSuccess: false,
    reset: jest.fn(),
  })
  mockUseQueryClient.mockReturnValue({
    invalidateQueries: jest.fn(),
    setQueryData: jest.fn(),
    getQueryData: jest.fn(),
    refetchQueries: jest.fn(),
  })
})

// Mock SasTokenContext globally
jest.mock('@/contexts/sas-token-context', () => ({
  useSasToken: jest.fn().mockReturnValue({
    getDownloadUrl: jest.fn((container, blob) => `https://example.com/${container}/${blob}`),
    buildDownloadUrl: jest.fn((container, blob) => `https://example.com/${container}/${blob}`),
  }),
  SasTokenProvider: ({ children }) => children,
}))

// Mock PermissionContext globally
jest.mock('@/contexts/permission-context', () => ({
  usePermissions: jest.fn().mockReturnValue({
    hasPermission: jest.fn().mockReturnValue(true),
    hasRole: jest.fn().mockReturnValue(true),
    hasAnyPermission: jest.fn().mockReturnValue(true),
    hasAllPermissions: jest.fn().mockReturnValue(true),
    hasAnyRole: jest.fn().mockReturnValue(true),
    isSuperAdmin: jest.fn().mockReturnValue(false),
    isLoading: false,
    isInitialized: true,
  }),
  PermissionProvider: ({ children }) => children,
  SYSTEM_ROLES: {
    SUPER_ADMIN: 'SuperAdmin',
    ACCOUNTS_MANAGER: 'AccountsManager',
  },
  ACCOUNT_ROLES: {
    ACCOUNT_MANAGER: 'AccountManager',
    ACCOUNT_OWNER: 'AccountOwner',
    GENERAL_SUPERVISOR: 'GeneralSupervisor',
    BRANCH_MANAGER: 'BranchManager',
    STOCK_MANAGER: 'StockManager',
    CASHIER: 'Cashier',
    TECHNICIAN: 'Technician',
    ASSISTANT: 'Assistant',
  },
  ALL_ROLES: {
    SUPER_ADMIN: 'SuperAdmin',
    ACCOUNTS_MANAGER: 'AccountsManager',
    ACCOUNT_MANAGER: 'AccountManager',
    ACCOUNT_OWNER: 'AccountOwner',
    GENERAL_SUPERVISOR: 'GeneralSupervisor',
    BRANCH_MANAGER: 'BranchManager',
    STOCK_MANAGER: 'StockManager',
    CASHIER: 'Cashier',
    TECHNICIAN: 'Technician',
    ASSISTANT: 'Assistant',
  },
}))
