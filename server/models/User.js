const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// تعريف مخطط المستخدم
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

// قبل حفظ المستخدم، نقوم بتجزئة كلمة المرور
userSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) return next(); // إذا لم تتغير كلمة المرور، تخطى هذه المرحلة

  const salt = await bcrypt.genSalt(10); // إنشاء "ملح" لتشفير كلمة المرور
  user.password = await bcrypt.hash(user.password, salt); // تشفير كلمة المرور
  next();
});

// دالة لمطابقة كلمة المرور المدخلة مع كلمة المرور المشفرة
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password); // مطابقة كلمة المرور
};

// تصدير النموذج (Model)
module.exports = mongoose.model('User', userSchema);
