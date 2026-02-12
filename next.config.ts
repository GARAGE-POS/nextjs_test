import type { NextConfig } from 'next'

const isProd = process.env.NODE_ENV === 'production'
const basePath = isProd ? '/nextjs_test' : ''

const nextConfig: NextConfig = {
  basePath: basePath ? '/nextjs_test' : '',
  output: 'export',
  images: {
    unoptimized: true,
  },
}

export default nextConfig
