const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Define the schema for the user
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String },
  profileImage: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  active: { type: Boolean, default: true } // Add active status
});

// Hash password before saving to DB
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Compare given password with hashed password
userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generate a JWT token
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { id: this._id, role: this.role, active: this.active }, // Include 'active' status in the token payload
    process.env.JWT_SECRET, // Ensure JWT_SECRET is set in your environment variables
    { expiresIn: process.env.JWT_EXPIRATION || '1h' } // Token expiration can be customized
  );
  return token;
};

// Export the User model
module.exports = mongoose.model('User', userSchema);
