'use client'
import useAxios from '../../hooks/useAxios'
import Image from 'next/image'

type WeatherData = {
  main?: { temp?: number }
  weather?: { description?: string; icon?: string }[]
}

export default function WeatherClient() {
  const { data, error, loading } = useAxios<WeatherData>('/weather')

  const currentTemp = data?.main?.temp
  const description = data?.weather?.[0]?.description
  const icon = data?.weather?.[0]?.icon
  const loadingText = loading ? 'Loading...' : 'N/A'

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className="text-2xl font-semibold">Weather — Riyadh, Saudi Arabia</h1>

        {error && <div className="mt-4 text-red-600">Error: {error}</div>}

        {!error && (
          <div className="mt-6 text-lg">
            <div>
              <strong>Temperature:</strong> {currentTemp ? `${currentTemp} °C` : loadingText}
            </div>
            <div className="flex items-center gap-2">
              <strong>Condition:</strong> {description ?? loadingText}
              {icon && (
                <Image
                  src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                  alt={description ?? 'Weather icon'}
                  width={48}
                  height={48}
                  className="w-12 h-12"
                />
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
