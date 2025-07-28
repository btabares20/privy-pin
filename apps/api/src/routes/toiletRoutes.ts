import express from 'express';
import { getToilets, deleteToilet, updateToilet, getToilet, getNearbyToilets, createToiletBatch, createToilet } from '../controllers/toiletController';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     ToiletLocation:
 *       type: object
 *       required:
 *         - type
 *         - coordinates
 *       properties:
 *         type:
 *           type: string
 *           enum: [Point, Polygon]
 *           description: GeoJSON type
 *         coordinates:
 *           type: array
 *           items:
 *             type: number
 *           minItems: 2
 *           maxItems: 2
 *           description: Array of [longitude, latitude]
 *           example: [121.0244, 14.5547]
 *     
 *     Toilet:
 *       type: object
 *       required:
 *         - name
 *         - location
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier for the toilet
 *         name:
 *           type: string
 *           description: Name of the toilet
 *           example: "Mall of Asia Restroom"
 *         location:
 *           $ref: '#/components/schemas/ToiletLocation'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *     
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 */

/**
 * @swagger
 * /toilets/nearby:
 *   get:
 *     summary: Find nearby toilets
 *     description: Retrieve toilets within a specified distance from given coordinates
 *     tags: [Toilets]
 *     parameters:
 *       - in: query
 *         name: longitude
 *         required: true
 *         schema:
 *           type: number
 *         description: Longitude coordinate
 *         example: 121.0244
 *       - in: query
 *         name: latitude
 *         required: true
 *         schema:
 *           type: number
 *         description: Latitude coordinate
 *         example: 14.5547
 *       - in: query
 *         name: maxDistance
 *         required: false
 *         schema:
 *           type: number
 *         description: Maximum distance in meters (default varies by implementation)
 *         example: 1000
 *     responses:
 *       200:
 *         description: List of nearby toilets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Toilet'
 *       400:
 *         description: Missing required query parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "longitude and latitude query parameters are required"
 *       404:
 *         description: No nearby toilets found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "No nearby toilets found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/nearby', getNearbyToilets);

/**
 * @swagger
 * /toilets/batch:
 *   post:
 *     summary: Create multiple toilets
 *     description: Create multiple toilet records in a single request
 *     tags: [Toilets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               required:
 *                 - name
 *                 - location
 *               properties:
 *                 name:
 *                   type: string
 *                   description: Name of the toilet
 *                 location:
 *                   $ref: '#/components/schemas/ToiletLocation'
 *           example:
 *             - name: "SM Mall Restroom A"
 *               location:
 *                 type: "Point"
 *                 coordinates: [121.0244, 14.5547]
 *             - name: "SM Mall Restroom B"
 *               location:
 *                 type: "Point"
 *                 coordinates: [121.0250, 14.5550]
 *     responses:
 *       200:
 *         description: Successfully created toilets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Toilet'
 *       500:
 *         description: Error creating toilets
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Error creating toilet"
 */
router.post('/batch', createToiletBatch);

/**
 * @swagger
 * /toilets:
 *   get:
 *     summary: Get all toilets
 *     description: Retrieve a list of all toilet records
 *     tags: [Toilets]
 *     responses:
 *       200:
 *         description: List of all toilets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Toilet'
 *       404:
 *         description: No toilets found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "No toilets found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     summary: Create a new toilet
 *     description: Create a single toilet record
 *     tags: [Toilets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - location
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the toilet
 *               location:
 *                 $ref: '#/components/schemas/ToiletLocation'
 *           example:
 *             name: "Central Mall Restroom"
 *             location:
 *               type: "Point"
 *               coordinates: [121.0244, 14.5547]
 *     responses:
 *       200:
 *         description: Successfully created toilet
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Toilet'
 *       500:
 *         description: Error creating toilet
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Error creating toilet"
 */
router.get('/', getToilets);

/**
 * @swagger
 * /toilets/{id}:
 *   get:
 *     summary: Get toilet by ID
 *     description: Retrieve a specific toilet record by its ID
 *     tags: [Toilets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Toilet ID
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Toilet details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Toilet'
 *       404:
 *         description: Toilet not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "No toilet found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   patch:
 *     summary: Update toilet
 *     description: Update an existing toilet record
 *     tags: [Toilets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Toilet ID
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the toilet
 *               location:
 *                 $ref: '#/components/schemas/ToiletLocation'
 *           example:
 *             name: "Updated Mall Restroom"
 *             location:
 *               type: "Point"
 *               coordinates: [121.0250, 14.5550]
 *     responses:
 *       200:
 *         description: Successfully updated toilet
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Toilet'
 *       404:
 *         description: Toilet not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Toilet not found"
 *       500:
 *         description: Error updating toilet
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Delete toilet
 *     description: Delete a toilet record by its ID
 *     tags: [Toilets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Toilet ID
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       204:
 *         description: Successfully deleted toilet (no content)
 *       404:
 *         description: Toilet not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Toilet not found"
 *       500:
 *         description: Error deleting toilet
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Error deleting toilet"
 */
router.get('/:id', getToilet);
router.patch('/:id', updateToilet);
router.post('/', createToilet);
router.delete('/:id', deleteToilet);

export default router;
