import express from 'express';
import cors from 'cors';
import {
  createUser,
  readUser,
  updateUser,
  deleteUser,
} from '../controllers/user';

const router = express.Router();

router
  .use(cors())
  .use(express.json())
  .post('/', createUser)
  .get(['/', '/:id/'], readUser)
  .patch('/', updateUser)
  .delete(['/', '/:id/'], deleteUser)
  .use((req, res, next) => next());

export default router;
