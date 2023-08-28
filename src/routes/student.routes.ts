import express from 'express';
import { AuthController } from '../controllers/Student/AuthController';
import {authenticateUser} from "../middleware/auth"
//import { authorizeRoles } from '../middleware/roles';

const studentRoutes = express.Router();
const authController = new AuthController();

// public routes
studentRoutes.post('/register', authController.register);
studentRoutes.post('/login', authController.login);

//protect routes
studentRoutes.put("/update",authenticateUser,authController.update)
studentRoutes.delete("/delete",authenticateUser,authController.delete)

export { studentRoutes };
