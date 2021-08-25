import { Application, Request, Response } from "express";
import { Configuration } from "../../Configuration";
import { passportClient } from "../clients/passportClient";

function applySamlMiddleware(app: Application) {
	// Adding authorization logic
	app.get("/metadata.xml", passportClient.createGetMedatadaRoute(Configuration.authentication.metadata.entityId, Configuration.authentication.saml.callbackUrl))
	app.use(passportClient.Instance.initialize());
	app.use(passportClient.Instance.session());
	app.get('/auth/saml', passportClient.Instance.authenticate('saml'));

	app.post('/auth/saml/callback', passportClient.Instance.authenticate('saml'), (req: Request, res: Response) => {
		const { user }: any = req;

		if(Configuration.application.allowedUsers.findIndex(userId => userId === user.id) !== -1) {
			res.redirect("/")			
		} else {
			res.redirect("/unauthorized")
		}
	});
}

export { applySamlMiddleware }