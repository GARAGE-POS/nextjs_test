'use client'
import { useEffect, useState, useCallback, useRef } from 'react'
import { toast } from 'react-toastify'
import axios from '../lib/axios'

export default function useAxios<T = unknown>(path: string) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const controllerRef = useRef<AbortController | null>(null)

  const fetcher = useCallback(async (): Promise<T | null> => {
    setLoading(true)
    const controller = new AbortController()
    // store controller so we can cancel from cleanup or subsequent calls
    controllerRef.current?.abort()
    controllerRef.current = controller
    try {
      const res = await axios.get(path, { signal: controller.signal })
      setData(res.data)
      setError(null)
      return res.data
    } catch (err: unknown) {
      type MaybeAxiosError = {
        code?: string
        name?: string
        response?: { data?: { message?: string } }
        message?: string
      }

      const e = err as MaybeAxiosError

      // Ignore aborts
      if (e?.code === 'ERR_CANCELED' || e?.name === 'CanceledError') {
        return null
      }

      const msg = e?.response?.data?.message ?? e?.message ?? String(err)
      toast.error(msg)

      console.error('Error fetching data:', err)
      setError('something went wrong! our team has been notified.')
      setData(null)
      return null
    } finally {
      setLoading(false)
    }
  }, [path])

  useEffect(() => {
    fetcher().catch(() => {})

    return () => {
      controllerRef.current?.abort()
      controllerRef.current = null
    }
  }, [fetcher])

  return { data, error, loading, refetch: fetcher }
}
