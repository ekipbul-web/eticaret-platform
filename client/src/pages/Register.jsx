import { useState } from 'react'
import axios from 'axios'

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', phone: '' })
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  const register = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/auth/register', form)
      setMsg('✅ Kayıt başarılı! Giriş yapabilirsiniz.')
      setErr('')
    } catch(err) {
      setErr(err.response?.data?.error || 'Hata')
      setMsg('')
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <div style={{ background: 'white', padding: 40, borderRadius: 20, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 30 }}>Kayıt Ol</h2>
        {msg && <div style={{ background: '#efe', color: '#3c3', padding: 10, borderRadius: 10, marginBottom: 20 }}>{msg}</div>}
        {err && <div style={{ background: '#fee', color: '#c33', padding: 10, borderRadius: 10, marginBottom: 20 }}>{err}</div>}
        <form onSubmit={register}>
          <input placeholder="Kullanıcı Adı" value={form.username} onChange={e => setForm({...form, username: e.target.value})}
            style={{ width: '100%', padding: 12, marginBottom: 15, borderRadius: 10, border: '1px solid #ddd', boxSizing: 'border-box' }} />
          <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
            style={{ width: '100%', padding: 12, marginBottom: 15, borderRadius: 10, border: '1px solid #ddd', boxSizing: 'border-box' }} />
          <input type="password" placeholder="Şifre" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
            style={{ width: '100%', padding: 12, marginBottom: 15, borderRadius: 10, border: '1px solid #ddd', boxSizing: 'border-box' }} />
          <input placeholder="Telefon (opsiyonel)" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
            style={{ width: '100%', padding: 12, marginBottom: 20, borderRadius: 10, border: '1px solid #ddd', boxSizing: 'border-box' }} />
          <button type="submit" style={{ width: '100%', padding: 15, background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 'bold', cursor: 'pointer' }}>
            Kayıt Ol
          </button>
        </form>
      </div>
    </div>
  )
}
