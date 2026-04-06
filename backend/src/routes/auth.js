const express = require('express');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const pool    = require('../db/pool');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// ────────────────────────────────────────────────────────
//  POST /api/auth/login
// ────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // 1. ตรวจ input
  if (!username || !password) {
    return res.status(400).json({ message: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' });
  }

  try {
    // 2. หา user ในฐานข้อมูล
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username.trim()]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
    }

    // 3. ตรวจสถานะบัญชี
    if (!user.is_active) {
      return res.status(403).json({ message: 'บัญชีนี้ถูกระงับการใช้งาน กรุณาติดต่อผู้ดูแลระบบ' });
    }

    // 4. ตรวจ password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
    }

    // 5. อัปเดต last_login
    await pool.query(
      'UPDATE users SET last_login = NOW() WHERE id = $1',
      [user.id]
    );

    // 6. สร้าง JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    // 7. ส่ง response (ไม่ส่ง password กลับ)
    return res.json({
      message: 'เข้าสู่ระบบสำเร็จ',
      token,
      user: {
        id:        user.id,
        username:  user.username,
        fullName:  user.full_name,
        email:     user.email,
        role:      user.role,
      },
    });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่ภายหลัง' });
  }
});

// ────────────────────────────────────────────────────────
//  GET /api/auth/me  — ดึงข้อมูลผู้ใช้ปัจจุบัน
// ────────────────────────────────────────────────────────
router.get('/me', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, username, full_name, email, role, last_login FROM users WHERE id = $1',
      [req.user.id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ message: 'ไม่พบข้อมูลผู้ใช้' });
    }

    const u = result.rows[0];
    return res.json({
      id:        u.id,
      username:  u.username,
      fullName:  u.full_name,
      email:     u.email,
      role:      u.role,
      lastLogin: u.last_login,
    });

  } catch (err) {
    console.error('Me error:', err);
    return res.status(500).json({ message: 'เกิดข้อผิดพลาดในระบบ' });
  }
});

// ────────────────────────────────────────────────────────
//  POST /api/auth/logout  — client ลบ token เอง
// ────────────────────────────────────────────────────────
router.post('/logout', authenticate, (_req, res) => {
  // JWT เป็น stateless — การ logout จริงๆ ทำที่ client (ลบ token ออกจาก localStorage)
  // ถ้าต้องการ server-side logout ให้เพิ่ม token blacklist (Redis) ทีหลัง
  return res.json({ message: 'ออกจากระบบเรียบร้อยแล้ว' });
});

module.exports = router;
