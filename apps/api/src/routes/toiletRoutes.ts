import express from 'express';
import { getToilets, deleteToilet, updateToilet, getToilet, getNearbyToilets, createToiletBatch, createToilet } from '../controllers/toiletController';

const router = express.Router();

router.get('/nearby', getNearbyToilets);
router.post('/batch', createToiletBatch);
router.get('/', getToilets);

router.get('/:id', getToilet);
router.patch('/:id', updateToilet);
router.post('/', createToilet);
router.delete('/:id', deleteToilet);

export default router;
