import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { logger } from "../clients/loggerClient";
import { IErrorMetadata } from "../interfaces/model/IErrorMetadata";

function errorHandlerMiddleware(errorMetadata: IErrorMetadata, req: Request, res: Response, next: Function): void {
	if(errorMetadata.error) {
		logger.error(`${errorMetadata.error} ${errorMetadata.stackTrace}`);
		res.status(errorMetadata.code).send(errorMetadata.error);
	} else {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
	}
}

export { errorHandlerMiddleware }