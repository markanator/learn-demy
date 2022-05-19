import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from 'dotenv';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import compression from 'compression';
// LOCAL IMPORTS
import AuthRoutes from '../routes/auth.routes';
import InstructorRoutes from '../routes/Instructor.routes';
import CourseRoutes from '../routes/course.routes';
import { __prod__ } from '../utils/env.utils';
import { developmentErrors, errorHandler, notFoundHandler } from '../utils/routeErrorChecks';

config();

const csrfProtection = csrf({ cookie: true });
const app = express();
// MW
app.use(
  cors({
    credentials: true,
    origin: process.env.CORS_ORIGIN,
  })
);
app.use(helmet());
app.use(cookieParser());
app.use(express.json({ limit: '2mb' }));
app.use(compression());
if (!__prod__) {
  app.use(morgan('dev'));
}
// routes
app.get('/', (_, res) => res.send('Server up!'));
app.use('/auth', AuthRoutes);
app.use('/instructors', InstructorRoutes);
app.use('/courses', CourseRoutes);

app.use(csrfProtection);
app.get('/csrf-token', (req, res) =>
  res.json({
    csrfToken: req.csrfToken(),
  })
);

// 404
app.use(notFoundHandler);
// error handler
if (!__prod__) {
  app.use(developmentErrors);
} else {
  app.use(errorHandler);
}

export default app;
