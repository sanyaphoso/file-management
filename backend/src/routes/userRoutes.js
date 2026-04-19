const express = require('express');
const router = express.Router();

const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// user
router.get('/profile', verifyToken, (req, res) => {
  res.json({
    message: 'Profile OK',
    user: req.user
  });
});

// admin
router.get('/admin', verifyToken, isAdmin, (req, res) => {
  res.json({
    message: 'Admin access granted'
  });
});

module.exports = router;