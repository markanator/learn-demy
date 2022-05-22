import express from 'express';
import { getUserEnrolledCourses } from '../controllers/user.controller';
import { requireAuth } from '../middlewares/checkAuth';
import { checkRoleMW } from '../middlewares/checkRoles';

const router = express.Router();

router.get('/:userId/enrolled-courses', requireAuth, checkRoleMW(), getUserEnrolledCourses);

export default router;
