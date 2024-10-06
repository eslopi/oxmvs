<<<<<<< HEAD
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

=======
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

>>>>>>> 12b00e4d159c16876c1deeb6329c294a42a68dae
module.exports = mongoose.model('Item', itemSchema);