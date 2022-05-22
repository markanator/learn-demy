import mongoose from 'mongoose';
const { Schema } = mongoose;

export const RolesEnum = {
  Subscriber: 'Subscriber',
  Instructor: 'Instructor',
  Admin: 'Admin',
};

export type UserRole = 'Subscriber' | 'Instructor' | 'Admin';

export interface IUser {
  name: string;
  email: string;
  password: string;
  picture?: string;
  bio?: string;
  role: UserRole[];
  stripe_account_id?: string;
  stripe_seller?: Record<string, unknown>;
  stripeSession?: Record<string, unknown>;
  passwordResetCode?: string;
  courses?: string[];
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 64,
    },
    picture: {
      type: String,
      default: '/avatar.png',
    },
    bio: {
      type: String,
      default: '/avatar.png',
      maxlength: 256,
      minlength: 100,
    },
    role: {
      type: [String],
      default: ['Subscriber'],
      enum: ['Subscriber', 'Instructor', 'Admin'],
    },
    courses: [{ type: String }],
    stripe_account_id: '',
    stripe_seller: {},
    stripeSession: {},
    passwordResetCode: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
