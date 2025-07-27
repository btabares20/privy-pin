import express from 'express';
import { createToilet, getToilets, deleteToilet } from '../controllers/toiletController';

const router = express.Router();

router.get('/', getToilets);
router.post('/', createToilet);
router.delete('/:id', deleteToilet);

export default router;
