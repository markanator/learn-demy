import { NextFunction, Request, Response } from 'express';
import formidable from 'formidable';

export const formMiddleWare = (req: Request, res: Response, next: NextFunction) => {
  const form = formidable({});

  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    // eslint-disable-next-line
    // @ts-ignore
    req.fields = fields;
    // eslint-disable-next-line
    // @ts-ignore
    req.files = files;
    next();
  });
};
