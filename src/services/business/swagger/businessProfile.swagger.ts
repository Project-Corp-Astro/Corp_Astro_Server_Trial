/**
 * @swagger
 * tags:
 *   name: BusinessProfile
 *   description: APIs for managing business profiles
 */

/**
 * @swagger
 * /business/business/:
 *   post:
 *     summary: Create a business profile
 *     tags: [BusinessProfile]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               user_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Business profile created
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /business/business/{id}/{user_id}:
 *   get:
 *     summary: Get business profile by ID and User ID
 *     tags: [BusinessProfile]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Business profile found
 *       404:
 *         description: Business profile not found
 */

/**
 * @swagger
 * /business/business/{business_id}/{user_id}:
 *   put:
 *     summary: Update a business profile
 *     tags: [BusinessProfile]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: business_id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Business profile updated
 *       404:
 *         description: Business profile not found
 */

/**
 * @swagger
 * /business/business/{id}/{user_id}:
 *   delete:
 *     summary: Delete a business profile
 *     tags: [BusinessProfile]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Business profile deleted
 *       404:
 *         description: Not found
 */

/**
 * @swagger
 * /business/business/user/{user_id}/businesses:
 *   get:
 *     summary: Get all business profiles for a user
 *     tags: [BusinessProfile]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of business profiles
 *       404:
 *         description: No profiles found
 */

/**
 * @swagger
 * /business/business/business-partner/{user_id}/{business_id}:
 *   get:
 *     summary: Get all business profiles and partners for a user
 *     tags: [BusinessProfile]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: business_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Profiles and partners retrieved
 *       404:
 *         description: No data found
 */
