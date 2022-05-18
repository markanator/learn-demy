import express from 'express';
import {
  applyForInstructor,
  getAccountStatus,
  currentInstructor,
  instructorCourses,
} from '../controllers/instructors.controller';
import { requireAuth } from '../middlewares/checkAuth';
import { checkRoleMW } from '../middlewares/checkRoles';

const router = express.Router();

router.post('/apply', requireAuth, applyForInstructor);
router.get('/account-status', requireAuth, getAccountStatus);
router.get(
  '/current-instructor',
  requireAuth,
  checkRoleMW('Instructor', 'Admin'),
  currentInstructor
);
router.get('/my-courses', requireAuth, checkRoleMW('Instructor', 'Admin'), instructorCourses);


export default router;
