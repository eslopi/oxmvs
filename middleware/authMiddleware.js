// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // التحقق من الرمز
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = decoded;  // تخزين المستخدم في الطلب

      next();
    } catch (error) {
      return res.status(401).json({ message: 'غير مصرح بالدخول' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'غير مصرح بالدخول، لا يوجد رمز' });
  }
};

module.exports = protect;
