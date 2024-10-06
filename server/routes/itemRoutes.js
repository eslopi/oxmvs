<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

router.post('/', itemController.createItem);
router.get('/', itemController.getAllItems);
router.get('/:id', itemController.getItem);
router.put('/:id', itemController.updateItem);
router.delete('/:id', itemController.deleteItem);

module.exports = router;
=======
// locationRoutes.js

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
