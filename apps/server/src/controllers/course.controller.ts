import { Response, Request } from 'express';
import type { File as FormidableFile } from 'formidable';
import slugify from 'slugify';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { nanoid } from 'nanoid';
import Course from '../models/Course';
import { readFileSync } from 'fs';
import User, { IUser } from '../models/User';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.Stripe_SECRET_KEY!);

const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  region: process.env.AWS_REGION,
});

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
    res.status(500).json({ message: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export const getPublishedCourse = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const course = await Course.findOne({ slug, published: true })
      .populate('instructor', '_id name picture bio')
      .exec();
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export const userPurchaseCourse = async (req: Request, res: Response) => {
  try {
    // ensure the course is paid
    const course = await Course.findById(req.params.courseId).populate('instructor').exec();
    if (!course) {
      return res.status(404).send('Course not found');
    }
    if (!course?.paid) {
      return res.status(400).send('Course is not paid');
    }
    const user = await User.findById(req.auth!._id).exec();
    if (!user) {
      return res.status(404).send('User not found');
    }

    const feeToInstructor = Math.round((course.price * 100 * 0.3) / 100);
    // create stripe session
    const courseImage = course?.image?.Location ? [course?.image?.Location as string] : [];
    const session = await stripe.checkout.sessions.create({
      // payment setup
      payment_method_types: ['card'],
      mode: 'payment',
      // we can also map through the cart items
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: course.name,
              images: courseImage,
            },
            unit_amount: Math.round(course.price * 100),
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        // platform fee
        application_fee_amount: Math.round(feeToInstructor * 100),
        transfer_data: {
          // final payout
          destination: (course.instructor as unknown as IUser).stripe_account_id!,
        },
      },
      customer_email: user.email,
      success_url: `${process.env.STRIPE_SUCCESS_URL}/${course?.id}`,
      cancel_url: process.env.STRIPE_CANCEL_URL!,
    });

    await User.findByIdAndUpdate(req.auth!._id, {
      stripeSession: session,
    });

    return res.status(200).send(session.url);
  } catch (error) {
    console.warn(error instanceof Error ? error.message : error);
    res.status(500).json({ message: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export const userFreeEnrollToCourse = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).exec();
    if (!course) {
      return res.status(404).send('Course not found');
    }
    if (course?.paid) {
      return res.status(400).send('You must purchase the course to enroll');
    }

    // update the user
    await User.findByIdAndUpdate(
      req.auth!._id,
      {
        $addToSet: { courses: course._id },
      },
      { new: true },
    ).exec();

    res.status(200).json({ message: 'User enrolled to course' });
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export const verifySuccessfulPurchase = async (req: Request, res: Response) => {
  try {
    // check with stripe if the payment was successful
    const { courseId } = req.params;
    const course = await Course.findById(courseId).exec();
    if (!course) {
      return res.status(404).send('Course not found');
    }
    // get user from db to get stripe sessionId
    const user = await User.findById(req.auth!._id).exec();
    if (!user?.stripeSession) {
      return res.sendStatus(400);
    }
    // get stripe sessions
    const session = await stripe.checkout.sessions.retrieve(user.stripeSession.id as string);

    if (session.payment_status !== 'paid') {
      return res.sendStatus(400);
    }
    await User.findByIdAndUpdate(
      req.auth!._id,
      {
        $addToSet: { courses: course._id },
        $set: { stripeSession: {} },
      },
      { new: true },
    ).exec();

    res.status(200).json({ slug: course.slug, ok: true });
  } catch (error) {
    console.warn(error instanceof Error ? error.message : error);
    res.status(500).json({ message: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export const checkCourseEnrollment = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const user = await User.findById(req.auth!._id).exec();
    let isEnrolled = false;
    for (let i = 0; i < (user?.courses?.length ?? 0); i++) {
      if (user?.courses?.includes(courseId as string)) {
        isEnrolled = true;
        break;
      }
    }

    res.status(200).json(!!isEnrolled);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// ************************************************************************
// *************************** S3 *************************************
// ************************************************************************

export const uploadImageToS3 = async (req: Request, res: Response) => {
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

    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${req.auth!._id}_${nanoid()}.${type}`,
        Body: base64Data,
        ContentEncoding: 'base64',
        ContentType: `image/${type}`,
      },
    });

    const data = await upload.done();
    return res.status(201).send(data);
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    return res.status(500).send('Error. Try again.');
  }
};

export const uploadVideoToS3 = async (req: Request, res: Response) => {
  try {
    const videoFiles = req.files?.file;
    if (!videoFiles) {
      return res.status(400).send('Video is required');
    }
    const video = (Array.isArray(videoFiles) ? videoFiles[0] : videoFiles) as FormidableFile;
    const type = video.mimetype?.split('/')[1];

    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${req.auth!._id}_${nanoid()}.${type}`,
        Body: readFileSync(video.filepath),
        ContentType: video.mimetype ?? undefined,
      },
    });

    const data = await upload.done();
    return res.status(201).send(data);
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    return res.status(500).send('Error. Try again.');
  }
};

export const removeFromS3 = async (req: Request, res: Response) => {
  try {
    const { Bucket, Key } = req.body;

    if (!Bucket || !Key) {
      return res.status(400).send('Bucket and Key is required');
    }
    await s3Client.send(new DeleteObjectCommand({ Bucket, Key }));
    return res.status(200).send({ ok: true });
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    return res.status(500).send('Error. Try again.');
  }
};

// ************************************************************************
// *************************** Courses ************************************
// ************************************************************************

export const createCourse = async (req: Request, res: Response) => {
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
      instructor: req.auth!._id,
      description: description || '',
      paid: paid === 'true',
      price: paid === 'true' ? parseFloat(price) : 0,
      category: category || '',
      image,
    }).save();

    return res.status(201).send({ ok: true, course });
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    return res.status(500).send('Error. Try again.');
  }
};

