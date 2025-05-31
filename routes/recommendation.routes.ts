import express from 'express';
const { authenticate } = require('../middlewares/auth.middleware');
const { recommendProperty, getRecommendations } = require('../controllers/recommendation.controller');

const router = express.Router();

router.post('/', authenticate, recommendProperty); 
router.get('/', authenticate, getRecommendations); 

export default router;
