import express from 'express';
import Project from '../models/Project.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route  GET /api/projects
// @desc   Get all published projects (supports ?search= & ?tech=)
// @access Public
router.get('/', async (req, res, next) => {
  try {
    const { search, tech } = req.query;
    const query = { status: 'published' };

    if (search) {
      query.$text = { $search: search };
    }
    if (tech) {
      query.techStack = { $in: [new RegExp(`^${tech}$`, 'i')] };
    }

    const projects = await Project.find(query).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    next(err);
  }
});

// @route  GET /api/projects/admin/all
// @desc   Get ALL projects including drafts (for CMS dashboard)
// @access Private
router.get('/admin/all', protect, async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    next(err);
  }
});

// @route  GET /api/projects/:id
// @desc   Get single project by id
// @access Public
router.get('/:id', async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    next(err);
  }
});

// @route  POST /api/projects
// @desc   Create a new project
// @access Private
router.post('/', protect, async (req, res, next) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
});

// @route  PUT /api/projects/:id
// @desc   Update a project
// @access Private
router.put('/:id', protect, async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    next(err);
  }
});

// @route  DELETE /api/projects/:id
// @desc   Delete a project
// @access Private
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;
