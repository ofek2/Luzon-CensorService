import passport from "passport";
import { Request, Response } from "express";
import { Strategy as SamlStrategy } from "passport-saml";
import { Configuration } from "../../Configuration";
import { logger } from "./loggerClient";
import path from "path";
import { createMetadataFile } from '../../samlMetadata';
import { IErrorMetadata } from "../interfaces/model/IErrorMetadata";
import { StatusCodes } from "http-status-codes";

//  Function for changing the object that will be got from the 
//  authentication service to the object we expect to get
function profileExtractor(profile: any, mapingObject: any) {
	const dynamicProfile: any = {};

	Object.keys(mapingObject).map(key => dynamicProfile[key] = profile[mapingObject[key]]);

	return dynamicProfile;
}

class PassportClient {
	constructor() {
		passport.use(
			new SamlStrategy(Configuration.authentication.saml, async (profile: any, done: any) => {
				// Change the profile props name according to the configuration
				// For example: from {firstName: "a", lastName: "b"} => to {name: "a", last: "b"} with config of profileExtractor to {name: "firstName", last: "lastName"} 
				profile = profileExtractor(profile, Configuration.authentication.profileExtractor);
				if (!profile) {
					logger.error(`Authentication error: could not authenticat user`);
					return done(new Error("Faled to authenticate"));
				}

				return done(null, profile);
			})
		);

		passport.serializeUser((user: any, done) => {
			done(null, user.id);
		});

		passport.deserializeUser(async (id, done) => {
			done(null, { id })
		});
	}

	public get Instance() {
		return passport;
	}

	public createGetMedatadaRoute(entityId: string, callbackUrl: string) {
		return async (req: Request, res: Response) => {
			try	{
				const file = await createMetadataFile(entityId, callbackUrl);

				res.sendFile(path.resolve(__dirname, "../../..", file));
			} catch(error) {
				logger.error(error);
			}
			
		};
	}

	public createLoggedInUserAuthorizeMiddleware(args: { shouldRedirectToHome: boolean}) {
		return (req: Request, res: Response, next: (error?: IErrorMetadata) => void) => {
			const { user }: any = req;
		
			if (!user) {
				logger.error("Authorization error: user tried to access route without user on the session")
				if(args.shouldRedirectToHome) {
					res.redirect("/auth/saml");
				} else {
					res.redirect("/unauthorized")
				}
			} else if(Configuration.application.allowedUsers.findIndex(userId => userId === user.id) === -1) {
				if(args.shouldRedirectToHome) {
					res.redirect("/unauthorized");
				} else {
					res.status(StatusCodes.UNAUTHORIZED).send();
				}
			} else {
				next();
			}
		}
	}

	public injectUserData(args: { requestTarget: string, requestProperty: string, userProperty: string}) {
		return (req: any, res: Response, next: (error?: IErrorMetadata) => void) => {
			const { user } = req;

			req[args.requestTarget][args.requestProperty] = user[args.userProperty];

			next();
		}
	}
}

const passportClient = new PassportClient();

export{ passportClient }