import { useState } from 'react'
import { home, tasks, utilities } from '../navigation.js'
import Icon from './Icon.jsx'

function NavigationItem({ item, current, onNavigate }) {
  return (
    <a className="nav-item" href={item.href} aria-current={current ? 'page' : undefined}
      aria-label={item.label} title={item.label} onClick={onNavigate}>
      <Icon name={item.icon} />
      <span className="nav-label">{item.label}</span>
    </a>
  )
}

export default function Sidebar({ page, collapsed, onToggle, onClose, onNavigate }) {
  const [open, setOpen] = useState(true)
  const toggleLabel = collapsed ? 'Mở rộng thanh điều hướng' : 'Thu gọn thanh điều hướng'

  return (
    <aside className="sidebar" id="sidebar">
      <div className="brand">
        <span className="brand-icon"><Icon name="school" /></span>
        <span className="brand-label">Quản lý trường <small>Trung học phổ thông</small></span>
      </div>
      <nav aria-label="Điều hướng chính">
        <NavigationItem item={home} current={page === home} onNavigate={onNavigate} />
        <button className="nav-item task-toggle" type="button" aria-controls="task-links"
          aria-expanded={open} aria-label="Tác vụ" title="Tác vụ" onClick={() => setOpen(!open)}>
          <Icon name="layers" />
          <span className="nav-label">Tác vụ</span>
          <Icon name="chevron" className="chevron" />
        </button>
        <div className="task-links" id="task-links" hidden={!open}>
          {tasks.map((task) => (
            <NavigationItem key={task.href} item={task} current={page === task} onNavigate={onNavigate} />
          ))}
        </div>
        <NavigationItem item={utilities} current={page === utilities} onNavigate={onNavigate} />
      </nav>
      <button className="nav-item sidebar-toggle desktop-toggle" type="button"
        aria-expanded={!collapsed} aria-label={toggleLabel} title={toggleLabel} onClick={onToggle}>
        <Icon name="panel" />
        <span className="nav-label">{toggleLabel}</span>
      </button>
      <button className="nav-item sidebar-toggle mobile-toggle" type="button" onClick={onClose}>
        <Icon name="panel" />
        <span className="nav-label">Đóng menu</span>
      </button>
    </aside>
  )
}
