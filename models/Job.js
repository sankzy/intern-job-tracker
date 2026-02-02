import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
  company: { type: String, required: true },
  role: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Interviewing', 'Accepted', 'Rejected'], 
    default: 'Pending' 
  },
  link: { type: String },
  dateApplied: { type: Date, default: Date.now },
});

export default mongoose.models.Job || mongoose.model('Job', JobSchema);