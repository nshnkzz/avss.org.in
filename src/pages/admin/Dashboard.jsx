import { useState, useEffect } from 'react'
import api from '../../services/api'
import styles from './Dashboard.module.css'
import {
  IconUsers, IconClock, IconBadgePlus, IconWarning,
  IconBanknote, IconTrending, IconMail,
} from '../../components/admin/Icons'

const stats = (data) => [
  { label: 'Active Members',       value: data.activeMembers,             icon: IconUsers,     color: 'blue'   },
  { label: 'Pending Approvals',    value: data.pendingApprovals,          icon: IconClock,     color: 'orange' },
  { label: 'New This Month',       value: data.newMembersThisMonth,       icon: IconBadgePlus, color: 'green'  },
  { label: 'Expiring Soon',        value: data.expiringSoon,              icon: IconWarning,   color: 'yellow' },
  { label: 'Total Donations',      value: `₹${data.totalDonations}`,     icon: IconBanknote,  color: 'green'  },
  { label: 'Donations This Month', value: `₹${data.donationsThisMonth}`, icon: IconTrending,  color: 'blue'   },
  { label: 'Unresolved Inquiries', value: data.unresolvedInquiries,       icon: IconMail,      color: 'red'    },
]

export default function Dashboard() {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    api.get('/api/dashboard/summary')
      .then(res => { setData(res); setLoading(false) })
      .catch(err => { console.error(err); setError('Could not load dashboard data.'); setLoading(false) })
  }, [])

  if (loading) return <div className={styles.loading}>Loading dashboard...</div>
  if (error)   return <div className={styles.error}>{error}</div>

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.sub}>Welcome back — here's what's happening at AVSS.</p>
      </div>

      <div className={styles.grid}>
        {stats(data).map(({ label, value, icon: Icon, color }) => (
          <div key={label} className={`${styles.card} ${styles[color]}`}>
            <div className={styles.cardIcon}><Icon size={28} /></div>
            <div className={styles.cardValue}>{value}</div>
            <div className={styles.cardLabel}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
