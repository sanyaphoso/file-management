const pool = require('../db');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
  const {
    username,
    password,
    fullname,
    email,
    job_position,
    department,
    role
  } = req.body;

  try {
    // 🔍 เช็ค username ซ้ำ
    const userCheck = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    if (userCheck.rows.length > 0) {
      return res.status(400).json({
        message: 'Username already exists'
      });
    }

    // 🔍 เช็ค email ซ้ำ (ถ้ามี)
    if (email) {
      const emailCheck = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

      if (emailCheck.rows.length > 0) {
        return res.status(400).json({
          message: 'Email already exists'
        });
      }
    }

    // 🔐 hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 💾 insert user
    const result = await pool.query(
      `INSERT INTO users 
      (username, password, fullname, email, job_position, department, role)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, username, fullname, email, role, created_at`,
      [
        username,
        hashedPassword,
        fullname,
        email,
        job_position,
        department,
        role || 'user'
      ]
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: result.rows[0]
    });

  } catch (error) {
    console.error('REGISTER ERROR:', error);

    res.status(500).json({
      message: 'Register failed',
      error: error.message
    });
  }
};

const jwt = require('jsonwebtoken');

// 🔐 LOGIN
exports.login = async (req, res) => {
  const { identifier, password } = req.body;
  // identifier = username หรือ email

  try {
    // 🔍 หา user จาก username หรือ email
    const result = await pool.query(
      `SELECT * FROM users WHERE username = $1 OR email = $1`,
      [identifier]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        message: 'User not found'
      });
    }

    const user = result.rows[0];

    // 🔐 เช็ค password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: 'Invalid password'
      });
    }

    // 🎫 สร้าง token
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN
      }
    );

    // ✅ ส่งกลับ (ไม่ส่ง password)
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        fullname: user.fullname,
        role: user.role
      }
    });

  } catch (error) {
    console.error('LOGIN ERROR:', error);
    res.status(500).json({
      message: 'Login failed',
      error: error.message
    });
  }
};