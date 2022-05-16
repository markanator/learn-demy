import express from 'express';
import {
  applyForInstructor,
  getAccountStatus,
  currentInstructor,
} from '../controllers/instructors.controller';
import { requireAuth } from '../middlewares/checkAuth';

const router = express.Router();

router.post('/apply', requireAuth, applyForInstructor);
router.get('/account-status', requireAuth, getAccountStatus);
router.get('/current-instructor', requireAuth, currentInstructor);

export default router;
