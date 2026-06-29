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
      alert('✅ Platform kuruldu! Giriş yapabilirsiniz.')
      window.location.href = '/login'
    } catch(err) {
      setError(err.response?.data?.error || 'Kurulum başarısız')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 450, margin: '0 auto' }}>
      <div style={{ background: 'white', padding: 40, borderRadius: 20, boxShadow: '0 10px 40px rgba(0,0,0,0.1)', textAlign: 'center' }}>
        <h2 style={{ marginBottom: 10 }}>👑 Platform Kurulumu</h2>
        <p style={{ color: '#666', marginBottom: 30 }}>Owner hesabınızı oluşturun</p>
        {error && <div style={{ background: '#fee', color: '#c33', padding: 10, borderRadius: 10, marginBottom: 20 }}>{error}</div>}
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
