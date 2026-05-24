export default function FormGroup({ id, label, hint, error, required, children }) {
  return (
    <div className="form-group">
      <label htmlFor={id} className="form-label">
        {label} {required && <span aria-hidden="true" style={{ color: 'var(--saffron)' }}>*</span>}
        {required && <span className="sr-only"> (required)</span>}
      </label>
      {hint && <p className="form-hint" id={`${id}-hint`}>{hint}</p>}
      {children}
      {error && (
        <p className="form-error" id={`${id}-error`} role="alert">
          ⚠ {error}
        </p>
      )}
    </div>
  )
}
