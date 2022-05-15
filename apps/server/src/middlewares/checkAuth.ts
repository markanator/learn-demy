import { expressjwt } from 'express-jwt';

export const requireAuth = expressjwt({
  getToken: (req) => req.cookies.token,
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
}); // set req.user = { _id }
