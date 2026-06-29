import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

const api = axios.create({ baseURL: '/api' })
api.interceptors.request.use(c => {
  const t = localStorage.getItem('token')
  if (t) c.headers.Authorization = `Bearer ${t}`
  return c
})

const css = `
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Segoe UI',system-ui,sans-serif;background:#0c0a1d}
  input:focus,textarea:focus,select:focus{border-color:#818cf8!important;box-shadow:0 0 0 3px rgba(129,140,248,0.2)!important;outline:none}
  button:active{transform:scale(0.97)}
  @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  .fadeUp{animation:fadeUp 0.4s ease-out}
  @keyframes slideIn{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
  .slideIn{animation:slideIn 0.3s ease-out}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
  .pulse{animation:pulse 2s infinite}
  ::-webkit-scrollbar{width:6px}
  ::-webkit-scrollbar-track{background:#0c0a1d}
  ::-webkit-scrollbar-thumb{background:#374151;border-radius:3px}
`

const colors = {
  bg: '#0c0a1d',
  card: 'rgba(255,255,255,0.03)',
  border: 'rgba(255,255,255,0.06)',
  text: '#fff',
  gray: '#94a3b8',
  purple: '#818cf8',
  green: '#10b981',
  red: '#ef4444',
  orange: '#f59e0b',
  input: 'rgba(255,255,255,0.04)',
  inputBorder: 'rgba(255,255,255,0.12)'
}

const S = {
  input: { width:'100%',padding:'14px 16px',marginBottom:12,borderRadius:12,border:`1px solid ${colors.inputBorder}`,background:colors.input,color:colors.text,fontSize:14 },
  btn: { width:'100%',padding:14,borderRadius:12,border:'none',color:'white',fontSize:15,fontWeight:700,cursor:'pointer',marginTop:6 },
  btnPurple: { background:'linear-gradient(135deg,#667eea,#764ba2)',boxShadow:'0 10px 30px rgba(102,126,234,0.25)' },
  btnGreen: { background:'linear-gradient(135deg,#10b981,#059669)',boxShadow:'0 10px 30px rgba(16,185,129,0.25)' },
  btnRed: { background:'linear-gradient(135deg,#ef4444,#dc2626)',boxShadow:'0 10px 30px rgba(239,68,68,0.25)' },
  btnOrange: { background:'linear-gradient(135deg,#f59e0b,#ef4444)',boxShadow:'0 10px 30px rgba(245,158,11,0.25)' },
  card: { background:colors.card,border:`1px solid ${colors.border}`,borderRadius:24,padding:40,backdropFilter:'blur(20px)' },
  badge: (c) => ({ display:'inline-block',padding:'4px 12px',borderRadius:20,fontSize:11,fontWeight:700,background:`${c}20`,color:c,border:`1px solid ${c}30` }),
  modal: { position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:9999 },
  modalInner: { background:'#1e1b4b',border:'1px solid rgba(255,255,255,0.1)',borderRadius:24,padding:40,maxWidth:500,width:'90%',maxHeight:'90vh',overflow:'auto' }
}

function useAuth() {
  const [user,setUser] = useState(null)
  useEffect(()=>{
    const t=localStorage.getItem('token')
    const u=localStorage.getItem('user')
    if(t&&u) setUser(JSON.parse(u))
  },[])
  const login = (token,user)=>{localStorage.setItem('token',token);localStorage.setItem('user',JSON.stringify(user));setUser(user)}
  const logout = ()=>{localStorage.removeItem('token');localStorage.removeItem('user');setUser(null);window.location.href='/'}
  return {user,login,logout,isOwner:user?.role==='OWNER',isAdmin:user?.role==='OWNER'||user?.role==='ADMIN',isAuth:!!user}
}

