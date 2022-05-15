import mongoose from 'mongoose';
const { Schema } = mongoose;

export const RolesEnum = {
  Subscriber: 'Subscriber',
  Instructor: 'Instructor',
  Admin: 'Admin',
};

export interface IUser {
  name: string;
  email: string;
  password: string;
  picture?: string;
  role: string[];
  stripe_account_id?: string;
  stripe_seller?: Record<string, unknown>;
  stripeSession?: Record<string, unknown>;
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
    role: {
      type: [String],
      default: ['Subscriber'],
      enum: ['Subscriber', 'Instructor', 'Admin'],
    },
    stripe_account_id: '',
    stripe_seller: {},
    stripeSession: {},
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
