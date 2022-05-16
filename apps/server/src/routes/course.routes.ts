import express from 'express';
import { uploadImageToS3 } from '../controllers/course.controller';
import { requireAuth } from '../middlewares/checkAuth';

const router = express.Router();

router.post('/upload-image', requireAuth, uploadImageToS3);

export default router;
