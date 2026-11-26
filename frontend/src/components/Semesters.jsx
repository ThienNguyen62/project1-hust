import SchoolRecords from './SchoolRecords.jsx'

const fields = [
  { name: 'number', label: 'Học kỳ', options: [{ value: 1, text: 'I' }, { value: 2, text: 'II' }],
    display: (value) => value === 1 ? 'I' : 'II' },
  { name: 'startDate', label: 'Bắt đầu', type: 'date' },
  { name: 'endDate', label: 'Kết thúc', type: 'date' },
]

function toPayload(form) {
  return {
    number: Number(form.get('number')), startDate: form.get('startDate'), endDate: form.get('endDate'),
  }
}

export default function Semesters({ year }) {
  return <SchoolRecords path={`/academic-years/${year.id}/semesters`} label="học kỳ"
    fields={fields} toPayload={toPayload} />
}
