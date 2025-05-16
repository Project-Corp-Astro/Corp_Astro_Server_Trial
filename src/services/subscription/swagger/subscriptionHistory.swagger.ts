/**
 * @swagger
 * tags:
 *   name: SubscriptionHistory
 *   description: Manage user subscription history
 */

/**
 * @swagger
 * /subscription/subscriptionHistory/subscription-history:
 *   get:
 *     summary: Get all subscription history records
 *     tags: [SubscriptionHistory]
 *     security: []
 *     responses:
 *       200:
 *         description: A list of all subscription histories
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /subscription/subscriptionHistory/subscription-history:
 *   post:
 *     summary: Create a new subscription history record
 *     tags: [SubscriptionHistory]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - plan_id
 *               - start_date
 *               - end_date
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: ID of the user
 *               plan_id:
 *                 type: string
 *                 description: ID of the subscribed plan
 *               start_date:
 *                 type: string
 *                 format: date
 *                 description: Subscription start date
 *               end_date:
 *                 type: string
 *                 format: date
 *                 description: Subscription end date
 *     responses:
 *       201:
 *         description: Subscription history created
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /subscription/subscriptionHistory/subscription-history/user/{user_id}:
 *   get:
 *     summary: Get subscription history for a specific user
 *     tags: [SubscriptionHistory]
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
 *         description: User subscription history retrieved successfully
 *       404:
 *         description: User not found or no history
 *       500:
 *         description: Internal server error
 */
