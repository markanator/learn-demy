import express from 'express';
import {
  applyForInstructor,
  getAccountStatus,
} from '../controllers/instructors.controller';
import { requireAuth } from '../middlewares/checkAuth';

const router = express.Router();

router.post('/apply', requireAuth, applyForInstructor);
router.get('/account-status', requireAuth, getAccountStatus);

export default router;
