import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    level: { type: Number, required: true, min: 0, max: 100 },
    category: { type: String, default: 'General' }, // e.g., Frontend, Backend, Tools
    icon: { type: String, default: '' }, // optional emoji or icon
    order: { type: Number, default: 0 }, // for custom ordering
  },
  { timestamps: true }
);

export default mongoose.model('Skill', skillSchema);
