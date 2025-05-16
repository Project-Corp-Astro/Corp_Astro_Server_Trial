/**
 * @swagger
 * tags:
 *   name: ProgressedChart
 *   description: API endpoints for managing progressed charts
 */

/**
 * @swagger
 * /business/progressedChart/{user_id}:
 *   post:
 *     summary: Create a new progressed chart for a user
 *     tags: [ProgressedChart]
  *     security: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user for whom the chart is created
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chart_data:
 *                 type: object
 *                 description: JSON object containing chart data
 *     responses:
 *       201:
 *         description: Progressed chart created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /business/progressedChart/{user_id}:
 *   get:
 *     summary: Retrieve a progressed chart by user ID
 *     tags: [ProgressedChart]
  *     security: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: Progressed chart retrieved successfully
 *       404:
 *         description: Chart not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /business/progressedChart/{user_id}:
 *   put:
 *     summary: Update a progressed chart by user ID
 *     tags: [ProgressedChart]
  *     security: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: Progressed chart updated successfully
 *       400:
 *         description: user_id is required
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /business/progressedChart/{user_id}:
 *   delete:
 *     summary: Delete a progressed chart by user ID
 *     tags: [ProgressedChart]
  *     security: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: Progressed chart deleted successfully
 *       404:
 *         description: Chart not found
 *       500:
 *         description: Internal server error
 */
