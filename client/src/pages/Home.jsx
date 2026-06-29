import { useState, useEffect } from 'react'
import axios from 'axios'

export default function Home() {
  const [needsSetup, setNeedsSetup] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    axios.get('/api/setup/check').then(r => setNeedsSetup(r.data.needsSetup)).catch(() => {})
    const u = localStorage.getItem('user')
    if (u) setUser(JSON.parse(u))
  }, [])

  const categories = [
    { icon: '🎮', name: 'Oyun', desc: 'Oyun hesapları ve dijital ürünler', color: '#8b5cf6' },
    { icon: '👕', name: 'Giyim', desc: 'Moda ve giyim ürünleri', color: '#3b82f6' },
    { icon: '💻', name: 'Teknoloji', desc: 'Bilgisayar ve yazılım', color: '#10b981' },
    { icon: '📱', name: 'Elektronik', desc: 'Telefon ve cihazlar', color: '#f59e0b' },
  ]

  return (
    <div>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(59, 130, 246, 0.15))',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 30,
        padding: '80px 40px',
        textAlign: 'center',
        marginBottom: 40
      }}>
        <h2 style={{ fontSize: 48, fontWeight: 900, color: 'white', marginBottom: 15 }}>
          Güvenli Alışverişin Yeni Adresi
        </h2>
        <p style={{ fontSize: 20, color: '#94a3b8', marginBottom: 40, maxWidth: 600, margin: '0 auto 40px' }}>
          İlan ver, keşfet, güvenle alışveriş yap. Türkiye'nin en modern pazar yeri.
        </p>
        
        {needsSetup ? (
          <a href="/setup" style={{
            background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
            color: 'white',
            padding: '18px 50px',
            borderRadius: 16,
            textDecoration: 'none',
            fontSize: 18,
            fontWeight: 700,
            display: 'inline-block',
            boxShadow: '0 10px 40px rgba(245, 158, 11, 0.3)'
          }}>
            🚀 Platformu Başlat
          </a>
        ) : user ? (
          <a href="/create-listing" style={{
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white',
            padding: '18px 50px',
            borderRadius: 16,
            textDecoration: 'none',
            fontSize: 18,
            fontWeight: 700,
            display: 'inline-block',
            boxShadow: '0 10px 40px rgba(102, 126, 234, 0.3)'
          }}>
            📝 İlan Ver
          </a>
        ) : (
          <a href="/register" style={{
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white',
            padding: '18px 50px',
            borderRadius: 16,
            textDecoration: 'none',
            fontSize: 18,
            fontWeight: 700,
            display: 'inline-block',
            boxShadow: '0 10px 40px rgba(102, 126, 234, 0.3)'
          }}>
            Hemen Başla
          </a>
        )}
      </div>

      {/* Categories */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
        {categories.map(cat => (
          <div key={cat.name} style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 20,
            padding: 35,
            cursor: 'pointer',
            transition: 'all 0.3s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
            e.currentTarget.style.transform = 'translateY(-5px)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
            e.currentTarget.style.transform = 'translateY(0)'
          }}>
            <div style={{ fontSize: 48, marginBottom: 15 }}>{cat.icon}</div>
            <h3 style={{ color: 'white', fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{cat.name}</h3>
            <p style={{ color: '#94a3b8', fontSize: 14, margin: 0 }}>{cat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
