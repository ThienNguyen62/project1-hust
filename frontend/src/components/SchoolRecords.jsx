import { useEffect, useRef, useState } from 'react'
import { requestSchoolRecords } from '../api/school-records.js'

export default function SchoolRecords({
  path, label, fields, toPayload, filter = () => true,
  columns = fields, renderHeader, formContext, pageSize, filterKey,
}) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [attempt, setAttempt] = useState(0)
  const [loadError, setLoadError] = useState('')
  const [formError, setFormError] = useState('')
  const [notice, setNotice] = useState('')
  const [action, setAction] = useState(null)
  const [saving, setSaving] = useState(false)
  const [pagination, setPagination] = useState({ key: filterKey, page: 1 })
  const dialog = useRef(null)

  useEffect(() => {
    const controller = new AbortController()
    requestSchoolRecords(path, { signal: controller.signal })
      .then((data) => { if (!controller.signal.aborted) setRows(data) })
      .catch((error) => { if (!controller.signal.aborted) setLoadError(error.message) })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [path, attempt])

  function reload() {
    setLoadError('')
    setLoading(true)
    setAttempt((previous) => previous + 1)
  }

  function open(mode, row) {
    setAction({ mode, row })
    setFormError('')
    dialog.current.showModal()
  }

  async function submit(event) {
    event.preventDefault()
    if (saving) return
    const { mode, row } = action
    const method = { add: 'POST', edit: 'PUT', delete: 'DELETE' }[mode]
    const endpoint = row ? `${path}/${row.id}` : path
    const body = mode === 'delete' ? undefined : toPayload(new FormData(event.currentTarget))
    setSaving(true)
    setFormError('')
    setNotice('')
    try {
      await requestSchoolRecords(endpoint, { method, body })
      dialog.current?.close()
      setNotice(`Đã ${{ add: 'thêm', edit: 'sửa', delete: 'xóa' }[mode]} ${label}.`)
      reload()
    } catch (error) {
      setFormError(error.message)
    } finally {
      setSaving(false)
    }
  }

  const visible = rows.filter(filter)
  const size = pageSize || Math.max(1, visible.length)
  const pages = Math.max(1, Math.ceil(visible.length / size))
  const page = Math.min(pages, pagination.key === filterKey ? pagination.page : 1)
  const offset = (page - 1) * size
  const shown = visible.slice(offset, offset + size)
  const goTo = (number) => setPagination({ key: filterKey, page: number })
  const formTitle = action ? `${{ add: 'Thêm', edit: 'Sửa', delete: 'Xóa' }[action.mode]} ${label}` : ''
  const addButton = <button type="button" className="records-add" onClick={() => open('add')}
    disabled={loading || Boolean(loadError)}>+ Thêm {label}</button>

  return (
    <div className={renderHeader ? 'records-layout' : 'academic-years-card'}>
      {renderHeader ? renderHeader({ rows, addButton, loading, loadError }) : addButton}
      {notice && <p role="status">{notice}</p>}
      {loading && <p role="status">Đang tải danh sách…</p>}
      {loadError && <div><p role="alert">{loadError}</p><button type="button" onClick={reload}>Thử lại</button></div>}
      {!loading && !loadError && visible.length === 0 && <p>Không có {label} phù hợp.</p>}
      {!loading && !loadError && visible.length > 0 && (
        <div className="academic-years-table">
          <table>
            <thead><tr>{columns.map((field) => <th key={field.name} scope="col">{field.label}</th>)}
              <th scope="col">Thao tác</th></tr></thead>
            <tbody>{shown.map((row) => (
              <tr key={row.id}>
                {columns.map((field) => <td key={field.name}>{field.display?.(row[field.name]) ?? row[field.name]}</td>)}
                <td className="academic-years-row-actions">
                  <button type="button" onClick={() => open('edit', row)}>Sửa</button>
                  <button type="button" onClick={() => open('delete', row)}>Xóa</button>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
      {pageSize && !loading && !loadError && visible.length > 0 && (
        <footer className="records-pagination">
          <span>Hiển thị {offset + 1}–{offset + shown.length} trên {visible.length} {label}</span>
          {pages > 1 && <nav aria-label="Phân trang">
            <button type="button" aria-label="Trang trước" disabled={page === 1} onClick={() => goTo(page - 1)}>‹</button>
            {Array.from({ length: pages }, (_, index) => index + 1).map((number) => (
              <button key={number} type="button" aria-current={number === page ? 'page' : undefined}
                aria-label={`Trang ${number}`} onClick={() => goTo(number)}>{number}</button>
            ))}
            <button type="button" aria-label="Trang sau" disabled={page === pages} onClick={() => goTo(page + 1)}>›</button>
          </nav>}
        </footer>
      )}
      <dialog ref={dialog} className="academic-years-dialog" aria-label={formTitle}
        onClose={() => setAction(null)}
        onCancel={(event) => { if (saving) event.preventDefault() }}>
        {action && (
          <form onSubmit={submit}>
            <h3>{formTitle}</h3>
            <fieldset disabled={saving}>
              {action.mode === 'delete' ? <p>Bạn xác nhận xóa {label} {action.row.code ?? action.row.number}?</p> : (
                <div className="academic-years-fields">
                  {fields.map(({ name, label: fieldLabel, options, display: _display, ...input }) => (
                    <label key={name}>{fieldLabel}
                      {options ? (
                        <select name={name} defaultValue={action.row?.[name] ?? options[0].value}>
                          {options.map(({ value, text }) => <option key={value} value={value}>{text}</option>)}
                        </select>
                      ) : <input {...input} name={name} defaultValue={action.row?.[name] ?? ''} required />}
                    </label>
                  ))}
                  {formContext}
                </div>
              )}
              <div className="academic-years-actions">
                <button type="button" onClick={() => dialog.current.close()}>Hủy</button>
                <button type="submit">{saving ? 'Đang xử lý…' : action.mode === 'delete' ? 'Xóa' : 'Lưu'}</button>
              </div>
            </fieldset>
            {formError && <p role="alert">{formError}</p>}
          </form>
        )}
      </dialog>
    </div>
  )
}
