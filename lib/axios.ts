import axios from 'axios'

const baseURL =
  process.env.NEXT_PUBLIC_OPENWEATHER_BASE || 'https://api.openweathermap.org/data/2.5'
const lat = '46.6752957'
const lon = '24.7135517'
const appid = process.env.NEXT_PUBLIC_OPENWEATHER_KEY

const instance = axios.create({ baseURL })

// Request interceptor: automatically add lat, lon, appid and units to every request
instance.interceptors.request.use((config) => {
  config.params = {
    ...(config.params || {}),
    lat,
    lon,
    appid,
    units: 'metric',
  }
  return config
})

export default instance
