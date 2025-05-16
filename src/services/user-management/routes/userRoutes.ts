// routes/userRoutes.ts
import { RequestHandler, Router } from 'express';
import { createUser, getUserByPhoneNumber, getUserById, updateProfileImageHandler,updateUserByUserId, deleteUserByUserId, logoutUserById } from '../controllers/user.controller';
import { loginOrSignupController, getAllAuthenticationLogs, getAuthenticationLogById } from '../controllers/auth.controller';
import { registerDevice } from '../controllers/user_devices.controler';
import { sendOtp, verifyOtp } from '../services/otp.service';
import { authenticate } from '../../../middleware/auth.middleware';
import { checkRole } from '../../../middleware/checkRole';
import { checkSubscription } from '../../../middleware/checkSubscription';
import { uploadProfileImage } from '../../../middleware/uploads';

const router = Router();
//create user by user id    
router.post('/create', createUser as unknown as RequestHandler);
//login or signup by user id 
router.post('/login', loginOrSignupController as unknown as RequestHandler);
//get user by user id 
router.get('/:id',  getUserById as unknown as RequestHandler);
//get user by phone number 
router.get('/phone/:phone_number',  authenticate as unknown as RequestHandler, checkRole(['user']) as RequestHandler,checkSubscription(['free']) as RequestHandler,getUserByPhoneNumber as unknown as RequestHandler);
//update user by user id 
router.put('/:id', authenticate as unknown as RequestHandler,updateUserByUserId as unknown as RequestHandler);
//logout user by user id 
router.post('/logout',  authenticate as unknown as RequestHandler , logoutUserById as unknown as RequestHandler);
//update profile image by user id 
router.post('/updateProfile',   authenticate as unknown as RequestHandler, uploadProfileImage.single('image'),updateProfileImageHandler as unknown as RequestHandler);

router.delete('/delete/:id',  authenticate as unknown as RequestHandler,deleteUserByUserId as unknown as RequestHandler);

// authenticate as RequestHandler,
//   checkRole(['user']) as RequestHandler,
//   checkSubscription(['free']) as RequestHandler,

// router.post('/send-otp', async (req, res) => {
//     const { phoneNumber } = req.body;
//     const result = await sendOtp(phoneNumber);
//     res.json(result);
//   });
  
//   // Verify OTP
//   router.post('/verify-otp', async (req, res) => {
//     const { phoneNumber, otp, orderId } = req.body;
//     const result = await verifyOtp(phoneNumber, otp, orderId);
//     res.json(result);
//   });

export default router;







// // routes/userRoutes.ts

// import { RequestHandler, Router } from 'express';
// import {
//   createUser,
//   getUserByPhoneNumber,
//   getUserById,
//   updateProfileImageHandler,
//   updateUserByUserId,
//   deleteUserByUserId,
//   logoutUserById,
// } from '../controllers/user.controller';
// import {
//   loginOrSignupController,
//   getAllAuthenticationLogs,
//   getAuthenticationLogById,
// } from '../controllers/auth.controller';
// import { registerDevice } from '../controllers/user_devices.controler';
// import { sendOtp, verifyOtp } from '../services/otp.service';
// import { authenticate } from '../../../middleware/auth.middleware';
// import { checkRole } from '../../../middleware/checkRole';
// import { checkSubscription } from '../../../middleware/checkSubscription';
// import { uploadProfileImage } from '../../../middleware/uploads';

// const router = Router();

// /**
//  * @swagger
//  * tags:
//  *   name: User
//  *   description: User management endpoints
//  */

// /**
//  * @swagger
//  * /usermanagement/create:
//  *   post:
//  *     summary: Create a new user
//  *     tags: [User]
//  *     security: []  # Disable JWT for this route
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               name:
//  *                 type: string
//  *               phone_number:
//  *                 type: string
//  *     responses:
//  *       201:
//  *         description: User created successfully
//  *       400:
//  *         description: Invalid input
//  */
// router.post('/create', createUser as unknown as RequestHandler);

// /**
//  * @swagger
//  * /usermanagement/login:
//  *   post:
//  *     summary: Login or sign up a user by phone number
//  *     tags: [User]
//  *     security: []  # Disable JWT for this route
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               phone_number:
//  *                 type: string
//  *     responses:
//  *       200:
//  *         description: Login successful
//  *       401:
//  *         description: Unauthorized
//  */
// router.post('/login', loginOrSignupController as unknown as RequestHandler);

// /**
//  * @swagger
//  * /usermanagement/user/{id}:
//  *   get:
//  *     summary: Get user by ID
//  *     tags: [User]
//  *     security: []  # Disable JWT for this route
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: The user ID
//  *     responses:
//  *       200:
//  *         description: User data retrieved
//  *       401:
//  *         description: Unauthorized
//  *       404:
//  *         description: User not found
//  */
// router.get('/:id', getUserById as unknown as RequestHandler);


// /**
//  * @swagger
//  * /usermanagement/phone/{phone_number}:
//  *   get:
//  *     summary: Get user by phone number
//  *     tags: [User]
//  *     parameters:
//  *       - name: phone_number
//  *         in: path
//  *         required: true
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: User data by phone number
//  *       401:
//  *         description: Unauthorized
//  *       403:
//  *         description: Role or subscription unauthorized
//  */
// router.get(
//   '/phone/:phone_number',
//   authenticate as unknown as RequestHandler,
//   checkRole(['user']) as RequestHandler,
//   checkSubscription(['free']) as RequestHandler,
//   getUserByPhoneNumber as unknown as RequestHandler
// );

// /**
//  * @swagger
//  * /usermanagement/{id}:
//  *   put:
//  *     summary: Update user by ID
//  *     tags: [User]
//  *     parameters:
//  *       - name: id
//  *         in: path
//  *         required: true
//  *         schema:
//  *           type: string
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               name:
//  *                 type: string
//  *               email:
//  *                 type: string
//  *     responses:
//  *       200:
//  *         description: User updated
//  *       401:
//  *         description: Unauthorized
//  */
// router.put('/:id', authenticate as unknown as RequestHandler, updateUserByUserId as unknown as RequestHandler);

// /**
//  * @swagger
//  * /usermanagement/logout:
//  *   post:
//  *     summary: Logout user
//  *     tags: [User]
//  *     responses:
//  *       200:
//  *         description: User logged out
//  *       401:
//  *         description: Unauthorized
//  */
// router.post('/logout', authenticate as unknown as RequestHandler, logoutUserById as unknown as RequestHandler);

// /**
//  * @swagger
//  * /usermanagement/updateProfile:
//  *   post:
//  *     summary: Update user's profile image
//  *     tags: [User]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         multipart/form-data:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               image:
//  *                 type: string
//  *                 format: binary
//  *     responses:
//  *       200:
//  *         description: Profile image updated
//  *       401:
//  *         description: Unauthorized
//  */
// router.post(
//   '/updateProfile',
//   authenticate as unknown as RequestHandler,
//   uploadProfileImage.single('image'),
//   updateProfileImageHandler as unknown as RequestHandler
// );

// /**
//  * @swagger
//  * /usermanagement/delete/{id}:
//  *   delete:
//  *     summary: Delete user by ID
//  *     tags: [User]
//  *     parameters:
//  *       - name: id
//  *         in: path
//  *         required: true
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: User deleted
//  *       401:
//  *         description: Unauthorized
//  *       404:
//  *         description: User not found
//  */
// router.delete('/delete/:id', authenticate as unknown as RequestHandler, deleteUserByUserId as unknown as RequestHandler);

// export default router;
