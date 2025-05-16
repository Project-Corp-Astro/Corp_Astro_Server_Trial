/**
 * @swagger
 * tags:
 *   name: NumerologySystem
 *   description: Manage numerology systems
 */

/**
 * @swagger
 * /numerology/numerology-system/create:
 *   post:
 *     summary: Create a new numerology system
 *     tags: [NumerologySystem]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the numerology system
 *               description:
 *                 type: string
 *                 description: Description of the numerology system
 *     responses:
 *       201:
 *         description: Numerology system created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /numerology/numerology-system:
 *   get:
 *     summary: Get all numerology systems
 *     tags: [NumerologySystem]
 *     security: []
 *     responses:
 *       200:
 *         description: List of numerology systems
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /numerology/numerology-system/{system_id}:
 *   get:
 *     summary: Get a numerology system by ID
 *     tags: [NumerologySystem]
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
 *         description: Numerology system details
 *       404:
 *         description: System not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /numerology/numerology-system/{system_id}:
 *   put:
 *     summary: Update a numerology system
 *     tags: [NumerologySystem]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: system_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the numerology system
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
 *         description: Numerology system updated successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: System not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /numerology/numerology-system/{system_id}:
 *   delete:
 *     summary: Delete a numerology system
 *     tags: [NumerologySystem]
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
 *         description: Numerology system deleted successfully
 *       404:
 *         description: System not found
 *       500:
 *         description: Internal server error
 */
