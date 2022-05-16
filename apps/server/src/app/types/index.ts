import { Request } from 'express';

export type ReqWithUser = Request & { auth: { _id: string } };
