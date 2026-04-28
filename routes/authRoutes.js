const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @route   POST api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    let user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

    const payload = { id: user.id, isAdmin: user.isAdmin };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { id: user.id, username: user.username, isAdmin: user.isAdmin } });
    });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// For initial setup: create an admin user (You can remove this or protect it after creating the first admin)
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        let user = await User.findOne({ username });
        if(user) return res.status(400).json({msg: 'User already exists'});
        user = new User({ username, password });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        res.json({msg: 'Admin user created'});
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
