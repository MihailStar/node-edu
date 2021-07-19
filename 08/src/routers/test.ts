import express from 'express';
import testController from '../controllers/test';

export default express.Router().get('/', testController);
