/**
 * @swagger
 * tags:
 *   name: LoShuGrid
 *   description: Operations related to Lo Shu Grid analysis
 */

/**
 * @swagger
 * /numerology/numerology-loshuGrid/create:
 *   post:
 *     summary: Create a new Lo Shu Grid analysis
 *     tags: [LoShuGrid]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - entity_id
 *               - entity_type
 *               - grid_data
 *             properties:
 *               entity_id:
 *                 type: string
 *                 description: ID of the user/partner/business
 *               entity_type:
 *                 type: string
 *                 description: Type of the entity (user, partner, or business)
 *               grid_data:
 *                 type: object
 *                 description: Analysis data for the Lo Shu Grid
 *     responses:
 *       201:
 *         description: Lo Shu Grid analysis created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /numerology/numerology-loshuGrid/{entity_type}/{entity_id}:
 *   get:
 *     summary: Get all Lo Shu Grid analyses by entity type and ID
 *     tags: [LoShuGrid]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: entity_type
 *         required: true
 *         schema:
 *           type: string
 *         description: Type of the entity (user, partner, or business)
 *       - in: path
 *         name: entity_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the entity
 *     responses:
 *       200:
 *         description: Lo Shu Grid analysis retrieved successfully
 *       404:
 *         description: Analysis not found
 *       500:
 *         description: Internal server error
 */
