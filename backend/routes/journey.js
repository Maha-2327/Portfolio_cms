import express from 'express';
import Journey from '../models/Journey.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route  GET /api/journey
// @desc   Get all journey items (public)
// @access Public
router.get('/', async (req, res, next) => {
  try {
    const journey = await Journey.find().sort({ order: 1, year: -1 });
    res.json(journey);
  } catch (err) {
    next(err);
  }
});

// @route  GET /api/journey/admin/all
// @desc   Get all journey items for admin
// @access Private
router.get('/admin/all', protect, async (req, res, next) => {
  try {
    const journey = await Journey.find().sort({ order: 1, year: -1 });
    res.json(journey);
  } catch (err) {
    next(err);
  }
});

// @route  POST /api/journey
// @desc   Create a new journey item
// @access Private
router.post('/', protect, async (req, res, next) => {
  try {
    const journey = await Journey.create(req.body);
    res.status(201).json(journey);
  } catch (err) {
    next(err);
  }
});

// @route  PUT /api/journey/:id
// @desc   Update a journey item
// @access Private
router.put('/:id', protect, async (req, res, next) => {
  try {
    const journey = await Journey.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(journey);
  } catch (err) {
    next(err);
  }
});

// @route  DELETE /api/journey/:id
// @desc   Delete a journey item
// @access Private
router.delete('/:id', protect, async (req, res, next) => {
  try {
    await Journey.findByIdAndDelete(req.params.id);
    res.json({ message: 'Journey item deleted' });
  } catch (err) {
    next(err);
  }
});

export default router;
