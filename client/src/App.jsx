import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import axios from 'axios'

const css = `
  * { margin:0; padding:0; box-sizing:border-box }
  body { font-family: 'Segoe UI', system-ui, sans-serif }
  input:focus { border-color: #818cf8 !important; box-shadow: 0 0 0 3px rgba(129,140,248,0.2) !important }
  button:active { transform: scale(0.98) }
  @keyframes fadeUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
  .fadeUp { animation: fadeUp 0.5s ease-out }
  @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.5 } }
  .pulse { animation: pulse 2s infinite }
  @keyframes float { 0%,100% { transform:translateY(0) } 50% { transform:translateY(-10px) } }
  .float { animation: float 3s ease-in-out infinite }
`

function UserMenu({ user, logout }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 40, padding: '6px 14px 6px 6px', cursor: 'pointer', color: 'white', fontSize: 14, fontWeight: 500 }}>
        <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, #667eea, #764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>
          {user.username.charAt(0).toUpperCase()}
        </div>
        <span style={{ maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.username}</span>
        <span style={{ fontSize: 10 }}>▼</span>
      </button>
      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setOpen(false)} />
          <div style={{ position: 'absolute', right: 0, top: 48, background: '#1e1b4b', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, padding: 6, minWidth: 180, zIndex: 100, boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
            <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#a78bfa', fontSize: 13, fontWeight: 600 }}>{user.email}</div>
            <button onClick={() => { logout(); setOpen(false) }} style={{ width: '100%', padding: '10px 14px', border: 'none', background: 'none', color: '#fca5a5', cursor: 'pointer', textAlign: 'left', borderRadius: 10, fontSize: 14, marginTop: 4 }}>Cikis Yap</button>
          </div>
        </>
      )}
    </div>
  )
}

function Layout({ children }) {
  const [user, setUser] = useState(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const u = localStorage.getItem('user')
    if (token && u) setUser(JSON.parse(u))
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    window.location.href = '/'
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0c0a1d 0%, #1a1040 30%, #0f0c29 60%, #1a1040 100%)' }}>
      <style>{css}</style>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 1000,
        background: scrolled ? 'rgba(15,12,41,0.95)' : 'rgba(15,12,41,0.7)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '0 24px', height: 68,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'all 0.3s'
      }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 12, background: 'linear-gradient(135deg, #667eea, #764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>M</div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'white', lineHeight: 1 }}>MarketPlace</div>
            <div style={{ fontSize: 10, color: '#818cf8', letterSpacing: 2 }}>PREMIUM</div>
          </div>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <Link to="/" style={{ color: '#c4b5fd', textDecoration: 'none', fontSize: 14, fontWeight: 500, padding: '6px 12px', borderRadius: 8 }}>Kesfet</Link>
          {user ? (
            <UserMenu user={user} logout={logout} />
          ) : (
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <Link to="/login" style={{ color: '#c4b5fd', textDecoration: 'none', fontSize: 14, fontWeight: 500, padding: '8px 16px', borderRadius: 10 }}>Giris Yap</Link>
              <Link to="/register" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', padding: '10px 22px', borderRadius: 12, textDecoration: 'none', fontSize: 14, fontWeight: 600, boxShadow: '0 8px 25px rgba(102,126,234,0.3)' }}>Kayit Ol</Link>
            </div>
          )}
        </div>
      </nav>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>{children}</div>
    </div>
  )
}

