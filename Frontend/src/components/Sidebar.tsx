import type { Status, User } from '../types'

type Props = {
  open: boolean
  user: User
  filterStatus: Status | 'all'
  setFilterStatus: (s: Status | 'all') => void
  counts: Record<Status | 'all', number>
  onLogout: () => void
}

const NAV_ITEMS: { label: string; value: Status | 'all'; icon: string }[] = [
  { label: 'All Tasks', value: 'all', icon: '▤' },
  { label: 'To Do', value: 'todo', icon: '○' },
  { label: 'In Progress', value: 'in_progress', icon: '◑' },
  { label: 'In Review', value: 'review', icon: '◕' },
  { label: 'Done', value: 'done', icon: '●' },
]

const STATUS_COLOR: Record<string, string> = {
  all: 'var(--primary)',
  todo: '#6b7280',
  in_progress: '#3b82f6',
  review: '#f59e0b',
  done: 'var(--primary)',
}

export default function Sidebar({ open, user, filterStatus, setFilterStatus, counts, onLogout }: Props) {
  if (!open) return null

  return (
    <aside
      className="flex flex-col shrink-0 w-56"
      style={{ background: '#0f0f0f', borderRight: '1px solid var(--border)', minHeight: '100vh' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
        <div
          className="w-7 h-7 flex items-center justify-center font-mono text-xs font-bold"
          style={{ background: 'var(--primary)', color: '#000' }}
        >
          TF
        </div>
        <span className="font-mono text-xs tracking-widest uppercase" style={{ color: 'var(--muted-foreground)' }}>
          TaskFlow
        </span>
      </div>

      {/* User */}
      <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 flex items-center justify-center font-mono text-xs font-bold shrink-0"
            style={{ background: 'var(--secondary)', color: 'var(--primary)', border: '1px solid var(--border)' }}
          >
            {user.avatar}
          </div>
          <div className="min-w-0">
            <div className="font-mono text-xs font-medium truncate" style={{ color: 'var(--foreground)' }}>{user.name}</div>
            <div className="font-mono text-xs truncate" style={{ color: 'var(--muted-foreground)', fontSize: '10px' }}>{user.email}</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <div className="font-mono text-xs mb-3 px-2" style={{ color: 'var(--muted-foreground)', fontSize: '10px', letterSpacing: '0.1em' }}>
          VIEWS
        </div>
        {NAV_ITEMS.map((item) => {
          const active = filterStatus === item.value
          return (
            <button
              key={item.value}
              onClick={() => setFilterStatus(item.value)}
              className="w-full flex items-center justify-between px-3 py-2 transition-colors text-left"
              style={{
                background: active ? 'var(--secondary)' : 'none',
                borderLeft: active ? '2px solid var(--primary)' : '2px solid transparent',
                cursor: 'pointer',
                border: active ? undefined : 'none',
              }}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xs" style={{ color: active ? STATUS_COLOR[item.value] : 'var(--muted-foreground)' }}>
                  {item.icon}
                </span>
                <span className="font-mono text-xs" style={{ color: active ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
                  {item.label}
                </span>
              </div>
              <span
                className="font-mono text-xs px-1.5 py-0.5"
                style={{
                  background: active ? 'var(--primary)' : 'var(--secondary)',
                  color: active ? '#000' : 'var(--muted-foreground)',
                  minWidth: '20px',
                  textAlign: 'center',
                  fontSize: '10px',
                }}
              >
                {counts[item.value]}
              </span>
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4" style={{ borderTop: '1px solid var(--border)' }}>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 font-mono text-xs transition-colors"
          style={{ color: 'var(--muted-foreground)', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#ff4d4d' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--muted-foreground)' }}
        >
          <span>↩</span> Sign out
        </button>
      </div>
    </aside>
  )
}
