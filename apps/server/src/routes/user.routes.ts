import express from 'express';
import { getPublishedCourse } from '../controllers/course.controller';
import { getUserEnrolledCourses } from '../controllers/user.controller';
import { requireAuth } from '../middlewares/checkAuth';
import { checkEnrollemntMW } from '../middlewares/checkCourseEnrollment';
import { checkRoleMW } from '../middlewares/checkRoles';

const router = express.Router();

router.get('/:userId/enrolled-courses', requireAuth, checkRoleMW(), getUserEnrolledCourses);
router.get('/course/:slug', requireAuth, checkEnrollemntMW, getPublishedCourse);

export default router;