function Home() {
  const [needsSetup, setNeedsSetup] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    axios.get('/api/setup/check').then(r => setNeedsSetup(r.data.needsSetup)).catch(() => {})
    const u = localStorage.getItem('user')
    if (u) setUser(JSON.parse(u))
  }, [])

  const cats = [
    { i: '🎮', n: 'Oyun', d: 'Hesaplar ve dijital urunler', c: '#8b5cf6', g: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(139,92,246,0.05))' },
    { i: '👕', n: 'Giyim', d: 'Moda ve giyim urunleri', c: '#3b82f6', g: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(59,130,246,0.05))' },
    { i: '💻', n: 'Teknoloji', d: 'Bilgisayar ve yazilim', c: '#10b981', g: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.05))' },
    { i: '📱', n: 'Elektronik', d: 'Telefon ve cihazlar', c: '#f59e0b', g: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.05))' },
  ]

  const features = [
    { i: '🛡️', t: 'Guvenli Alisveris', d: 'SSL sertifikasi ve guvenli odeme altyapisi' },
    { i: '⚡', t: 'Hizli Ilan Sistemi', d: 'Dakikalar icinde ilan verin, hemen yayinlansin' },
    { i: '⭐', t: 'Guvenilir Saticilar', d: 'Degerlendirme sistemi ile guvenli alisveris' },
  ]

  return (
    <div>
      <div className="fadeUp" style={{
        background: 'radial-gradient(circle at 50% 0%, rgba(102,126,234,0.2), transparent 70%)',
        borderRadius: 40, padding: '80px 30px', textAlign: 'center', marginBottom: 60,
        border: '1px solid rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: 30, left: '10%', width: 60, height: 60, borderRadius: 16, background: 'linear-gradient(135deg, rgba(139,92,246,0.3), transparent)', transform: 'rotate(15deg)' }} className="float" />
        <div style={{ position: 'absolute', bottom: 40, right: '10%', width: 80, height: 80, borderRadius: 20, background: 'linear-gradient(135deg, rgba(59,130,246,0.3), transparent)', transform: 'rotate(-10deg)' }} className="float" />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 40, padding: '8px 20px', marginBottom: 30, color: '#c4b5fd', fontSize: 13, fontWeight: 500 }}>
            <span className="pulse" style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} /> Turkiye'nin en hizli buyuyen pazaryeri
          </div>
          
          <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 900, color: 'white', marginBottom: 16, lineHeight: 1.1 }}>
            Guvenli Alisverisin<br />
            <span style={{ background: 'linear-gradient(135deg, #667eea, #a78bfa, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Yeni Nesil</span> Adresi
          </h1>
          
          <p style={{ fontSize: 'clamp(16px, 2vw, 19px)', color: '#94a3b8', maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.6 }}>
            Modern, guvenli ve kullanici dostu platform. Saniyeler icinde ilan verin, binlerce urunu kesfedin.
          </p>
          
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            {needsSetup ? (
              <Link to="/setup" style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)', color: 'white', padding: '16px 40px', borderRadius: 16, textDecoration: 'none', fontSize: 17, fontWeight: 700, boxShadow: '0 15px 40px rgba(245,158,11,0.3)' }}>🚀 Platformu Baslat</Link>
            ) : user ? (
              <span style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', padding: '16px 40px', borderRadius: 16, fontSize: 17, fontWeight: 700, boxShadow: '0 15px 40px rgba(102,126,234,0.3)' }}>📝 Ilan Ver</span>
            ) : (
              <Link to="/register" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', padding: '16px 40px', borderRadius: 16, textDecoration: 'none', fontSize: 17, fontWeight: 700, boxShadow: '0 15px 40px rgba(102,126,234,0.3)' }}>Hemen Basla</Link>
            )}
            <Link to="/search" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'white', padding: '16px 40px', borderRadius: 16, textDecoration: 'none', fontSize: 17, fontWeight: 600 }}>Urunleri Kesfet →</Link>
          </div>
          
          <div style={{ display: 'flex', gap: 40, justifyContent: 'center', marginTop: 50, flexWrap: 'wrap' }}>
            <div><div style={{ fontSize: 28, fontWeight: 800, color: 'white' }}>10K+</div><div style={{ fontSize: 13, color: '#94a3b8' }}>Aktif Kullanici</div></div>
            <div style={{ width: 1, background: 'rgba(255,255,255,0.08)' }} />
            <div><div style={{ fontSize: 28, fontWeight: 800, color: 'white' }}>50K+</div><div style={{ fontSize: 13, color: '#94a3b8' }}>Toplam Ilan</div></div>
            <div style={{ width: 1, background: 'rgba(255,255,255,0.08)' }} />
            <div><div style={{ fontSize: 28, fontWeight: 800, color: 'white' }}>%99</div><div style={{ fontSize: 13, color: '#94a3b8' }}>Musteri Memnuniyeti</div></div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 60 }}>
        <div style={{ marginBottom: 30 }}>
          <h2 style={{ fontSize: 30, fontWeight: 800, color: 'white', marginBottom: 8 }}>Kategoriler</h2>
          <p style={{ color: '#94a3b8', fontSize: 15 }}>Ilgi alaniniza gore ozel kategoriler</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          {cats.map(cat => (
            <div key={cat.n} className="fadeUp" style={{
              background: cat.g, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 24, padding: 35, cursor: 'pointer', transition: 'all 0.3s'
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = cat.c; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 20px 50px ${cat.c}20` }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: `${cat.c}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, marginBottom: 20 }}>{cat.i}</div>
              <h3 style={{ color: 'white', fontSize: 20, fontWeight: 700, marginBottom: 6 }}>{cat.n}</h3>
              <p style={{ color: '#94a3b8', fontSize: 13, margin: 0 }}>{cat.d}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 60 }}>
        <h2 style={{ fontSize: 30, fontWeight: 800, color: 'white', marginBottom: 8, textAlign: 'center' }}>Neden MarketPlace?</h2>
        <p style={{ color: '#94a3b8', fontSize: 15, textAlign: 'center', marginBottom: 40 }}>Sizi dusunerek tasarladik</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
          {features.map(f => (
            <div key={f.t} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 24, padding: 35, textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>{f.i}</div>
              <h3 style={{ color: 'white', fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{f.t}</h3>
              <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.5 }}>{f.d}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '40px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, #667eea, #764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>M</div>
          <span style={{ color: 'white', fontWeight: 700, fontSize: 18 }}>MarketPlace</span>
        </div>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <span style={{ color: '#64748b', fontSize: 13 }}>© 2024 MarketPlace</span>
          <span style={{ color: '#64748b', fontSize: 13 }}>Gizlilik</span>
          <span style={{ color: '#64748b', fontSize: 13 }}>Kosullar</span>
          <span style={{ color: '#64748b', fontSize: 13 }}>Iletisim</span>
        </div>
      </div>
    </div>
  )
}

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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
      setError(err.response?.data?.error || 'Giris basarisiz')
    } finally { setLoading(false) }
  }

  const s = { width: '100%', padding: '15px 18px', marginBottom: 14, borderRadius: 14, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: 'white', fontSize: 15, outline: 'none' }

  return (
    <div style={{ maxWidth: 440, margin: '40px auto' }}>
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 28, padding: 48, backdropFilter: 'blur(20px)' }}>
        <div style={{ textAlign: 'center', marginBottom: 35 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #667eea, #764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 16' }}>🔐</div>
          <h2 style={{ color: 'white', fontSize: 26, fontWeight: 800, marginBottom: 6 }}>Tekrar Hos Geldin</h2>
          <p style={{ color: '#94a3b8', fontSize: 14 }}>Hesabiniza giris yapin</p>
        </div>
        {error && <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5', padding: 14, borderRadius: 12, marginBottom: 20, fontSize: 13, textAlign: 'center' }}>{error}</div>}
        <form onSubmit={login}>
          <input type="email" placeholder="Email adresiniz" value={email} onChange={e => setEmail(e.target.value)} required style={s} />
          <input type="password" placeholder="Sifreniz" value={password} onChange={e => setPassword(e.target.value)} required style={s} />
          <button type="submit" disabled={loading} style={{ width: '100%', padding: 15, borderRadius: 14, background: loading ? '#555' : 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', border: 'none', fontSize: 16, fontWeight: 700, cursor: 'pointer', marginTop: 6, boxShadow: '0 10px 30px rgba(102,126,234,0.25)' }}>
            {loading ? 'Giris yapiliyor...' : 'Giris Yap'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 22, color: '#94a3b8', fontSize: 13 }}>
          Hesabiniz yok mu? <Link to="/register" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: 600 }}>Kayit Ol</Link>
        </p>
      </div>
    </div>
  )
}

