const mongoose = require('mongoose');
const User = require('../models/User');
const cloudinary = require('../config/cloudinaryConfig');
const streamifier = require('streamifier');

// Get User Profile (for Regular User)
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Users List (Paginated)
const getUsersList = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  try {
    let users;
    if (req.user.role === 'admin') {
      users = await User.find().skip(skip).limit(limit);
    } else {
      users = await User.find({ _id: req.user.id }).skip(skip).limit(limit);
    }

    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create User (Register a new User)
const createUser = async (req, res) => {
  const { username, email, mobile, password, role = 'user' } = req.body;

  // Simple validation for required fields
  if (!username || !email || !mobile || !password) {
    return res.status(400).json({ message: 'Please provide all required fields: username, email, mobile, and password' });
  }

  // Validate email format
  // const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  // if (!emailRegex.test(email)) {
  //   return res.status(400).json({ message: 'Invalid email format' });
  // }

  // Validate mobile format (basic check, you can adjust this based on your requirements)
  // const mobileRegex = /^[0-9]{10}$/; // Example: 10 digit mobile number
  // if (!mobileRegex.test(mobile)) {
  //   return res.status(400).json({ message: 'Invalid mobile number format. Must be 10 digits.' });
  // }

  try {
    // Check if the email already exists
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Check if the mobile number already exists
    const existingUserByMobile = await User.findOne({ mobile });
    if (existingUserByMobile) {
      return res.status(400).json({ message: 'Mobile number already in use' });
    }


    // Create a new user instance
    const newUser = new User({
      username,
      email,
      mobile,
      password,
      role,
      active: true,  // New users are active by default
    });

    // Save the new user to the database
    await newUser.save();

    // Respond with the newly created user data (excluding the password)
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        mobile: newUser.mobile,
        role: newUser.role,
        active: newUser.active,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Update User (Username, Password, Active Status)
const updateUser = async (req, res) => {
  const { username, password, active } = req.body;
  const userId = req.params.userId;

  try {
    // Ensure that only the user themselves or an admin can update
    if (req.user.role !== 'admin' && req.user.id !== userId) {
      return res.status(403).json({ message: 'You are not authorized to update this user' });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update fields if provided
    if (username) user.username = username;
    if (password) {
      // Hash the new password before saving
      user.password = await bcrypt.hash(password, 10);
    }
    if (active !== undefined) user.active = active;

    // Save updated user
    await user.save();

    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Upload Profile Image/Resume
const uploadProfile = async (req, res) => {
  // console.log('Received file:', req.file); // Log the file data to check if it's being received
  // console.log('User ID from params:', req.params.userId); // Log the user ID from the URL parameter

  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Create a stream from the file buffer
    const stream = streamifier.createReadStream(req.file.buffer);
    const uploadResult = await new Promise((resolve, reject) => {
      const cloudinaryUploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto', folder: 'profile_images' },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      // Pipe the file stream to Cloudinary
      stream.pipe(cloudinaryUploadStream);
    });

    // Query the user from the database using the userId from the URL params
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Save the image URL to the user's profile
    user.profileImage = uploadResult.secure_url;
    await user.save();

    res.json({ message: 'Profile image uploaded successfully', user });
  } catch (error) {
    console.error('Error during upload:', error);
    res.status(500).json({ message: 'Error uploading image to Cloudinary', error: error.message });
  }
};


// Delete User by ID
// Delete user function
const deleteUser = async (req, res) => {
  const userId = req.params.userId;  // Assuming userId is passed as a route parameter

  // Check if the userId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid user ID format' });
  }

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete the user
    await user.deleteOne();  // Or you can use `user.remove()`, but `deleteOne()` is recommended in Mongoose 6

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

module.exports = { getProfile, getUsersList, updateUser, uploadProfile, createUser, deleteUser };

