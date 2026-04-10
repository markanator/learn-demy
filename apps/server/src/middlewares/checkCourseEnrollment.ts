import { NextFunction, Request, Response } from 'express';
import Course from '../models/Course';
import User from '../models/User';

export const checkEnrollemntMW = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.auth!._id).exec();
    if (!user) {
      return res.status(404).send('User not found');
    }
    const { slug } = req.params;
    const course = await Course.findOne({ slug }).select('-lessons -image -description').exec();
    if (!course) {
      return res.status(404).send('Course not found');
    }

    let isEnrolled = false;
    for (let i = 0; i < (user.courses?.length ?? 0); i++) {
      if (user.courses?.includes(course.id)) {
        isEnrolled = true;
        break;
      }
    }

    if (!isEnrolled) {
      return res.status(403).send('Forbidden');
    }

    next();
  } catch (error) {
    console.error(' Error in checkEnrollemntMW', error instanceof Error ? error.message : error);
    return res.status(500).send('Server Error');
  }
};
