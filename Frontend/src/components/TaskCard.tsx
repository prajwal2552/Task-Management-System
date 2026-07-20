import { useState } from 'react'
import type { Task, Status } from '../types'

type Props = {
  task: Task
  onEdit: () => void
  onDelete: () => void
  onStatusChange: (status: Status) => void
}

const PRIORITY_COLOR: Record<string, string> = {
  critical: '#ff4d4d',
  high: '#f97316',
  medium: '#f59e0b',
  low: '#6b7280',
}

const STATUS_COLOR: Record<string, string> = {
  todo: '#6b7280',
  in_progress: '#3b82f6',
  review: '#f59e0b',
  done: '#d4ff3e',
}

const STATUS_LABEL: Record<string, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  review: 'In Review',
  done: 'Done',
}

const STATUS_CYCLE: Record<Status, Status> = {
  todo: 'in_progress',
  in_progress: 'review',
  review: 'done',
  done: 'todo',
}

function daysUntil(dateStr: string): number {
  const now = new Date()
  const due = new Date(dateStr)
  return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }: Props) {
  const [hovered, setHovered] = useState(false)
  const [showStatusMenu, setShowStatusMenu] = useState(false)
  const days = daysUntil(task.dueDate)
  const overdue = days < 0 && task.status !== 'done'

  return (
    <div
      className="relative flex items-start gap-4 px-5 py-4 transition-colors"
      style={{
        background: hovered ? 'var(--card)' : 'var(--background)',
        borderLeft: `3px solid ${PRIORITY_COLOR[task.priority]}`,
        borderBottom: '1px solid var(--border)',
        cursor: 'default',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setShowStatusMenu(false) }}
    >
      {/* Status toggle */}
      <div className="relative shrink-0 pt-0.5">
        <button
          onClick={() => setShowStatusMenu(!showStatusMenu)}
          className="w-5 h-5 flex items-center justify-center transition-colors"
          style={{
            border: `1.5px solid ${STATUS_COLOR[task.status]}`,
            background: task.status === 'done' ? STATUS_COLOR[task.status] : 'none',
            cursor: 'pointer',
            borderRadius: 0,
          }}
          title="Change status"
        >
          {task.status === 'done' && (
            <span style={{ color: '#000', fontSize: '9px', fontWeight: 'bold' }}>✓</span>
          )}
          {task.status === 'in_progress' && (
            <span style={{ color: STATUS_COLOR[task.status], fontSize: '8px' }}>▶</span>
          )}
          {task.status === 'review' && (
            <span style={{ color: STATUS_COLOR[task.status], fontSize: '8px' }}>◈</span>
          )}
        </button>

        {showStatusMenu && (
          <div
            className="absolute top-7 left-0 z-10 py-1"
            style={{ background: '#1a1a1a', border: '1px solid var(--border)', minWidth: '120px' }}
          >
            {(['todo', 'in_progress', 'review', 'done'] as Status[]).map((s) => (
              <button
                key={s}
                onClick={() => { onStatusChange(s); setShowStatusMenu(false) }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-left font-mono text-xs transition-colors"
                style={{ color: task.status === s ? STATUS_COLOR[s] : 'var(--muted-foreground)', background: 'none', border: 'none', cursor: 'pointer' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--secondary)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'none' }}
              >
                <span style={{ color: STATUS_COLOR[s] }}>■</span>
                {STATUS_LABEL[s]}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-3 mb-1.5">
          <span className="font-mono text-xs shrink-0" style={{ color: 'var(--muted-foreground)', fontSize: '10px', paddingTop: '2px' }}>
            {task.id}
          </span>
          <h3
            className="font-mono text-sm font-medium leading-snug"
            style={{
              color: task.status === 'done' ? 'var(--muted-foreground)' : 'var(--foreground)',
              textDecoration: task.status === 'done' ? 'line-through' : 'none',
            }}
          >
            {task.title}
          </h3>
        </div>

        <p className="text-xs leading-relaxed mb-3 line-clamp-1" style={{ color: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }}>
          {task.description}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          {/* Status badge */}
          <span
            className="font-mono text-xs px-2 py-0.5"
            style={{ color: STATUS_COLOR[task.status], border: `1px solid ${STATUS_COLOR[task.status]}20`, background: `${STATUS_COLOR[task.status]}10`, fontSize: '10px' }}
          >
            {STATUS_LABEL[task.status]}
          </span>

          {/* Priority badge */}
          <span
            className="font-mono text-xs px-2 py-0.5 uppercase"
            style={{ color: PRIORITY_COLOR[task.priority], fontSize: '10px' }}
          >
            ↑ {task.priority}
          </span>

          {/* Tags */}
          {task.tags.map((tag) => (
            <span key={tag} className="font-mono text-xs px-2 py-0.5" style={{ background: 'var(--secondary)', color: 'var(--muted-foreground)', fontSize: '10px' }}>
              #{tag}
            </span>
          ))}

          {/* Assignee */}
          <span className="font-mono text-xs" style={{ color: 'var(--muted-foreground)', fontSize: '10px', marginLeft: 'auto' }}>
            {task.assignee}
          </span>

          {/* Due date */}
          <span
            className="font-mono text-xs"
            style={{
              color: overdue ? '#ff4d4d' : days <= 2 ? '#f59e0b' : 'var(--muted-foreground)',
              fontSize: '10px',
            }}
          >
            {task.status === 'done' ? '✓ ' : overdue ? '! ' : ''}{task.dueDate}
            {overdue && ' (overdue)'}
          </span>
        </div>
      </div>

      {/* Action buttons */}
      {hovered && (
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onEdit}
            className="px-3 py-1.5 font-mono text-xs transition-colors"
            style={{ border: '1px solid var(--border)', color: 'var(--muted-foreground)', background: 'none', cursor: 'pointer' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.borderColor = 'var(--primary)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--muted-foreground)'; e.currentTarget.style.borderColor = 'var(--border)' }}
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="px-2 py-1.5 font-mono text-xs transition-colors"
            style={{ border: '1px solid transparent', color: 'var(--muted-foreground)', background: 'none', cursor: 'pointer' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#ff4d4d' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--muted-foreground)' }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  )
}
