import express from "express";
import cors from "cors";
import { Configuration } from "../../Configuration";
import { Application } from "express";
import { StatusCodes } from "http-status-codes";
import expressSession from "express-session";
import connectMongo from "connect-mongo";
import { dalFactory } from "../dal/DalFactory";

const MongoStore = connectMongo(expressSession);

function applyThirdPartyMiddleware(app: Application) {
	app.use(cors());
	app.use(express.json({ limit: Configuration.application.jsonBodyMaxSize }));
	app.use(express.urlencoded({ extended: true }));
	app.use(expressSession({
		secret: "asd",
		resave: false,
		saveUninitialized: false,
		store: new MongoStore({
			client: dalFactory.DalComposer.client.Client
		}),
		cookie: {
			maxAge: 30 * 24 * 60 * 60 * 1000,
			path: '/',
			sameSite: false
		}
	}));
	app.use((error: any, req: any, res: any, next: any) => {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
	})
}

export { applyThirdPartyMiddleware }