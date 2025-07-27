import express from 'express';
import { createToilet, getToilets, deleteToilet, updateToilet, getToilet } from '../controllers/toiletController';

const router = express.Router();

router.get('/', getToilets);
router.get('/:id', getToilet);
router.patch('/:id', updateToilet);
router.post('/', createToilet);
router.delete('/:id', deleteToilet);

export default router;
