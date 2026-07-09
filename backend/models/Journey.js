import mongoose from 'mongoose';

const journeySchema = new mongoose.Schema(
  {
    year: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['education', 'work', 'project', 'milestone'],
      default: 'milestone'
    },
    order: { type: Number, default: 0 }, // for custom ordering
  },
  { timestamps: true }
);

export default mongoose.model('Journey', journeySchema);
