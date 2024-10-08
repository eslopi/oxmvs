const express = require('express');
const mongoose = require('mongoose');
const Location = require('../models/Location');
require('dotenv').config(); // جلب إعدادات البيئة من ملف .env

const app = express();
const router = express.Router();

// إعداد استخدام JSON في طلبات HTTP
app.use(express.json());

// الاتصال بقاعدة بيانات MongoDB (تأكد من أن MONGODB_URI موجودة في ملف .env)
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('تم الاتصال بقاعدة البيانات بنجاح'))
    .catch((error) => console.error('خطأ في الاتصال بقاعدة البيانات:', error));

// إنشاء موقع جديد
router.post('/locations', async (req, res) => {
  try {
    const { name, description, latitude, longitude } = req.body;
    const newLocation = new Location({ name, description, latitude, longitude });
    await newLocation.save();
    res.status(201).json(newLocation);
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ أثناء إنشاء الموقع', error: error.message });
  }
});

// استرجاع جميع المواقع من قاعدة البيانات
router.get('/locations', async (req, res) => {
  try {
    const locations = await Location.find();
    res.status(200).json(locations);
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ أثناء استرجاع المواقع', error: error.message });
  }
});

// حذف موقع
router.delete('/locations/:id', async (req, res) => {
  try {
    const location = await Location.findByIdAndDelete(req.params.id);
    if (!location) {
      return res.status(404).json({ message: 'الموقع غير موجود' });
    }
    res.status(200).json({ message: 'تم حذف الموقع بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ أثناء حذف الموقع', error: error.message });
  }
});

// ربط المسارات التي تتعامل مع المواقع
app.use('/api', router);

const PORT = process.env.PORT || 3000; // تحديد المنفذ من المتغيرات البيئية أو الافتراضي 3000
app.listen(PORT, () => console.log(`الخادم يعمل على المنفذ ${PORT}`));
