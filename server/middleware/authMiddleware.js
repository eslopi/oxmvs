const jwt = require('jsonwebtoken');

// Middleware لحماية المسارات
const protect = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'غير مصرح، لا يوجد رمز مصادقة' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // تخزين بيانات المستخدم في الطلب
        next();
    } catch (error) {
        res.status(401).json({ message: 'رمز المصادقة غير صالح' });
    }
};

// Middleware للتحقق من صلاحيات المدير
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'غير مصرح، لا تمتلك صلاحيات المدير' });
    }
};

module.exports = { protect, admin };
