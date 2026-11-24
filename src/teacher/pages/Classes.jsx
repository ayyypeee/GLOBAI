import { useState } from 'react'
import { Modal, Field, Empty, PlusIcon } from '../../shared/ui'

const BLANK = { title: '', units: '' }

const randomCode = () => Math.random().toString(36).slice(2, 8).toUpperCase()

function Classes() {
  const [courses, setCourses] = useState([])
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState(BLANK)

  const set = (key) => (value) => setForm({ ...form, [key]: value })

  const close = () => {
    setForm(BLANK)
    setCreating(false)
  }

  const create = (e) => {
    e.preventDefault()
    setCourses([...courses, { ...form, coursecode: randomCode() }])
    close()
  }

  return (
    <div className="tp-page">
      <div className="ui-head">
        <div>
          <h1>Classes</h1>
          <p>Create a subject and share its code with your students.</p>
        </div>
        <button type="button" className="ui-btn" onClick={() => setCreating(true)}>
          <PlusIcon />
          Create subject
        </button>
      </div>

      {courses.length === 0 ? (
        <div className="ui-card">
          <Empty title="No subjects yet" text="Click Create subject to add your first one." />
        </div>
      ) : (
        <div className="ui-classes">
          {courses.map((c) => (
            <div key={c.coursecode} className="ui-class">
              <span className="ui-code">{c.coursecode}</span>
              <h3>{c.title}</h3>
              <p>{c.units} units · 0 students</p>
            </div>
          ))}
        </div>
      )}

      {creating && (
        <Modal title="Create subject" text="A random code is generated for your students to join." onClose={close}>
          <form onSubmit={create}>
            <Field label="Title" value={form.title} placeholder="e.g. Project Management for IT" onChange={set('title')} />
            <Field label="Units" type="number" value={form.units} placeholder="3" onChange={set('units')} />
            <div className="ui-actions">
              <button type="button" className="ui-btn ui-btn-ghost" onClick={close}>
                Cancel
              </button>
              <button type="submit" className="ui-btn">
                Create
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

export default Classes