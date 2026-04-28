const express = require('express');
const router = express.Router();
const Part = require('../models/Part');
const auth = require('../middleware/auth');

// @route   GET api/parts
// @desc    Get all parts (Public)
router.get('/', async (req, res) => {
  try {
    const parts = await Part.find().sort({ createdAt: -1 });
    res.json(parts);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// @route   POST api/parts
// @desc    Create a part (Admin only)
router.post('/', auth, async (req, res) => {
  try {
    const newPart = new Part(req.body);
    const part = await newPart.save();
    res.json(part);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// @route   PUT api/parts/:id
// @desc    Update a part (Admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const part = await Part.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(part);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/parts/:id
// @desc    Delete a part (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    await Part.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Part removed' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
