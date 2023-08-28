import express from 'express';
import { AuthController } from '../controllers/Instructor/AuthController';
import { ScheduleController } from '../controllers/Instructor/ScheduleController';
import { authenticateUser } from '../middleware/auth';

const instructorRoutes = express.Router();
const authController = new AuthController();
const scheduleController = new ScheduleController();

// Public Routes
instructorRoutes.post('/register', authController.register);
instructorRoutes.post('/login', authController.login);

// Protected Routes
instructorRoutes.put('/update', authenticateUser, authController.update);
instructorRoutes.delete("/delete",authenticateUser,authController.delete)

//Schedule Routes
instructorRoutes.post("/schedule", authenticateUser, scheduleController.addSchedule)
instructorRoutes.delete("/schedule/:scheduleId", authenticateUser, scheduleController.removeSchedule)
export { instructorRoutes };
