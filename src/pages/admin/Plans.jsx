import { useState, useEffect } from 'react'
import api from '../../services/api'
import styles from './Plans.module.css'
import useAdminGuide from '../../hooks/useAdminGuide'
import AdminGuide from '../../components/admin/AdminGuide'
import {
  IconCreditCard, IconStarLine, IconStarFill,
  IconPencil, IconUsers, IconCheck,
} from '../../components/admin/Icons'

const PLANS_GUIDE = [
  {
    icon: <IconCreditCard size={15} />,
    title: 'Adding Plans',
    items: [
      'Fill all fields in both English and Hindi — the public membership page shows content in the visitor\'s chosen language.',
      'Price is a display string (e.g. "₹999") — keep it consistent with the Amount field.',
      'Period is a display string shown after the price (e.g. "per year" / "प्रति वर्ष").',
      'Features are entered one per line — each becomes a ✓ bullet on the public membership card.',
      'Badge is optional (e.g. "Best Value" / "सबसे अच्छा") — displayed as a coloured tag on the plan card.',
      'Amount is the numeric value (in ₹) used for payment processing — must match the display price.',
      'New plans are ACTIVE immediately and appear on the public membership page.',
    ],
  },
  {
    icon: <IconStarLine size={15} />,
    title: 'Highlight Feature',
    variant: 'feature',
    items: [
      'Only one plan can be HIGHLIGHTED at a time — it appears with a special badge and featured styling on the public page.',
      'Highlighting a plan automatically removes the highlight from any previously highlighted plan.',
      'An INACTIVE plan cannot be highlighted — activate it first.',
      'Click "★ Highlighted" on an already-highlighted plan to remove the highlight and return it to Active.',
    ],
  },
]

const EMPTY_FORM = {
  nameEn: '', priceEn: '', periodEn: '', badgeEn: '', featuresEn: '',
  nameHi: '', priceHi: '', periodHi: '', badgeHi: '', featuresHi: '',
  amount: '', currency: 'INR', interval: 'YEARLY',
}

