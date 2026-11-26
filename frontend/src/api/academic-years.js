const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, '')

async function request(options, id) {
  let response
  try {
    const path = id == null ? '' : `/${id}`
    response = await fetch(`${apiUrl}/api/academic-years${path}`, options)
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new Error('Không kết nối được máy chủ. Vui lòng thử lại.')
  }

  if (response.status >= 500) throw new Error('Máy chủ gặp lỗi. Vui lòng thử lại.')
  const body = await response.json()
  if (!response.ok) throw new Error(body.message || 'Không xử lý được yêu cầu.')
  return body.data
}

export function listAcademicYears(signal) {
  return request({ signal })
}

export function saveAcademicYear(input, id) {
  return request({
    method: id == null ? 'POST' : 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  }, id)
}

export function deleteAcademicYear(id) {
  return request({ method: 'DELETE' }, id)
}
