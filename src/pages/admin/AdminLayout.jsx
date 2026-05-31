import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './AdminLayout.module.css'
import {
  IconDashboard, IconUsers, IconMail, IconDocument,
  IconPhoto, IconArticle, IconCreditCard,
  IconLogout, IconMenu,
} from '../../components/admin/Icons'
import AvsscLogo from '../../components/admin/AvsscLogo'

const navItems = [
  { to: '/admin/dashboard', icon: IconDashboard, label: 'Dashboard' },
  { to: '/admin/members',   icon: IconUsers,     label: 'Members' },
  { to: '/admin/inquiries', icon: IconMail,      label: 'Inquiries' },
  { to: '/admin/circulars', icon: IconDocument,  label: 'Circulars' },
  { to: '/admin/gallery',   icon: IconPhoto,     label: 'Gallery' },
  { to: '/admin/articles',  icon: IconArticle,   label: 'Articles' },
  { to: '/admin/plans',     icon: IconCreditCard, label: 'Plans' },
]

export default function AdminLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className={styles.shell}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`}>
        <div className={styles.sidebarHeader}>
          <AvsscLogo size={52} />
          <div>
            <div className={styles.sidebarTitle}>AVSS Admin</div>
            <div className={styles.sidebarSub}>Singrauli</div>
          </div>
        </div>

        <nav className={styles.nav}>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <span className={styles.navIcon}><Icon size={18} /></span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <button className={styles.logoutBtn} onClick={handleLogout}>
          <IconLogout size={18} />
          <span>Logout</span>
        </button>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className={styles.main}>
        {/* Top bar */}
        <header className={styles.topbar}>
          <button
            className={styles.menuBtn}
            onClick={() => setSidebarOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <IconMenu size={20} />
          </button>
          <span className={styles.topbarTitle}>AVSS Admin Panel</span>
        </header>

        {/* Page content */}
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
