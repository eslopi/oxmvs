<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const Location = require('../models/Location');

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

module.exports = router;

// حذف مكان
router.delete('/:id', async (req, res) => {
  try {
    const deletedLocation = await Location.findByIdAndDelete(req.params.id);
    if (!deletedLocation) return res.status(404).json({ message: 'الموقع غير موجود' });
    res.json({ message: 'تم حذف الموقع بنجاح' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
>>>>>>> 12b00e4d159c16876c1deeb6329c294a42a68dae
