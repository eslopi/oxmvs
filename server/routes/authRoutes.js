// routes/authRoutes.js
const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();

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

module.exports = router;
const nodemailer = require('nodemailer');

// طلب إعادة تعيين كلمة المرور
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    // البحث عن المستخدم عبر البريد الإلكتروني
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }

    // إنشاء رمز JWT قصير العمر
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

    // إرسال الرمز إلى البريد الإلكتروني
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,  // بريد إلكتروني
        pass: process.env.EMAIL_PASS   // كلمة المرور
      }
    });

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'إعادة تعيين كلمة المرور',
      html: `<h4>اضغط على الرابط لإعادة تعيين كلمة المرور:</h4><a href="${resetLink}">${resetLink}</a>`
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني' });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في إرسال الرابط', error: error.message });
  }
});
// إعادة تعيين كلمة المرور
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // التحقق من صلاحية الرمز
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }

    // تحديث كلمة المرور
    user.password = password;
    await user.save();

    res.status(200).json({ message: 'تم إعادة تعيين كلمة المرور بنجاح' });
  } catch (error) {
    res.status(400).json({ message: 'الرمز غير صالح أو منتهي', error: error.message });
  }
});
// تغيير كلمة المرور (للمستخدمين المسجلين)
router.post('/change-password', protect, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }

    // التحقق من كلمة المرور القديمة
    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'كلمة المرور القديمة غير صحيحة' });
    }

    // تحديث كلمة المرور
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'تم تغيير كلمة المرور بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في تغيير كلمة المرور', error: error.message });
  }
});
