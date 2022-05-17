import type { Response } from 'express';
import type { File, ReqWithUser, ReqWithUserAndFormData } from '../app/types';
import slugify from 'slugify';
import S3 from 'aws-sdk/clients/s3';
import { nanoid } from 'nanoid';
import Course from '../models/Course';
import { readFileSync } from 'fs';

const awsConfig: S3.ClientConfiguration = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  apiVersion: process.env.AWS_API_VERSION,
};

const s3Client = new S3(awsConfig);

// ************************************************************************
// *************************** IMAGES *************************************
// ************************************************************************

export const uploadImageToS3 = async (req: ReqWithUser, res: Response) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).send('Image is required');
    }
    // prep image for upload
    // eslint-disable-next-line
    // @ts-ignore
    const base64Data = new Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    const type = image.split(';')[0].split('/')[1];

    const params: S3.PutObjectRequest = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${req.auth._id}_${nanoid()}.${type}`,
      Body: base64Data,
      // ACL: 'public-read', // TODO: limit access to only this website
      ContentEncoding: 'base64',
      ContentType: `image/${type}`,
    };

    s3Client.upload(params, (err, data) => {
      if (err) {
        console.warn('Error uploading image: ', err?.message);
        return res.status(500).send(err?.message);
      }
      return res.status(201).send(data);
      // prettier-ignore
    });
  } catch (error) {
    console.error(error?.message);
    return res.status(500).send('Error. Try again.');
  }
};

export const removeImageFromS3 = async (req: ReqWithUser, res: Response) => {
  try {
    const { Bucket, Key } = req.body;

    if (!Bucket || !Key) {
      return res.status(400).send('Bucket and Key is required');
    }
    const params: S3.DeleteObjectRequest = {
      Bucket,
      Key,
    };
    // send remove request to s3
    s3Client.deleteObject(params, (err) => {
      if (err) {
        console.warn('Error deleting image: ', err?.message);
        return res.status(500).send(err?.message);
      }
      return res.status(200).send({ ok: true });
    });
  } catch (error) {
    console.error(error?.message);
    return res.status(500).send('Error. Try again.');
  }
};

// ************************************************************************
// *************************** VIDEOS *************************************
// ************************************************************************
export const uploadVideoToS3 = async (req: ReqWithUserAndFormData, res: Response) => {
  try {
    const { video } = req.files;

    if (!video) {
      return res.status(400).send('Video is required');
    }
    const type = (video as File).mimetype.split('/')[1];
    const videoParams: S3.PutObjectRequest = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${req.auth._id}_${nanoid()}.${type}`,
      Body: readFileSync((video as File).filepath),
      // ACL: 'public-read', // TODO: limit access to only this website
      ContentEncoding: (video as File).mimetype,
    };
    // upload video to s3
    s3Client.upload(videoParams, (err, data) => {
      if (err) {
        console.warn('Error uploading video: ', err?.message);
        return res.status(500).send(err?.message);
      }
      return res.status(201).send(data);
      // prettier-ignore
    });
  } catch (error) {
    console.error(error?.message);
    return res.status(500).send('Error. Try again.');
  }
};
export const removeVideoFromS3 = async (req: ReqWithUser, res: Response) => {
  try {
    const { Bucket, Key } = req.body;

    if (!Bucket || !Key) {
      return res.status(400).send('Bucket and Key is required');
    }
    const params: S3.DeleteObjectRequest = {
      Bucket,
      Key,
    };
    // send remove request to s3
    s3Client.deleteObject(params, (err) => {
      if (err) {
        console.warn('Error deleting VIDEO: ', err?.message);
        return res.status(500).send(err?.message);
      }
      return res.status(200).send({ ok: true });
    });
  } catch (error) {
    console.error(error?.message);
    return res.status(500).send('Error. Try again.');
  }
};

// ************************************************************************
// *************************** Courses ************************************
// ************************************************************************

export const createCourse = async (req: ReqWithUser, res: Response) => {
  try {
    const { name, description, paid, price, category, image } = req.body;
    if (!name || !description || !paid) {
      return res.status(400).send('Name, description and price are required');
    }
    const slug = slugify(name.toLowerCase());
    const alreadyExists = await Course.findOne({
      slug,
    });
    if (alreadyExists) {
      return res.status(400).send('Course already exists');
    }

    const course = await new Course({
      name,
      slug,
      instructor: req.auth._id,
      description: description || '',
      paid: paid === 'true',
      price: paid === 'true' ? parseFloat(price) : 0,
      category: category || '',
      image,
    }).save();

    return res.status(201).send({ ok: true, course });
  } catch (error) {
    console.error(error?.message);
    return res.status(500).send('Error. Try again.');
  }
};

export const getCourseBySlug = async (req: ReqWithUser, res: Response) => {
  try {
    const course = await Course.findOne({
      slug: req.params.slug,
    })
      .populate('instructor', '_id name')
      .exec();

    if (!course) {
      return res.status(404).send('Course not found');
    }

    return res.status(200).json(course);
  } catch (error) {
    console.error(error?.message);
    return res.status(500).send('Error. Try again.');
  }
};
