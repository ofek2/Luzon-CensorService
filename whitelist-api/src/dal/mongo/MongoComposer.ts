import { IDalComposer, IDalComposerGetApi } from "../../interfaces/dal/IDalComposer";
import { MongoClientFacade } from "./MongoClientFacade";
import { ListsDal } from "./ListsDal";
import { promiseLogerWrapper } from "../../clients/loggerClient";
import { IMongoConfiguration } from "Configuration";

/**
 * A concreate implementation of IDalComposer to MongoDB.
 * Create the MongoClientFacade instance and
 * create all dals objects instances and compose them to a generic Api property.
 */
class MongoComposer implements IDalComposer {
    private api: IDalComposerGetApi;
    private mongoClientFacade: MongoClientFacade;

    /**
     * Initialize the mongo composer, the composer is composing all the nececery logic to use the storage data.
     * It creates the dals objects instance and the mongo 
     * client facade object and open a connection to the database
     * @param configuration object 
     * @returns Promise
     */
    public initialize(configuration: IMongoConfiguration): Promise<string> {
        return promiseLogerWrapper(new Promise((resolve, reject) => {
            try {
                // Initializing the mongo client facade
                const { connectionString, databaseName } = configuration;

                this.mongoClientFacade = new MongoClientFacade();
                this.mongoClientFacade.initMongoClient({ connectionString, databaseName });
                // Open a persistent connection to the database
                this.mongoClientFacade.connect(resolveMsg => {
                    this.api = {
                        ListDal: new ListsDal(this.mongoClientFacade)
                    };
                    resolve(resolveMsg);
                }, rejectMsg => {
                    reject(rejectMsg);
                });
            } catch(error) {
                reject(error);
            } 
        }), "Error");
    }

    /**
     * The composed data access api
     */
    public get Api(): IDalComposerGetApi {
        return this.api;
    }

    public get client(): MongoClientFacade {
        return this.mongoClientFacade;
    }
}

export { MongoComposer }