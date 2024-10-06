const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); // لتحميل المتغيرات من ملف .env

// الاتصال بقاعدة بيانات MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('تم الاتصال بقاعدة البيانات بنجاح'))
.catch(err => console.error('خطأ في الاتصال بقاعدة البيانات:', err));

const itemRoutes = require('./routes/itemRoutes'); // ربط مسارات المواقع
require('dotenv').config(); // جلب إعدادات البيئة من ملف .env

const app = express();

// إعداد استخدام JSON في طلبات HTTP
app.use(express.json());

// الاتصال بقاعدة بيانات MongoDB (تأكد من أن MONGODB_URI موجودة في ملف .env)
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('تم الاتصال بقاعدة البيانات بنجاح'))
    .catch((error) => console.error('خطأ في الاتصال بقاعدة البيانات:', error));

// ربط المسارات التي تتعامل مع المواقع
app.use('/api', itemRoutes);

const PORT = process.env.PORT || 3000; // تحديد المنفذ من المتغيرات البيئية أو الافتراضي 3000
app.listen(PORT, () => console.log(`الخادم يعمل على المنفذ ${PORT}`));
