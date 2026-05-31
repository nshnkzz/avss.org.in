import { useState } from 'react'

export default function useAdminGuide(key) {
  const storageKey = `avss_guide_${key}`
  const [seen, setSeen] = useState(() => !!localStorage.getItem(storageKey))
  const [open, setOpen] = useState(false)

  const trigger = () => { if (!seen) setOpen(true) }
  const acknowledge = () => {
    localStorage.setItem(storageKey, '1')
    setSeen(true)
    setOpen(false)
  }
  const reopen = () => setOpen(true)

  return { open, seen, trigger, acknowledge, reopen }
}
