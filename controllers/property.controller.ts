import Property from '../models/property.model';
import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import redisClient from '../config/radis';

export const createProperty = async (req: AuthRequest, res: Response) => {
  try {
    const property = await Property.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json(property);
  } catch (err) {
    res.status(500).json({ message: 'Create failed', error: err });
  }
  await redisClient.flushAll()
};

export const getAllProperties = async (req: Request, res: Response) => {
  const cacheKey = `properties:${JSON.stringify(req.query)}`;
  try {
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const {
      minPrice, maxPrice, bedrooms, bathrooms, state, city,
      furnished, isVerified, listingType, tags, amenities
    } = req.query;

    const query: any = {};

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (bedrooms) query.bedrooms = Number(bedrooms);
    if (bathrooms) query.bathrooms = Number(bathrooms);
    if (state) query.state = state;
    if (city) query.city = city;
    if (furnished) query.furnished = furnished;
    if (isVerified !== undefined) query.isVerified = isVerified === 'true';
    if (listingType) query.listingType = listingType;

    if (tags) query.tags = { $in: (tags as string).split(',') };
    if (amenities) query.amenities = { $all: (amenities as string).split(',') };

    const properties = await Property.find(query);
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(properties)); // cache for 1hr
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: 'Filter failed', error: err });
  }
};



export const getPropertyById = async (req: Request, res: Response) => {
  const cacheKey = `property:${req.params.id}`;
  try {
    const cached = await redisClient.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Not found' });

    await redisClient.setEx(cacheKey, 3600, JSON.stringify(property)); // cache for 1hr
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed', error: err });
  }
};


export const updateProperty = async (req: AuthRequest, res: Response) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Not found' });
    if (!property.createdBy || property.createdBy.toString() !== req.user.id)
      return res.status(403).json({ message: 'Unauthorized' });

    const updated = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err });
  }
  await redisClient.flushAll()
};

export const deleteProperty = async (req: AuthRequest, res: Response) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Not found' });
    if (!property.createdBy || property.createdBy.toString() !== req.user.id)
      return res.status(403).json({ message: 'Unauthorized' });
    await property.deleteOne();
    res.json({ message: 'Property deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err });
  }
  await redisClient.flushAll()
};
