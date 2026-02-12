'use client'
import useAxios from '../../hooks/useAxios'

type WeatherData = {
  main?: { temp?: number }
  weather?: { description?: string }[]
}

export default function WeatherClient() {
  const { data, error, loading } = useAxios<WeatherData>('/weather')

  const currentTemp = data?.main?.temp
  const description = data?.weather?.[0]?.description

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className="text-2xl font-semibold">Weather — Riyadh, Saudi Arabia</h1>

        {loading && <p className="mt-4">Loading…</p>}
        {error && <div className="mt-4 text-red-600">Error: {error}</div>}

        {!loading && !error && (
          <div className="mt-6 text-lg">
            <div>
              <strong>Temperature:</strong> {currentTemp ?? 'N/A'} °C
            </div>
            <div>
              <strong>Condition:</strong> {description ?? 'N/A'}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
