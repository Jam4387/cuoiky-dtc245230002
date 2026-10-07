const express = require('express');
const session = require('express-session');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const app = express();
app.set('view engine', 'ejs');
app.set('trust proxy', 1);

app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 3600000 }
}));

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 5
});

const auth = (req, res, next) => req.session.admin ? next() : res.redirect('/admin/login');
const safeLink = l => /^https?:\/\//i.test(l || '') ? l : null;

app.get('/', async (req, res) => {
  const [projects] = await pool.query('SELECT * FROM projects ORDER BY id DESC');
  const [[profile]] = await pool.query('SELECT * FROM profile LIMIT 1');
  res.render('index', { projects, profile });
});

app.get('/health', (req, res) => res.send('ok'));

app.get('/admin/login', (req, res) => res.render('login', { error: null }));
app.post('/admin/login', async (req, res) => {
  const { username, password } = req.body;
  const [rows] = await pool.query('SELECT * FROM admins WHERE username=?', [username]);
  if (rows[0] && await bcrypt.compare(password || '', rows[0].password_hash)) {
    req.session.admin = rows[0].username;
    console.log(`LOGIN_OK user=${username} ip=${req.ip}`);
    return res.redirect('/admin');
  }
  console.log(`LOGIN_FAILED user=${username} ip=${req.ip}`);
  res.status(401).render('login', { error: 'Sai tài khoản hoặc mật khẩu' });
});

app.get('/admin/logout', (req, res) => req.session.destroy(() => res.redirect('/')));
app.get('/admin', auth, async (req, res) => {
  const [projects] = await pool.query('SELECT * FROM projects ORDER BY id DESC');
  const [[profile]] = await pool.query('SELECT * FROM profile LIMIT 1');
  res.render('admin', { projects, profile });
});

app.post('/admin/profile', auth, async (req, res) => {
  const { full_name, title, bio, email } = req.body;
  await pool.query('UPDATE profile SET full_name=?, title=?, bio=?, email=? WHERE id=1', [full_name, title, bio, email]);
  res.redirect('/admin');
});

app.post('/admin/projects', auth, async (req, res) => {
  const { title, description, link } = req.body;
  await pool.query('INSERT INTO projects(title,description,link) VALUES (?,?,?)', [title, description, safeLink(link)]);
  res.redirect('/admin');
});

app.post('/admin/projects/:id/delete', auth, async (req, res) => {
  await pool.query('DELETE FROM projects WHERE id=?', [req.params.id]);
  res.redirect('/admin');
});

(async () => {
  for (let i = 0; i < 30; i++) {
    try { await pool.query('SELECT 1'); break; }
    catch { await new Promise(r => setTimeout(r, 2000)); }
  }
  const [[{ c }]] = await pool.query('SELECT COUNT(*) c FROM admins');
  if (c === 0) {
    await pool.query('INSERT INTO admins(username,password_hash) VALUES (?,?)',
      [process.env.ADMIN_USER, await bcrypt.hash(process.env.ADMIN_PASSWORD, 12)]);
  }
  app.listen(3000, () => console.log('App listening on 3000'));
})();
