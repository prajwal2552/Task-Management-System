import { useState } from 'react'
import type { User } from '../types'

type Props = {
  onAuth: (user: User) => void
}

const DEMO_USER: User = {
  id: 'u-001',
  name: 'Alex Chen',
  email: 'alex@taskflow.dev',
  avatar: 'AC',
}

export default function AuthScreen({ onAuth }: Props) {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('All fields are required.')
      return
    }
    if (mode === 'signup' && !name) {
      setError('Name is required.')
      return
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onAuth({ ...DEMO_USER, name: name || DEMO_USER.name, email })
    }, 800)
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--background)' }}>
      {/* Left panel */}
      <div
        className="hidden lg:flex flex-col justify-between p-12 w-[480px] shrink-0"
        style={{ background: '#0f0f0f', borderRight: '1px solid var(--border)' }}
      >
        <div>
          <div className="flex items-center gap-3 mb-16">
            <div
              className="w-8 h-8 flex items-center justify-center text-xs font-bold"
              style={{ background: 'var(--primary)', color: '#000' }}
            >
              TF
            </div>
            <span className="font-mono text-sm tracking-widest uppercase" style={{ color: 'var(--muted-foreground)' }}>
              TaskFlow
            </span>
          </div>
          <h1 className="font-mono font-bold text-4xl leading-tight mb-6" style={{ color: 'var(--foreground)' }}>
            Ship faster.<br />
            Track everything.
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }}>
            A no-nonsense task manager built for engineering teams who care about execution, not ceremony.
          </p>
        </div>

        <div className="space-y-6">
          {[
            { label: 'Tasks completed this week', value: '1,284' },
            { label: 'Active teams', value: '47' },
            { label: 'Avg. resolution time', value: '2.3 days' },
          ].map((stat) => (
            <div key={stat.label} className="flex items-baseline justify-between" style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
              <span className="font-mono text-xs" style={{ color: 'var(--muted-foreground)' }}>{stat.label}</span>
              <span className="font-mono font-bold text-xl" style={{ color: 'var(--primary)' }}>{stat.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Logo mobile */}
          <div className="flex items-center gap-3 mb-12 lg:hidden">
            <div
              className="w-8 h-8 flex items-center justify-center text-xs font-bold"
              style={{ background: 'var(--primary)', color: '#000' }}
            >
              TF
            </div>
            <span className="font-mono text-sm tracking-widest uppercase" style={{ color: 'var(--muted-foreground)' }}>
              TaskFlow
            </span>
          </div>

          <div className="mb-8">
            <div className="flex font-mono text-xs" style={{ borderBottom: '1px solid var(--border)' }}>
              {(['login', 'signup'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setError('') }}
                  className="px-4 py-3 uppercase tracking-widest transition-colors"
                  style={{
                    color: mode === m ? 'var(--primary)' : 'var(--muted-foreground)',
                    borderBottom: mode === m ? '2px solid var(--primary)' : '2px solid transparent',
                    background: 'none',
                    cursor: 'pointer',
                    marginBottom: '-1px',
                  }}
                >
                  {m === 'login' ? 'Sign in' : 'Create account'}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block font-mono text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--muted-foreground)' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Chen"
                  className="w-full px-4 py-3 font-mono text-sm outline-none transition-colors"
                  style={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    color: 'var(--foreground)',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--primary)' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)' }}
                />
              </div>
            )}

            <div>
              <label className="block font-mono text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--muted-foreground)' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@company.dev"
                className="w-full px-4 py-3 font-mono text-sm outline-none transition-colors"
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  color: 'var(--foreground)',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--primary)' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)' }}
              />
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--muted-foreground)' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 font-mono text-sm outline-none transition-colors"
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  color: 'var(--foreground)',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--primary)' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)' }}
              />
            </div>

            {error && (
              <p className="font-mono text-xs" style={{ color: '#ff4d4d' }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 font-mono text-sm font-bold uppercase tracking-widest transition-opacity mt-2"
              style={{
                background: 'var(--primary)',
                color: '#000',
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'wait' : 'pointer',
                border: 'none',
              }}
            >
              {loading ? 'Authenticating...' : mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <div className="mt-8 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
            <p className="font-mono text-xs text-center mb-4" style={{ color: 'var(--muted-foreground)' }}>
              — or continue with —
            </p>
            <div className="grid grid-cols-2 gap-3">
              {['GitHub', 'Google'].map((provider) => (
                <button
                  key={provider}
                  onClick={() => onAuth({ ...DEMO_USER, name: 'Demo User' })}
                  className="py-3 font-mono text-xs uppercase tracking-widest transition-colors"
                  style={{
                    background: 'none',
                    border: '1px solid var(--border)',
                    color: 'var(--muted-foreground)',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary)'
                    e.currentTarget.style.color = 'var(--primary)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)'
                    e.currentTarget.style.color = 'var(--muted-foreground)'
                  }}
                >
                  {provider}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
