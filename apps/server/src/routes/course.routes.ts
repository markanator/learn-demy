import express from 'express';
import {
  createCourse,
  getCourseBySlug,
  updateCourse,
  uploadImageToS3,
  uploadVideoToS3,
  removeFromS3,
  addLessonToCourse,
  deleteLessonFromCourse,
} from '../controllers/course.controller';
import { requireAuth } from '../middlewares/checkAuth';
import { checkRoleMW } from '../middlewares/checkRoles';
import { formMiddleWare } from '../middlewares/formidableMW';

const router = express.Router();

// IMAGES
router.post('/upload-image', requireAuth, checkRoleMW('Instructor', 'Admin'), uploadImageToS3);
router.post('/remove-image', requireAuth, checkRoleMW('Instructor', 'Admin'), removeFromS3);
// VIDEOS
router.post(
  '/upload-video',
  requireAuth,
  checkRoleMW('Instructor', 'Admin'),
  formMiddleWare,
  uploadVideoToS3
);
router.post('/remove-video', requireAuth, checkRoleMW('Instructor', 'Admin'), removeFromS3);
// COURSES
router.get('/:slug', requireAuth, checkRoleMW('Instructor', 'Admin'), getCourseBySlug);
router.post('/', requireAuth, checkRoleMW('Instructor', 'Admin'), createCourse);
router.put('/:slug', requireAuth, checkRoleMW('Instructor', 'Admin'), updateCourse);

// LESSONS
router.post('/:slug/lessons', requireAuth, checkRoleMW('Instructor', 'Admin'), addLessonToCourse);
router.delete(
  '/:slug/lessons/:lessonId',
  requireAuth,
  checkRoleMW('Instructor', 'Admin'),
  deleteLessonFromCourse
);

export default router;