function Register() {
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
      setMsg('Kayit basarili! Giris sayfasina yonlendiriliyorsunuz...')
      setTimeout(() => { window.location.href = '/login' }, 2000)
    } catch(error) {
      setErr(error.response?.data?.error || 'Kayit basarisiz')
    } finally { setLoading(false) }
  }

  const s = { width: '100%', padding: '15px 18px', marginBottom: 14, borderRadius: 14, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: 'white', fontSize: 15, outline: 'none' }

  return (
    <div style={{ maxWidth: 440, margin: '40px auto' }}>
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 28, padding: 48, backdropFilter: 'blur(20px)' }}>
        <div style={{ textAlign: 'center', marginBottom: 35 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 16' }}>✨</div>
          <h2 style={{ color: 'white', fontSize: 26, fontWeight: 800, marginBottom: 6 }}>Hesap Olustur</h2>
          <p style={{ color: '#94a3b8', fontSize: 14 }}>Aramiza katilin</p>
        </div>
        {msg && <div style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', color: '#6ee7b7', padding: 14, borderRadius: 12, marginBottom: 20, fontSize: 13, textAlign: 'center' }}>{msg}</div>}
        {err && <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5', padding: 14, borderRadius: 12, marginBottom: 20, fontSize: 13, textAlign: 'center' }}>{err}</div>}
        <form onSubmit={register}>
          <input placeholder="Kullanici Adi" value={form.username} onChange={e => setForm({...form, username: e.target.value})} required style={s} />
          <input type="email" placeholder="Email adresiniz" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required style={s} />
          <input type="password" placeholder="Sifre (min 8 karakter)" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required style={s} />
          <input placeholder="Telefon (opsiyonel)" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} style={s} />
          <button type="submit" disabled={loading} style={{ width: '100%', padding: 15, borderRadius: 14, background: loading ? '#555' : 'linear-gradient(135deg, #10b981, #059669)', color: 'white', border: 'none', fontSize: 16, fontWeight: 700, cursor: 'pointer', marginTop: 6, boxShadow: '0 10px 30px rgba(16,185,129,0.25)' }}>
            {loading ? 'Kaydediliyor...' : 'Kayit Ol'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 22, color: '#94a3b8', fontSize: 13 }}>
          Hesabiniz var mi? <Link to="/login" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: 600 }}>Giris Yap</Link>
        </p>
      </div>
    </div>
  )
}