function UserMenu({user,logout}){
  const [o,setO]=useState(false)
  return (
    <div style={{position:'relative'}}>
      <button onClick={()=>setO(!o)} style={{display:'flex',alignItems:'center',gap:10,background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:40,padding:'6px 14px 6px 6px',cursor:'pointer',color:'white',fontSize:14,fontWeight:500}}>
        <div style={{width:34,height:34,borderRadius:'50%',background:'linear-gradient(135deg,#667eea,#764ba2)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:14}}>{user.username.charAt(0).toUpperCase()}</div>
        <span style={{maxWidth:80,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user.username}</span><span style={{fontSize:10}}>▼</span>
      </button>
      {o&&<><div style={{position:'fixed',inset:0,zIndex:99}} onClick={()=>setO(false)}/>
        <div style={{position:'absolute',right:0,top:48,background:'#1e1b4b',border:'1px solid rgba(255,255,255,0.12)',borderRadius:16,padding:6,minWidth:200,zIndex:100,boxShadow:'0 20px 50px rgba(0,0,0,0.5)'}}>
          <div style={{padding:'10px 14px',borderBottom:'1px solid rgba(255,255,255,0.08)',color:'#a78bfa',fontSize:13,fontWeight:600}}>{user.email}</div>
          <div style={{padding:'10px 14px',borderBottom:'1px solid rgba(255,255,255,0.08)',color:'#94a3b8',fontSize:12}}>Rol: {user.role}</div>
          <Link to="/profile" onClick={()=>setO(false)} style={{display:'block',padding:'10px 14px',color:'white',textDecoration:'none',fontSize:13,borderRadius:8,marginTop:4}}>👤 Profilim</Link>
          <Link to="/my-listings" onClick={()=>setO(false)} style={{display:'block',padding:'10px 14px',color:'white',textDecoration:'none',fontSize:13,borderRadius:8}}>📋 İlanlarım</Link>
          {(user.role==='OWNER'||user.role==='ADMIN')&&<Link to="/admin" onClick={()=>setO(false)} style={{display:'block',padding:'10px 14px',color:'#fbbf24',textDecoration:'none',fontSize:13,borderRadius:8}}>⚙️ Admin Panel</Link>}
          <button onClick={()=>{logout();setO(false)}} style={{width:'100%',padding:'10px 14px',border:'none',background:'none',color:'#fca5a5',cursor:'pointer',textAlign:'left',borderRadius:8,fontSize:13,marginTop:4}}>🚪 Çıkış Yap</button>
        </div>
      </>}
    </div>
  )
}

function Layout({children}){
  const {user,logout} = useAuth()
  const [s,setS]=useState(false)
  useEffect(()=>{const h=()=>setS(window.scrollY>20);window.addEventListener('scroll',h);return ()=>window.removeEventListener('scroll',h)},[])
  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#0c0a1d 0%,#1a1040 30%,#0f0c29 60%,#1a1040 100%)'}}>
      <style>{css}</style>
      <nav style={{position:'sticky',top:0,zIndex:1000,background:s?'rgba(15,12,41,0.95)':'rgba(15,12,41,0.7)',backdropFilter:'blur(20px)',borderBottom:'1px solid rgba(255,255,255,0.06)',padding:'0 24px',height:68,display:'flex',alignItems:'center',justifyContent:'space-between',transition:'all 0.3s'}}>
        <Link to="/" style={{textDecoration:'none',display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:38,height:38,borderRadius:12,background:'linear-gradient(135deg,#667eea,#764ba2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,color:'white'}}>M</div>
          <div><div style={{fontSize:20,fontWeight:800,color:'white',lineHeight:1}}>MarketPlace</div><div style={{fontSize:10,color:'#818cf8',letterSpacing:2}}>PREMIUM</div></div>
        </Link>
        <div style={{display:'flex',alignItems:'center',gap:16}}>
          <Link to="/" style={{color:'#c4b5fd',textDecoration:'none',fontSize:13,fontWeight:500}}>Keşfet</Link>
          {user?<><Link to="/create-listing" style={{background:'linear-gradient(135deg,#667eea,#764ba2)',color:'white',padding:'8px 16px',borderRadius:10,textDecoration:'none',fontSize:12,fontWeight:600}}>+ İlan Ver</Link><UserMenu user={user} logout={logout}/></>:<>
            <Link to="/login" style={{color:'#c4b5fd',textDecoration:'none',fontSize:13}}>Giriş</Link>
            <Link to="/register" style={{background:'linear-gradient(135deg,#667eea,#764ba2)',color:'white',padding:'8px 18px',borderRadius:10,textDecoration:'none',fontSize:13,fontWeight:600}}>Kayıt Ol</Link>
          </>}
        </div>
      </nav>
      <div id="announcement-bar"></div>
      <div style={{maxWidth:1200,margin:'0 auto',padding:'24px 16px'}}>{children}</div>
    </div>
  )
}

// === ANA SAYFA ===
function Home(){
  const {user} = useAuth()
  const [announcements,setAnnouncements] = useState([])
  const [needsSetup,setNeedsSetup] = useState(false)
  const [listings,setListings] = useState([])

  useEffect(()=>{
    api.get('/announcements').then(r=>setAnnouncements(r.data)).catch(()=>{})
    api.get('/setup/check').then(r=>setNeedsSetup(r.data.needsSetup)).catch(()=>{})
    api.get('/listings/featured').then(r=>setListings(r.data)).catch(()=>{})
  },[])

  const cats=[{i:'🎮',n:'Oyun',d:'Hesaplar ve dijital ürünler',c:'#8b5cf6'},{i:'👕',n:'Giyim',d:'Moda ve giyim',c:'#3b82f6'},{i:'💻',n:'Teknoloji',d:'Bilgisayar ve yazılım',c:'#10b981'},{i:'📱',n:'Elektronik',d:'Telefon ve cihazlar',c:'#f59e0b'}]

  return (
    <div>
      {announcements.map(a=>(
        <div key={a.id} style={{background:'linear-gradient(135deg,rgba(245,158,11,0.2),rgba(239,68,68,0.2))',border:'1px solid rgba(245,158,11,0.3)',borderRadius:16,padding:'16px 24px',marginBottom:20,color:'#fbbf24',fontSize:14,fontWeight:600,textAlign:'center'}}>
          📢 {a.title}: {a.message}
        </div>
      ))}
      
      <div className="fadeUp" style={{background:'radial-gradient(circle at 50% 0%,rgba(102,126,234,0.2),transparent 70%)',borderRadius:40,padding:'60px 24px',textAlign:'center',marginBottom:40,border:'1px solid rgba(255,255,255,0.06)',position:'relative',overflow:'hidden'}}>
        <div style={{position:'relative',zIndex:1}}>
          <h1 style={{fontSize:'clamp(32px,6vw,56px)',fontWeight:900,color:'white',marginBottom:12,lineHeight:1.1}}>Güvenli Alışverişin<br/><span style={{background:'linear-gradient(135deg,#667eea,#a78bfa,#c084fc)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Yeni Nesil</span> Adresi</h1>
          <p style={{fontSize:'clamp(15px,2vw,18px)',color:'#94a3b8',maxWidth:600,margin:'0 auto 30px'}}>Modern, güvenli ve kullanıcı dostu platform.</p>
          <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
            {needsSetup?<Link to="/setup" style={{...S.btn,...S.btnOrange,width:'auto',padding:'14px 36px',textDecoration:'none'}}>🚀 Platformu Başlat</Link>:
             user?<Link to="/create-listing" style={{...S.btn,...S.btnPurple,width:'auto',padding:'14px 36px',textDecoration:'none'}}>📝 İlan Ver</Link>:
             <Link to="/register" style={{...S.btn,...S.btnPurple,width:'auto',padding:'14px 36px',textDecoration:'none'}}>Hemen Başla</Link>}
          </div>
        </div>
      </div>

      <div style={{marginBottom:40}}>
        <h2 style={{fontSize:26,fontWeight:800,color:'white',marginBottom:20}}>Kategoriler</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))',gap:14}}>
          {cats.map(c=>(
            <div key={c.n} style={{background:`${c.c}15`,border:`1px solid ${c.c}30`,borderRadius:20,padding:30,cursor:'pointer',transition:'all 0.3s'}}
              onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow=`0 20px 40px ${c.c}20`}}
              onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='none'}}>
              <div style={{fontSize:36,marginBottom:14}}>{c.i}</div>
              <h3 style={{color:'white',fontSize:18,fontWeight:700,marginBottom:4}}>{c.n}</h3>
              <p style={{color:'#94a3b8',fontSize:12,margin:0}}>{c.d}</p>
            </div>
          ))}
        </div>
      </div>

      {listings.length>0&&<div style={{marginBottom:40}}>
        <h2 style={{fontSize:26,fontWeight:800,color:'white',marginBottom:20}}>Öne Çıkan İlanlar</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))',gap:14}}>
          {listings.map(l=>(
            <Link to={`/listing/${l.id}`} key={l.id} style={{textDecoration:'none'}}>
              <div style={{background:colors.card,border:`1px solid ${colors.border}`,borderRadius:20,padding:24,transition:'all 0.3s'}}>
                <div style={{width:'100%',height:160,borderRadius:12,background:'rgba(255,255,255,0.05)',marginBottom:14,display:'flex',alignItems:'center',justifyContent:'center',fontSize:40}}>📦</div>
                <h3 style={{color:'white',fontSize:16,fontWeight:700,marginBottom:6}}>{l.title}</h3>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <span style={{fontSize:20,fontWeight:800,color:'#818cf8'}}>{l.price} TL</span>
                  <span style={S.badge('#10b981')}>{l.status==='APPROVED'?'Onaylı':'Bekliyor'}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>}

      <div style={{borderTop:'1px solid rgba(255,255,255,0.06)',padding:'30px 0',textAlign:'center'}}>
        <span style={{color:'#64748b',fontSize:13}}>© 2024 MarketPlace. Tüm hakları saklıdır.</span>
      </div>
    </div>
  )
}

// === GİRİŞ ===
function Login(){
  const {login} = useAuth()
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [error,setError]=useState('')
  const [loading,setLoading]=useState(false)
  const handle=async(e)=>{
    e.preventDefault();setError('');setLoading(true)
    try{
      const res=await api.post('/auth/login',{email,password})
      login(res.data.token,res.data.user)
      window.location.href='/'
    }catch(err){setError(err.response?.data?.error||'Giriş başarısız')}
    finally{setLoading(false)}
  }
  return (
    <div style={{maxWidth:420,margin:'40px auto'}}>
      <div style={S.card}>
        <div style={{textAlign:'center',marginBottom:30}}>
          <div style={{width:56,height:56,borderRadius:16,background:'linear-gradient(135deg,#667eea,#764ba2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,margin:'0 auto 14'}}>🔐</div>
          <h2 style={{color:'white',fontSize:24,fontWeight:800}}>Giriş Yap</h2>
        </div>
        {error&&<div style={{background:'rgba(239,68,68,0.12)',border:'1px solid rgba(239,68,68,0.25)',color:'#fca5a5',padding:12,borderRadius:10,marginBottom:16,fontSize:13,textAlign:'center'}}>{error}</div>}
        <form onSubmit={handle}>
          <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required style={S.input}/>
          <input type="password" placeholder="Şifre" value={password} onChange={e=>setPassword(e.target.value)} required style={S.input}/>
          <button type="submit" disabled={loading} style={{...S.btn,...S.btnPurple,background:loading?'#555':undefined}}>{loading?'Giriş yapılıyor...':'Giriş Yap'}</button>
        </form>
        <p style={{textAlign:'center',marginTop:18,color:'#94a3b8',fontSize:13}}>Hesabınız yok mu? <Link to="/register" style={{color:'#818cf8',fontWeight:600}}>Kayıt Ol</Link></p>
      </div>
    </div>
  )
}

// === KAYIT ===
function Register(){
  const [form,setForm]=useState({username:'',email:'',password:'',phone:''})
  const [msg,setMsg]=useState('');const [err,setErr]=useState('');const [loading,setLoading]=useState(false)
  const handle=async(e)=>{
    e.preventDefault();setMsg('');setErr('');setLoading(true)
    try{await api.post('/auth/register',form);setMsg('Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...');setTimeout(()=>window.location.href='/login',2000)}
    catch(error){setErr(error.response?.data?.error||'Kayıt başarısız')}finally{setLoading(false)}
  }
  return (
    <div style={{maxWidth:420,margin:'40px auto'}}>
      <div style={S.card}>
        <div style={{textAlign:'center',marginBottom:30}}>
          <div style={{width:56,height:56,borderRadius:16,background:'linear-gradient(135deg,#10b981,#059669)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,margin:'0 auto 14'}}>✨</div>
          <h2 style={{color:'white',fontSize:24,fontWeight:800}}>Kayıt Ol</h2>
        </div>
        {msg&&<div style={{background:'rgba(16,185,129,0.12)',border:'1px solid rgba(16,185,129,0.25)',color:'#6ee7b7',padding:12,borderRadius:10,marginBottom:16,fontSize:13,textAlign:'center'}}>{msg}</div>}
        {err&&<div style={{background:'rgba(239,68,68,0.12)',border:'1px solid rgba(239,68,68,0.25)',color:'#fca5a5',padding:12,borderRadius:10,marginBottom:16,fontSize:13,textAlign:'center'}}>{err}</div>}
        <form onSubmit={handle}>
          <input placeholder="Kullanıcı Adı" value={form.username} onChange={e=>setForm({...form,username:e.target.value})} required style={S.input}/>
          <input type="email" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required style={S.input}/>
          <input type="password" placeholder="Şifre" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required style={S.input}/>
          <input placeholder="Telefon (opsiyonel)" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} style={S.input}/>
          <button type="submit" disabled={loading} style={{...S.btn,...S.btnGreen,background:loading?'#555':undefined}}>{loading?'Kaydediliyor...':'Kayıt Ol'}</button>
        </form>
        <p style={{textAlign:'center',marginTop:18,color:'#94a3b8',fontSize:13}}>Hesabınız var mı? <Link to="/login" style={{color:'#818cf8',fontWeight:600}}>Giriş Yap</Link></p>
      </div>
    </div>
  )
}

// === KURULUM ===
function Setup(){
  const [form,setForm]=useState({username:'',email:'',password:'',confirmPassword:'',setupKey:''})
  const [error,setError]=useState('');const [loading,setLoading]=useState(false)
  useEffect(()=>{api.get('/setup/check').then(r=>{if(!r.data.needsSetup){alert('Owner zaten mevcut.');window.location.href='/'}}).catch(()=>{})},[])
  const handle=async(e)=>{
    e.preventDefault()
    if(form.password!==form.confirmPassword){setError('Şifreler eşleşmiyor');return}
    setLoading(true)
    try{await api.post('/setup/initialize',{username:form.username,email:form.email,password:form.password,setupKey:form.setupKey});alert('Platform kuruldu!');window.location.href='/login'}
    catch(err){setError(err.response?.data?.error||'Kurulum başarısız')}finally{setLoading(false)}
  }
  return (
    <div style={{maxWidth:440,margin:'40px auto'}}>
      <div style={{...S.card,textAlign:'center'}}>
        <div style={{fontSize:56}}>👑</div>
        <h2 style={{color:'white',fontSize:24,fontWeight:800,marginBottom:6}}>Platform Kurulumu</h2>
        <p style={{color:'#94a3b8',fontSize:13,marginBottom:24}}>Owner hesabınızı oluşturun</p>
        {error&&<div style={{background:'rgba(239,68,68,0.12)',border:'1px solid rgba(239,68,68,0.25)',color:'#fca5a5',padding:12,borderRadius:10,marginBottom:16,fontSize:13}}>{error}</div>}
        <form onSubmit={handle}>
          <input placeholder="Kullanıcı Adı" value={form.username} onChange={e=>setForm({...form,username:e.target.value})} required style={S.input}/>
          <input type="email" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required style={S.input}/>
          <input type="password" placeholder="Şifre" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required style={S.input}/>
          <input type="password" placeholder="Şifre Tekrar" value={form.confirmPassword} onChange={e=>setForm({...form,confirmPassword:e.target.value})} required style={S.input}/>
          <input type="password" placeholder="Kurulum Anahtarı" value={form.setupKey} onChange={e=>setForm({...form,setupKey:e.target.value})} required style={S.input}/>
          <button type="submit" disabled={loading} style={{...S.btn,...S.btnOrange,background:loading?'#555':undefined}}>{loading?'Kuruluyor...':'🚀 Platformu Başlat'}</button>
        </form>
      </div>
    </div>
  )
}

// === PROFİL ===
function Profile(){
  const {user,logout} = useAuth()
  const [listings,setListings] = useState([])
  useEffect(()=>{api.get('/listings/my').then(r=>setListings(r.data)).catch(()=>{})},[])
  if(!user) return <div style={{color:'white',textAlign:'center',padding:60}}>Giriş yapmalısınız</div>
  return (
    <div style={{maxWidth:700,margin:'0 auto'}}>
      <div style={{...S.card,marginBottom:20,display:'flex',alignItems:'center',gap:20,flexWrap:'wrap'}}>
        <div style={{width:70,height:70,borderRadius:'50%',background:'linear-gradient(135deg,#667eea,#764ba2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:30,color:'white',fontWeight:800}}>{user.username.charAt(0).toUpperCase()}</div>
        <div style={{flex:1}}>
          <h2 style={{color:'white',fontSize:22,fontWeight:800}}>{user.username}</h2>
          <p style={{color:'#94a3b8',fontSize:13}}>{user.email}</p>
          <span style={S.badge('#8b5cf6')}>{user.role}</span>
        </div>
        <button onClick={logout} style={{...S.btn,...S.btnRed,width:'auto',padding:'10px 24px',fontSize:13}}>Çıkış Yap</button>
      </div>
      
      <h3 style={{color:'white',fontSize:20,fontWeight:700,marginBottom:14}}>İlanlarım</h3>
      {listings.length===0?<p style={{color:'#94a3b8'}}>Henüz ilan vermediniz.</p>:
        listings.map(l=>(
          <div key={l.id} style={{background:colors.card,border:`1px solid ${colors.border}`,borderRadius:16,padding:20,marginBottom:10,display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:10}}>
            <div>
              <h4 style={{color:'white',fontSize:15,fontWeight:600}}>{l.title}</h4>
              <p style={{color:'#94a3b8',fontSize:12}}>{l.price} TL</p>
            </div>
            <span style={S.badge(l.status==='APPROVED'?'#10b981':l.status==='REJECTED'?'#ef4444':'#f59e0b')}>{l.status==='APPROVED'?'Onaylı':l.status==='REJECTED'?'Reddedildi':'Bekliyor'}</span>
          </div>
        ))
      }
    </div>
  )
}

// === İLAN VER ===
function CreateListing(){
  const {user} = useAuth()
  const [form,setForm]=useState({title:'',description:'',category:'GAMING',price:'',contactEmail:'',contactPhone:''})
  const [msg,setMsg]=useState('');const [err,setErr]=useState('');const [loading,setLoading]=useState(false)
  if(!user) return <div style={{color:'white',textAlign:'center',padding:60}}>Giriş yapmalısınız</div>
  const handle=async(e)=>{
    e.preventDefault();setMsg('');setErr('');setLoading(true)
    try{await api.post('/listings/create',form);setMsg('İlanınız onaya gönderildi!');setForm({title:'',description:'',category:'GAMING',price:'',contactEmail:'',contactPhone:''})}
    catch(error){setErr(error.response?.data?.error||'İlan oluşturulamadı')}finally{setLoading(false)}
  }
  return (
    <div style={{maxWidth:600,margin:'0 auto'}}>
      <div style={S.card}>
        <h2 style={{color:'white',fontSize:24,fontWeight:800,marginBottom:20}}>📝 İlan Ver</h2>
        {msg&&<div style={{background:'rgba(16,185,129,0.12)',border:'1px solid rgba(16,185,129,0.25)',color:'#6ee7b7',padding:12,borderRadius:10,marginBottom:16,fontSize:13,textAlign:'center'}}>{msg}</div>}
        {err&&<div style={{background:'rgba(239,68,68,0.12)',border:'1px solid rgba(239,68,68,0.25)',color:'#fca5a5',padding:12,borderRadius:10,marginBottom:16,fontSize:13,textAlign:'center'}}>{err}</div>}
        <form onSubmit={handle}>
          <input placeholder="Başlık" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required style={S.input}/>
          <textarea placeholder="Açıklama" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} required style={{...S.input,height:100,resize:'vertical'}}/>
          <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} style={{...S.input,color:'white'}}>
            <option value="GAMING">🎮 Oyun</option><option value="CLOTHING">👕 Giyim</option><option value="TECHNOLOGY">💻 Teknoloji</option><option value="ELECTRONICS">📱 Elektronik</option><option value="OTHER">🏠 Diğer</option>
          </select>
          <input type="number" placeholder="Fiyat (TL)" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} required style={S.input}/>
          <input placeholder="İletişim Email" value={form.contactEmail} onChange={e=>setForm({...form,contactEmail:e.target.value})} style={S.input}/>
          <input placeholder="İletişim Telefon" value={form.contactPhone} onChange={e=>setForm({...form,contactPhone:e.target.value})} style={S.input}/>
          <button type="submit" disabled={loading} style={{...S.btn,...S.btnPurple,background:loading?'#555':undefined}}>{loading?'Gönderiliyor...':'İlanı Gönder'}</button>
        </form>
      </div>
    </div>
  )
}

// === İLANLARIM ===
function MyListings(){
  const {user} = useAuth()
  const [listings,setListings]=useState([])
  useEffect(()=>{api.get('/listings/my').then(r=>setListings(r.data)).catch(()=>{})},[])
  if(!user) return <div style={{color:'white',textAlign:'center',padding:60}}>Giriş yapmalısınız</div>
  return (
    <div style={{maxWidth:800,margin:'0 auto'}}>
      <h2 style={{color:'white',fontSize:24,fontWeight:800,marginBottom:20}}>📋 İlanlarım</h2>
      {listings.length===0?<p style={{color:'#94a3b8'}}>Henüz ilanınız yok.</p>:
        listings.map(l=>(
          <div key={l.id} style={{...S.card,padding:24,marginBottom:10}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'start',flexWrap:'wrap',gap:10}}>
              <div>
                <h3 style={{color:'white',fontSize:17,fontWeight:700}}>{l.title}</h3>
                <p style={{color:'#94a3b8',fontSize:13,margin:'6px 0'}}>{l.description?.slice(0,100)}</p>
                <span style={{fontSize:20,fontWeight:800,color:'#818cf8'}}>{l.price} TL</span>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{marginBottom:6}}><span style={S.badge(l.status==='APPROVED'?'#10b981':l.status==='REJECTED'?'#ef4444':'#f59e0b')}>{l.status==='APPROVED'?'✅ Onaylı':l.status==='REJECTED'?'❌ Reddedildi':'⏳ Bekliyor'}</span></div>
                <span style={{color:'#64748b',fontSize:11}}>{new Date(l.createdAt).toLocaleDateString('tr-TR')}</span>
              </div>
            </div>
            {l.rejectionReason&&<div style={{marginTop:12,padding:12,background:'rgba(239,68,68,0.1)',borderRadius:8,color:'#fca5a5',fontSize:12}}>Red sebebi: {l.rejectionReason}</div>}
          </div>
        ))
      }
    </div>
  )
}

// === İLAN DETAY ===
function ListingDetail(){
  const {id} = useParams()
  const [listing,setListing]=useState(null)
  useEffect(()=>{api.get(`/listings/${id}`).then(r=>setListing(r.data)).catch(()=>{})},[id])
  if(!listing) return <div style={{color:'white',textAlign:'center',padding:60}}>Yükleniyor...</div>
  return (
    <div style={{maxWidth:700,margin:'0 auto'}}>
      <div style={S.card}>
        <div style={{width:'100%',height:250,borderRadius:16,background:'rgba(255,255,255,0.05)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:60,marginBottom:20}}>📦</div>
        <h1 style={{color:'white',fontSize:28,fontWeight:800,marginBottom:8}}>{listing.title}</h1>
        <span style={S.badge(listing.status==='APPROVED'?'#10b981':'#f59e0b')}>{listing.status==='APPROVED'?'Onaylı':'Bekliyor'}</span>
        <p style={{color:'#94a3b8',fontSize:14,margin:'16px 0',lineHeight:1.6}}>{listing.description}</p>
        <div style={{fontSize:32,fontWeight:900,color:'#818cf8',marginBottom:16}}>{listing.price} TL</div>
        <div style={{borderTop:'1px solid rgba(255,255,255,0.08)',paddingTop:16}}>
          <p style={{color:'#94a3b8',fontSize:13}}>📧 {listing.contactEmail||'Belirtilmemiş'}</p>
          <p style={{color:'#94a3b8',fontSize:13}}>📱 {listing.contactPhone||'Belirtilmemiş'}</p>
          <p style={{color:'#64748b',fontSize:11,marginTop:8}}>📅 {new Date(listing.createdAt).toLocaleDateString('tr-TR')}</p>
        </div>
      </div>
    </div>
  )
}

// === ADMIN PANEL ===
function AdminPanel(){
  const {user} = useAuth()
  const [tab,setTab] = useState('dashboard')
  const [users,setUsers] = useState([])
  const [listings,setListings] = useState([])
  const [stats,setStats] = useState({users:0,listings:0,pending:0,approved:0})
  const [announcement,setAnnouncement] = useState({title:'',message:''})
  const [modal,setModal] = useState(null)
  const navigate = useNavigate()

  useEffect(()=>{
    if(user&&(user.role==='OWNER'||user.role==='ADMIN')){
      loadData()
    }
  },[user])

  const loadData = async () => {
    try{
      const [u,l,s] = await Promise.all([api.get('/admin/users'),api.get('/admin/listings'),api.get('/admin/stats')])
      setUsers(u.data);setListings(l.data);setStats(s.data)
    }catch(e){}
  }

  const handleApprove = async (id) => {await api.put(`/admin/listings/${id}`,{status:'APPROVED'});loadData()}
  const handleReject = async (id) => {
    const reason = prompt('Red sebebi:')
    if(reason){await api.put(`/admin/listings/${id}`,{status:'REJECTED',rejectionReason:reason});loadData()}
  }
  const handleBan = async (id) => {await api.put(`/admin/users/${id}`,{accountStatus:'BANNED'});loadData()}
  const handleUnban = async (id) => {await api.put(`/admin/users/${id}`,{accountStatus:'ACTIVE'});loadData()}
  const handleRole = async (id,role) => {await api.put(`/admin/users/${id}`,{role});loadData()}
  const sendAnnouncement = async () => {
    try{await api.post('/admin/announcements',announcement);alert('Duyuru gönderildi!');setAnnouncement({title:'',message:''});loadData()}
    catch(e){alert('Hata oluştu')}
  }

  if(!user||(user.role!=='OWNER'&&user.role!=='ADMIN')) return <div style={{color:'white',textAlign:'center',padding:60}}>Yetkiniz yok</div>

  const tabs = ['📊 Dashboard','👥 Kullanıcılar','📋 İlanlar','📢 Duyuru']
  const tabKeys = ['dashboard','users','listings','announcement']

  return (
    <div>
      <h1 style={{color:'white',fontSize:28,fontWeight:800,marginBottom:20}}>⚙️ Admin Panel</h1>
      
      <div style={{display:'flex',gap:8,marginBottom:30,flexWrap:'wrap'}}>
        {tabs.map((t,i)=>(
          <button key={i} onClick={()=>setTab(tabKeys[i])} style={{
            padding:'10px 20px',borderRadius:12,border:`1px solid ${tab===tabKeys[i]?'#818cf8':'rgba(255,255,255,0.1)'}`,
            background:tab===tabKeys[i]?'rgba(129,140,248,0.15)':'transparent',color:tab===tabKeys[i]?'#818cf8':'#94a3b8',
            cursor:'pointer',fontSize:13,fontWeight:600,transition:'all 0.2s'
          }}>{t}</button>
        ))}
      </div>

      {tab==='dashboard'&&<div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))',gap:14,marginBottom:30}}>
          {[{l:'Toplam Kullanıcı',v:stats.users,c:'#8b5cf6'},{l:'Toplam İlan',v:stats.listings,c:'#3b82f6'},{l:'Bekleyen İlan',v:stats.pending,c:'#f59e0b'},{l:'Onaylı İlan',v:stats.approved,c:'#10b981'}].map(s=>(
            <div key={s.l} style={{background:colors.card,border:`1px solid ${colors.border}`,borderRadius:20,padding:24}}>
              <div style={{color:s.c,fontSize:32,fontWeight:900}}>{s.v}</div>
              <div style={{color:'#94a3b8',fontSize:13}}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>}

      {tab==='users'&&<div>
        <div style={{overflow:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr style={{borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
              {['Kullanıcı','Email','Rol','Durum','İşlem'].map(h=><th key={h} style={{color:'#94a3b8',fontSize:12,fontWeight:600,padding:'12px 8px',textAlign:'left'}}>{h}</th>)}
            </tr></thead>
            <tbody>
              {users.map(u=>(
                <tr key={u.id} style={{borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
                  <td style={{padding:'12px 8px',color:'white',fontSize:13}}>{u.username}</td>
                  <td style={{padding:'12px 8px',color:'#94a3b8',fontSize:12}}>{u.email}</td>
                  <td style={{padding:'12px 8px'}}>
                    <select value={u.role} onChange={e=>handleRole(u.id,e.target.value)} style={{background:'rgba(255,255,255,0.05)',color:'white',border:'1px solid rgba(255,255,255,0.1)',borderRadius:6,padding:'4px 8px',fontSize:11}}>
                      <option value="USER">USER</option><option value="CATEGORY_ADMIN">CATEGORY_ADMIN</option><option value="ADMIN">ADMIN</option><option value="OWNER">OWNER</option>
                    </select>
                  </td>
                  <td style={{padding:'12px 8px'}}><span style={S.badge(u.accountStatus==='ACTIVE'?'#10b981':'#ef4444')}>{u.accountStatus}</span></td>
                  <td style={{padding:'12px 8px'}}>
                    {u.accountStatus!=='BANNED'?<button onClick={()=>handleBan(u.id)} style={{...S.btn,...S.btnRed,width:'auto',padding:'6px 14px',fontSize:11,marginTop:0}}>Ban</button>:
                    <button onClick={()=>handleUnban(u.id)} style={{...S.btn,...S.btnGreen,width:'auto',padding:'6px 14px',fontSize:11,marginTop:0}}>Unban</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>}

      {tab==='listings'&&<div>
        <div style={{overflow:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr style={{borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
              {['İlan','Fiyat','Kategori','Durum','İşlem'].map(h=><th key={h} style={{color:'#94a3b8',fontSize:12,fontWeight:600,padding:'12px 8px',textAlign:'left'}}>{h}</th>)}
            </tr></thead>
            <tbody>
              {listings.map(l=>(
                <tr key={l.id} style={{borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
                  <td style={{padding:'12px 8px',color:'white',fontSize:13}}>{l.title}</td>
                  <td style={{padding:'12px 8px',color:'#818cf8',fontSize:13,fontWeight:700}}>{l.price} TL</td>
                  <td style={{padding:'12px 8px',color:'#94a3b8',fontSize:12}}>{l.category}</td>
                  <td style={{padding:'12px 8px'}}><span style={S.badge(l.status==='APPROVED'?'#10b981':l.status==='REJECTED'?'#ef4444':'#f59e0b')}>{l.status}</span></td>
                  <td style={{padding:'12px 8px',display:'flex',gap:6}}>
                    {l.status==='PENDING'&&<>
                      <button onClick={()=>handleApprove(l.id)} style={{...S.btn,...S.btnGreen,width:'auto',padding:'6px 14px',fontSize:11,marginTop:0}}>Onayla</button>
                      <button onClick={()=>handleReject(l.id)} style={{...S.btn,...S.btnRed,width:'auto',padding:'6px 14px',fontSize:11,marginTop:0}}>Reddet</button>
                    </>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>}

      {tab==='announcement'&&<div style={{maxWidth:500}}>
        <div style={S.card}>
          <h3 style={{color:'white',fontSize:18,fontWeight:700,marginBottom:16}}>📢 Duyuru Gönder</h3>
          <input placeholder="Duyuru Başlığı" value={announcement.title} onChange={e=>setAnnouncement({...announcement,title:e.target.value})} style={S.input}/>
          <textarea placeholder="Duyuru Mesajı" value={announcement.message} onChange={e=>setAnnouncement({...announcement,message:e.target.value})} style={{...S.input,height:80,resize:'vertical'}}/>
          <button onClick={sendAnnouncement} style={{...S.btn,...S.btnOrange}}>📢 Duyuruyu Gönder</button>
        </div>
      </div>}
    </div>
  )
}

// === APP ROUTER ===
export default function App(){
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/setup" element={<Setup/>}/>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/create-listing" element={<CreateListing/>}/>
          <Route path="/my-listings" element={<MyListings/>}/>
          <Route path="/listing/:id" element={<ListingDetail/>}/>
          <Route path="/admin/*" element={<AdminPanel/>}/>
        </Routes>
      </Layout>
    </BrowserRouter>
  )
     }      )}
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
