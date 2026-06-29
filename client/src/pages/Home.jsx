import { useState, useEffect } from 'react'
import axios from 'axios'

export default function Home() {
  const [needsSetup, setNeedsSetup] = useState(false)

  useEffect(() => {
    axios.get('/api/setup/check').then(r => setNeedsSetup(r.data.needsSetup)).catch(() => {})
  }, [])

  return (
    <div>
      <div style={{ background: 'white', padding: 60, borderRadius: 20, textAlign: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', marginBottom: 30 }}>
        <h2 style={{ fontSize: 36, color: '#333', marginBottom: 10 }}>Türkiye'nin En Güvenli Pazar Yeri</h2>
        <p style={{ fontSize: 18, color: '#666', marginBottom: 30 }}>İlan ver, keşfet, güvenle alışveriş yap</p>
        {needsSetup && (
          <a href="/setup" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', padding: '15px 40px', borderRadius: 30, textDecoration: 'none', fontSize: 18, fontWeight: 'bold', display: 'inline-block' }}>
            🚀 Platformu Başlat
          </a>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
        {['🎮 Oyun', '👕 Giyim', '💻 Teknoloji', '📱 Elektronik'].map(cat => (
          <div key={cat} style={{ background: 'white', padding: 30, borderRadius: 15, textAlign: 'center', boxShadow: '0 5px 20px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: 24 }}>{cat}</h3>
            <p style={{ color: '#666' }}>Yakında ilanlar</p>
          </div>
        ))}
      </div>
    </div>
  )
}
