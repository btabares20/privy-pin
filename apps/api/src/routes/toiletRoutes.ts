import express from 'express';
import { getToilets, deleteToilet, updateToilet, getToilet, getNearbyToilets, createToiletBatch } from '../controllers/toiletController';

const router = express.Router();

router.get('/nearby', getNearbyToilets);
router.get('/', getToilets);

router.get('/:id', getToilet);
router.patch('/:id', updateToilet);
router.post('/', createToiletBatch);
router.delete('/:id', deleteToilet);

export default router;
