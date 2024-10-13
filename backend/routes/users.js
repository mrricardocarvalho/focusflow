const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticateJWT = require('../middleware/auth');

// Get all users
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const users = await db.collection('users').find({}, { projection: { password: 0 } }).toArray();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single user
router.get('/:id', authenticateJWT, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(req.params.id) },
      { projection: { password: 0 } }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      username,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('users').insertOne(newUser);

    // Create and send JWT token
    const payload = {
      user: {
        id: result.insertedId
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ token });
      }
    );
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// User login
router.post('/login', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { email, password } = req.body;

    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create and send JWT token
    const payload = {
      user: {
        id: user._id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a user
router.put('/:id', authenticateJWT, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { username, email } = req.body;
    const updatedUser = {
      username,
      email,
      updatedAt: new Date()
    };
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updatedUser }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User updated successfully', result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a user
router.delete('/:id', authenticateJWT, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const result = await db.collection('users').deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully', result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get user profile
router.get('/profile', authenticateJWT, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(req.user.id) },
      { projection: { password: 0 } }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user profile
router.put('/profile', authenticateJWT, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { username, email } = req.body;
    const updatedUser = {
      username,
      email,
      updatedAt: new Date()
    };
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(req.user.id) },
      { $set: updatedUser }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

