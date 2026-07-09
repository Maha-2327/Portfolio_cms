import express from 'express';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Limit login attempts to slow down brute force attacks
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { message: 'Too many login attempts. Please try again later.' },
});

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// @route  POST /api/auth/login
// @desc   Login admin/editor and get token
// @access Public
router.post('/login', loginLimiter, async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = await User.findOne({ username });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (err) {
    next(err);
  }
});

// @route  GET /api/auth/me
// @desc   Get current logged-in user
// @access Private
router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

// @route  PUT /api/auth/profile
// @desc   Update user profile (display name, bio, profile picture)
// @access Private
router.put('/profile', protect, async (req, res, next) => {
  try {
    const { displayName, bio, profilePicture } = req.body;
    const user = await User.findById(req.user._id);

    if (displayName !== undefined) user.displayName = displayName;
    if (bio !== undefined) user.bio = bio;
    if (profilePicture !== undefined) user.profilePicture = profilePicture;

    await user.save();

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      displayName: user.displayName,
      bio: user.bio,
      profilePicture: user.profilePicture,
    });
  } catch (err) {
    next(err);
  }
});

// @route  GET /api/auth/public-profile
// @desc   Get public user profile (for portfolio display)
// @access Public
router.get('/public-profile', async (req, res, next) => {
  try {
    // Get the first admin user's profile
    const user = await User.findOne({ role: 'admin' }).select('displayName bio profilePicture');
    
    if (!user) {
      return res.json({
        displayName: 'MAHALAKSHMI U',
        bio: 'Full Stack Developer · MERN Stack',
        profilePicture: '',
      });
    }

    res.json({
      displayName: user.displayName || 'MAHALAKSHMI U',
      bio: user.bio || 'Full Stack Developer · MERN Stack',
      profilePicture: user.profilePicture || '',
    });
  } catch (err) {
    next(err);
  }
});

export default router;
