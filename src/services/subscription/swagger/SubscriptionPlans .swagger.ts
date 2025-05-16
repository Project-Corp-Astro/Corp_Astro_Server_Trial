/**
 * @swagger
 * tags:
 *   name: SubscriptionPlan
 *   description: Manage subscription plans
 */

/**
 * @swagger
 * /subscription/subscriptionPlan/plans:
 *   get:
 *     summary: Retrieve all subscription plans
 *     tags: [SubscriptionPlan]
 *     security: []
 *     responses:
 *       200:
 *         description: A list of subscription plans
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /subscription/subscriptionPlan/plans:
 *   post:
 *     summary: Create a new subscription plan
 *     tags: [SubscriptionPlan]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - duration
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the plan
 *               price:
 *                 type: number
 *                 description: Price of the plan
 *               duration:
 *                 type: integer
 *                 description: Duration of the plan in days
 *     responses:
 *       201:
 *         description: Subscription plan created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /subscription/subscriptionPlan/plans/{plan_id}:
 *   put:
 *     summary: Update a subscription plan by ID
 *     tags: [SubscriptionPlan]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: plan_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the subscription plan to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               duration:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Subscription plan updated successfully
 *       404:
 *         description: Plan not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /subscription/subscriptionPlan/plans/{plan_id}:
 *   delete:
 *     summary: Delete a subscription plan by ID
 *     tags: [SubscriptionPlan]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: plan_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the subscription plan to delete
 *     responses:
 *       200:
 *         description: Subscription plan deleted successfully
 *       404:
 *         description: Plan not found
 *       500:
 *         description: Internal server error
 */
