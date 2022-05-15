import { Request, Response } from 'express';
import User from '../models/User';
import { hashPassword } from '../utils/auth.utils';

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
