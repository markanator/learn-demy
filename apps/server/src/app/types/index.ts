import { Request, Response } from 'express';
import { Schema } from 'mongoose';
const { ObjectId } = Schema.Types;
import type { Fields, Files, File as FFile } from 'node_modules/@types/formidable';
import { UserRole } from '../../models/User';

export type ReqWithUser = Request & { auth: { _id: string } };
export type ReqWithUserAndFormData = ReqWithUser & { fields: Fields; files: Files };

export type ResWithUserRoles = Response & { locals: { userRoles: UserRole[] } };

export type File = FFile;

export type Lesson = {
  title: string;
  slug: string;
  content: string;
  video: Record<string, unknown>;
  free_preview: boolean;
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
