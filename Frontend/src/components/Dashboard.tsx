import { useState, useMemo } from 'react'
import { mockTasks } from '../data/mockTasks'
import type { Task, Status, Priority, User } from '../types'
import TaskCard from './TaskCard'
import TaskModal from './TaskModal'
import Sidebar from './Sidebar'

type Props = {
  user: User
  onLogout: () => void
}

export default function Dashboard({ user, onLogout }: Props) {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [filterStatus, setFilterStatus] = useState<Status | 'all'>('all')
  const [filterPriority, setFilterPriority] = useState<Priority | 'all'>('all')
  const [search, setSearch] = useState('')
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [creatingTask, setCreatingTask] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (filterStatus !== 'all' && t.status !== filterStatus) return false
      if (filterPriority !== 'all' && t.priority !== filterPriority) return false
      if (search && !t.title.toLowerCase().includes(search.toLowerCase()) && !t.description.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [tasks, filterStatus, filterPriority, search])

  const counts: Record<Status | 'all', number> = {
    all: tasks.length,
    todo: tasks.filter((t) => t.status === 'todo').length,
    in_progress: tasks.filter((t) => t.status === 'in_progress').length,
    review: tasks.filter((t) => t.status === 'review').length,
    done: tasks.filter((t) => t.status === 'done').length,
  }

  const handleSave = (task: Task) => {
    setTasks((prev) => {
      const idx = prev.findIndex((t) => t.id === task.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = { ...task, updatedAt: new Date().toISOString().split('T')[0] }
        return next
      }
      return [task, ...prev]
    })
    setEditingTask(null)
    setCreatingTask(false)
  }

  const handleDelete = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  const handleStatusChange = (id: string, status: Status) => {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, status, updatedAt: new Date().toISOString().split('T')[0] } : t))
  }

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--background)' }}>
      <Sidebar
        open={sidebarOpen}
        user={user}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        counts={counts}
        onLogout={onLogout}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header
          className="flex items-center gap-4 px-6 py-4 shrink-0"
          style={{ borderBottom: '1px solid var(--border)', background: 'var(--background)' }}
        >
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 font-mono text-xs transition-colors"
            style={{ color: 'var(--muted-foreground)', background: 'none', border: '1px solid var(--border)', cursor: 'pointer' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.borderColor = 'var(--primary)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--muted-foreground)'; e.currentTarget.style.borderColor = 'var(--border)' }}
          >
            ☰
          </button>

          <div className="flex-1 relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="w-full max-w-md pl-8 pr-4 py-2 font-mono text-sm outline-none"
              style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                color: 'var(--foreground)',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--primary)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)' }}
            />
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs" style={{ color: 'var(--muted-foreground)' }}>⌕</span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Priority filter */}
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as Priority | 'all')}
              className="font-mono text-xs px-3 py-2 outline-none"
              style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                color: 'var(--muted-foreground)',
                cursor: 'pointer',
              }}
            >
              <option value="all">All priority</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <button
              onClick={() => setCreatingTask(true)}
              className="flex items-center gap-2 px-4 py-2 font-mono text-xs font-bold uppercase tracking-widest transition-opacity"
              style={{ background: 'var(--primary)', color: '#000', border: 'none', cursor: 'pointer' }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85' }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
            >
              <span>+</span> New Task
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {/* Stats bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px mb-6" style={{ border: '1px solid var(--border)', background: 'var(--border)' }}>
            {([
              { label: 'To Do', count: counts.todo, color: '#6b7280' },
              { label: 'In Progress', count: counts.in_progress, color: '#3b82f6' },
              { label: 'In Review', count: counts.review, color: '#f59e0b' },
              { label: 'Done', count: counts.done, color: 'var(--primary)' },
            ] as const).map((s) => (
              <div key={s.label} className="p-4" style={{ background: 'var(--card)' }}>
                <div className="font-mono text-2xl font-bold" style={{ color: s.color }}>{s.count}</div>
                <div className="font-mono text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Task header */}
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-xs" style={{ color: 'var(--muted-foreground)' }}>
              {filtered.length} task{filtered.length !== 1 ? 's' : ''}{filterStatus !== 'all' ? ` · ${filterStatus.replace('_', ' ')}` : ''}
            </span>
          </div>

          {/* Tasks list */}
          {filtered.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-24"
              style={{ border: '1px solid var(--border)' }}
            >
              <div className="font-mono text-4xl mb-4" style={{ color: 'var(--muted-foreground)' }}>∅</div>
              <p className="font-mono text-sm" style={{ color: 'var(--muted-foreground)' }}>No tasks match your filters</p>
            </div>
          ) : (
            <div className="space-y-px">
              {filtered.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={() => setEditingTask(task)}
                  onDelete={() => handleDelete(task.id)}
                  onStatusChange={(status) => handleStatusChange(task.id, status)}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {(editingTask || creatingTask) && (
        <TaskModal
          task={editingTask}
          onSave={handleSave}
          onClose={() => { setEditingTask(null); setCreatingTask(false) }}
        />
      )}
    </div>
  )
}
