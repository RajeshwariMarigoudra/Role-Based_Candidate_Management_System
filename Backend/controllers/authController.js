const User = require('../models/User');
const jwt = require('jsonwebtoken');

// User Registration
const register = async (req, res) => {
    const { username, email, password } = req.body;
  
    try {
      // Check if user already exists
      const userExists = await User.findOne({ email });
      if (userExists) return res.status(400).json({ message: 'User already exists' });
  
      // Create new user
      const user = new User({ username, email, password });
      await user.save();
  
      // Generate JWT token
      const token = user.generateAuthToken();
      res.status(201).json({ token, user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  

// User Login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Check if user is active
    if (!user.active) {
      return res.status(403).json({ message: 'User is inactive' });
    }

    // Validate password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate JWT token
    const token = user.generateAuthToken();
    res.json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

  
// Toggle User Active Status (Admin Only)
const toggleUserStatus = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      // Toggle the active status
      user.active = !user.active;
      await user.save();
  
      res.json({ message: `User is now ${user.active ? 'active' : 'inactive'}`, user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
module.exports = { register, login, toggleUserStatus };
