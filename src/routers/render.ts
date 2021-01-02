import express from 'express';
import renderController from '../controllers/render';

const route = express.Router();

route.post('/', express.json(), renderController);

export default route;
