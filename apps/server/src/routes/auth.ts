import express from 'express';
import {
  currentUser,
  login,
  logout,
  register,
  sendTestEmail,
} from '../controllers/auth.controllers';
import { requireAuth } from '../middlewares/checkAuth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', requireAuth, currentUser);
router.get('/send-email', sendTestEmail);

export default router;
