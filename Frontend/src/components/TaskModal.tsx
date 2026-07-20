import { useState, useEffect } from 'react'
import type { Task, Status, Priority } from '../types'

type Props = {
  task: Task | null
  onSave: (task: Task) => void
  onClose: () => void
}

const emptyTask = (): Task => ({
  id: `t-${String(Date.now()).slice(-6)}`,
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  assignee: '',
  dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
  tags: [],
  createdAt: new Date().toISOString().split('T')[0],
  updatedAt: new Date().toISOString().split('T')[0],
})

const STATUSES: { value: Status; label: string }[] = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'review', label: 'In Review' },
  { value: 'done', label: 'Done' },
]

const PRIORITIES: { value: Priority; label: string }[] = [
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

const inputStyle = {
  background: '#0c0c0c',
  border: '1px solid #2a2a2a',
  color: '#f0f0f0',
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: '13px',
  outline: 'none',
  width: '100%',
  padding: '10px 12px',
}

const labelStyle = {
  display: 'block',
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: '10px',
  letterSpacing: '0.08em',
  color: '#606060',
  textTransform: 'uppercase' as const,
  marginBottom: '6px',
}

export default function TaskModal({ task, onSave, onClose }: Props) {
  const [form, setForm] = useState<Task>(task ?? emptyTask())
  const [tagInput, setTagInput] = useState('')

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const set = <K extends keyof Task>(key: K, val: Task[K]) => setForm((f) => ({ ...f, [key]: val }))

  const handleAddTag = () => {
    const t = tagInput.trim().replace(/^#/, '')
    if (t && !form.tags.includes(t)) set('tags', [...form.tags, t])
    setTagInput('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) return
    onSave(form)
  }

  const isNew = !task

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.75)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="relative flex flex-col w-full max-w-xl max-h-[90vh]"
        style={{ background: '#141414', border: '1px solid #2a2a2a' }}
      >
        {/* Modal header */}
        <div
          className="flex items-center justify-between px-6 py-4 shrink-0"
          style={{ borderBottom: '1px solid #2a2a2a' }}
        >
          <div className="flex items-center gap-3">
            <span
              className="font-mono text-xs px-2 py-0.5"
              style={{ background: isNew ? '#d4ff3e' : '#1e1e1e', color: isNew ? '#000' : '#606060', fontSize: '10px' }}
            >
              {isNew ? 'NEW' : form.id}
            </span>
            <h2 className="font-mono text-sm font-bold" style={{ color: '#f0f0f0' }}>
              {isNew ? 'Create Task' : 'Edit Task'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="font-mono text-xs transition-colors"
            style={{ color: '#606060', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', lineHeight: 1 }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#f0f0f0' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#606060' }}
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-y-auto">
          <div className="px-6 py-5 space-y-5 flex-1">
            {/* Title */}
            <div>
              <label style={labelStyle}>Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="Brief, descriptive task title"
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#d4ff3e' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#2a2a2a' }}
                autoFocus
              />
            </div>

            {/* Description */}
            <div>
              <label style={labelStyle}>Description</label>
              <textarea
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                placeholder="What needs to be done and why..."
                rows={3}
                style={{ ...inputStyle, resize: 'vertical', fontFamily: 'Inter, sans-serif', fontSize: '12px', lineHeight: '1.6' }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#d4ff3e' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#2a2a2a' }}
              />
            </div>

            {/* Status + Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label style={labelStyle}>Status</label>
                <select
                  value={form.status}
                  onChange={(e) => set('status', e.target.value as Status)}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#d4ff3e' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#2a2a2a' }}
                >
                  {STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Priority</label>
                <select
                  value={form.priority}
                  onChange={(e) => set('priority', e.target.value as Priority)}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#d4ff3e' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#2a2a2a' }}
                >
                  {PRIORITIES.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Assignee + Due date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label style={labelStyle}>Assignee</label>
                <input
                  type="text"
                  value={form.assignee}
                  onChange={(e) => set('assignee', e.target.value)}
                  placeholder="Full name"
                  style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#d4ff3e' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#2a2a2a' }}
                />
              </div>
              <div>
                <label style={labelStyle}>Due Date</label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => set('dueDate', e.target.value)}
                  style={{ ...inputStyle, colorScheme: 'dark' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#d4ff3e' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#2a2a2a' }}
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label style={labelStyle}>Tags</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag() } }}
                  placeholder="#tag"
                  style={{ ...inputStyle, flex: 1 }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#d4ff3e' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#2a2a2a' }}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 font-mono text-xs"
                  style={{ background: '#1e1e1e', border: '1px solid #2a2a2a', color: '#a0a0a0', cursor: 'pointer' }}
                >
                  Add
                </button>
              </div>
              {form.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {form.tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1.5 font-mono text-xs px-2 py-1"
                      style={{ background: '#1e1e1e', color: '#a0a0a0', border: '1px solid #2a2a2a', fontSize: '11px' }}
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => set('tags', form.tags.filter((t) => t !== tag))}
                        style={{ color: '#606060', background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 1 }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#ff4d4d' }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = '#606060' }}
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-between px-6 py-4 shrink-0"
            style={{ borderTop: '1px solid #2a2a2a' }}
          >
            <span className="font-mono text-xs" style={{ color: '#606060', fontSize: '10px' }}>
              ESC to cancel
            </span>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 font-mono text-xs transition-colors"
                style={{ background: 'none', border: '1px solid #2a2a2a', color: '#606060', cursor: 'pointer' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3a3a3a'; e.currentTarget.style.color = '#a0a0a0' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#606060' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 font-mono text-xs font-bold uppercase tracking-widest transition-opacity"
                style={{ background: '#d4ff3e', color: '#000', border: 'none', cursor: 'pointer' }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85' }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
              >
                {isNew ? 'Create Task' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
