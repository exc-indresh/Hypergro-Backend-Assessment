import express from 'express';
const { register, login } =  require('../controllers/user.controller');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

export default router;
