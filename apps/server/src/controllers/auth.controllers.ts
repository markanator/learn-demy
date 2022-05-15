import { Request, Response } from 'express';
import User from '../models/User';
import { hashPassword, comparePassword } from '../utils/auth.utils';
import jwt from 'jsonwebtoken';
import { __prod__ } from '../utils/env.utils';

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
      return res.status(400).send('Account with email not found.');
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
