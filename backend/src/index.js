require('dotenv').config();

const express = require('express');
const cors = require('cors');

const pool = require('./db');
const authRoutes = require('./routes/authRoutes');

const app = express();

// 🔧 middleware
app.use(cors());
app.use(express.json());

// 🧪 route ทดสอบ server
app.get('/', (req, res) => {
  res.send('Backend is running...');
});

// 🧪 route ทดสอบ database
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');

    res.json({
      message: 'Database connected!',
      time: result.rows[0]
    });

  } catch (error) {
    console.error('DB ERROR:', error);
    res.status(500).json({
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// 🔐 ใช้ auth routes
app.use('/api/auth', authRoutes);

// 🚀 start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
