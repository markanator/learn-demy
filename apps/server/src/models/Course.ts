import mongoose from 'mongoose';
import { Course, Lesson } from '../app/types';

const { ObjectId } = mongoose.Schema.Types;

const lessonSchema = new mongoose.Schema<Lesson>(
  {
    title: {
      type: String,
      trim: true,
      minlength: 3,
      maxlength: 320,
      required: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
      required: true,
    },
    content: {
      type: String,
      minlength: 200,
    },
    video: {},
    free_preview: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const courseSchema = new mongoose.Schema<Course>(
  {
    name: {
      type: String,
      trim: true,
      minlength: 3,
      maxlength: 320,
      required: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    description: {
      type: String,
      minlength: 20,
      required: true,
    },
    price: {
      type: Number,
      default: 9.99,
    },
    image: {},
    category: String,
    published: {
      type: Boolean,
      default: false,
    },
    paid: {
      type: Boolean,
      default: true,
    },
    instructor: {
      type: ObjectId,
      ref: 'User',
      required: true,
    },
    lessons: [lessonSchema],
  },
  { timestamps: true }
);

export default mongoose.model('Course', courseSchema);
