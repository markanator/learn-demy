import { Response } from 'express';
import type { ReqWithUser } from '../app/types';
import User from '../models/User';
import { config } from 'dotenv';
import Stripe from 'stripe';
import qs from 'query-string';

config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
});

export const applyForInstructor = async (req: ReqWithUser, res: Response) => {
  try {
    // find user
    const user = await User.findById(req.auth._id).exec();
    if (!user) {
      return res.status(404).send('User not found');
    }
    // if user doesnt have a stripe account, create one in DB
    if (!user.stripe_account_id) {
      const account = await stripe.accounts.create({ type: 'express' });
      console.log('stripe account', account.id);
      user.stripe_account_id = account.id;
      await user.save();
    }
    // create account link based on stripe account id, UI will complete the onboarding process
    let accountLink = await stripe.accountLinks.create({
      account: user.stripe_account_id,
      refresh_url: process.env.STRIPE_REDIRECT_URL,
      return_url: process.env.STRIPE_REDIRECT_URL,
      type: 'account_onboarding',
    });
    console.log({ accountLink });
    // pre-fill the stripe form such as email, send URL to UI
    accountLink = Object.assign(accountLink, {
      'stripe_user[email]': user.email,
    });

    console.log({ accountLink });
    // send account lnk to UI as json
    console.log({ accountLink });
    const url = `${accountLink.url}?${qs.stringify(accountLink)}`;

    res.status(200).json({ ok: true, url });
  } catch (error) {
    console.log(error?.message);
    res.status(400).send('An error occured');
  }
};

export const getAccountStatus = async (req: ReqWithUser, res: Response) => {
  try {
    // find user
    const user = await User.findById(req.auth._id).exec();
    if (!user) {
      return res.status(404).send('User not found');
    }
    const stripeAccount = await stripe.accounts.retrieve(
      user.stripe_account_id
    );

    if (!stripeAccount.charges_enabled) {
      return res.status(401).send('Not authorized');
    }

    const sellerUpdatedUser = await User.findByIdAndUpdate(
      user.id,
      {
        stripe_seller: stripeAccount,
        $addToSet: {
          role: 'Instructor',
        },
      },
      { new: true }
    )
      .select('-password -passwordResetCode')
      .exec();
    // sellerUpdatedUser.password = undefined;
    console.log({ dbSeller: sellerUpdatedUser.stripe_seller });

    res.status(200).json(sellerUpdatedUser);
  } catch (error) {
    console.log(error?.message);
    res.status(400).send('An error occured');
  }
};

export const currentInstructor = async (req: ReqWithUser, res: Response) => {
  try {
    const user = await User.findById(req.auth._id).select('-password').exec();
    if (!user) {
      return res.status(404).send('User not found');
    } else if (!user?.role.includes('Instructor')) {
      return res.status(403).send('Not Authorized.');
    }
    res.status(200).json({ ok: true });
  } catch (error) {
    console.log(error?.message);
    res.status(400).send('An error occured');
  }
};
