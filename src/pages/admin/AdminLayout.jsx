import { useState, useEffect } from 'react'
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './AdminLayout.module.css'
import {
  IconDashboard, IconUsers, IconMail, IconDocument,
  IconPhoto, IconArticle, IconCreditCard, IconShield,
  IconLogout, IconMenu,
} from '../../components/admin/Icons'
import AvsscLogo from '../../components/admin/AvsscLogo'

const ALL_NAV = [
  { to: '/admin/dashboard', icon: IconDashboard,  label: 'Dashboard',   roles: ['SUPER_ADMIN', 'STAFF'] },
  { to: '/admin/members',   icon: IconUsers,      label: 'Members',     roles: ['SUPER_ADMIN'] },
  { to: '/admin/inquiries', icon: IconMail,       label: 'Inquiries',   roles: ['SUPER_ADMIN', 'STAFF'] },
  { to: '/admin/circulars', icon: IconDocument,   label: 'Circulars',   roles: ['SUPER_ADMIN', 'STAFF'] },
  { to: '/admin/gallery',   icon: IconPhoto,      label: 'Gallery',     roles: ['SUPER_ADMIN', 'STAFF'] },
  { to: '/admin/articles',  icon: IconArticle,    label: 'Articles',    roles: ['SUPER_ADMIN', 'STAFF', 'DESIGNER'] },
  { to: '/admin/plans',     icon: IconCreditCard, label: 'Plans',       roles: ['SUPER_ADMIN', 'STAFF'] },
  { to: '/admin/admins',    icon: IconShield,     label: 'Admin Users', roles: ['SUPER_ADMIN'] },
]

const ROLE_LABELS = {
  SUPER_ADMIN: 'Super Admin',
  STAFF: 'Staff',
  DESIGNER: 'Designer',
}

export default function AdminLayout() {
  const { logout, role } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const navItems = ALL_NAV.filter(item => !role || item.roles.includes(role))

  // Redirect if the current route is not allowed for this role
  useEffect(() => {
    if (!role) return
    const segment = pathname.split('/')[2]
    const allowedSegments = navItems.map(item => item.to.split('/')[2])
    if (segment && !allowedSegments.includes(segment)) {
      navigate(`${navItems[0]?.to ?? '/admin/articles'}`, { replace: true })
    }
  }, [pathname, role])
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
            {role && (
              <span className={`${styles.roleBadge} ${styles[`role${role}`]}`}>
                {ROLE_LABELS[role]}
              </span>
            )}
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
