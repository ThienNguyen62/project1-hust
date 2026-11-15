import { useEffect, useState } from 'react'

const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, '')

export default function BackendStatus() {
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState({ status: 'loading', message: '' })

  useEffect(() => {
    const controller = new AbortController()
    let active = true
    const timeout = setTimeout(() => controller.abort(), 8000)

    async function checkBackend() {
      setResult({ status: 'loading', message: '' })
      try {
        const response = await fetch(`${apiUrl}/api/health`, { signal: controller.signal })
        if (!response.ok) throw new Error(`API trả HTTP ${response.status}`)
        const data = await response.json()
        if (data.status !== 'ok' || typeof data.message !== 'string') {
          throw new Error('API trả dữ liệu không đúng định dạng')
        }
        if (active) setResult({ status: 'success', message: data.message })
      } catch (error) {
        if (active) {
          setResult({
            status: 'error',
            message: `${error.message}. Kiểm tra backend đang chạy, địa chỉ API và CLIENT_ORIGIN.`,
          })
        }
      } finally {
        clearTimeout(timeout)
      }
    }

    checkBackend()
    return () => {
      active = false
      clearTimeout(timeout)
      controller.abort()
    }
  }, [attempt])

  return (
    <section className="backend-status" aria-labelledby="backend-heading">
      <h2 id="backend-heading">Kết nối backend</h2>
      <p><code>{apiUrl}/api/health</code></p>
      <div role="status" aria-live="polite">
        {result.status === 'loading' && <p>Đang kiểm tra kết nối…</p>}
        {result.status === 'success' && <p>Kết nối backend thành công: {result.message}</p>}
        {result.status === 'error' && <p>Không kết nối được backend: {result.message}</p>}
      </div>
      <button className="counter" type="button" disabled={result.status === 'loading'}
        onClick={() => setAttempt(value => value + 1)}>
        Kiểm tra lại
      </button>
    </section>
  )
}
