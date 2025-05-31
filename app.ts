import express from 'express';
import dotenv from 'dotenv';
import connectDB from './utils/connectDB';
import userRoutes from './routes/user.routes';
import propertyRoutes from './routes/property.routes';
import favoriteRoutes from './routes/favorite.routes';
import recommendationRoutes from './routes/recommendation.routes';

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/recommendations', recommendationRoutes);

export default app;
