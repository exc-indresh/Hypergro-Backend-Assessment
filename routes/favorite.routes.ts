import express from 'express';
const { authenticate } = require('../middlewares/auth.middleware');
const { addFavorite, removeFavorite, getFavorites } = require('../controllers/favorite.controller');

const router = express.Router();

router.post('/:id', authenticate, addFavorite);     
router.delete('/:id', authenticate, removeFavorite); 
router.get('/', authenticate, getFavorites);        

export default router;
