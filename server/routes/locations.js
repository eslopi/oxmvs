 
const express = require('express');
const router = express.Router();
const Location = require('../models/Location');

// إضافة مكان جديد
router.post('/', async (req, res) => {
  try {
    const location = new Location(req.body);
    await location.save();
    res.status(201).json(location);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// الحصول على جميع الأماكن
router.get('/', async (req, res) => {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
const mongoose = require('mongoose');

// إعداد نموذج الموقع الذي يحتوي على الحقول المطلوبة
const locationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
});

module.exports = mongoose.model('Location', locationSchema); // تصدير النموذج
