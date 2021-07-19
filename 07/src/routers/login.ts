import express from 'express';
import loginController from '../controllers/login';

const router = express.Router();

router.all('/', loginController);

export default router;
