import express from 'express';
import loginController from '../controllers/login';

export default express.Router().get('/', loginController);
