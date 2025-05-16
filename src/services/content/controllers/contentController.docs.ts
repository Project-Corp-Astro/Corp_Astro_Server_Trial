/**
 * @swagger
 * tags:
 *   name: Content
 *   description: API endpoints for accessing astrological content
 */

/**
 * @swagger
 * /api/content/daily-horoscope:
 *   get:
 *     summary: Get daily horoscope
 *     description: |
 *       Returns the daily horoscope for the authenticated user.
 *       This endpoint is only available to users with a subscription or premium tier.
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daily horoscope retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/DailyHoroscope'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden - requires subscription
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: This feature requires a subscription
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /api/content/monthly-report:
 *   get:
 *     summary: Get monthly report
 *     description: |
 *       Returns the monthly astrological report for the authenticated user.
 *       This endpoint is only available to users with a subscription or premium tier.
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: Month number (1-12). Defaults to current month if not provided.
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *           minimum: 2020
 *           maximum: 2030
 *         description: Year (4-digit). Defaults to current year if not provided.
 *     responses:
 *       200:
 *         description: Monthly report retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/MonthlyReport'
 *       400:
 *         description: Bad request - invalid month or year
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden - requires subscription
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: This feature requires a subscription
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /api/content/business-insight/{businessId}:
 *   get:
 *     summary: Get business astrological insight
 *     description: |
 *       Returns astrological insights for a specific business.
 *       This endpoint is only available to users with a premium tier.
 *     tags: [Content, Business]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: businessId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the business to get insights for
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [weekly, monthly, quarterly, yearly]
 *         description: Type of insight to retrieve. Defaults to monthly if not provided.
 *     responses:
 *       200:
 *         description: Business insight retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/BusinessInsight'
 *       400:
 *         description: Bad request - invalid business ID or insight type
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden - requires premium subscription
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: This feature requires a premium subscription
 *       404:
 *         description: Business not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /api/content/free-tools/{toolName}:
 *   get:
 *     summary: Get result from a free astrological tool
 *     description: |
 *       Returns the result from one of the free astrological tools.
 *       Available to all users, including those on the free tier.
 *     tags: [Content, Free Tools]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: toolName
 *         required: true
 *         schema:
 *           type: string
 *           enum: [name-number, tagline-analysis, brand-color]
 *         description: Name of the free tool to use
 *       - in: query
 *         name: input
 *         required: true
 *         schema:
 *           type: string
 *         description: Input for the tool (e.g., business name, tagline, or color code)
 *     responses:
 *       200:
 *         description: Tool result retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     toolName:
 *                       type: string
 *                       example: name-number
 *                     input:
 *                       type: string
 *                       example: Acme Corporation
 *                     result:
 *                       type: object
 *                       example:
 *                         numerology: 7
 *                         meaning: "The number 7 represents analysis, understanding, and knowledge. Businesses with this number often excel in research, development, and innovation."
 *                         recommendations: [
 *                           "Focus on intellectual property and innovation",
 *                           "Invest in research and development",
 *                           "Build a reputation for expertise and knowledge"
 *                         ]
 *       400:
 *         description: Bad request - invalid tool name or missing input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /api/content/templates:
 *   get:
 *     summary: Get available content templates
 *     description: |
 *       Returns a list of available content templates.
 *       This endpoint is primarily for internal use.
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Templates retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: template123
 *                       name:
 *                         type: string
 *                         example: Daily Horoscope Template
 *                       type:
 *                         type: string
 *                         example: daily_horoscope
 *                       structure:
 *                         type: object
 *                         example:
 *                           title: "Daily Horoscope for {date}"
 *                           sections: [
 *                             "overview",
 *                             "career",
 *                             "relationships",
 *                             "health"
 *                           ]
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden - requires admin role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /api/content/templates/{templateId}:
 *   get:
 *     summary: Get a specific content template
 *     description: |
 *       Returns a specific content template by ID.
 *       This endpoint is primarily for internal use.
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: templateId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the template to retrieve
 *     responses:
 *       200:
 *         description: Template retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: template123
 *                     name:
 *                       type: string
 *                       example: Daily Horoscope Template
 *                     type:
 *                       type: string
 *                       example: daily_horoscope
 *                     structure:
 *                       type: object
 *                       example:
 *                         title: "Daily Horoscope for {date}"
 *                         sections: [
 *                           "overview",
 *                           "career",
 *                           "relationships",
 *                           "health"
 *                         ]
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden - requires admin role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Template not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
