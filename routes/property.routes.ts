import express from 'express';
const {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty
} = require('../controllers/property.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const router = express.Router();

router.post('/', authenticate, createProperty);
router.get('/', getAllProperties);
router.get('/:id', getPropertyById);
router.put('/:id', authenticate, updateProperty);
router.delete('/:id', authenticate, deleteProperty);

export default router;
