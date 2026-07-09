import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    techStack: [{ type: String }],
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate',
    },
    timeTaken: { type: String, default: '' }, // e.g. "2 weeks"
    githubLink: { type: String, default: '' },
    liveDemo: { type: String, default: '' },
    image: { type: String, default: '' }, // image URL (uploaded or external)
    features: [{ type: String }],
    challenges: { type: String, default: '' },
    learnings: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ['draft', 'published'], default: 'published' },
  },
  { timestamps: true }
);

// Text index for search
projectSchema.index({ title: 'text', shortDescription: 'text', techStack: 'text' });

export default mongoose.model('Project', projectSchema);
