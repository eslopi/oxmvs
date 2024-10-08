const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');  // إضافة مسارات المصادقة
const protect = require('./middleware/authMiddleware');  // إضافة Middleware الحماية
const itemRoutes = require('./routes/itemRoutes');  // مسارات العناصر
require('dotenv').config();  // تحميل متغيرات البيئة من ملف .env

const app = express();

// Middleware
app.use(express.json());  // لتحليل JSON

// استخدام Middleware الحماية مع مسارات العناصر
app.use('/api/items', protect, itemRoutes);  // حماية مسارات العناصر

// مسارات المصادقة
app.use('/api/auth', authRoutes);  // مسارات المصادقة

// الاتصال بقاعدة البيانات MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('تم الاتصال بقاعدة البيانات MongoDB بنجاح'))
.catch(err => console.error('خطأ في الاتصال بقاعدة البيانات:', err));

// إعداد المنفذ
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`الخادم يعمل على المنفذ ${PORT}`));
