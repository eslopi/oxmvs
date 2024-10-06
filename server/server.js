// server.js

const express = require('express');
const mongoose = require('mongoose');
const itemRoutes = require('./routes/itemRoutes');
const locationRoutes = require('./routes/locationRoutes'); // إضافة مسار للأماكن
require('dotenv').config();

const app = express();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('تم الاتصال بقاعدة البيانات بنجاح'))
  .catch((error) => console.error('خطأ في الاتصال بقاعدة البيانات:', error));

app.use(express.json());
app.use('/api/items', itemRoutes);
app.use('/api/locations', locationRoutes); // مسار جديد للأماكن

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`الخادم يعمل على المنفذ ${PORT}`));
