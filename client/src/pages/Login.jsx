import { useState } from 'react'
import axios from 'axios'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const login = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('/api/auth/login', { email, password })
      localStorage.setItem('token', res.data.token)
      window.location.href = '/'
    } catch(err) {
      setError(err.response?.data?.error || 'Hata')
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <div style={{ background: 'white', padding: 40, borderRadius: 20, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 30 }}>Giriş Yap</h2>
        {error && <div style={{ background: '#fee', color: '#c33', padding: 10, borderRadius: 10, marginBottom: 20 }}>{error}</div>}
        <form onSubmit={login}>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', padding: 12, marginBottom: 15, borderRadius: 10, border: '1px solid #ddd', boxSizing: 'border-box' }} />
          <input type="password" placeholder="Şifre" value={password} onChange={e => setPassword(e.target.value)}
            style={{ width: '100%', padding: 12, marginBottom: 20, borderRadius: 10, border: '1px solid #ddd', boxSizing: 'border-box' }} />
          <button type="submit" style={{ width: '100%', padding: 15, background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 'bold', cursor: 'pointer' }}>
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  )
}
