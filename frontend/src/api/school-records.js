const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, '')

export async function requestSchoolRecords(path, { signal, method = 'GET', body } = {}) {
  const response = await fetch(`${apiUrl}/api${path}`, {
    signal, method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  const payload = await response.json()
  if (!response.ok) throw new Error(payload.message || 'Không xử lý được yêu cầu.')
  return payload.data
}