function Setup() {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '', setupKey: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    axios.get('/api/setup/check').then(r => {
      if (!r.data.needsSetup) {
        alert('Owner zaten mevcut. Bu sayfa kullanilamaz.')
        window.location.href = '/'
      }
    }).catch(() => {})
  }, [])

  const setup = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) { setError('Sifreler eslesmiyor'); return }
    setLoading(true)
    try {
      await axios.post('/api/setup/initialize', { username: form.username, email: form.email, password: form.password, setupKey: form.setupKey })
      alert('Platform basariyla kuruldu! Giris yapabilirsiniz.')
      window.location.href = '/login'
    } catch(err) {
      setError(err.response?.data?.error || 'Kurulum basarisiz')
    } finally { setLoading(false) }
  }

  const s = { width: '100%', padding: '15px 18px', marginBottom: 14, borderRadius: 14, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: 'white', fontSize: 15, outline: 'none' }

  return (
    <div style={{ maxWidth: 460, margin: '40px auto' }}>
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 28, padding: 48, backdropFilter: 'blur(20px)', textAlign: 'center' }}>
        <div style={{ fontSize: 60, marginBottom: 10 }}>👑</div>
        <h2 style={{ color: 'white', fontSize: 26, fontWeight: 800, marginBottom: 6 }}>Platform Kurulumu</h2>
        <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 30 }}>Sadece ilk kurulum icin. Owner hesabinizi olusturun.</p>
        {error && <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5', padding: 14, borderRadius: 12, marginBottom: 20, fontSize: 13 }}>{error}</div>}
        <form onSubmit={setup}>
          <input placeholder="Kullanici Adi" value={form.username} onChange={e => setForm({...form, username: e.target.value})} required style={s} />
          <input type="email" placeholder="Email adresiniz" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required style={s} />
          <input type="password" placeholder="Sifre" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required style={s} />
          <input type="password" placeholder="Sifre Tekrar" value={form.confirmPassword} onChange={e => setForm({...form, confirmPassword: e.target.value})} required style={s} />
          <input type="password" placeholder="Kurulum Anahtari" value={form.setupKey} onChange={e => setForm({...form, setupKey: e.target.value})} required style={s} />
          <button type="submit" disabled={loading} style={{ width: '100%', padding: 15, borderRadius: 14, background: loading ? '#555' : 'linear-gradient(135deg, #f59e0b, #ef4444)', color: 'white', border: 'none', fontSize: 16, fontWeight: 700, cursor: 'pointer', marginTop: 6, boxShadow: '0 10px 30px rgba(245,158,11,0.25)' }}>
            {loading ? 'Kuruluyor...' : '🚀 Platformu Baslat'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/setup" element={<Setup />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
