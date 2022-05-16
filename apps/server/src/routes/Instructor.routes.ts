import express from 'express';
import { applyForInstructor } from '../controllers/instructors.controller';
import { requireAuth } from '../middlewares/checkAuth';

const router = express.Router();

router.post('/apply', requireAuth, applyForInstructor);

export default router;
