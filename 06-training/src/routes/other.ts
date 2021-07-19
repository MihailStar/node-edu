import express from 'express';
import handleOther from '../controllers/other';

const router = express.Router();

router.use(handleOther);

export default router;
