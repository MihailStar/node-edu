import express from 'express';
import { getPosts, getPost } from '../controllers/wp';

const router = express.Router();

router.get('/', getPosts);
router.get('/:id', getPost);

export default router;
