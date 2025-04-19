import express from 'express';
import { body, validationResult } from 'express-validator';
import { createUser, getAllUsers, getUserById, updateUser, deleteUser } from '../services/userService.js';
import { rateLimit } from 'express-rate-limit';

const router = express.Router();

// Rate limiting middleware
const createUserLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 create account requests per window
  message: 'Too many accounts created from this IP, please try again after 15 minutes'
});

// Validation middleware
const validateUserInput = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters')
    .matches(/^[a-zA-Z0-9_-]+$/).withMessage('Username can only contain letters, numbers, underscores and hyphens')
    .escape(),
  
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters')
    .escape(),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  
  body('dateOfBirth')
    .notEmpty().withMessage('Date of birth is required')
    .isISO8601().withMessage('Invalid date format. Use YYYY-MM-DD')
    .custom(value => {
      const birthDate = new Date(value);
      const today = new Date();
      if (birthDate > today) {
        throw new Error('Birth date cannot be in the future');
      }
      // Check if the date is not too far in the past (e.g., 120 years)
      const minDate = new Date();
      minDate.setFullYear(minDate.getFullYear() - 120);
      if (birthDate < minDate) {
        throw new Error('Birth date is too far in the past');
      }
      return true;
    })
];

// Create a new user
router.post('/', createUserLimiter, validateUserInput, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('[Validation Error]', {
        timestamp: new Date().toISOString(),
        errors: errors.array(),
        requestBody: req.body
      });
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }

    const userData = {
      username: req.body.username,
      name: req.body.name,
      email: req.body.email,
      date_of_birth: req.body.dateOfBirth
    };

    const newUser = await createUser(userData);

    // Log successful creation
    console.log('[User Created]', {
      timestamp: new Date().toISOString(),
      userId: newUser.id,
      email: newUser.email
    });

    res.status(201)
      .header('Content-Type', 'application/json')
      .json({
        status: 'success',
        data: newUser
      });
  } catch (error) {
    // Log the error with request details
    console.error('[User Creation Error]', {
      timestamp: new Date().toISOString(),
      error: error.message,
      requestBody: req.body
    });

    // Handle specific error types
    if (error.code === '23505') { // Unique violation in PostgreSQL
      return res.status(409).json({
        status: 'error',
        message: 'A user with this email or username already exists'
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Failed to create user',
      details: error.message
    });
  }
});

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users', details: error.message });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user', details: error.message });
  }
});

// Update user
router.put('/:id', validateUserInput, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userData = {
      username: req.body.username,
      name: req.body.name,
      email: req.body.email,
      date_of_birth: req.body.dateOfBirth
    };

    const updatedUser = await updateUser(req.params.id, userData);
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user', details: error.message });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const result = await deleteUser(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user', details: error.message });
  }
});

export default router;