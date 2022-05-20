import type { Response, Request } from 'express';
import type { Course as TCourse, File, ReqWithUser, ReqWithUserAndFormData, ResWithUserRoles } from '../app/types';
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
// *************************** PUBLIC *************************************
// ************************************************************************

export const getPublishedCourseList = async (req: Request, res: Response) => {
  try {
    const courses = await Course.find({ published: true })
      .populate('instructor', '_id name picture')
      .sort({ createdAt: -1 });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ************************************************************************
// *************************** S3 *************************************
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

export const uploadVideoToS3 = async (req: ReqWithUserAndFormData, res: ResWithUserRoles) => {
  try {
    const { file: video } = req.files;
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

export const removeFromS3 = async (req: ReqWithUser, res: Response) => {
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
// *************************** Courses ************************************
// ************************************************************************

export const createCourse = async (req: ReqWithUser, res: ResWithUserRoles) => {
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

export const updateCourse = async (req: ReqWithUser, res: ResWithUserRoles) => {
  try {
    const { slug } = req.params;
    const isAdmin = res.locals.userRoles.includes('Admin');
    const filterParams = isAdmin ? { slug } : { slug, instructor: req.auth._id };
    const alreadyExists = await Course.findOne(filterParams).exec();
    if (!alreadyExists) {
      return res.status(400).send('Course does not exist');
    }
    // check resource owner
    if (!isAdmin && alreadyExists.instructor.toString() !== req.auth._id.toString()) {
      return res.status(403).send('You are not authorized to view this course');
    }

    const { name, description, paid, price, image } = req.body;
    if (!name || !description || (paid && !price)) {
      return res.status(400).send('Name, description and price are required');
    }

    const course = await Course.findOneAndUpdate(
      filterParams,
      {
        ...req.body,
        paid: paid === 'true',
        price: paid === 'true' ? parseFloat(price) : 0,
        image: image ?? null,
      },
      {
        new: true,
        // TODO: figure out lessons sort order sorting
      }
    ).exec();

    return res.status(201).send({ ok: true, course });
  } catch (error) {
    console.error(error?.message);
    return res.status(500).send('Error. Try again.');
  }
};

export const getCourseBySlug = async (req: ReqWithUser, res: ResWithUserRoles) => {
  try {
    const course = await Course.findOne({
      slug: req.params.slug,
    })
      .populate('instructor', '_id name')
      .exec();

    if (!course) {
      return res.status(404).send('Course not found');
    }
    // check if resourceOwner is the same as the authenticated user
    if (
      !res.locals.userRoles.includes('Admin') &&
      (course.instructor as unknown as { _id: string; name: string })._id.toString() !== req.auth._id.toString()
    ) {
      return res.status(403).send('You are not authorized to view this course');
    }

    return res.status(200).json(course);
  } catch (error) {
    console.error(error?.message);
    return res.status(500).send('Error. Try again.');
  }
};

export const toggleCoursePublished = async (req: ReqWithUser, res: ResWithUserRoles) => {
  try {
    const { courseId, toggleValue } = req.params;

    const isAdmin = res.locals.userRoles.includes('Admin');
    const course = await Course.findById<TCourse>(courseId).exec();
    if (!course) {
      return res.status(400).send('Course does not exist');
    }

    // check if resourceOwner is the same as the authenticated user
    if (!isAdmin && course.instructor.toString() !== req.auth._id.toString()) {
      return res.status(403).send('You are not authorized to view this course');
    }

    const published = toggleValue === 'true';
    console.log({ published });
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { published },
      {
        new: true,
      }
    );

    return res.status(200).send(updatedCourse);
  } catch (error) {
    console.error(error?.message);
    return res.status(500).send('Error. Try again.');
  }
};

// ************************************************************************
// *************************** Lessons ************************************
// ************************************************************************

export const addLessonToCourse = async (req: ReqWithUser, res: ResWithUserRoles) => {
  try {
    const instructorId = req.auth._id;
    const { slug } = req.params;
    const { title, content, video } = req.body;
    if (!title) {
      return res.status(400).send('Missing fields is required');
    }

    const course = await Course.findOne({ slug }).populate('instructor', '_id').exec();
    if (!course) {
      return res.status(404).send('Course not found');
    }
    // role check, needs to be Admin or course.instructor owner
    if (
      !res.locals.userRoles.includes('Admin') &&
      (course.instructor as unknown as { _id: string })._id.toString() !== instructorId.toString()
    ) {
      return res.status(403).send('You are not authorized to add lessons to this course');
    }

    const updatedCourse = await Course.findOneAndUpdate<TCourse>(
      { slug },
      {
        $push: { lessons: { title, content, video, slug: slugify(title) } },
      },
      {
        new: true,
      }
    )
      .populate('instructor', '_id name')
      .exec();

    res.status(201).json(updatedCourse);
  } catch (error) {
    console.error(error?.message);
    return res.status(500).send('Error, add lesson failed. Try again.');
  }
};

export const updateLessonInCourse = async (req: ReqWithUser, res: ResWithUserRoles) => {
  try {
    const instructorId = req.auth._id;
    const { slug, lessonId } = req.params;
    const { title } = req.body;
    if (!title) {
      return res.status(400).send('Missing fields is required');
    }

    const course = await Course.findOne({ slug }).populate('instructor', '_id').exec();
    if (!course) {
      return res.status(404).send('Course not found');
    }
    // role check, needs to be Admin or course.instructor owner
    if (
      !res.locals.userRoles.includes('Admin') &&
      (course.instructor as unknown as { _id: string })._id.toString() !== instructorId.toString()
    ) {
      return res.status(403).send('You are not authorized to add lessons to this course');
    }

    await Course.updateOne<TCourse>(
      { 'lessons._id': lessonId }, // find course by lesson.id
      {
        $set: {
          'lessons.$.content': req.body.content,
          'lessons.$.free_preview': req.body.free_preview,
          'lessons.$.title': req.body.title,
          'lessons.$.sortOrder': req.body.sortOrder,
          'lessons.$.video': req.body.video,
        },
      },
      {
        new: true,
      }
    )
      .populate('instructor', '_id name')
      .exec();

    const updated = await Course.findOne({ slug }).populate('instructor', '_id name').exec();

    res.status(200).json({ ok: true, course: updated });
  } catch (error) {
    console.error(error?.message);
    return res.status(500).send('Error, add lesson failed. Try again.');
  }
};

export const deleteLessonFromCourse = async (req: ReqWithUser, res: ResWithUserRoles) => {
  try {
    const isAdmin = res.locals.userRoles.includes('Admin');
    const { slug, lessonId } = req.params;

    const filterParams = isAdmin ? { slug } : { slug, instructor: req.auth._id };
    const course = await Course.findOne(filterParams).populate('instructor', '_id').exec();

    if (!course) {
      return res.status(404).send('Course not found');
    } else if (
      !isAdmin &&
      (course?.instructor as unknown as { _id: string })._id.toString() !== req.auth._id.toString()
    ) {
      return res.status(403).send('You are not authorized to perform this action.');
    }

    await Course.findOneAndUpdate(filterParams, {
      $pull: { lessons: { _id: lessonId } },
    }).exec();

    return res.status(200).send({ ok: true });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error, delete lesson failed. Try again.');
  }
};
