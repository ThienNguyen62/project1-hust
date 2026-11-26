import { useEffect, useState } from 'react'
import { listAcademicYears } from '../api/academic-years.js'
import SchoolRecords from './SchoolRecords.jsx'
import Icon from './Icon.jsx'
import './ClassroomsPage.css'

const grades = [10, 11, 12]
const fields = [
  { name: 'code', label: 'Mã lớp', maxLength: 20 },
  { name: 'name', label: 'Tên lớp', maxLength: 60 },
  { name: 'grade', label: 'Khối', options: grades.map((value) => ({ value, text: `Khối ${value}` })) },
]

function toPayload(form) {
  return { code: form.get('code'), name: form.get('name'), grade: Number(form.get('grade')) }
}

export default function ClassroomsPage() {
  const [years, setYears] = useState(null)
  const [yearId, setYearId] = useState('')
  const [grade, setGrade] = useState('')
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    listAcademicYears(controller.signal).then((data) => {
      if (controller.signal.aborted) return
      setYears(data)
      setYearId(data.length ? String(data[0].id) : '')
    }).catch((cause) => {
      if (!controller.signal.aborted) setError(cause.message)
    })
    return () => controller.abort()
  }, [attempt])

  const year = years?.find((item) => String(item.id) === yearId)
  const keyword = search.trim().toLocaleLowerCase('vi')
  const title = <h1 id="classrooms-heading"><Icon name="users" /> Quản lý lớp học</h1>

  return (
    <section className="academic-years classrooms" aria-labelledby="classrooms-heading">
      {!year && title}
      {error && <div className="academic-years-card">
        <p role="alert">{error}</p>
        <button type="button" onClick={() => { setError(''); setAttempt((value) => value + 1) }}>Thử lại</button>
      </div>}
      {!years && !error && <p role="status">Đang tải năm học…</p>}
      {years?.length === 0 && <p>Hãy tạo năm học trước khi thêm lớp.</p>}
      {year && (
        <SchoolRecords key={yearId} path={`/academic-years/${yearId}/classes`} label="lớp học"
          fields={fields} toPayload={toPayload} pageSize={4} filterKey={`${grade}:${keyword}`}
          columns={[
            ...fields,
            { name: 'year', label: 'Năm học', display: () => year.code },
            { name: 'size', label: 'Sĩ số', display: () => '—' },
            { name: 'teacher', label: 'GVCN', display: () => '—' },
          ]}
          formContext={<label>Năm học <input value={year.code} readOnly /></label>}
          filter={(row) => (!grade || row.grade === Number(grade)) &&
            [row.code, row.name].some((value) => value.toLocaleLowerCase('vi').includes(keyword))}
          renderHeader={({ rows, addButton, loading, loadError }) => (
            <>
              <header className="classrooms-heading">{title}{addButton}</header>
              <dl className="classrooms-summary">
                {[['Tổng số lớp', rows.length, 'layers'], ...grades.map((value) =>
                  [`Khối ${value}`, rows.filter((row) => row.grade === value).length, 'school'],
                )].map(([label, count, icon]) => (
                  <div key={label}><Icon name={icon} /><dt>{label}</dt><dd>{loading || loadError ? '—' : count}</dd></div>
                ))}
              </dl>
              <div className="classrooms-filters">
                <label className="classrooms-search"><Icon name="search" />
                  <input aria-label="Tìm theo mã lớp hoặc tên lớp" type="search"
                    placeholder="Tìm theo mã lớp hoặc tên lớp" value={search}
                    onChange={(event) => setSearch(event.target.value)} />
                </label>
                <select aria-label="Khối" value={grade} onChange={(event) => setGrade(event.target.value)}>
                  <option value="">Tất cả khối</option>
                  {grades.map((value) => <option key={value} value={value}>Khối {value}</option>)}
                </select>
                <select aria-label="Năm học" value={yearId} onChange={(event) => setYearId(event.target.value)}>
                  {years.map((item) => <option key={item.id} value={item.id}>Năm học: {item.code}</option>)}
                </select>
              </div>
            </>
          )} />
      )}
    </section>
  )
}
