import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

function Layout({ children }) {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    if (token && savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' }}>
      <nav style={{
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        padding: '0 40px',
        height: 70,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h1 style={{ 
            fontSize: 28, 
            fontWeight: 800,
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0
          }}>
            🛍️ MarketPlace
          </h1>
        </Link>
        
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontSize: 15, fontWeight: 500 }}>Ana Sayfa</Link>
          
          {user ? (
            <>
              <span style={{ color: '#a78bfa', fontSize: 14 }}>
                👋 {user.username}
              </span>
              <button onClick={logout} style={{
                background: 'rgba(239, 68, 68, 0.2)',
                color: '#fca5a5',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '8px 20px',
                borderRadius: 10,
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 500
              }}>
                Çıkış
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: '#ccc', textDecoration: 'none', fontSize: 15 }}>Giriş</Link>
              <Link to="/register" style={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                padding: '10px 24px',
                borderRadius: 12,
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 600
              }}>
                Kayıt Ol
              </Link>
            </>
          )}
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px' }}>
        {children}
      </div>
    </div>
  )
}

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Setup from './pages/Setup'

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
