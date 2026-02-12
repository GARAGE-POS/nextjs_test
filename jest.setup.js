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

// Polyfill scrollIntoView for jsdom compatibility
if (typeof Element !== 'undefined' && !Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = function () {}
}
