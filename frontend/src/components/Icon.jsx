const paths = {
  search: 'M16 16l5 5m-3-11a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z',
  school: 'm2 9 10-5 10 5-10 5L2 9Zm4 2v5c3 3 9 3 12 0v-5m4-2v6',
  home: 'm3 10 9-7 9 7v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-9Zm6 10v-6h6v6',
  panel: 'M4 4h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Zm5 0v16',
  menu: 'M4 6h16M4 12h16M4 18h16',
  chevron: 'm6 9 6 6 6-6',
  layers: 'm3 8 9-5 9 5-9 5-9-5Zm0 4 9 5 9-5m-18 4 9 5 9-5',
  users: 'M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2m18 0v-2a4 4 0 0 0-3-4M13 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm4-3a3.5 3.5 0 0 1 0 7',
  book: 'M3 4h6a3 3 0 0 1 3 3v14a3 3 0 0 0-3-3H3V4Zm18 0h-6a3 3 0 0 0-3 3v14a3 3 0 0 1 3-3h6V4Z',
  calendar: 'M4 5h16v15H4V5Zm0 5h16M8 3v4m8-4v4',
  chart: 'M4 4v16h16M8 15v-3m4 3V8m4 7v-5',
  clipboard: 'M8 5H5v16h14V5h-3M8 3h8v4H8V3Zm0 8h8m-8 4h6',
  grid: 'M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z',
  clock: 'M12 7v5l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-8 12a2 2 0 0 0 4 0',
  user: 'M4 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2m-4-13a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
}

export default function Icon({ name, className }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  )
}
