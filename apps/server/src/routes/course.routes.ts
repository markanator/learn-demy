import express from 'express';
import {
  uploadImageToS3,
  removeImageFromS3,
  createCourse,
  getCourseBySlug,
  uploadVideoToS3,
  removeVideoFromS3,
  addLessonToCourse,
} from '../controllers/course.controller';
import { requireAuth } from '../middlewares/checkAuth';
import { checkRoleMW } from '../middlewares/checkRoles';
import { formMiddleWare } from '../middlewares/formidableMW';

const router = express.Router();

// IMAGES
router.post('/upload-image', requireAuth, checkRoleMW('Instructor', 'Admin'), uploadImageToS3);
router.post('/remove-image', requireAuth, checkRoleMW('Instructor', 'Admin'), removeImageFromS3);
// VIDEOS
router.post(
  '/upload-video',
  requireAuth,
  checkRoleMW('Instructor', 'Admin'),
  formMiddleWare,
  uploadVideoToS3
);
router.post('/remove-video', requireAuth, checkRoleMW('Instructor', 'Admin'), removeVideoFromS3);
// COURSES
router.post('/', requireAuth, checkRoleMW('Instructor', 'Admin'), createCourse);
router.get('/:slug', requireAuth, checkRoleMW('Instructor', 'Admin'), getCourseBySlug);
router.post('/:slug/lessons', requireAuth, checkRoleMW('Instructor', 'Admin'), addLessonToCourse);

export default router;
