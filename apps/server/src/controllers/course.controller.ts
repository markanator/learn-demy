import type { Response } from 'express';
import type { ReqWithUser } from '../app/types';
import S3 from 'aws-sdk/clients/s3';
import { nanoid } from 'nanoid';

const awsConfig: S3.ClientConfiguration = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  apiVersion: process.env.AWS_API_VERSION,
};

const s3Client = new S3(awsConfig);

export const uploadImageToS3 = async (req: ReqWithUser, res: Response) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).send('Image is required');
    }
    // prep image for upload
    // eslint-disable-next-line
    // @ts-ignore
    const base64Data = new Buffer.from(
      image.replace(/^data:image\/\w+;base64,/, ''),
      'base64'
    );
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
        console.log('Error uploading image: ', err?.message);
        return res.status(500).send(err?.message);
      }
      console.log('S3 DATA', data);
      return res.status(201).send(data);
    });
  } catch (error) {
    console.error(error?.message);
    return res.status(500).send('Error. Try again.');
  }
};

export const removeImageFromS3 = async (req: ReqWithUser, res: Response) => {
  try {
    console.log(req.body);
    const { Bucket, Key } = req.body;

    if (!Bucket || !Key) {
      return res.status(400).send('Bucket and Key is required');
    }
    const params: S3.DeleteObjectRequest = {
      Bucket,
      Key,
    };
    // send remove request to s3
    s3Client.deleteObject(params, (err, data) => {
      if (err) {
        console.log('Error deleting image: ', err?.message);
        return res.status(500).send(err?.message);
      }
      console.log('S3 DATA', data);
      return res.status(200).send({ ok: true });
    });
  } catch (error) {
    console.error(error?.message);
    return res.status(500).send('Error. Try again.');
  }
};
