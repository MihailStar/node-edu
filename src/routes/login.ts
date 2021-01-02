import express from 'express';
import loginController from '../controllers/login';

const route = express.Router();

// agnostic
route.all('/', loginController);

export default route;
