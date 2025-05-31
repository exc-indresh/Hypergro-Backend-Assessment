import { Request, Response } from 'express';
import User from '../models/user.model';
import Property from '../models/property.model';
import { AuthRequest } from '../middlewares/auth.middleware';

export const recommendProperty = async (req: AuthRequest, res: Response) => {
  const senderId = req.user.id;
  const { email, propertyId } = req.body;

  try {
    const recipient = await User.findOne({ email });
    if (!recipient) return res.status(404).json({ message: 'Recipient not found' });

    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    recipient.recommendationsReceived.push({
      property: property._id,
      from: senderId
    });

    await recipient.save();
    res.json({ message: 'Recommendation sent!' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to recommend property', error: err });
  }
};

export const getRecommendations = async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId)
      .populate({
        path: 'recommendationsReceived.property',
        model: 'Property'
      })
      .populate({
        path: 'recommendationsReceived.from',
        select: 'email name',
        model: 'User'
      });

    res.json(user?.recommendationsReceived || []);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch recommendations', error: err });
  }
};
