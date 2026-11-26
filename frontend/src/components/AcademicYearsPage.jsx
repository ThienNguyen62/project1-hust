import { useEffect, useRef, useState } from 'react'
import { deleteAcademicYear, listAcademicYears, saveAcademicYear } from '../api/academic-years.js'
import './AcademicYearsPage.css'

const emptyForm = { startYear: '', startDate: '', endDate: '', note: '', createSemesters: true }
const statuses = { upcoming: 'Sắp diễn ra', active: 'Đang diễn ra', ended: 'Đã kết thúc' }

function getStatus({ startDate, endDate }, today) {
  if (today < startDate) return 'upcoming'
  return today > endDate ? 'ended' : 'active'
}

function formatDate(date) {
  return date.split('-').reverse().join('/')
}

export default function AcademicYearsPage() {
  const [form, setForm] = useState(emptyForm)
  const [years, setYears] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [attempt, setAttempt] = useState(0)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [notice, setNotice] = useState('')
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [deleteError, setDeleteError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const dialog = useRef(null)
  const deleteDialog = useRef(null)
  const [today] = useState(() =>
    new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date()),
  )
  const startYear = Number(form.startYear)
  const code = Number.isInteger(startYear) && startYear >= 1000 && startYear <= 9998
    ? `${startYear}-${startYear + 1}` : ''
  const visibleYears = years.filter((year) =>
    year.code.includes(search.trim()) && (!statusFilter || getStatus(year, today) === statusFilter),
  )
  const ongoing = years.filter((year) => getStatus(year, today) === 'active')
  const summary = [
    ['Tổng số năm học', years.length],
    ['Đang diễn ra', ongoing.map((year) => year.code).join(', ') || 'Chưa có'],
    ['Sắp diễn ra', years.filter((year) => getStatus(year, today) === 'upcoming').length],
    ['Đã kết thúc', years.filter((year) => getStatus(year, today) === 'ended').length],
  ]

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      try {
        const data = await listAcademicYears(controller.signal)
        if (!controller.signal.aborted) setYears(data)
      } catch (error) {
        if (!controller.signal.aborted) setLoadError(error.message)
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    load()
    return () => controller.abort()
  }, [attempt])

  function retryLoad() {
    setLoading(true)
    setLoadError('')
    setAttempt((previous) => previous + 1)
  }

  function updateField(event) {
    const { name, value, checked, type } = event.target
    setForm((previous) => ({ ...previous, [name]: type === 'checkbox' ? checked : value }))
  }

  function openForm(year = null) {
    setEditing(year)
    setForm(year ? {
      startYear: year.code.slice(0, 4), startDate: year.startDate, endDate: year.endDate,
      note: year.note || '', createSemesters: false,
    } : emptyForm)
    setSaveError('')
    dialog.current.showModal()
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (saving || loading || loadError) return
    setSaveError('')
    setNotice('')
    setSaving(true)

    try {
      const { startDate, endDate, note, createSemesters } = form
      const year = await saveAcademicYear({ code, startDate, endDate, note, createSemesters }, editing?.id)
      setYears((previous) => [year, ...previous.filter((item) => item.id !== year.id)].sort(
        (a, b) => b.startDate.localeCompare(a.startDate) || b.id - a.id,
      ))
      dialog.current?.close()
      setNotice(editing ? `Đã cập nhật năm học ${year.code}.` :
        `Đã tạo năm học ${year.code}${year.semesterCount ? ' và hai học kỳ' : ''}.`)
      if (editing) retryLoad()
      if (editing) retryLoad()
    } catch (error) {
      setSaveError(error.message)
    } finally {
      setSaving(false)
    }
  }

  function confirmDeletion(year) {
    setDeleting(year)
    setDeleteError('')
    deleteDialog.current.showModal()
  }

  async function handleDelete(event) {
    event.preventDefault()
    if (!deleting || saving) return
    setSaving(true)
    setDeleteError('')
    setNotice('')
    try {
      await deleteAcademicYear(deleting.id)
      setYears((previous) => previous.filter((year) => year.id !== deleting.id))
      deleteDialog.current?.close()
      setNotice(`Đã xóa năm học ${deleting.code}.`)
    } catch (error) {
      setDeleteError(error.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="academic-years" aria-labelledby="academic-years-heading">
      <header className="academic-years-header">
        <h1 id="academic-years-heading">Quản lý năm học</h1>
        <button type="button" onClick={() => openForm()} disabled={loading || Boolean(loadError)}>
          + Thêm năm học
        </button>
      </header>

      {!loading && !loadError && (
        <dl className="academic-years-summary">
          {summary.map(([label, value]) => (
            <div className="academic-years-card" key={label}><dt>{label}</dt><dd>{value}</dd></div>
          ))}
        </dl>
      )}
      {notice && <p role="status">{notice}</p>}

      <dialog ref={dialog} className="academic-years-dialog" aria-labelledby="academic-year-form-title"
        onCancel={(event) => { if (saving) event.preventDefault() }}>
      <form onSubmit={handleSubmit}>
        <h2 id="academic-year-form-title">{editing ? 'Sửa năm học' : 'Thêm năm học'}</h2>
        <fieldset disabled={saving}>
          <div className="academic-years-fields">
            <label>Năm bắt đầu
              <input name="startYear" type="number" min="1000" max="9998" step="1"
                value={form.startYear} onChange={updateField} required />
            </label>
            <label>Tên năm học<input value={code} readOnly /></label>
            <label>Ngày bắt đầu<input name="startDate" type="date"
              value={form.startDate} onChange={updateField} required /></label>
            <label>Ngày kết thúc<input name="endDate" type="date"
              value={form.endDate} onChange={updateField} required /></label>
          </div>
          <p>Trạng thái theo ngày: {form.startDate && form.endDate && form.startDate < form.endDate
            ? statuses[getStatus(form, today)] : 'Chưa xác định'}</p>
          {!editing && <label className="academic-years-checkbox">
            <input name="createSemesters" type="checkbox" checked={form.createSemesters}
              onChange={updateField} />
            Tự động tạo hai học kỳ
          </label>}
          {!editing && form.createSemesters && <p>Khoảng ngày được chia thành hai học kỳ liên tiếp, gần bằng nhau.</p>}
          <label className="academic-years-note">Ghi chú
            <textarea name="note" rows="3" maxLength={500} value={form.note} onChange={updateField} />
          </label>
          <div className="academic-years-actions">
            <button type="button" onClick={() => dialog.current.close()}>Hủy</button>
            <button type="submit">{saving ? 'Đang lưu…' : 'Lưu'}</button>
          </div>
        </fieldset>
        {saveError && <p role="alert">{saveError}</p>}
      </form>
      </dialog>

      <dialog ref={deleteDialog} className="academic-years-dialog" aria-labelledby="delete-year-title"
        onCancel={(event) => { if (saving) event.preventDefault() }}>
        <form onSubmit={handleDelete}>
          <h2 id="delete-year-title">Xóa năm học {deleting?.code}?</h2>
          <p>Các học kỳ của năm này cũng sẽ bị xóa. Năm học đã có lớp sẽ được giữ lại.</p>
          {deleteError && <p role="alert">{deleteError}</p>}
          <div className="academic-years-actions">
            <button type="button" disabled={saving} onClick={() => deleteDialog.current.close()}>Hủy</button>
            <button type="submit" disabled={saving}>{saving ? 'Đang xóa…' : 'Xóa năm học'}</button>
          </div>
        </form>
      </dialog>

      <div className="academic-years-card">
        <h2>Danh sách năm học</h2>
        {years.length > 0 && (
          <div className="academic-years-filters">
            <input type="search" aria-label="Tìm năm học" placeholder="Tìm năm học…"
              value={search} onChange={(event) => setSearch(event.target.value)} />
            <select aria-label="Lọc trạng thái" value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="">Tất cả trạng thái</option>
              {Object.entries(statuses).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
            </select>
          </div>
        )}
        {loading && <p role="status">Đang tải danh sách…</p>}
        {loadError && (
          <div>
            <p role="alert">{loadError}</p>
            <button type="button" onClick={retryLoad}>Tải lại danh sách</button>
          </div>
        )}
        {!loading && !loadError && years.length === 0 && <p>Chưa có năm học.</p>}
        {years.length > 0 && visibleYears.length === 0 && <p>Không tìm thấy năm học phù hợp.</p>}
        {visibleYears.length > 0 && (
          <div className="academic-years-table">
            <table>
              <thead><tr>
                {['Năm học', 'Bắt đầu', 'Kết thúc', 'Trạng thái', 'Học kỳ', 'Ghi chú', 'Thao tác'].map(
                  (label) => <th key={label} scope="col">{label}</th>,
                )}
              </tr></thead>
              <tbody>
                {visibleYears.map((year) => (
                  <tr key={year.id}>
                    <th scope="row">{year.code}</th>
                    <td>{formatDate(year.startDate)}</td>
                    <td>{formatDate(year.endDate)}</td>
                    <td><span className="academic-years-status" data-status={getStatus(year, today)}>
                      {statuses[getStatus(year, today)]}
                    </span></td>
                    <td>{year.semesterCount}</td>
                    <td className="academic-years-note-cell">{year.note || '—'}</td>
                    <td className="academic-years-row-actions">
                      <button type="button" aria-label={`Sửa năm học ${year.code}`}
                        onClick={() => openForm(year)}>Sửa</button>
                      <button type="button" aria-label={`Xóa năm học ${year.code}`}
                        onClick={() => confirmDeletion(year)}>Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}
