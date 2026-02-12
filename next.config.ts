import type { NextConfig } from 'next'

const isProd = process.env.NODE_ENV === 'production'
const basePath = isProd ? '/nextjs_test' : ''

const PROD_OPENWEATHER_KEY = '4c2b57758f396e0ff31a7a89fc82e0cc'

const nextConfig: NextConfig = {
  basePath: basePath ? '/nextjs_test' : '',
  output: 'export',
  images: {
    unoptimized: true,
  },
  env: isProd
    ? {
        NEXT_PUBLIC_OPENWEATHER_KEY: PROD_OPENWEATHER_KEY,
      }
    : {
        NEXT_PUBLIC_OPENWEATHER_KEY: process.env.NEXT_PUBLIC_OPENWEATHER_KEY,
      },
}

export default nextConfig
