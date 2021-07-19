import { Request, Response } from 'express';
import mongoose from 'mongoose';
// eslint-disable-next-line import/no-extraneous-dependencies
import mongodb from 'mongodb';
import User from '../models/user';
import handleError from '../helpers/handleError';

const DUPLICATE_KEY = 11000;

async function createUser(req: Request, res: Response): Promise<void> {
  try {
    const { login, password } = req.body;
    const user = new User({ login, password });
    const doc = await User.create(user);

    res.status(200).json(doc);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      const { errors } = err;

      res.status(400).json({
        message: Object.keys(errors)
          .reduce<Array<string>>((arr, key) => {
            return arr.concat([errors[key].message]);
          }, [])
          .join('. '),
      });

      return;
    }

    if (err instanceof mongodb.MongoError && err.code === DUPLICATE_KEY) {
      res.status(400).json({ message: 'Login exists' });

      return;
    }

    handleError(err, req, res);
  }
}

async function readUser(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id ?? req.body.id;

    if (typeof id === 'string') {
      if (mongoose.Types.ObjectId.isValid(id)) {
        const doc = await User.findById(id).exec();

        if (doc === null) {
          res.status(404).json({ message: 'User is not found' });

          return;
        }

        res.status(200).json(doc);
      } else {
        res.status(400).json({ message: 'Id is not valid' });
      }
    } else {
      const docs = await User.find({});

      res.status(200).json(docs);
    }
  } catch (err) {
    handleError(err, req, res);
  }
}

async function updateUser(req: Request, res: Response): Promise<void> {
  try {
    const { id, password } = req.body;

    if (mongoose.Types.ObjectId.isValid(id)) {
      const doc = await User.findByIdAndUpdate(
        id,
        { password },
        { new: true, runValidators: true }
      );

      if (doc === null) {
        res.status(404).json({ message: 'User is not found' });

        return;
      }

      res.status(200).json(doc);
    } else {
      res.status(400).json({ message: 'Id is not valid' });
    }
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      const { errors } = err;

      res.status(400).json({
        message: Object.keys(errors)
          .reduce<Array<string>>((arr, key) => {
            return arr.concat([errors[key].message]);
          }, [])
          .join('. '),
      });

      return;
    }

    handleError(err, req, res);
  }
}

async function deleteUser(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id ?? req.body.id;

    if (mongoose.Types.ObjectId.isValid(id)) {
      const doc = await User.findByIdAndDelete(id);

      if (doc === null) {
        res.status(404).json({ message: 'User is not found' });

        return;
      }

      res.status(200).json(doc);
    } else {
      res.status(400).json({ message: 'Id is not valid' });
    }
  } catch (err) {
    handleError(err, req, res);
  }
}

export { readUser, createUser, deleteUser, updateUser };
