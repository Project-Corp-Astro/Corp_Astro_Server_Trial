// src/services/content/swagger/content.swagger.ts

/**
 * @swagger
 * components:
 *   schemas:
 *     ContentTemplate:
 *       type: object
 *       required:
 *         - template_type
 *         - template_content
 *         - variables
 *         - active
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated ID of the template
 *         template_type:
 *           type: string
 *           description: Type of template (daily_horoscope, monthly_report, business_insight, etc.)
 *         zodiac_sign:
 *           type: string
 *           description: Zodiac sign for zodiac-specific templates
 *         planet:
 *           type: string
 *           description: Planet for planet-specific templates
 *         house:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *           description: House number for house-specific templates
 *         aspect:
 *           type: string
 *           description: Aspect for aspect-specific templates
 *         template_content:
 *           type: string
 *           description: The template content with placeholders
 *         variables:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of variables/placeholders used in the template
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Tags for categorizing templates
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date the template was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The date the template was last updated
 *         active:
 *           type: boolean
 *           description: Whether the template is active
 *       example:
 *         id: d290f1ee-6c54-4b01-90e6-d701748f0851
 *         template_type: daily_horoscope
 *         zodiac_sign: Aries
 *         template_content: "Today, {{planet_name}} is moving through your {{house_number}} house, bringing {{aspect_effect}}. Focus on {{recommendation}}."
 *         variables: [planet_name, house_number, aspect_effect, recommendation]
 *         tags: [daily, horoscope, aries]
 *         active: true
 *         created_at: 2025-05-15T10:30:00.000Z
 *         updated_at: 2025-05-15T10:30:00.000Z
 *
 *     ContentVariable:
 *       type: object
 *       required:
 *         - variable_name
 *         - variable_type
 *         - context
 *         - values
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated ID of the variable
 *         variable_name:
 *           type: string
 *           description: The name of the variable (e.g., 'planet_name', 'aspect_description')
 *         variable_type:
 *           type: string
 *           description: The type of variable (e.g., 'planet', 'aspect', 'house', 'zodiac')
 *         context:
 *           type: string
 *           description: The context in which this variable is used
 *         values:
 *           type: object
 *           description: JSON object containing possible values for this variable
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date the variable was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The date the variable was last updated
 *       example:
 *         id: d290f1ee-6c54-4b01-90e6-d701748f0852
 *         variable_name: planet_name
 *         variable_type: planet
 *         context: daily_horoscope
 *         values: {"Sun": "the Sun", "Moon": "the Moon", "Mercury": "Mercury", "Venus": "Venus", "Mars": "Mars"}
 *         created_at: 2025-05-15T10:30:00.000Z
 *         updated_at: 2025-05-15T10:30:00.000Z
 *
 *     GeneratedContent:
 *       type: object
 *       required:
 *         - content_type
 *         - content
 *         - valid_from
 *         - valid_until
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated ID of the content
 *         user_id:
 *           type: string
 *           format: uuid
 *           description: The ID of the user this content is for
 *         business_id:
 *           type: string
 *           format: uuid
 *           description: The ID of the business this content is for
 *         content_type:
 *           type: string
 *           description: Type of content (daily_horoscope, monthly_report, business_insight, etc.)
 *         zodiac_sign:
 *           type: string
 *           description: Zodiac sign for zodiac-specific content
 *         content:
 *           type: string
 *           description: The generated content
 *         metadata:
 *           type: object
 *           description: Additional metadata about the content
 *         astrological_data:
 *           type: object
 *           description: Relevant astrological data used for generation
 *         valid_from:
 *           type: string
 *           format: date-time
 *           description: When the content becomes valid
 *         valid_until:
 *           type: string
 *           format: date-time
 *           description: When the content expires
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date the content was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The date the content was last updated
 *       example:
 *         id: d290f1ee-6c54-4b01-90e6-d701748f0853
 *         user_id: d290f1ee-6c54-4b01-90e6-d701748f0854
 *         content_type: daily_horoscope
 *         zodiac_sign: Aries
 *         content: "Today, the Sun is moving through your 10th house, bringing increased visibility in your career. Focus on networking with influential people."
 *         astrological_data: {"sun_sign": "Aries", "moon_sign": "Taurus", "rising_sign": "Gemini"}
 *         valid_from: 2025-05-16T00:00:00.000Z
 *         valid_until: 2025-05-17T00:00:00.000Z
 *         created_at: 2025-05-16T01:00:00.000Z
 *         updated_at: 2025-05-16T01:00:00.000Z
 *
 * tags:
 *   - name: Content Templates
 *     description: Content template management
 *   - name: Content Variables
 *     description: Content variable management
 *   - name: Content Generation
 *     description: Content generation endpoints
 *
 * /api/content/templates:
 *   get:
 *     summary: Get all content templates
 *     tags: [Content Templates]
 *     parameters:
 *       - in: query
 *         name: template_type
 *         schema:
 *           type: string
 *         description: Filter by template type
 *       - in: query
 *         name: zodiac_sign
 *         schema:
 *           type: string
 *         description: Filter by zodiac sign
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *     responses:
 *       200:
 *         description: A list of content templates
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ContentTemplate'
 *       500:
 *         description: Server error
 *
 *   post:
 *     summary: Create a new content template
 *     tags: [Content Templates]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContentTemplate'
 *     responses:
 *       201:
 *         description: Template created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/ContentTemplate'
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Server error
 *
 * /api/content/templates/{id}:
 *   get:
 *     summary: Get a content template by ID
 *     tags: [Content Templates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Template ID
 *     responses:
 *       200:
 *         description: Content template found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/ContentTemplate'
 *       404:
 *         description: Template not found
 *       500:
 *         description: Server error
 *
 *   put:
 *     summary: Update a content template
 *     tags: [Content Templates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Template ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContentTemplate'
 *     responses:
 *       200:
 *         description: Template updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/ContentTemplate'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Template not found
 *       500:
 *         description: Server error
 *
 *   delete:
 *     summary: Delete a content template
 *     tags: [Content Templates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Template ID
 *     responses:
 *       200:
 *         description: Template deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Template not found
 *       500:
 *         description: Server error
 *
 * /api/content/templates/search:
 *   get:
 *     summary: Search for templates by content
 *     tags: [Content Templates]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ContentTemplate'
 *       400:
 *         description: Missing search query
 *       500:
 *         description: Server error
 *
 * /api/content/variables:
 *   get:
 *     summary: Get all content variables
 *     tags: [Content Variables]
 *     parameters:
 *       - in: query
 *         name: variable_type
 *         schema:
 *           type: string
 *         description: Filter by variable type
 *       - in: query
 *         name: context
 *         schema:
 *           type: string
 *         description: Filter by context
 *     responses:
 *       200:
 *         description: A list of content variables
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ContentVariable'
 *       500:
 *         description: Server error
 *
 *   post:
 *     summary: Create a new content variable
 *     tags: [Content Variables]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContentVariable'
 *     responses:
 *       201:
 *         description: Variable created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/ContentVariable'
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Server error
 *
 * /api/content/generate/horoscope/daily/{userId}:
 *   get:
 *     summary: Generate daily horoscope for a user
 *     tags: [Content Generation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Target date (defaults to today)
 *     responses:
 *       200:
 *         description: Daily horoscope generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/GeneratedContent'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *
 * /api/content/generate/report/monthly/{userId}:
 *   get:
 *     summary: Generate monthly report for a user
 *     tags: [Content Generation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: Target month (1-12, defaults to current month)
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Target year (defaults to current year)
 *     responses:
 *       200:
 *         description: Monthly report generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/GeneratedContent'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *
 * /api/content/generate/business/{businessId}/insight:
 *   get:
 *     summary: Generate business insight
 *     tags: [Content Generation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: businessId
 *         required: true
 *         schema:
 *           type: string
 *         description: Business ID
 *       - in: query
 *         name: insightType
 *         required: true
 *         schema:
 *           type: string
 *         description: Type of insight (weekly_forecast, opportunity, etc.)
 *     responses:
 *       200:
 *         description: Business insight generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/GeneratedContent'
 *       400:
 *         description: Missing insight type
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
