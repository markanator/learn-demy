import { UserRole } from '../../models/User';
import type { Fields, Files } from 'formidable';

declare global {
  namespace Express {
    interface Request {
      /** Set by express-jwt middleware after token verification */
      auth?: { _id: string };
      /** Set by formidable middleware for multipart form data */
      fields?: Fields;
      /** Set by formidable middleware for file uploads */
      files?: Files;
    }

    interface Locals {
      /** Set by checkRoleMW after verifying the authenticated user's roles */
      userRoles: UserRole[];
    }
  }
}