export const updateCourse = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const isAdmin = res.locals.userRoles.includes('Admin');
    const filterParams = isAdmin ? { slug } : { slug, instructor: req.auth!._id };
    const alreadyExists = await Course.findOne(filterParams as Record<string, unknown>).exec();
    if (!alreadyExists) {
      return res.status(400).send('Course does not exist');
    }
    // check resource owner
    if (!isAdmin && alreadyExists.instructor.toString() !== req.auth!._id.toString()) {
      return res.status(403).send('You are not authorized to view this course');
    }

    const { name, description, paid, price, image } = req.body;
    if (!name || !description || (paid && !price)) {
      return res.status(400).send('Name, description and price are required');
    }

    const course = await Course.findOneAndUpdate(
      filterParams as Record<string, unknown>,
      {
        ...req.body,
        paid: paid === 'true',
        price: paid === 'true' ? parseFloat(price) : 0,
        image: image ?? null,
      },
      {
        new: true,
        // TODO: figure out lessons sort order sorting
      },
    ).exec();

    return res.status(201).send({ ok: true, course });
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    return res.status(500).send('Error. Try again.');
  }
};

export const getCourseBySlug = async (req: Request, res: Response) => {
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
      (course.instructor as unknown as { _id: string; name: string })._id.toString() !== req.auth!._id.toString()
    ) {
      return res.status(403).send('You are not authorized to view this course');
    }

    return res.status(200).json(course);
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    return res.status(500).send('Error. Try again.');
  }
};

export const toggleCoursePublished = async (req: Request, res: Response) => {
  try {
    const { courseId, toggleValue } = req.params;

    const isAdmin = res.locals.userRoles.includes('Admin');
    const course = await Course.findById(courseId).exec();
    if (!course) {
      return res.status(400).send('Course does not exist');
    }

    // check if resourceOwner is the same as the authenticated user
    if (!isAdmin && course.instructor.toString() !== req.auth!._id.toString()) {
      return res.status(403).send('You are not authorized to view this course');
    }

    const published = toggleValue === 'true';
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { published },
      {
        new: true,
      },
    );

    return res.status(200).send(updatedCourse);
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    return res.status(500).send('Error. Try again.');
  }
};

// ************************************************************************
// *************************** Lessons ************************************
// ************************************************************************

export const addLessonToCourse = async (req: Request, res: Response) => {
  try {
    const instructorId = req.auth!._id;
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

    const updatedCourse = await Course.findOneAndUpdate(
      { slug },
      {
        $push: { lessons: { title, content, video, slug: slugify(title) } },
      },
      {
        new: true,
      },
    )
      .populate('instructor', '_id name')
      .exec();

    res.status(201).json(updatedCourse);
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    return res.status(500).send('Error, add lesson failed. Try again.');
  }
};

export const updateLessonInCourse = async (req: Request, res: Response) => {
  try {
    const instructorId = req.auth!._id;
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

    await Course.updateOne(
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
    ).exec();

    const updated = await Course.findOne({ slug }).populate('instructor', '_id name').exec();

    res.status(200).json({ ok: true, course: updated });
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    return res.status(500).send('Error, add lesson failed. Try again.');
  }
};

export const deleteLessonFromCourse = async (req: Request, res: Response) => {
  try {
    const isAdmin = res.locals.userRoles.includes('Admin');
    const { slug, lessonId } = req.params;

    const filterParams = isAdmin ? { slug } : { slug, instructor: req.auth!._id };
    const course = await Course.findOne(filterParams as Record<string, unknown>)
      .populate('instructor', '_id')
      .exec();

    if (!course) {
      return res.status(404).send('Course not found');
    } else if (
      !isAdmin &&
      (course.instructor as unknown as { _id: string })._id.toString() !== req.auth!._id.toString()
    ) {
      return res.status(403).send('You are not authorized to perform this action.');
    }

    await Course.findOneAndUpdate(filterParams as Record<string, unknown>, {
      $pull: { lessons: { _id: lessonId } },
    }).exec();

    return res.status(200).send({ ok: true });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error, delete lesson failed. Try again.');
  }
};
