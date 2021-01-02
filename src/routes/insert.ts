import express from 'express';
import insertController from '../controllers/insert';

const route = express.Router();
const parseUrlEncodedBody = express.urlencoded({ extended: false });

route.post('/', parseUrlEncodedBody, insertController);

export default route;
