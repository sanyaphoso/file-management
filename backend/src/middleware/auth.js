const jwt = require('jsonwebtoken');

/**
 * Middleware ตรวจ JWT token จาก Authorization header
 * ใช้กับ route ที่ต้องการ login ก่อน
 */
const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'ไม่พบ Token กรุณาเข้าสู่ระบบ' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, username, role }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token หมดอายุ กรุณาเข้าสู่ระบบใหม่' });
    }
    return res.status(403).json({ message: 'Token ไม่ถูกต้อง' });
  }
};

/**
 * Middleware ตรวจสิทธิ์ตาม role
 * ใช้ต่อจาก authenticate เช่น requireRole('admin')
 */
const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    return res.status(403).json({ message: 'ไม่มีสิทธิ์เข้าถึงส่วนนี้' });
  }
  next();
};

module.exports = { authenticate, requireRole };
