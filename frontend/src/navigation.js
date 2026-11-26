export const home = { href: '#/', label: 'Trang chủ', icon: 'home' }
export const academicYears = { href: '#/tac-vu/1', label: 'Quản lý năm học', icon: 'calendar' }
export const tasks = [
  academicYears,
  { href: '#/tac-vu/2', label: 'Chức năng 2', icon: 'book' },
  { href: '#/tac-vu/3', label: 'Chức năng 3', icon: 'calendar' },
  { href: '#/tac-vu/4', label: 'Chức năng 4', icon: 'chart' },
  { href: '#/tac-vu/5', label: 'Chức năng 5', icon: 'clipboard' },
]
export const utilities = { href: '#/tien-ich', label: 'Tiện ích', icon: 'grid' }
export const pages = [home, ...tasks, utilities]
