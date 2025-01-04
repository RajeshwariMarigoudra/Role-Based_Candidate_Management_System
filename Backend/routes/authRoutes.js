const express = require('express');
const { register, login, toggleUserStatus } = require('../controllers/authController');
const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user and generate a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: User already exists
 *       500:
 *         description: Server error
 */
router.post('/register', register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticate the user and return a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/users/{userId}/status:
 *   patch:
 *     summary: Toggle user active status
 *     description: Allows an admin to toggle a user's active status between active and inactive.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user whose active status will be toggled.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               active:
 *                 type: boolean
 *                 description: New active status of the user (true for active, false for inactive).
 *     responses:
 *       200:
 *         description: User's active status updated successfully
 *       400:
 *         description: Invalid user ID or status
 *       403:
 *         description: Unauthorized to update the user's status
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.patch('/users/:userId/status', toggleUserStatus);

module.exports = router;
