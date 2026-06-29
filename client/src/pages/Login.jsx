import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const login = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      const res = await axios.post('/api/auth/login', { email, password })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      window.location.href = '/'
    } catch(err) {
      setError(err.response?.data?.error || 'Giriş başarısız')
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
        <h2 style={{ color: 'white', fontSize: 32, fontWeight: 800, textAlign: 'center', marginBottom: 10 }}>Giriş Yap</h2>
        <p style={{ color: '#94a3b8', textAlign: 'center', marginBottom: 35 }}>Hesabınıza giriş yapın</p>
        
        {error && (
          <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', padding: 14, borderRadius: 12, marginBottom: 20, fontSize: 14, textAlign: 'center' }}>
            {error}
          </div>
        )}
        
        <form onSubmit={login}>
          <input 
            type="email" 
            placeholder="Email adresiniz" 
            value={email} 
            onChange={e => setEmail(e.target.value)}
            required
            style={{
              width: '100%', padding: 16, marginBottom: 16, borderRadius: 14,
              border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)',
              color: 'white', fontSize: 16, outline: 'none', boxSizing: 'border-box'
            }}
          />
          <input 
            type="password" 
            placeholder="Şifreniz" 
            value={password} 
            onChange={e => setPassword(e.target.value)}
            required
            style={{
              width: '100%', padding: 16, marginBottom: 24, borderRadius: 14,
              border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)',
              color: 'white', fontSize: 16, outline: 'none', boxSizing: 'border-box'
            }}
          />
          <button 
            type="submit" 
            disabled={loading}
            style={{
              width: '100%', padding: 16, borderRadius: 14,
              background: loading ? '#555' : 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white', border: 'none', fontSize: 17, fontWeight: 700,
              cursor: loading ? 'default' : 'pointer',
              boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
            }}
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: 25, color: '#94a3b8', fontSize: 14 }}>
          Hesabınız yok mu? <a href="/register" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: 600 }}>Kayıt Ol</a>
        </p>
      </div>
    </div>
  )
}}
