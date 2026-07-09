import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true }, // rich text / HTML
    excerpt: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model('Blog', blogSchema);
