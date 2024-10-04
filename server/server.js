const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

const express = require('express');
const mongoose = require('mongoose');
const itemRoutes = require('./routes/itemRoutes');
require('dotenv').config();

const app = express();

// اتصال بقاعدة البيانات
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('تم الاتصال بقاعدة البيانات بنجاح'))
  .catch((error) => console.error('خطأ في الاتصال بقاعدة البيانات:', error));

app.use(express.json());
app.use('/api/items', itemRoutes);

// باقي إعدادات الخادم...

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`الخادم يعمل على المنفذ ${PORT}`));

// استيراد مسار المواقع
const locationsRoutes = require('./routes/locations');

// Middleware
app.use(cors());
app.use(express.json());

// تسجيل مسار API للمواقع
app.use('/api/locations', locationsRoutes);

// اتصال بقاعدة البيانات
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// تقديم الملفات الثابتة
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
