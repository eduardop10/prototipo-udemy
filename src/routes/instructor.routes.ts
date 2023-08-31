import express from 'express';
import { AuthController } from '../controllers/Instructor/AuthController';
import { authenticateUser } from '../middleware/auth';

const instructorRoutes = express.Router();
const authController = new AuthController();

// Public Routes
instructorRoutes.post('/register', authController.register);
instructorRoutes.post('/login', authController.login);

// Protected Routes
instructorRoutes.put('/update', authenticateUser, authController.update);
instructorRoutes.delete("/delete",authenticateUser,authController.delete)


export { instructorRoutes };
