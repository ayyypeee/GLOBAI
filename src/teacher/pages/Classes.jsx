import { useEffect, useState } from 'react'
import { courses, enrollments } from '../../api'
import { Modal, Confirm, Field, Alert, Empty, PlusIcon } from '../../shared/ui'

const BLANK = { code: '', title: '', units: '' }

function Classes({ user, search }) {
  const [list, setList] = useState([])
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [version, setVersion] = useState(0)
  const [form, setForm] = useState(null)
  const [formError, setFormError] = useState('')
  const [rosterCode, setRosterCode] = useState(null)
  const [pending, setPending] = useState(null)
  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState('')

  const reload = () => setVersion((v) => v + 1)

  useEffect(() => {
    let cancelled = false
    Promise.all([courses.byTeacher(user.userid), enrollments.byTeacher(user.userid)])
      .then(([c, e]) => {
        if (cancelled) return
        setList(c)
        setRows(e)
        setError('')
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [user.userid, version])

  const set = (key) => (value) => setForm({ ...form, [key]: value })

  const closeForm = () => {
    setForm(null)
    setFormError('')
  }

  const save = async (e) => {
    e.preventDefault()
    setFormError('')
    setBusy(true)
    try {
      const body = { title: form.title.trim(), units: Number(form.units) }
      if (form.code) await courses.update(form.code, body)
      else await courses.create(user.userid, body)
      closeForm()
      reload()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const confirmRemove = async () => {
    setBusy(true)
    try {
      if (pending.type === 'class') await courses.remove(pending.course.coursecode)
      else await enrollments.remove(pending.enrollment.enrollmentid)
      setPending(null)
      reload()
    } catch (err) {
      setPending(null)
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const copy = async (code) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(code)
      setTimeout(() => setCopied(''), 1500)
    } catch {
      setCopied('')
    }
  }

  const sizeOf = (code) => rows.filter((r) => r.course.coursecode === code).length
  const query = search.trim().toLowerCase()
  const visible = list.filter(
    (c) => !query || c.title.toLowerCase().includes(query) || c.coursecode.toLowerCase().includes(query),
  )
  const rosterCourse = list.find((c) => c.coursecode === rosterCode)
  const roster = rows.filter((r) => r.course.coursecode === rosterCode)

  return (
    <div className="tp-page">
      <div className="ui-head">
        <div>
          <h1>Classes</h1>
          <p>Create a subject and share its code. Students who enter it join automatically.</p>
        </div>
        <button type="button" className="ui-btn" onClick={() => setForm(BLANK)}>
          <PlusIcon />
          Create subject
        </button>
      </div>

      {error && <Alert>{error}</Alert>}

      {loading ? (
        <div className="ui-card">
          <div className="ui-loading">Loading your classes...</div>
        </div>
      ) : visible.length === 0 ? (
        <div className="ui-card">
          <Empty
            title={list.length === 0 ? 'No subjects yet' : 'No matching classes'}
            text={list.length === 0 ? 'Click Create subject to add your first one.' : 'Try a different search.'}
          />
        </div>
      ) : (
        <div className="ui-classes">
          {visible.map((c) => {
            const size = sizeOf(c.coursecode)
            return (
              <div key={c.coursecode} className="ui-class">
                <div className="ui-class-top">
                  <span className="ui-code">{c.coursecode}</span>
                  <button type="button" className="ui-copy" onClick={() => copy(c.coursecode)}>
                    {copied === c.coursecode ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <h3>{c.title}</h3>
                <p>
                  {c.units} {c.units === 1 ? 'unit' : 'units'} · {size} {size === 1 ? 'student' : 'students'}
                </p>
                <div className="ui-class-actions">
                  <button type="button" className="ui-btn ui-btn-sm" onClick={() => setRosterCode(c.coursecode)}>
                    Students
                  </button>
                  <button
                    type="button"
                    className="ui-btn ui-btn-sm ui-btn-ghost"
                    onClick={() => setForm({ code: c.coursecode, title: c.title, units: c.units })}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="ui-btn ui-btn-sm ui-btn-ghost"
                    onClick={() => setPending({ type: 'class', course: c })}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {form && (
        <Modal
          title={form.code ? 'Edit subject' : 'Create subject'}
          text={form.code ? `Code ${form.code} stays the same.` : 'A random code is generated for your students to join.'}
          onClose={closeForm}
        >
          <form onSubmit={save}>
            {formError && <Alert>{formError}</Alert>}
            <Field label="Title" value={form.title} placeholder="e.g. Project Management for IT" onChange={set('title')} />
            <Field label="Units" type="number" min={1} max={6} value={form.units} placeholder="3" onChange={set('units')} />
            <div className="ui-actions">
              <button type="button" className="ui-btn ui-btn-ghost" onClick={closeForm}>
                Cancel
              </button>
              <button type="submit" className="ui-btn" disabled={busy}>
                {busy ? 'Saving...' : form.code ? 'Save' : 'Create'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {rosterCourse && (
        <Modal
          wide
          title={rosterCourse.title}
          text={`Code ${rosterCourse.coursecode} · ${roster.length} ${roster.length === 1 ? 'student' : 'students'}`}
          onClose={() => setRosterCode(null)}
        >
          {roster.length === 0 ? (
            <Empty title="No students yet" text="Share the code so students can join this class." />
          ) : (
            <ul className="ui-roster">
              {roster.map((r) => (
                <li key={r.enrollmentid}>
                  <div>
                    <strong>{r.student.user.fullname}</strong>
                    <span>
                      {[r.student.program, r.student.yearlevel ? `Year ${r.student.yearlevel}` : '']
                        .filter(Boolean)
                        .join(' · ') || r.student.user.username}
                      {r.dateenrolled ? ` · Joined ${r.dateenrolled}` : ''}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="ui-btn ui-btn-sm ui-btn-ghost"
                    onClick={() => setPending({ type: 'student', enrollment: r })}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="ui-actions">
            <button type="button" className="ui-btn ui-btn-ghost" onClick={() => setRosterCode(null)}>
              Close
            </button>
          </div>
        </Modal>
      )}

      {pending && (
        <Confirm
          title={pending.type === 'class' ? 'Delete this subject?' : 'Remove this student?'}
          text={
            pending.type === 'class'
              ? `${pending.course.title} and all of its enrollments will be deleted.`
              : `${pending.enrollment.student.user.fullname} will be removed from this class.`
          }
          label={pending.type === 'class' ? 'Delete' : 'Remove'}
          busy={busy}
          onConfirm={confirmRemove}
          onCancel={() => setPending(null)}
        />
      )}
    </div>
  )
}

export default Classes