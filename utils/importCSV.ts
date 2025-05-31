import fs from 'fs';
import csv from 'csv-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Property from '../models/property.model';

dotenv.config();

const importCSV = async () => {
  await mongoose.connect(process.env.MONGODB_URI!);

  const results: any[] = [];

  fs.createReadStream('dataset.csv')  
    .pipe(csv())
    .on('data', (data) => {
      results.push({
        ...data,
        price: Number(data.price),
        areaSqFt: Number(data.areaSqFt),
        bedrooms: Number(data.bedrooms),
        bathrooms: Number(data.bathrooms),
        amenities: data.amenities.split('|'),
        tags: data.tags.split('|'),
        rating: parseFloat(data.rating),
        isVerified: data.isVerified === 'true',
      });
    })
    .on('end', async () => {
      try {
        await Property.insertMany(results);
        console.log('CSV import successful!');
        process.exit();
      } catch (err) {
        console.error('Import error:', err);
        process.exit(1);
      }
    });
};

importCSV();
