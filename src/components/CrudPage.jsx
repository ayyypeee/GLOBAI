import { useEffect, useState } from 'react'

async function loadLookups(lookups = {}) {
  const names = Object.keys(lookups)
  const lists = await Promise.all(names.map((name) => lookups[name]()))
  return Object.fromEntries(names.map((name, i) => [name, lists[i]]))
}

function CrudPage({ config, user, readOnly }) {
  const [rows, setRows] = useState([])
  const [lookups, setLookups] = useState({})
  const [form, setForm] = useState(null)
  const [editId, setEditId] = useState(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [version, setVersion] = useState(0)

  const editing = editId !== null

  const reload = () => setVersion((v) => v + 1)

  useEffect(() => {
    Promise.all([config.api.getAll(), loadLookups(config.lookups)])
      .then(([list, extra]) => {
        setRows(list)
        setLookups(extra)
      })
      .catch((err) => setError(err.message))
  }, [config, version])

  const clearNotices = () => {
    setError('')
    setMessage('')
  }

  const startCreate = () => {
    clearNotices()
    setEditId(null)
    setForm(config.blank)
  }

  const startEdit = (row) => {
    clearNotices()
    setEditId(config.idOf(row))
    setForm(config.toForm(row))
  }

  const changeField = (key, value) => setForm({ ...form, [key]: value })

  const save = async (e) => {
    e.preventDefault()
    clearNotices()
    try {
      const payload = config.toPayload(form)
      if (editing) {
        await config.api.put(editId, payload)
      } else {
        await config.api.post(payload)
      }
      setMessage(`${config.noun} ${editing ? 'updated' : 'added'}.`)
      setForm(null)
      reload()
    } catch (err) {
      setError(err.message)
    }
  }

  const remove = async (row) => {
    if (!window.confirm(`Delete this ${config.noun.toLowerCase()}?`)) return
    clearNotices()
    try {
      setMessage(await config.api.remove(config.idOf(row)))
      reload()
    } catch (err) {
      setError(err.message)
    }
  }

  const visibleRows = rows.filter((row) => !config.rowFilter || config.rowFilter(row, user))
  const visibleFields = form ? config.fields.filter((f) => !(editing && f.createOnly)) : []
  const canDelete = (row) => !config.canDelete || config.canDelete(row, user)

  return (
    <div className="home-card">
      <div className="crud-head">
        <h3>{config.title}</h3>
        {!readOnly && !form && (
          <button className="btn-small" onClick={startCreate}>
            Add {config.noun.toLowerCase()}
          </button>
        )}
      </div>

      {message && <p className="success-msg">{message}</p>}
      {error && <p className="error-msg">{error}</p>}

      {form && (
        <form className="crud-form" onSubmit={save}>
          {visibleFields.map((f) => (
            <label className="crud-field" key={f.key}>
              <span>{f.label}</span>
              {f.type === 'select' ? (
                <select
                  value={form[f.key]}
                  disabled={editing && f.lockOnEdit}
                  required
                  onChange={(e) => changeField(f.key, e.target.value)}
                >
                  <option value="">Select...</option>
                  {f.options(lookups).map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={f.type}
                  value={form[f.key] ?? ''}
                  min={f.min}
                  max={f.max}
                  disabled={editing && f.lockOnEdit}
                  required={!f.optional}
                  onChange={(e) => changeField(f.key, e.target.value)}
                />
              )}
            </label>
          ))}
          <div className="actions">
            <button type="submit" className="btn-small">Save</button>
            <button type="button" className="btn-small gray" onClick={() => setForm(null)}>Cancel</button>
          </div>
        </form>
      )}

      <table className="user-table">
        <thead>
          <tr>
            {config.columns.map((c) => (
              <th key={c.label}>{c.label}</th>
            ))}
            {!readOnly && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {visibleRows.map((row) => (
            <tr key={config.idOf(row)}>
              {config.columns.map((c) => (
                <td key={c.label}>{c.value(row)}</td>
              ))}
              {!readOnly && (
                <td>
                  <div className="actions">
                    <button className="btn-small" onClick={() => startEdit(row)}>Edit</button>
                    {canDelete(row) && (
                      <button className="btn-small red" onClick={() => remove(row)}>Delete</button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
          {visibleRows.length === 0 && (
            <tr>
              <td colSpan={config.columns.length + 1} className="empty">
                No {config.title.toLowerCase()} yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default CrudPage