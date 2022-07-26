import express from "express";
import { dalFactory } from "./src/dal/DalFactory";
import { Configuration, exctractStorageConfiguration, IConfiguration } from "./Configuration";
import { applyRoutesMiddleware } from "./src/middlewares/applyRoutesMiddleware";
import { applyThirdPartyMiddleware } from "./src/middlewares/applyThirdPartyMiddleware";
import { applySamlMiddleware } from "./src/middlewares/applySamlMiddleware";
import { logger } from "./src/clients/loggerClient";
import proxy from "express-http-proxy";
import { passportClient } from "./src/clients/passportClient";

/**
 * Run all dependencies code and create & run an express application.
 * @param configuration the configuration for the application 
 */
function createExpressApplication(configuration: IConfiguration) {
    const app = express();
    const { application, storage  } = configuration;
    
    // Initialize the dal compeser according to the configuration
    dalFactory.initialize(storage.type, exctractStorageConfiguration(storage.type))
        .then(message => {
            logger.info(message);
            applyThirdPartyMiddleware(app);
            applySamlMiddleware(app);
            applyRoutesMiddleware(app);
            app.get("/unauthorized", (req, res, next) => {
    			res.sendFile('/app/unauthorized.html');
            })
            app.all("/*",
                passportClient.createLoggedInUserAuthorizeMiddleware({shouldRedirectToHome: true, shouldActive: Configuration.authentication.shouldUseAuth }),
                proxy(Configuration.application.frontendUrl)
            );
            app.listen( application.port, () => {
                logger.info(`Application started at port: ${ application.port }`)
            });
        })
        .catch(error => {
            logger.error(`DalFactory error: failed open connection to storage, error: ${error}, stack: ${error.stack}}`);
        });
}

/**
 * The main start up function.
 */
function main() {
    logger.info("The application is trying to build up");
    createExpressApplication(Configuration);
    process.on("unhandledRejection", (error: any) => {
        logger.error(`Unexpected error: ${error}, stack: ${error.stack}`);
    });
}

main();