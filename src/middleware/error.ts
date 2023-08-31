import { NextFunction, Request, Response } from 'express'
import { MongoError } from 'mongodb';
import { AppError } from '../errors/index'
import { StatusCodes } from 'http-status-codes'

export const errorMiddleware = (
	error: Error & Partial<AppError>,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	//console.log(error)
	const statusCode = error.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR
	let message = error.statusCode ? error.message : 'Internal Server Error'

	// Duplicated MongoDB Error Treatment
	if (error instanceof MongoError && error.code === 11000) {
		const duplicateKeyErrorMessage = error.message.match(/\{([^}]+)\}/);
		if (duplicateKeyErrorMessage) {
		  const fieldsString = duplicateKeyErrorMessage[1];
		  const fields = fieldsString.split(', ');
		  message = `Duplicate key error for fields: ${fields.join(', ')}`;
		}
		return res.status(400).json({ message });
	  }

	return res.status(statusCode).json({ message })
}
