import { useState } from 'react'
import axios from 'axios'

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', phone: '' })
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const register = async (e) => {
    e.preventDefault()
    setMsg('')
    setErr('')
    setLoading(true)
    
    try {
      await axios.post('/api/auth/register', form)
      setMsg('✅ Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...')
      setTimeout(() => { window.location.href = '/login' }, 2000)
    } catch(err) {
      setErr(err.response?.data?.error || 'Kayıt başarısız')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: '60px auto' }}>
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 24,
        padding: 50
      }}>
        <h2 style={{ color: 'white', fontSize: 32, fontWeight: 800, textAlign: 'center', marginBottom: 10 }}>Kayıt Ol</h2>
        <p style={{ color: '#94a3b8', textAlign: 'center', marginBottom: 35 }}>Yeni hesap oluşturun</p>
        
        {msg && <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#6ee7b7', padding: 14, borderRadius: 12, marginBottom: 20, fontSize: 14, textAlign: 'center' }}>{msg}</div>}
        {err && <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', padding: 14, borderRadius: 12, marginBottom: 20, fontSize: 14, textAlign: 'center' }}>{err}</div>}
        
        <form onSubmit={register}>
          <input placeholder="Kullanıcı Adı" value={form.username} onChange={e => setForm({...form, username: e.target.value})} required
            style={{ width: '100%', padding: 16, marginBottom: 16, borderRadius: 14, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: 16, outline: 'none', boxSizing: 'border-box' }} />
          <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required
            style={{ width: '100%', padding: 16, marginBottom: 16, borderRadius: 14, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: 16, outline: 'none', boxSizing: 'border-box' }} />
          <input type="password" placeholder="Şifre (min 8 karakter)" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required
            style={{ width: '100%', padding: 16, marginBottom: 16, borderRadius: 14, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: 16, outline: 'none', boxSizing: 'border-box' }} />
          <input placeholder="Telefon (opsiyonel)" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
            style={{ width: '100%', padding: 16, marginBottom: 24, borderRadius: 14, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: 16, outline: 'none', boxSizing: 'border-box' }} />
          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: 16, borderRadius: 14, background: loading ? '#555' : 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', border: 'none', fontSize: 17, fontWeight: 700, cursor: loading ? 'default' : 'pointer', boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)' }}>
            {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: 25, color: '#94a3b8', fontSize: 14 }}>
          Hesabınız var mı? <a href="/login" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: 600 }}>Giriş Yap</a>
        </p>
      </div>
    </div>
  )
}            Kayıt Ol
          </button>
        </form>
      </div>
    </div>
  )
}
