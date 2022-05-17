import { Request } from 'express';
import { Schema } from 'mongoose';
const { ObjectId } = Schema.Types;

export type ReqWithUser = Request & { auth: { _id: string } };

export type Lesson = {
  title: string;
  slug: string;
  content: Record<string, unknown>;
  video_link: Record<string, unknown>;
  free_preview: boolean;
};

export type Course = {
  name: string;
  slug: string;
  description: Record<string, unknown>;
  price: number;
  image: Record<string, unknown>;
  category: string;
  published: boolean;
  paid: boolean;
  instructor: typeof ObjectId;
  lessons: Lesson[];
};
