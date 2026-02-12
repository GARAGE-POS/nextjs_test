import axios from 'axios'

const baseURL =
  process.env.NEXT_PUBLIC_OPENWEATHER_BASE || 'https://api.openweathermap.org/data/2.5'
const lat = process.env.NEXT_PUBLIC_OPENWEATHER_LAT
const lon = process.env.NEXT_PUBLIC_OPENWEATHER_LON
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
