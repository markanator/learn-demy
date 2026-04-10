import { Schema } from 'mongoose';
const { ObjectId } = Schema.Types;

export type Lesson = {
  title: string;
  slug: string;
  content: string;
  video: Record<string, unknown>;
  free_preview: boolean;
  sortOrder: number;
};

export type Course = {
  name: string;
  slug: string;
  description: string;
  price: number;
  image: Record<string, unknown>;
  category: string;
  published: boolean;
  paid: boolean;
  instructor: typeof ObjectId;
  lessons: Lesson[];
};
