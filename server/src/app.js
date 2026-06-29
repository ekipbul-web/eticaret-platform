const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());

// SQLite Database
const Database = require('better-sqlite3');
const fs = require('fs');
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, 'secure.db'));
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY, username TEXT UNIQUE, email TEXT UNIQUE,
    password_hash TEXT, phone TEXT, role TEXT DEFAULT 'USER',
    account_status TEXT DEFAULT 'ACTIVE', is_verified INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY, user_id TEXT, token TEXT UNIQUE,
    expires_at TEXT, created_at TEXT DEFAULT (datetime('now'))
  );
`);

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const exists = db.prepare('SELECT id FROM users WHERE email=? OR username=?').get(email, username);
    if (exists) return res.status(400).json({ error: 'Email veya kullanıcı adı kullanılıyor' });
    
    const hash = await bcrypt.hash(password, 12);
    db.prepare('INSERT INTO users (id,username,email,password_hash) VALUES (?,?,?,?)').run(uuidv4(), username, email, hash);
    res.json({ success: true });
  } catch(e) {
    res.status(500).json({ error: 'Kayıt başarısız' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE email=?').get(email);
    if (!user) return res.status(401).json({ error: 'Email veya şifre hatalı' });
    
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Email veya şifre hatalı' });
    
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    db.prepare('INSERT INTO sessions (id,user_id,token,expires_at) VALUES (?,?,?,?)').run(uuidv4(), user.id, token, new Date(Date.now()+7*86400000).toISOString());
    
    res.json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role } });
  } catch(e) {
    res.status(500).json({ error: 'Giriş başarısız' });
  }
});

// Setup check
app.get('/api/setup/check', (req, res) => {
  const owner = db.prepare('SELECT id FROM users WHERE role=?').get('OWNER');
  res.json({ needsSetup: !owner });
});

// Setup initialize
app.post('/api/setup/initialize', async (req, res) => {
  try {
    const { username, email, password, setupKey } = req.body;
    if (setupKey !== process.env.SETUP_SECRET_KEY) return res.status(403).json({ error: 'Geçersiz kurulum anahtarı' });
    
    const owner = db.prepare('SELECT id FROM users WHERE role=?').get('OWNER');
    if (owner) return res.status(400).json({ error: 'Owner zaten var' });
    
    const hash = await bcrypt.hash(password, 12);
    db.prepare('INSERT INTO users (id,username,email,password_hash,role,is_verified) VALUES (?,?,?,?,?,1)').run(uuidv4(), username, email, hash, 'OWNER');
    res.json({ success: true });
  } catch(e) {
    res.status(500).json({ error: 'Kurulum başarısız' });
  }
});

// Health
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Serve frontend
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/dist')));
  app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../../client/dist/index.html')));
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running on port', PORT));
