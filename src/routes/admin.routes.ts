import express from 'express';
import { Request, Response } from 'express';

import { AuthController } from '../controllers/Admin/AuthController';
import {authenticateAdmin} from '../middleware/auth';
import { InstructorController } from '../controllers/Admin/InstructorController';
import { StudentController } from '../controllers/Admin/StudentController';

const adminRoutes = express.Router();;
const authController = new AuthController();
const instructorController = new InstructorController();
const studentController = new StudentController();

// Login Route
adminRoutes.post('/login',authController.login);

// Instructors
adminRoutes.get('/instructors',authenticateAdmin,instructorController.showAll)
adminRoutes.get('/instructor/:id',authenticateAdmin,instructorController.findOne)
adminRoutes.put('/instructor/:id',authenticateAdmin,instructorController.update)
adminRoutes.delete('/instructor/:id',authenticateAdmin,instructorController.delete)

// Students
adminRoutes.get('/students',authenticateAdmin,studentController.showAll)
adminRoutes.get('/student/:id',authenticateAdmin,studentController.findOne)
adminRoutes.put('/student/:id',authenticateAdmin,studentController.update)
adminRoutes.delete('/student/:id',authenticateAdmin,studentController.delete)

export { adminRoutes };
