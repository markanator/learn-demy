import express from 'express';
import {
  uploadImageToS3,
  removeImageFromS3,
  createCourse,
  getCourseBySlug,
} from '../controllers/course.controller';
import { requireAuth } from '../middlewares/checkAuth';
import { checkRoleMW } from '../middlewares/checkRoles';

const router = express.Router();

// IMAGES
router.post('/upload-image', requireAuth, uploadImageToS3);
router.post('/remove-image', requireAuth, removeImageFromS3);
// COURSES
router.post('/', requireAuth, checkRoleMW('Instructor', 'Admin'), createCourse);
router.get('/:slug', requireAuth, checkRoleMW('Instructor', 'Admin'), getCourseBySlug);

export default router;
