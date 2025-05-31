import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
  recommendationsReceived: [{
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    recommendedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export default mongoose.model('User', userSchema);
