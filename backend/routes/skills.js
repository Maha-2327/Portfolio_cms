import express from 'express';
import Skill from '../models/Skill.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route  GET /api/skills
// @desc   Get all skills (public)
// @access Public
router.get('/', async (req, res, next) => {
  try {
    const skills = await Skill.find().sort({ order: 1, name: 1 });
    res.json(skills);
  } catch (err) {
    next(err);
  }
});

// @route  GET /api/skills/admin/all
// @desc   Get all skills for admin (including drafts if any)
// @access Private
router.get('/admin/all', protect, async (req, res, next) => {
  try {
    const skills = await Skill.find().sort({ order: 1, name: 1 });
    res.json(skills);
  } catch (err) {
    next(err);
  }
});

// @route  POST /api/skills
// @desc   Create a new skill
// @access Private
router.post('/', protect, async (req, res, next) => {
  try {
    const skill = await Skill.create(req.body);
    res.status(201).json(skill);
  } catch (err) {
    next(err);
  }
});

// @route  PUT /api/skills/:id
// @desc   Update a skill
// @access Private
router.put('/:id', protect, async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(skill);
  } catch (err) {
    next(err);
  }
});

// @route  DELETE /api/skills/:id
// @desc   Delete a skill
// @access Private
router.delete('/:id', protect, async (req, res, next) => {
  try {
    await Skill.findByIdAndDelete(req.params.id);
    res.json({ message: 'Skill deleted' });
  } catch (err) {
    next(err);
  }
});

export default router;
