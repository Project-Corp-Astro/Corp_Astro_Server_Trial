// swagger/user.swagger.ts

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management endpoints
 */

/**
 * @swagger
 * /usermanagement/user/create:
 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     security: []  # Disable JWT for this route
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone_number:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /usermanagement/user/login:
 *   post:
 *     summary: Login or sign up a user by phone number
 *     tags: [User]
 *     security: []  # Disable JWT for this route
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone_number:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /usermanagement/user/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [User]
 *     security: []  # Disable JWT for this route
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User data retrieved
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /usermanagement/user/phone/{phone_number}:
 *   get:
 *     summary: Get user by phone number
 *     tags: [User]
 *     parameters:
 *       - name: phone_number
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User data by phone number
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Role or subscription unauthorized
 */

/**
 * @swagger
 * /usermanagement/user/{id}:
 *   put:
 *     summary: Update user by ID
 *     tags: [User]
 *     parameters:
 *       - name: id
 *         in: path
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
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /usermanagement/user/logout:
 *   post:
 *     summary: Logout user
 *     tags: [User]
 *     responses:
 *       200:
 *         description: User logged out
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /usermanagement/user/updateProfile:
 *   post:
 *     summary: Update user's profile image
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile image updated
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /usermanagement/user/delete/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     tags: [User]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
