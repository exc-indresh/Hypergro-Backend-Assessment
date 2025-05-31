import { Request, Response } from 'express';
import User from '../models/user.model';
import Property from '../models/property.model';
import { AuthRequest } from '../middlewares/auth.middleware';

export const addFavorite = async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  const propertyId = req.params.id;

  try {
    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.favorites.includes(propertyId)) {
      return res.status(400).json({ message: 'Property already in favorites' });
    }

    user.favorites.push(propertyId);
    await user.save();
    res.json({ message: 'Added to favorites' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to favorite', error: err });
  }
};

export const removeFavorite = async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  const propertyId = req.params.id;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { favorites: propertyId } },
      { new: true }
    );
    res.json({ message: 'Removed from favorites', favorites: user?.favorites });
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove favorite', error: err });
  }
};

export const getFavorites = async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  try {
    const user = await User.findById(userId).populate('favorites');
    res.json(user?.favorites || []);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get favorites', error: err });
  }
};
