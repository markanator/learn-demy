import { ReqWithUser, ResWithUserRoles } from '../app/types';
import Course from '../models/Course';
import User from '../models/User';

export const getUserEnrolledCourses = async (req: ReqWithUser, res: ResWithUserRoles) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).exec();
    if (!user) {
      return res.status(404).send('User not found');
    }
    const isAdmin = res.locals.userRoles.includes('Admin');
    if (!isAdmin && user.id !== req.auth._id) {
      return res.status(403).send('Forbidden');
    }

    const enrolledCourses = await Course.find({ _id: { $in: user.courses } })
      .select('-lessons -description')
      .populate('instructor', '_id name picture bio')
      .exec();

    res.status(200).json(enrolledCourses);
  } catch (error) {
    console.error(error?.message);
    return res.status(500).send('Server Error.');
  }
};
