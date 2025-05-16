/**
 * @swagger
 * tags:
 *   name: RelationalChart
 *   description: APIs for managing relational charts, including synastry and composite charts
 */

/**
 * @swagger
 * /business/relationalChart/insertSynastryChart:
 *   post:
 *     summary: Insert a synastry chart for the user
 *     tags: [RelationalChart]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: |
 *                   ID of the user. This is used for user-partner charts.
 *               partner_id:
 *                 type: string
 *                 description: |
 *                   ID of the partner. This is used for partner-user charts.
 *               business_id:
 *                 type: string
 *                 description: |
 *                   ID of the business. This is used for user-business charts or partner-business charts.
 *               chart_type_id:
 *                 type: string
 *                 description: |
 *                   ID of the chart type, which could be synastry or composite.
 *     responses:
 *       201:
 *         description: Synastry chart created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /business/relationalChart/insertCompositeChart:
 *   post:
 *     summary: Insert a composite chart for the user
 *     tags: [RelationalChart]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: |
 *                   ID of the user. This is used for user-partner charts.
 *               partner_id:
 *                 type: string
 *                 description: |
 *                   ID of the partner. This is used for partner-user charts.
 *               business_id:
 *                 type: string
 *                 description: |
 *                   ID of the business. This is used for user-business charts or partner-business charts.
 *               chart_type_id:
 *                 type: string
 *                 description: |
 *                   ID of the chart type, which could be synastry or composite.
 *     responses:
 *       201:
 *         description: Composite chart created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /business/relationalChart/fetchRelationalChart:
 *   get:
 *     summary: Fetch a relational chart by user id, partner id, business id, and chart type id
 *     tags: [RelationalChart]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: |
 *           ID of the user.
 *       - in: query
 *         name: partner_id
 *         required: true
 *         schema:
 *           type: string
 *         description: |
 *           ID of the partner.
 *       - in: query
 *         name: business_id
 *         required: true
 *         schema:
 *           type: string
 *         description: |
 *           ID of the business.
 *       - in: query
 *         name: chart_type_id
 *         required: true
 *         schema:
 *           type: string
 *         description: |
 *           ID of the chart type.
 *     responses:
 *       200:
 *         description: Relational chart fetched successfully
 *       404:
 *         description: Relational chart not found
 */

/**
 * @swagger
 * /business/relationalChart/updateRelationalChart:
 *   put:
 *     summary: Update an existing relational chart
 *     tags: [RelationalChart]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: |
 *                   ID of the relational chart to update.
 *               type:
 *                 type: string
 *                 description: |
 *                   Type of the chart (e.g., synastry, composite).
 *     responses:
 *       200:
 *         description: Relational chart updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Relational chart not found
 *       500:
 *         description: Internal server error
 */
