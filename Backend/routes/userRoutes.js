const express = require('express');
const { getProfile, getUsersList, updateUser, uploadProfile, createUser, deleteUser } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();
const upload = require('../config/uploadConfig');

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Retrieves the profile of the logged-in user
 *     description: Gets the user's profile information
 *     security:
 *       - bearerAuth: []  # JWT Bearer token authentication
 *     responses:
 *       200:
 *         description: User profile successfully fetched
 *       401:
 *         description: Unauthorized, user not logged in
 */
router.get('/profile', authMiddleware, getProfile);

/**
 * @swagger
 * /api/users/create:
 *   post:
 *     summary: Create a new user
 *     description: Registers a new user with the provided username, email, and password. Optionally, the user role can be set (default is 'user').
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the new user.
 *               email:
 *                 type: string
 *                 description: The email address of the new user.
 *               password:
 *                 type: string
 *                 description: The password of the new user.
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 description: The role of the new user. Default is 'user'.
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid data or email already exists
 *       500:
 *         description: Server error
 */
router.post('/create', createUser);

/**
 * 
 * 
 * +
 * @swagger
 * /api/users:
 *   get:
 *     summary: Retrieves a list of users
 *     description: Fetches the list of users. Admins can see all users, regular users can see their own profile.
 *     security:
 *       - bearerAuth: []  # JWT Bearer token authentication
 *     responses:
 *       200:
 *         description: List of users successfully fetched
 *       401:
 *         description: Unauthorized, user not logged in
 *       403:
 *         description: Forbidden, admin access required
 */
router.get('/', authMiddleware, getUsersList);

/**
 * @swagger
 * /api/users/users/{userId}:
 *   patch:
 *     summary: Update user information
 *     description: Allows an admin to update any user's details or allows a user to update their own profile.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user whose information is to be updated.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user.
 *               email:
 *                 type: string
 *                 description: The email of the user.
 *               password:
 *                 type: string
 *                 description: The new password for the user (optional).
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 description: The role of the user (only admin can update this).
 *     security:
 *       - bearerAuth: []  # JWT Bearer token authentication
 *     responses:
 *       200:
 *         description: User information successfully updated
 *       400:
 *         description: Invalid user ID or invalid data provided
 *       401:
 *         description: Unauthorized, user not logged in or permission denied
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.patch('/users/:userId', authMiddleware, updateUser);

/**
 * @swagger
 * /api/users/profile:
 *   post:
 *     summary: Upload candidate profile image
 *     tags: [user]
 *     description: This endpoint allows candidates to upload their profile images.
 *     consumes:
 *       - multipart/form-data  # Defines the content type for file uploads
 *     parameters:
 *       - name: file
 *         in: formData
 *         description: The image file to upload as profile picture
 *         required: true  # This field is required for the request
 *         type: file  # Type is file, which tells Swagger to show a file input
 *     security:
 *       - bearerAuth: []  # Assuming you have JWT auth enabled
 *     responses:
 *       200:
 *         description: Profile image uploaded successfully
 *       400:
 *         description: Bad request (file not uploaded)
 *       500:
 *         description: Server error
 */
router.post('/uploadprofile/:userId', authMiddleware, upload.single('file'), uploadProfile);

/**
 * @swagger
 * /api/users/{userId}:
 *   delete:
 *     summary: Delete a user
 *     description: Allows an admin or the user themselves to delete a user account.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user to be deleted.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []  # JWT Bearer token authentication
 *     responses:
 *       200:
 *         description: User successfully deleted
 *       400:
 *         description: Bad request (invalid user ID)
 *       401:
 *         description: Unauthorized, user not logged in
 *       403:
 *         description: Forbidden, user not authorized to delete the account
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.delete('/:userId', authMiddleware, deleteUser);


module.exports = router;
