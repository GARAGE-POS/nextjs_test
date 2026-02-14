import type { NextConfig } from 'next'

const isProd = process.env.NODE_ENV === 'production'

const nextConfig: NextConfig = {
  basePath: isProd ? process.env.NEXT_PUBLIC_BASE_PATH || '/nextjs_test' : '',
  output: 'export',
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_OPENWEATHER_BASE:
      process.env.NEXT_PUBLIC_OPENWEATHER_BASE || 'https://api.openweathermap.org/data/2.5',
    NEXT_PUBLIC_OPENWEATHER_KEY: process.env.NEXT_PUBLIC_OPENWEATHER_KEY || '',
    NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH || '',
  },
}

export default nextConfig
