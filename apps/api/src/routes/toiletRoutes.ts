import express from 'express';
import { getToilets } from '../controllers/toiletController';

const router = express.Router();

router.get('/', getToilets);

export default router;
