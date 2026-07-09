import express from 'express';
import Project from '../models/Project.js';
import Blog from '../models/Blog.js';
import Message from '../models/Message.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route  GET /api/stats
// @desc   Summary counts for the CMS analytics dashboard
// @access Private
router.get('/', protect, async (req, res, next) => {
  try {
    const [totalProjects, publishedProjects, totalBlogs, publishedBlogs, totalMessages, unreadMessages] =
      await Promise.all([
        Project.countDocuments(),
        Project.countDocuments({ status: 'published' }),
        Blog.countDocuments(),
        Blog.countDocuments({ status: 'published' }),
        Message.countDocuments(),
        Message.countDocuments({ read: false }),
      ]);

    const recentMessages = await Message.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      totalProjects,
      publishedProjects,
      totalBlogs,
      publishedBlogs,
      totalMessages,
      unreadMessages,
      recentMessages,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
