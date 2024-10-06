const Item = require('../models/Item');

// إنشاء عنصر جديد
exports.createItem = async (req, res) => {
  try {
    const newItem = new Item(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// قراءة جميع العناصر
exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// قراءة عنصر واحد
exports.getItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'العنصر غير موجود' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// تحديث عنصر
exports.updateItem = async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedItem) return res.status(404).json({ message: 'العنصر غير موجود' });
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// حذف عنصر
exports.deleteItem = async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ message: 'العنصر غير موجود' });
    res.json({ message: 'تم حذف العنصر بنجاح' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};