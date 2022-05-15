import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import { hashPassword, comparePassword } from '../utils/auth.utils';
import jwt from 'jsonwebtoken';
import { __prod__ } from '../utils/env.utils';
import SES from 'aws-sdk/clients/ses';
import { nanoid } from 'nanoid';

const awsConfig: SES.ClientConfiguration = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  apiVersion: process.env.AWS_API_VERSION,
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // validation
    if (!name) {
      return res.status(400).send('Name is required');
    }
    if (!password || password.length < 6) {
      return res
        .status(400)
        .send('Password is required and should be min 6 characters long');
    }
    const userExist = await User.findOne({ email }).exec();
    if (userExist) {
      return res.status(400).send('Email is taken');
    }

    // hash password
    const hashedPassword = await hashPassword(password);

    // register
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    return res.status(201).json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(400).send('Error. Try again.');
  }
};
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      return res.status(400).send('Missing fields. Try again.');
    }
    const userExist = await User.findOne({ email }).exec();
    if (!userExist) {
      return res.status(400).send('Email or password is incorrect.');
    }

    // check password
    const isValidPassword = await comparePassword(password, userExist.password);
    if (!isValidPassword) {
      return res.status(400).send('Email or password is incorrect');
    }

    // login
    const token = jwt.sign({ _id: userExist._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // return user and token, not password
    userExist.password = undefined;
    // send token as cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: __prod__,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });

    return res.status(200).json(userExist);
  } catch (err) {
    console.log(err);
    return res.status(400).send('Error. Try again.');
  }
};
export const logout = async (req: Request, res: Response) => {
  try {
    // send token as cookie
    res.clearCookie('token');

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(400).send('Error. Try again.');
  }
};

type ReqWithUser = Request & { auth: { _id: string } };
export const currentUser = async (req: ReqWithUser, res: Response) => {
  try {
    const user = await User.findById(req?.auth._id).select('-password').exec();
    if (!user) {
      return res.status(404).send('User not found');
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(400).send('Error. Try again.');
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).send('Email is required');
    }
    const shortCode = nanoid(8).toUpperCase();
    const dbUser = await User.findOneAndUpdate<IUser>(
      { email },
      {
        passwordResetCode: shortCode,
      }
    ).exec();

    if (!dbUser) {
      return res.status(404).send('User not found');
    }

    const params: SES.SendEmailRequest = {
      Source: process.env.SES_EMAIL_FROM,
      Destination: {
        ToAddresses: [dbUser.email],
      },
      ReplyToAddresses: [process.env.SES_EMAIL_FROM],
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: `
            <html>
              <h1>Password Reset Link</h1>
              <p>Please use the following code to reset your password</p>
              <h2 style="color:red;">${shortCode}</h2>
              <i>learnwind.com</i>
            </html>
            `,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: 'Password Reset Code',
        },
      },
    };

    const sesclient = new SES(awsConfig);

    await sesclient.sendEmail(params).promise();
    //  const emailSent = await sesclient.sendEmail(params).promise();
    // const sentRes = await emailSent.$response.data;

    console.log({ shortCode });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(400).send('Error. Try again.');
  }
};

export const resetPassword = async (req: ReqWithUser, res: Response) => {
  try {
    const { email, code, newPassword } = req.body;

    const hashedPassword = await hashPassword(newPassword);
    const updatedUser = await User.findOneAndUpdate<IUser>(
      { email, passwordResetCode: code },
      { password: hashedPassword, passwordResetCode: '' }
    ).exec();

    if (!updatedUser) {
      return res.status(400).send('User with email not found');
    }

    console.log('RESET PASSWORD');

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(400).send('Error. Try again.');
  }
};
