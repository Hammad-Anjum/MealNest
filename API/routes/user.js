import express from 'express'
import { register, login, profile, updateUserSettings } from '../controllers/user.js';
import { Authenticate } from '../middlewares/auth.js';

const router = express.Router();

// user register
router.post("/register", register);

// user login
router.post('/login', login);

// get user profile
router.get('/user', Authenticate, profile);

// update user settings (name/password)
router.put('/user/settings', Authenticate, updateUserSettings);

export default router;