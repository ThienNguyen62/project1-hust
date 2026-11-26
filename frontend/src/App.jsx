import { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import AcademicYearsPage from './components/AcademicYearsPage.jsx'
import { HomePage, PlaceholderPage } from './components/DashboardPages.jsx'
import Icon from './components/Icon.jsx'
import { pages, home, academicYears } from './navigation.js'
import './App.css'

function currentPage() {
  return pages.find((page) => page.href === window.location.hash) ?? home
}

function App() {
  const [page, setPage] = useState(currentPage)
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [headerPanel, setHeaderPanel] = useState(null)

  useEffect(() => {
    function syncPage() {
      setPage(currentPage())
      setMobileOpen(false)
      setHeaderPanel(null)
    }
    function closeOnEscape(event) {
      if (event.key === 'Escape') {
        setMobileOpen(false)
        setHeaderPanel(null)
      }
    }
    window.addEventListener('hashchange', syncPage)
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      window.removeEventListener('hashchange', syncPage)
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [])

  return (
    <div className={`dashboard${collapsed ? ' is-collapsed' : ''}${mobileOpen ? ' is-mobile-open' : ''}`}>
      {mobileOpen && (
        <button className="scrim" aria-label="Đóng menu" onClick={() => setMobileOpen(false)} />
      )}
      <Sidebar page={page} collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)}
        onClose={() => setMobileOpen(false)} onNavigate={() => setMobileOpen(false)} />
      <div className="workspace">
        <header className="topbar">
          <button className="icon-button mobile-toggle" type="button" aria-controls="sidebar"
            aria-expanded={mobileOpen} aria-label={mobileOpen ? 'Đóng menu' : 'Mở menu'}
            onClick={() => setMobileOpen(!mobileOpen)}>
            <Icon name="menu" />
          </button>
          <span className="breadcrumb"><Icon name="home" /> <span>{page.label}</span></span>
          <div className="header-actions">
            {[{ label: 'Thông báo', icon: 'bell' }, { label: 'Hồ sơ cá nhân', icon: 'user' }].map(({ label, icon }) => (
              <button key={icon} className="icon-button" type="button" title={label} aria-label={label}
                aria-expanded={headerPanel === label} aria-controls="header-panel"
                onClick={() => setHeaderPanel(headerPanel === label ? null : label)}>
                <Icon name={icon} />
              </button>
            ))}
          </div>
          <section id="header-panel" className="header-panel" hidden={!headerPanel}
            aria-labelledby="header-panel-title">
            <h2 id="header-panel-title">{headerPanel}</h2>
            <p>Tính năng sẽ được bổ sung sau.</p>
          </section>
        </header>
        <main className="content">
          {page === home && <HomePage />}
          {page === academicYears && <AcademicYearsPage />}
          {page !== home && page !== academicYears && <PlaceholderPage page={page} />}
        </main>
      </div>
    </div>
  )
}

export default App
