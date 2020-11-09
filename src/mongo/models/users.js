const mongoose = require('mongoose');

//const Schema = mongoose.Schema;
const { Schema } = mongoose;

const userSchema = new Schema({
  //propiedades del usuario
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  data: {
    age: Number,
    isMale: Boolean,
  },
  role: { type: String, enum: ['admin', 'seller'], default: 'seller' },
});

//Coleccion User
const model = mongoose.model('User', userSchema);

module.exports = model;