export default function AdminPlans() {
  const [plans, setPlans]               = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState(null)
  const [actionLoading, setActionLoading] = useState(null)
  const [saving, setSaving]             = useState(false)
  const [saveError, setSaveError]       = useState(null)
  const [showForm, setShowForm]         = useState(false)
  const [editingId, setEditingId]       = useState(null)
  const [form, setForm]                 = useState(EMPTY_FORM)
  const guide = useAdminGuide('plans')

  useEffect(() => { fetchPlans() }, [])

  const fetchPlans = () => {
    setLoading(true)
    api.get('/api/plans?all=true')
      .then(data => { setPlans(data); setLoading(false) })
      .catch(() => { setError('Could not load plans.'); setLoading(false) })
  }

  const setField = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const startEdit = (plan) => {
    const en = plan.description?.en ?? {}
    const hi = plan.description?.hi ?? {}
    setForm({
      nameEn: en.name || '', priceEn: en.price || '', periodEn: en.period || '',
      badgeEn: en.badge || '', featuresEn: (en.features || []).join('\n'),
      nameHi: hi.name || '', priceHi: hi.price || '', periodHi: hi.period || '',
      badgeHi: hi.badge || '', featuresHi: (hi.features || []).join('\n'),
      amount: String(plan.amount), currency: plan.currency || 'INR', interval: plan.interval || 'YEARLY',
    })
    setEditingId(plan.id)
    setShowForm(true)
    setSaveError(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cancelForm = () => {
    setShowForm(false)
    setEditingId(null)
    setForm(EMPTY_FORM)
    setSaveError(null)
  }

  const buildDescription = () => ({
    en: {
      name: form.nameEn.trim(),
      price: form.priceEn.trim(),
      period: form.periodEn.trim(),
      features: form.featuresEn.split('\n').map(s => s.trim()).filter(Boolean),
      ...(form.badgeEn.trim() && { badge: form.badgeEn.trim() }),
    },
    hi: {
      name: form.nameHi.trim(),
      price: (form.priceHi.trim() || form.priceEn.trim()),
      period: form.periodHi.trim(),
      features: form.featuresHi.split('\n').map(s => s.trim()).filter(Boolean),
      ...(form.badgeHi.trim() && { badge: form.badgeHi.trim() }),
    },
  })

  const save = async () => {
    const missing = !form.nameEn.trim() || !form.nameHi.trim() ||
      !form.priceEn.trim() || !form.periodEn.trim() || !form.periodHi.trim() || !form.amount
    if (missing) {
      setSaveError('Name (EN + HI), Price (EN), Period (EN + HI) and Amount are required.')
      return
    }
    setSaving(true)
    setSaveError(null)
    try {
      const payload = {
        name: form.nameEn.trim(),
        description: buildDescription(),
        amount: parseFloat(form.amount),
        currency: form.currency || 'INR',
        interval: form.interval,
      }
      if (editingId) {
        await api.patch(`/api/plans/${editingId}`, payload)
      } else {
        await api.post('/api/plans', payload)
      }
      cancelForm()
      fetchPlans()
    } catch (err) {
      setSaveError(
        !editingId && err.message?.includes('401')
          ? 'A plan with this amount already exists.'
          : 'Could not save plan. Please try again.'
      )
    } finally {
      setSaving(false)
    }
  }

  const highlight = async (id) => {
    setActionLoading(`hl-${id}`)
    try {
      await api.patch(`/api/plans/${id}/highlight`)
      fetchPlans()
    } catch (err) {
      alert(err.message?.includes('400') ? 'Activate this plan before highlighting it.' : 'Could not highlight plan.')
    } finally {
      setActionLoading(null)
    }
  }

  const unhighlight = async (id) => {
    setActionLoading(`uhl-${id}`)
    try {
      await api.patch(`/api/plans/${id}/unhighlight`)
      fetchPlans()
    } finally {
      setActionLoading(null)
    }
  }

  const deactivate = async (id) => {
    setActionLoading(`deact-${id}`)
    try {
      await api.delete(`/api/plans/${id}`)
      fetchPlans()
    } catch {
      alert('Could not deactivate plan.')
    } finally {
      setActionLoading(null)
    }
  }

  const activate = async (id) => {
    setActionLoading(`act-${id}`)
    try {
      await api.patch(`/api/plans/${id}/restore`)
      fetchPlans()
    } catch {
      alert('Could not activate plan.')
    } finally {
      setActionLoading(null)
    }
  }

  const remove = async (id) => {
    if (!window.confirm('Permanently delete this plan? This cannot be undone and may affect existing subscriptions.')) return
    setActionLoading(`rm-${id}`)
    try {
      await api.delete(`/api/plans/${id}/remove`)
      fetchPlans()
    } catch {
      alert('Could not delete plan.')
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Plans</h1>
          <p className={styles.sub}>{plans.length} total</p>
        </div>
        <button
          className={styles.newBtn}
          onClick={() => { if (showForm) { cancelForm() } else { guide.trigger(); setShowForm(true) } }}
        >
          {showForm ? '✕ Cancel' : '+ New Plan'}
        </button>
      </div>

      {showForm && (
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>{editingId ? 'Edit Plan' : 'New Plan'}</h2>
          {saveError && <div className={styles.formError}>{saveError}</div>}

          <div className={styles.langGrid}>
            {/* English */}
            <div className={styles.langSection}>
              <div className={styles.langLabel}>EN · English</div>
              <div className={styles.field}>
                <label className={styles.label}>Plan Name *</label>
                <input className={styles.input} value={form.nameEn} onChange={setField('nameEn')} placeholder="Yearly Member" />
              </div>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Price Display *</label>
                  <input className={styles.input} value={form.priceEn} onChange={setField('priceEn')} placeholder="₹999" />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Period *</label>
                  <input className={styles.input} value={form.periodEn} onChange={setField('periodEn')} placeholder="per year" />
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Badge (optional)</label>
                <input className={styles.input} value={form.badgeEn} onChange={setField('badgeEn')} placeholder="Best Value" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Features (one per line)</label>
                <textarea
                  className={styles.textarea}
                  value={form.featuresEn}
                  onChange={setField('featuresEn')}
                  placeholder={"Member ID Card\nPriority helpline\nLegal guidance"}
                  rows={5}
                />
              </div>
            </div>

            {/* Hindi */}
            <div className={styles.langSection}>
              <div className={styles.langLabel}>HI · Hindi · हिंदी</div>
              <div className={styles.field}>
                <label className={styles.label}>योजना का नाम *</label>
                <input className={styles.input} value={form.nameHi} onChange={setField('nameHi')} placeholder="वार्षिक सदस्य" />
              </div>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label}>मूल्य प्रदर्शन</label>
                  <input className={styles.input} value={form.priceHi} onChange={setField('priceHi')} placeholder="₹999 (EN used if blank)" />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>अवधि *</label>
                  <input className={styles.input} value={form.periodHi} onChange={setField('periodHi')} placeholder="प्रति वर्ष" />
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>बैज (वैकल्पिक)</label>
                <input className={styles.input} value={form.badgeHi} onChange={setField('badgeHi')} placeholder="सबसे अच्छा" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>सुविधाएँ (प्रति पंक्ति एक)</label>
                <textarea
                  className={styles.textarea}
                  value={form.featuresHi}
                  onChange={setField('featuresHi')}
                  placeholder={"सदस्य पहचान पत्र\nहेल्पलाइन प्राथमिकता\nकानूनी मार्गदर्शन"}
                  rows={5}
                />
              </div>
            </div>
          </div>

          {/* Plan-level fields */}
          <div className={styles.planMeta}>
            <div className={styles.field}>
              <label className={styles.label}>Amount (₹) *</label>
              <input type="number" className={styles.input} value={form.amount} onChange={setField('amount')} placeholder="999" min="1" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Currency</label>
              <span className={styles.staticField}>{form.currency || 'INR'}</span>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Billing Interval</label>
              <select className={styles.input} value={form.interval} onChange={setField('interval')}>
                <option value="YEARLY">Yearly</option>
                <option value="MONTHLY">Monthly</option>
              </select>
            </div>
          </div>

          <button className={styles.saveBtn} onClick={save} disabled={saving}>
            {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Create Plan'}
          </button>
        </div>
      )}

      {loading ? (
        <div className={styles.loading}>Loading plans...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : plans.length === 0 ? (
        <div className={styles.empty}>No plans yet. Create your first one above.</div>
      ) : (
        <div className={styles.list}>
          {plans.map(plan => {
            const en = plan.description?.en ?? {}
            const hi = plan.description?.hi ?? {}
            const isHl       = plan.status === 'HIGHLIGHTED'
            const isInactive = plan.status === 'INACTIVE'
            const busy = !!actionLoading
            return (
              <div
                key={plan.id}
                className={`${styles.card} ${isHl ? styles.cardHighlighted : ''} ${isInactive ? styles.cardInactive : ''}`}
              >
                <div className={styles.cardTop}>
                  <div>
                    <span className={`${styles.badge} ${isHl ? styles.badgeHighlighted : isInactive ? styles.badgeInactive : styles.badgeActive}`}>
                      {isHl ? '★ Highlighted' : isInactive ? 'Inactive' : 'Active'}
                    </span>
                    <div className={styles.cardName}>
                      {en.name || '—'}
                      {hi.name && hi.name !== en.name && (
                        <span className={styles.cardNameHi}> · {hi.name}</span>
                      )}
                    </div>
                    <div className={styles.cardPrice}>
                      {en.price}
                      {en.period && <span className={styles.cardPeriod}> / {en.period}</span>}
                      {hi.period && hi.period !== en.period && (
                        <span className={styles.cardPeriodHi}> · {hi.period}</span>
                      )}
                    </div>
                    <div className={styles.cardAmountRow}>
                      <span className={styles.cardAmount}>₹{Number(plan.amount).toLocaleString('en-IN')}</span>
                      <span className={styles.cardInterval}>{plan.currency} · {plan.interval}</span>
                      <span className={styles.cardSubs}>
                        <IconUsers size={13} /> {plan._count?.subscriptions ?? 0} subscriber{plan._count?.subscriptions !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  <div className={styles.cardActions}>
                    <button
                      className={`${styles.btn} ${styles.btnReview}`}
                      onClick={() => startEdit(plan)}
                      disabled={busy}
                    >
                      <IconPencil size={14} /> Review
                    </button>

                    {isHl ? (
                      <button
                        className={`${styles.btn} ${styles.btnHighlighted}`}
                        onClick={() => unhighlight(plan.id)}
                        disabled={busy}
                        title="Remove highlight"
                      >
                        {actionLoading === `uhl-${plan.id}` ? '…' : <><IconStarFill size={14} /> Highlighted</>}
                      </button>
                    ) : (
                      <button
                        className={`${styles.btn} ${styles.btnHighlight}`}
                        onClick={() => highlight(plan.id)}
                        disabled={busy || isInactive}
                        title={isInactive ? 'Activate plan before highlighting' : 'Set as highlighted plan'}
                      >
                        {actionLoading === `hl-${plan.id}` ? '…' : <><IconStarLine size={14} /> Highlight</> }
                      </button>
                    )}

                    {isInactive ? (
                      <button
                        className={`${styles.btn} ${styles.btnActivate}`}
                        onClick={() => activate(plan.id)}
                        disabled={busy}
                      >
                        {actionLoading === `act-${plan.id}` ? '…' : 'Activate'}
                      </button>
                    ) : (
                      <button
                        className={`${styles.btn} ${styles.btnDeactivate}`}
                        onClick={() => deactivate(plan.id)}
                        disabled={busy}
                      >
                        {actionLoading === `deact-${plan.id}` ? '…' : 'Deactivate'}
                      </button>
                    )}

                    <button
                      className={`${styles.btn} ${styles.btnDelete}`}
                      onClick={() => remove(plan.id)}
                      disabled={busy}
                    >
                      {actionLoading === `rm-${plan.id}` ? '…' : 'Delete'}

                    </button>
                  </div>
                </div>

                {(en.features?.length > 0) && (
                  <div className={styles.features}>
                    {en.features.slice(0, 5).map((f, i) => (
                      <span key={i} className={styles.feature}>
                        <IconCheck size={13} />{f}
                      </span>
                    ))}
                    {en.features.length > 5 && (
                      <span className={styles.featureMore}>+{en.features.length - 5} more</span>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <AdminGuide
        open={guide.open}
        seen={guide.seen}
        onAcknowledge={guide.acknowledge}
        onReopen={guide.reopen}
        title="Plans Guidelines"
        sections={PLANS_GUIDE}
      />
    </div>
  )
}
