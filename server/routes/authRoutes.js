const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const { protect, admin } = require('../middleware/authMiddleware');  // استدعاء `protect` و `admin` من authMiddleware

// تسجيل مستخدم جديد
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'اسم المستخدم مستخدم بالفعل' });
    }

    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: 'تم إنشاء المستخدم بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في إنشاء المستخدم', error: error.message });
  }
});

// تسجيل الدخول
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
    }

    // إنشاء رمز JWT
    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في تسجيل الدخول', error: error.message });
  }
});

// مسار لتغيير كلمة المرور باستخدام حماية `protect`
router.post('/change-password', protect, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }

    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'كلمة المرور القديمة غير صحيحة' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'تم تغيير كلمة المرور بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في تغيير كلمة المرور', error: error.message });
  }
});

module.exports = router;
