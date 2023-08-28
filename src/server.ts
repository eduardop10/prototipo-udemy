import "express-async-errors";
import express, { NextFunction, Request, Response } from "express";
import { AppError } from "./errors/AppError";
import { routes } from "./routes";
import MongoDBService from './services/MongoDBService';

const app = express();
const mongoDBService = new MongoDBService("mongodb+srv://ms159236:similar-udemy@similar-udemy.bckomqv.mongodb.net/?retryWrites=true&w=majority");

app.use(express.json());

app.use(routes);

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        status: "error",
        message: err.message,
      });
    }

    return response.status(500).json({
      status: "error",
      message: `Internal server error - ${err.message}`,
    });
  }
);

export { app };

