import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide name, email and password');
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters');
  }

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(409);
    throw new Error('User with this email already exists');
  }

  // First user becomes admin automatically
  const userCount = await User.countDocuments();
  const finalRole = userCount === 0 ? 'admin' : role === 'admin' ? 'member' : role || 'member';

  const user = await User.create({
    name,
    email,
    password,
    role: finalRole,
  });

  res.status(201).json({
    success: true,
    user: user.toSafeJSON(),
    token: generateToken(user._id),
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  res.json({
    success: true,
    user: user.toSafeJSON(),
    token: generateToken(user._id),
  });
});

// @desc    Get logged-in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});

// @desc    Update profile
// @route   PUT /api/auth/me
// @access  Private
export const updateMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  user.name = req.body.name ?? user.name;
  user.title = req.body.title ?? user.title;
  user.avatarColor = req.body.avatarColor ?? user.avatarColor;
  if (req.body.password) {
    user.password = req.body.password;
  }
  const updated = await user.save();
  res.json({ success: true, user: updated.toSafeJSON() });
});
