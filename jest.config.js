const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  coverageProvider: 'v8',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '/e2e/'],
  modulePathIgnorePatterns: ['<rootDir>/.next/'],
  collectCoverageFrom: ['app/**/*.{js,jsx,ts,tsx}', '!app/**/*.d.ts', '!app/**/*.stories.tsx'],
  maxWorkers: '50%',
  workerIdleMemoryLimit: '512MB',
  cache: true,
  cacheDirectory: '<rootDir>/.jest-cache',
  passWithNoTests: true,
}

module.exports = createJestConfig(customJestConfig)
