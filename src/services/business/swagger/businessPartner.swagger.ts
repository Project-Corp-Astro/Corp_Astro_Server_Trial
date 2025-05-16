/**
 * @swagger
 * tags:
 *   name: BusinessPartner
 *   description: APIs for managing business partners
 */

/**
 * @swagger
 * /business/partner/business-partner:
 *   post:
 *     summary: Create a partner for the business
 *     tags: [BusinessPartner]
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
 *               business_id:
 *                 type: string
 *               user_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Partner created successfully
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /business/partner/business-partner/{user_id}:
 *   get:
 *     summary: Get all partners for a user
 *     tags: [BusinessPartner]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of partners found
 *       404:
 *         description: No partners found
 */

/**
 * @swagger
 * /business/partner/business-partner/{partner_id}/{user_id}:
 *   get:
 *     summary: Get partner by partner ID and user ID
 *     tags: [BusinessPartner]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: partner_id
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
 *         description: Partner found
 *       404:
 *         description: Partner not found
 */

/**
 * @swagger
 * /business/partner/business-partner/{partner_id}/{user_id}:
 *   put:
 *     summary: Update a partner by partner ID and user ID
 *     tags: [BusinessPartner]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: partner_id
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
 *               business_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Partner updated successfully
 *       404:
 *         description: Partner not found
 */

/**
 * @swagger
 * /business/partner/business-partner/{partner_id}/{user_id}:
 *   delete:
 *     summary: Delete a partner by partner ID and user ID
 *     tags: [BusinessPartner]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: partner_id
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
 *         description: Partner deleted successfully
 *       404:
 *         description: Partner not found
 */

/**
 * @swagger
 * /business/partner/business-partner/business/{business_id}/{user_id}:
 *   get:
 *     summary: Get all partners for a business by business ID and user ID
 *     tags: [BusinessPartner]
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
 *     responses:
 *       200:
 *         description: List of business partners found
 *       404:
 *         description: No partners found for the business
 */
