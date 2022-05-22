import { NextFunction, Response } from 'express';
import { ReqWithUser } from '../app/types';
import User, { UserRole } from '../models/User';
import { intersection } from 'lodash';

export const checkRoleMW =
  (...roles: UserRole[]) =>
  async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
      const user = await User.findById(req.auth._id).exec();
      if (!user) {
        return res.status(401).send('User not found');
      }

      if (!roles.length) {
        console.log(" No roles specified, still inserting the authenticated user's roles");
        res.locals.userRoles = user.role;
        return next();
      }

      const isAdmin = user.role.includes('Admin');
      if (!intersection(user.role, roles).length && !isAdmin) {
        return res.status(403).send('Forbidden');
      }

      res.locals.userRoles = user.role;
      return next();
    } catch (error) {
      console.error(error);
      return res.status(500).send('Error. Try again.');
    }
  };
