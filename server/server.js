// server.js

const express = require('express');
const mongoose = require('mongoose');
const itemRoutes = require('./routes/itemRoutes');
<<<<<<< HEAD
const authRoutes = require('./routes/authRoutes');  // إضافة مسارات المصادقة
const protect = require('./middleware/authMiddleware');  // إضافة Middleware الحماية
=======
const locationRoutes = require('./routes/locationRoutes'); // إضافة مسار للأماكن
>>>>>>> 12b00e4d159c16876c1deeb6329c294a42a68dae
require('dotenv').config();

const app = express();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('تم الاتصال بقاعدة البيانات بنجاح'))
  .catch((error) => console.error('خطأ في الاتصال بقاعدة البيانات:', error));

app.use(express.json());
<<<<<<< HEAD
app.use('/api/items', protect, itemRoutes);  // حماية مسارات العناصر
app.use('/api/auth', authRoutes);  // مسارات المصادقة
=======
app.use('/api/items', itemRoutes);
app.use('/api/locations', locationRoutes); // مسار جديد للأماكن
>>>>>>> 12b00e4d159c16876c1deeb6329c294a42a68dae

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`الخادم يعمل على المنفذ ${PORT}`));
