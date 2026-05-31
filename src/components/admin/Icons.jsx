function Svg({ size, sw = 1.75, fill = 'none', children }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
      stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      {children}
    </svg>
  )
}

// ── Navigation ────────────────────────────────────────────

export function IconDashboard({ size = 18 }) {
  return (
    <Svg size={size}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </Svg>
  )
}

export function IconUsers({ size = 18 }) {
  return (
    <Svg size={size}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </Svg>
  )
}

export function IconMail({ size = 18 }) {
  return (
    <Svg size={size}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <polyline points="2,4 12,13 22,4" />
    </Svg>
  )
}

export function IconDocument({ size = 18 }) {
  return (
    <Svg size={size}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14,2 14,8 20,8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </Svg>
  )
}

export function IconPhoto({ size = 18 }) {
  return (
    <Svg size={size}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21,15 16,10 5,21" />
    </Svg>
  )
}

export function IconArticle({ size = 18 }) {
  return (
    <Svg size={size}>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </Svg>
  )
}

export function IconCreditCard({ size = 18 }) {
  return (
    <Svg size={size}>
      <rect x="1" y="4" width="22" height="16" rx="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </Svg>
  )
}

export function IconLogout({ size = 18 }) {
  return (
    <Svg size={size}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16,17 21,12 16,7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </Svg>
  )
}

export function IconMenu({ size = 18 }) {
  return (
    <Svg size={size}>
      <line x1="3" y1="6"  x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </Svg>
  )
}

export function IconLogo({ size = 24 }) {
  return (
    <Svg size={size}>
      <path d="M12 2L3 6.5v6c0 4.75 3.8 9.2 9 10.5 5.2-1.3 9-5.75 9-10.5v-6L12 2z" />
      <polyline points="9,12 11,14 15,10" />
    </Svg>
  )
}

// ── Actions ───────────────────────────────────────────────

export function IconUpload({ size = 18 }) {
  return (
    <Svg size={size}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17,8 12,3 7,8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </Svg>
  )
}

export function IconTrash({ size = 18 }) {
  return (
    <Svg size={size}>
      <polyline points="3,6 5,6 21,6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </Svg>
  )
}

export function IconStarFill({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill="currentColor" stroke="none" aria-hidden="true">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </svg>
  )
}

export function IconStarLine({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.75"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </svg>
  )
}

export function IconPlus({ size = 18 }) {
  return (
    <Svg size={size}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5"  y1="12" x2="19" y2="12" />
    </Svg>
  )
}

export function IconXMark({ size = 18 }) {
  return (
    <Svg size={size}>
      <line x1="18" y1="6"  x2="6"  y2="18" />
      <line x1="6"  y1="6"  x2="18" y2="18" />
    </Svg>
  )
}

export function IconEye({ size = 18 }) {
  return (
    <Svg size={size}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </Svg>
  )
}

export function IconPencil({ size = 18 }) {
  return (
    <Svg size={size}>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </Svg>
  )
}

export function IconClipboard({ size = 18 }) {
  return (
    <Svg size={size}>
      <rect x="9" y="1" width="6" height="4" rx="1" />
      <path d="M6 2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-2" />
      <line x1="8" y1="11" x2="16" y2="11" />
      <line x1="8" y1="15" x2="16" y2="15" />
    </Svg>
  )
}

export function IconCheck({ size = 18 }) {
  return (
    <Svg size={size}>
      <polyline points="20,6 9,17 4,12" />
    </Svg>
  )
}

// ── Dashboard stats ───────────────────────────────────────

export function IconClock({ size = 18 }) {
  return (
    <Svg size={size}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12,6 12,12 16,14" />
    </Svg>
  )
}

export function IconBadgePlus({ size = 18 }) {
  return (
    <Svg size={size}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8"  y1="12" x2="16" y2="12" />
    </Svg>
  )
}

export function IconWarning({ size = 18 }) {
  return (
    <Svg size={size}>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9"  x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </Svg>
  )
}

export function IconBanknote({ size = 18 }) {
  return (
    <Svg size={size}>
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.5" />
      <line x1="6"  y1="10" x2="6"  y2="14" />
      <line x1="18" y1="10" x2="18" y2="14" />
    </Svg>
  )
}

export function IconTrending({ size = 18 }) {
  return (
    <Svg size={size}>
      <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" />
      <polyline points="17,6 23,6 23,12" />
    </Svg>
  )
}

// ── Inquiries ─────────────────────────────────────────────

export function IconPhone({ size = 18 }) {
  return (
    <Svg size={size}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 11.5 19.79 19.79 0 0 1 1.62 2.84 2 2 0 0 1 3.62 0.84h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9a16 16 0 0 0 6.72 6.72l1.19-1.19a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </Svg>
  )
}

export function IconChevronUp({ size = 18 }) {
  return (
    <Svg size={size}>
      <polyline points="18,15 12,9 6,15" />
    </Svg>
  )
}

export function IconChevronDown({ size = 18 }) {
  return (
    <Svg size={size}>
      <polyline points="6,9 12,15 18,9" />
    </Svg>
  )
}
