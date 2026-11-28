import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import './ui.css'

export function Modal({ title, text, onClose, wide, children }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return createPortal(
    <div className="ui-overlay" onClick={onClose}>
      <div className={wide ? 'ui-modal ui-modal-wide' : 'ui-modal'} onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        {text && <p>{text}</p>}
        {children}
      </div>
    </div>,
    document.body,
  )
}

export function Confirm({ title, text, label, busy, onConfirm, onCancel }) {
  return (
    <Modal title={title} text={text} onClose={onCancel}>
      <div className="ui-actions">
        <button type="button" className="ui-btn ui-btn-ghost" onClick={onCancel}>
          Cancel
        </button>
        <button type="button" className="ui-btn ui-btn-danger" disabled={busy} onClick={onConfirm}>
          {busy ? 'Please wait...' : label}
        </button>
      </div>
    </Modal>
  )
}

export function Field({ label, value, onChange, type = 'text', placeholder, min, max }) {
  return (
    <label className="ui-field">
      <span>{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        min={min}
        max={max}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </label>
  )
}

export function Alert({ children }) {
  return <div className="ui-alert">{children}</div>
}

export function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

export function Empty({ title, text }) {
  return (
    <div className="ui-empty">
      <span className="ui-empty-icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12h-6l-2 3h-4l-2-3H2" />
          <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
        </svg>
      </span>
      <strong>{title}</strong>
      <span>{text}</span>
    </div>
  )
}