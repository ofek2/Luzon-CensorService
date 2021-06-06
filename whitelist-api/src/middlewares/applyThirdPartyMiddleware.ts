import express from "express";
import cors from "cors";
import { Configuration } from "../../Configuration";
import { Application } from "express";
import { StatusCodes } from "http-status-codes";

function applyThirdPartyMiddleware(app: Application) {
	app.use(cors());
	app.use(express.json({ limit: Configuration.application.jsonBodyMaxSize }));
	app.use(express.urlencoded({ extended: true }));
	app.use((error: any, req: any, res: any, next: any) => {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
	})
}

export { applyThirdPartyMiddleware }