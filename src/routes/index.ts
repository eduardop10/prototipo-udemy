import { Router } from "express";
/* import { authRoutes } from "./auth.routes";
import { courseRoutes } from "./course.routes"; */
import {studentRoutes} from "./student.routes"
import {instructorRoutes} from "./instructor.routes"

const routes = Router();
routes.use("/api/v1/student", studentRoutes);
routes.use("/api/v1/instructor", instructorRoutes);

export { routes };