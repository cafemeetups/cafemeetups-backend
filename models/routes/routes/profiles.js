import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Get all profiles
router.get('/', async (req, res) => {
  try {
    const { community } = req.query;
    
    let filter = { isActive: true };
    if (community && community !== 'All') {
      filter.community = community;
    }

    const profiles = await User.find(filter)
      .select('name email bio community profilePicture socialLinks isPremium')
      .sort({ isPremium: -1, createdAt: -1 });

    res.json({
      message: 'Profiles fetched successfully',
      profiles
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching profiles',
      error: error.message
    });
  }
});

// Get single profile
router.get('/:id', async (req, res) => {
  try {
    const profile = await User.findById(req.params.id)
      .select('-password');

    if (!profile) {
      return res.status(404).json({
        message: 'Profile not found'
      });
    }

    res.json({
      message: 'Profile fetched successfully',
      profile
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching profile',
      error: error.message
    });
  }
});

// Update profile
router.put('/:id', async (req, res) => {
  try {
    const { name, bio, community, profilePicture, socialLinks } = req.body;

    const updatedProfile = await User.findByIdAndUpdate(
      req.params.id,
      {
        name,
        bio,
        community,
        profilePicture,
        socialLinks
      },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      profile: updatedProfile
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating profile',
      error: error.message
    });
  }
});

export default router;
