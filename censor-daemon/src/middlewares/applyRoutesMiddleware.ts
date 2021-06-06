import { router } from "../routes/Router";
import { errorHandlerMiddleware } from "./errorHandlerMiddleware";
import { Application } from "express";

function applyRoutesMiddleware(app: Application) {
	app.get('/', (req, res, next) => {
		res.status(200).send();
	})
	app.use('/api', router);
	app.use(errorHandlerMiddleware);

}

export { applyRoutesMiddleware }