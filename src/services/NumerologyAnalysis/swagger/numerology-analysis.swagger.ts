/**
 * @swagger
 * tags:
 *   name: NumerologyAnalysis
 *   description: Operations related to numerology analysis
 */

/**
 * @swagger
 * /numerology/numerology-analysis/create:
 *   post:
 *     summary: Create a new numerology analysis
 *     tags: [NumerologyAnalysis]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - entity_id
 *               - system_type
 *               - analysis_data
 *             properties:
 *               entity_id:
 *                 type: string
 *                 description: The ID of the entity (user, partner, or business)
 *               system_type:
 *                 type: string
 *                 description: Type of the numerology system
 *               analysis_data:
 *                 type: object
 *                 description: Result or calculated values for numerology analysis
 *     responses:
 *       201:
 *         description: Numerology analysis created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /numerology/numerology-analysis/:
 *   get:
 *     summary: Get all numerology analyses for a specific entity
 *     tags: [NumerologyAnalysis]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: entity_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the entity to retrieve analyses for
 *     responses:
 *       200:
 *         description: List of numerology analyses
 *       400:
 *         description: Missing or invalid entity_id
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /numerology/numerology-analysis/{system_id}:
 *   get:
 *     summary: Get a numerology analysis by system ID
 *     tags: [NumerologyAnalysis]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: system_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the numerology system
 *     responses:
 *       200:
 *         description: Numerology analysis found
 *       404:
 *         description: Analysis not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /numerology/numerology-analysis/{system_id}:
 *   delete:
 *     summary: Delete a numerology analysis by system ID
 *     tags: [NumerologyAnalysis]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: system_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the numerology system to delete
 *     responses:
 *       200:
 *         description: Analysis deleted successfully
 *       404:
 *         description: Analysis not found
 *       500:
 *         description: Internal server error
 */
