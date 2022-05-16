/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from 'dotenv';
import mongoose from 'mongoose';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
// LOCAL IMPORTS
import AuthRoutes from './routes/auth';
import InstructorRoutes from './routes/Instructor.routes';

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
app.use(cookieParser());
app.use(express.json());
app.use(morgan('dev'));

// MONGOOSE
mongoose
  .connect(process.env.DB_URL, {})
  .then(() => console.log('DB connected'))
  .catch((err) => console.log('DB Error => ', err));

// routes
app.get('/', (_, res) => res.send('Server up!'));
app.use('/auth', AuthRoutes);
app.use('/instructors', InstructorRoutes);

app.use(csrfProtection);
app.get('/csrf-token', (req, res) =>
  res.json({
    csrfToken: req.csrfToken(),
  })
);

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
server.on('error', console.error);
