const express = require('express');
const mongoose = require('mongoose');
const itemRoutes = require('./routes/itemRoutes');
const authRoutes = require('./routes/authRoutes');  // إضافة مسارات المصادقة
const protect = require('./middleware/authMiddleware');  // إضافة Middleware الحماية
require('dotenv').config();

const app = express();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('تم الاتصال بقاعدة البيانات بنجاح'))
  .catch((error) => console.error('خطأ في الاتصال بقاعدة البيانات:', error));

app.use(express.json());
app.use('/api/items', protect, itemRoutes);  // حماية مسارات العناصر
app.use('/api/auth', authRoutes);  // مسارات المصادقة

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`الخادم يعمل على المنفذ ${PORT}`));
