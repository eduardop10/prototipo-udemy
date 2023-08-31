import { StatusCodes } from 'http-status-codes'
import {AppError} from "./AppError"

export class UnauthenticatedError extends AppError {
	constructor(message: string) {
		super(message, StatusCodes.UNAUTHORIZED)
	}
}

