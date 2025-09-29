import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// Signup Route
router.post('/signup', async (req, res) => {
  try {
    const { name, email, phone, password, bio, community, profilePicture, socialLinks } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: 'User already exists with this email'
      });
    }

    // Create new user
    const newUser = await User.create({
      name,
      email,
      phone,
      password,
      bio,
      community,
      profilePicture,
      socialLinks
    });

    // Generate JWT token
    const token = signToken(newUser._id);

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        community: newUser.community,
        profilePicture: newUser.profilePicture,
        isPremium: newUser.isPremium
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error creating user',
      error: error.message
    });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Please provide email and password'
      });
    }

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        message: 'Incorrect email or password'
      });
    }

    // Generate JWT token
    const token = signToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        community: user.community,
        profilePicture: user.profilePicture,
        isPremium: user.isPremium
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error logging in',
      error: error.message
    });
  }
});

// Get Current User
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        message: 'No token provided'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        bio: user.bio,
        community: user.community,
        profilePicture: user.profilePicture,
        socialLinks: user.socialLinks,
        isPremium: user.isPremium
      }
    });
  } catch (error) {
    res.status(401).json({
      message: 'Invalid token'
    });
  }
});

export default router;
