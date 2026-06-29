import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Setup from './pages/Setup'

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 20, background: '#f0f2f5', minHeight: '100vh' }}>
        <nav style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', padding: '15px 30px', borderRadius: 15, marginBottom: 30, color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0 }}>🛍️ MarketPlace</h1>
          <div style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
            <a href="/" style={{ color: 'white', textDecoration: 'none' }}>Ana Sayfa</a>
            <a href="/login" style={{ color: 'white', textDecoration: 'none' }}>Giriş</a>
            <a href="/register" style={{ background: 'white', color: '#667eea', padding: '8px 20px', borderRadius: 20, textDecoration: 'none', fontWeight: 'bold' }}>Kayıt Ol</a>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/setup" element={<Setup />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
