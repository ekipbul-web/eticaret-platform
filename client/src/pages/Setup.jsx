import { useState } from 'react'
import axios from 'axios'

export default function Setup() {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '', setupKey: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const setup = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      setError('Şifreler eşleşmiyor')
      return
    }
    setLoading(true)
    try {
      await axios.post('/api/setup/initialize', {
        username: form.username,
        email: form.email,
        password: form.password,
        setupKey: form.setupKey
      })
      alert('Platform kuruldu! Giriş yapabilirsiniz.')
      window.location.href = '/login'
    } catch(err) {
      setError(err.response?.data?.error || 'Kurulum başarısız')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: 16,
    marginBottom: 16,
    borderRadius: 14,
    border: '1px solid rgba(255,255,255,0.15)',
    background: 'rgba(255,255,255,0.05)',
    color: 'white',
    fontSize: 16,
    outline: 'none',
    boxSizing: 'border-box'
  }

  return (
    <div style={{ maxWidth: 450, margin: '60px auto' }}>
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 24,
        padding: 50,
        textAlign: 'center'
      }}>
        <div style={{ fontSize: 60, marginBottom: 15 }}>👑</div>
        <h2 style={{ color: 'white', fontSize: 30, fontWeight: 800, marginBottom: 8 }}>
          Platform Kurulumu
        </h2>
        <p style={{ color: '#94a3b8', marginBottom: 30 }}>
          Owner hesabınızı oluşturun
        </p>
        
        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.15)',
            border: '1px solid rgba(239,68,68,0.3)',
            color: '#fca5a5',
            padding: 14,
            borderRadius: 12,
            marginBottom: 20,
            fontSize: 14
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={setup}>
          <input
            placeholder="Kullanıcı Adı"
            value={form.username}
            onChange={e => setForm({...form, username: e.target.value})}
            required
            style={inputStyle}
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={e => setForm({...form, email: e.target.value})}
            required
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Şifre"
            value={form.password}
            onChange={e => setForm({...form, password: e.target.value})}
            required
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Şifre Tekrar"
            value={form.confirmPassword}
            onChange={e => setForm({...form, confirmPassword: e.target.value})}
            required
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Kurulum Anahtarı"
            value={form.setupKey}
            onChange={e => setForm({...form, setupKey: e.target.value})}
            required
            style={{...inputStyle, marginBottom: 24}}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: 16,
              borderRadius: 14,
              background: loading ? '#555' : 'linear-gradient(135deg, #f59e0b, #ef4444)',
              color: 'white',
              border: 'none',
              fontSize: 17,
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {loading ? 'Kuruluyor...' : 'Platformu Başlat'}
          </button>
        </form>
      </div>
    </div>
  )
}        <form onSubmit={setup}>
          <input placeholder="Kullanıcı Adı" value={form.username} onChange={e => setForm({...form, username: e.target.value})} required
            style={{ width: '100%', padding: 16, marginBottom: 16, borderRadius: 14, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: 16, outline: 'none', boxSizing: 'border-box' }} />
          <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required
            style={{ width: '100%', padding: 16, marginBottom: 16, borderRadius: 14, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: 16, outline: 'none', boxSizing: 'border-box' }} />
          <input type="password" placeholder="Şifre" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required
            style={{ width: '100%', padding: 16, marginBottom: 16, borderRadius: 14, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: 16, outline: 'none', boxSizing: 'border-box' }} />
          <input type="password" placeholder="Şifre Tekrar" value={form.confirmPassword} onChange={e => setForm({...form, confirmPassword: e.target.value})} required
            style={{ width: '100%', padding: 16, marginBottom: 16, borderRadius: 14, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: 16, outline: 'none', boxSizing: 'border-box' }} />
          <input type="password" placeholder="Kurulum Anahtarı" value={form.setupKey} onChange={e => setForm({...form, setupKey: e.target.value})} required
            style={{ width: '100%', padding: 16, marginBottom: 24, borderRadius: 14, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: 16, outline: 'none', boxSizing: 'border-box' }} />
          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: 16, borderRadius: 14, background: loading ? '#555' : 'linear-gradient(135deg, #f59e0b, #ef4444)', color: 'white', border: 'none', fontSize: 17, fontWeight: 700, cursor: 'pointer', boxShadow: '0 10px 30px rgba(245,158,11,0.3)' }}>
            {loading ? 'Kuruluyor...' : '🚀 Platformu Başlat'}
          </button>
        </form>
      </div>
    </div>
  )
}        {error && <div style={{ background: '#fee', color: '#c33', padding: 10, borderRadius: 10, marginBottom: 20 }}>{error}</div>}
        <form onSubmit={setup}>
          <input placeholder="Kullanıcı Adı" value={form.username} onChange={e => setForm({...form, username: e.target.value})}
            style={{ width: '100%', padding: 12, marginBottom: 15, borderRadius: 10, border: '1px solid #ddd', boxSizing: 'border-box' }} />
          <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
            style={{ width: '100%', padding: 12, marginBottom: 15, borderRadius: 10, border: '1px solid #ddd', boxSizing: 'border-box' }} />
          <input type="password" placeholder="Şifre" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
            style={{ width: '100%', padding: 12, marginBottom: 15, borderRadius: 10, border: '1px solid #ddd', boxSizing: 'border-box' }} />
          <input type="password" placeholder="Şifre Tekrar" value={form.confirmPassword} onChange={e => setForm({...form, confirmPassword: e.target.value})}
            style={{ width: '100%', padding: 12, marginBottom: 15, borderRadius: 10, border: '1px solid #ddd', boxSizing: 'border-box' }} />
          <input type="password" placeholder="Kurulum Anahtarı" value={form.setupKey} onChange={e => setForm({...form, setupKey: e.target.value})}
            style={{ width: '100%', padding: 12, marginBottom: 20, borderRadius: 10, border: '1px solid #ddd', boxSizing: 'border-box' }} />
          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: 15, background: 'linear-gradient(135deg, #f6d365, #fda085)', color: '#333', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 'bold', cursor: 'pointer' }}>
            {loading ? 'Kuruluyor...' : '🚀 Platformu Başlat'}
          </button>
        </form>
      </div>
    </div>
  )
}
