import express from "express";
import { dalFactory } from "./src/dal/DalFactory";
import { Configuration, exctractStorageConfiguration, IConfiguration } from "./Configuration";
import { applyRoutesMiddleware } from "./src/middlewares/applyRoutesMiddleware";
import { applyThirdPartyMiddleware } from "./src/middlewares/applyThirdPartyMiddleware";
import { logger } from "./src/clients/loggerClient";
import { WhitelistService } from "./src/services/WhitelistService";

/**
 * Run all dependencies code and create & run an express application.
 * @param configuration the configuration for the application 
 */
function createExpressApplication(configuration: IConfiguration): Promise<any> {
    const app = express();
    const { application, storage  } = configuration;
    const creationPromise = new Promise((resolve, reject) => {
        // Initialize the dal compeser according to the configuration
        dalFactory.initialize(storage.type, exctractStorageConfiguration(storage.type))
            .then(message => {
                logger.info(`Initializeing WhitelistService`)
                WhitelistService.initialize()
                    .then(message => {
                        logger.info(message);
                        applyThirdPartyMiddleware(app);
                        applyRoutesMiddleware(app);
                        app.listen( application.port, () => {
                            logger.info(`Application started at port: ${ application.port }`)
                        });
                        resolve("Application succeed to build");
                    })
                    .catch(error => {
                        logger.error(`WhitelistService Error: ${error}, stack: ${error.stack}}`);
                        reject(error);
                    })
            })
            .catch(error => {
                logger.error(`DalFactory error: failed open connection to storage, error: ${error}, stack: ${error.stack}}`);
                reject(error);
            });
    });
    
    return creationPromise;
}

/**
 * The main start up function.
 */
async function main() {
    logger.info("The application is trying to build up");
    await createExpressApplication(Configuration);
    process.on("unhandledRejection", (error: any) => {
        logger.error(`Unexpected error: ${error}, stack: ${error.stack}`);
    });
}

main();