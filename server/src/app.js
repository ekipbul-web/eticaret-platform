const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuid } = require('uuid');
const Database = require('better-sqlite3');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

const dir = path.join(__dirname, '../data');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
const db = new Database(path.join(dir, 'db.sqlite'));
db.exec(`CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, username TEXT UNIQUE, email TEXT UNIQUE, password_hash TEXT, phone TEXT, role TEXT DEFAULT 'USER', account_status TEXT DEFAULT 'ACTIVE', is_verified INTEGER DEFAULT 0, created_at TEXT DEFAULT (datetime('now')));
CREATE TABLE IF NOT EXISTS listings (id TEXT PRIMARY KEY, user_id TEXT, title TEXT, description TEXT, category TEXT, price REAL, contactEmail TEXT, contactPhone TEXT, status TEXT DEFAULT 'PENDING', rejectionReason TEXT, created_at TEXT DEFAULT (datetime('now')));
CREATE TABLE IF NOT EXISTS announcements (id TEXT PRIMARY KEY, title TEXT, message TEXT, created_at TEXT DEFAULT (datetime('now')));`);

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token gerekli' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const user = db.prepare('SELECT * FROM users WHERE id=?').get(decoded.userId);
    if (!user) return res.status(401).json({ error: 'Kullanıcı bulunamadı' });
    req.user = user;
    next();
  } catch(e) { res.status(401).json({ error: 'Geçersiz token' }) }
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'OWNER' && req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Yetkisiz' });
  next();
};

// Auth
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;
    if (!username || !email || !password) return res.status(400).json({ error: 'Tüm alanlar zorunlu' });
    if (db.prepare('SELECT id FROM users WHERE email=? OR username=?').get(email, username)) return res.status(400).json({ error: 'Email veya kullanıcı adı kullanılıyor' });
    const hash = await bcrypt.hash(password, 12);
    db.prepare('INSERT INTO users (id, username, email, password_hash, phone) VALUES (?,?,?,?,?)').run(uuid(), username, email, hash, phone||null);
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: 'Sunucu hatası' }) }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE email=?').get(email);
    if (!user) return res.status(401).json({ error: 'Email veya şifre hatalı' });
    if (user.account_status === 'BANNED') return res.status(403).json({ error: 'Hesap yasaklanmış' });
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Email veya şifre hatalı' });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET||'secret', { expiresIn: '7d' });
    res.json({ token, user: { id:user.id, username:user.username, email:user.email, role:user.role } });
  } catch(e) { res.status(500).json({ error: 'Sunucu hatası' }) }
});

// Setup
app.get('/api/setup/check', (req, res) => {
  res.json({ needsSetup: !db.prepare('SELECT id FROM users WHERE role=?').get('OWNER') });
});

app.post('/api/setup/initialize', async (req, res) => {
  try {
    const { username, email, password, setupKey } = req.body;
    if (setupKey !== (process.env.SETUP_SECRET_KEY||'platformkurulum2024')) return res.status(403).json({ error: 'Geçersiz anahtar' });
    if (db.prepare('SELECT id FROM users WHERE role=?').get('OWNER')) return res.status(400).json({ error: 'Owner zaten var' });
    const hash = await bcrypt.hash(password, 12);
    db.prepare('INSERT INTO users (id, username, email, password_hash, role, is_verified) VALUES (?,?,?,?,?,1)').run(uuid(), username, email, hash, 'OWNER');
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: 'Sunucu hatası' }) }
});

// Listings
app.get('/api/listings/featured', (req, res) => {
  res.json(db.prepare('SELECT * FROM listings WHERE status=? ORDER BY created_at DESC LIMIT 8').all('APPROVED'));
});

app.get('/api/listings/my', auth, (req, res) => {
  res.json(db.prepare('SELECT * FROM listings WHERE user_id=? ORDER BY created_at DESC').all(req.user.id));
});

app.get('/api/listings/:id', (req, res) => {
  const l = db.prepare('SELECT * FROM listings WHERE id=?').get(req.params.id);
  if (!l) return res.status(404).json({ error: 'Bulunamadı' });
  res.json(l);
});

app.post('/api/listings/create', auth, (req, res) => {
  try {
    const { title, description, category, price, contactEmail, contactPhone } = req.body;
    if (!title || !description || !price) return res.status(400).json({ error: 'Başlık, açıklama ve fiyat zorunlu' });
    db.prepare('INSERT INTO listings (id, user_id, title, description, category, price, contactEmail, contactPhone) VALUES (?,?,?,?,?,?,?,?)').run(uuid(), req.user.id, title, description, category||'OTHER', parseFloat(price), contactEmail||null, contactPhone||null);
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: 'Sunucu hatası' }) }
});

// Announcements
app.get('/api/announcements', (req, res) => {
  res.json(db.prepare('SELECT * FROM announcements ORDER BY created_at DESC').all());
});

// Admin
app.get('/api/admin/users', auth, adminOnly, (req, res) => {
  res.json(db.prepare('SELECT id, username, email, role, account_status FROM users').all());
});

app.put('/api/admin/users/:id', auth, adminOnly, (req, res) => {
  const { role, accountStatus } = req.body;
  if (role) db.prepare('UPDATE users SET role=? WHERE id=?').run(role, req.params.id);
  if (accountStatus) db.prepare('UPDATE users SET account_status=? WHERE id=?').run(accountStatus, req.params.id);
  res.json({ success: true });
});

app.get('/api/admin/listings', auth, adminOnly, (req, res) => {
  res.json(db.prepare('SELECT * FROM listings ORDER BY created_at DESC').all());
});

app.put('/api/admin/listings/:id', auth, adminOnly, (req, res) => {
  const { status, rejectionReason } = req.body;
  db.prepare('UPDATE listings SET status=?, rejectionReason=? WHERE id=?').run(status, rejectionReason||null, req.params.id);
  res.json({ success: true });
});

app.get('/api/admin/stats', auth, adminOnly, (req, res) => {
  const users = db.prepare('SELECT COUNT(*) as c FROM users').get().c;
  const listings = db.prepare('SELECT COUNT(*) as c FROM listings').get().c;
  const pending = db.prepare("SELECT COUNT(*) as c FROM listings WHERE status='PENDING'").get().c;
  const approved = db.prepare("SELECT COUNT(*) as c FROM listings WHERE status='APPROVED'").get().c;
  res.json({ users, listings, pending, approved });
});

app.post('/api/admin/announcements', auth, adminOnly, (req, res) => {
  const { title, message } = req.body;
  db.prepare('INSERT INTO announcements (id, title, message) VALUES (?,?,?)').run(uuid(), title, message);
  res.json({ success: true });
});

// Serve index.html
app.use(express.static(path.join(__dirname, '../../')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../../index.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server:', PORT));
