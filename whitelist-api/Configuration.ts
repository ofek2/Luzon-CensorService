import dotenv from 'dotenv';

dotenv.config();

interface IConfiguration {
    application: IApplicationConfiguration,
    storage: IStorageConfiguration,
}

interface IApplicationConfiguration {
    port: number,
    jsonBodyMaxSize: string,
    isProduction: boolean,
    maxPageSize: number,
}

interface IStorageConfiguration {
    type: "mongo" | string,
    mongoConfiguration?: IMongoConfiguration,
}

interface IMongoConfiguration {
    connectionString: string,
    databaseName: string
}

const Configuration: IConfiguration = {
    application: {
		port: +process.env.PORT || 8001,
		jsonBodyMaxSize: process.env.JSON_BODY_MAX_SIZE || "30mb",
		isProduction: process.env.IS_PRODUCTION === "true" || false,
        maxPageSize: (process.env.MAX_PAGE_SIZE && parseInt(process.env.MAX_PAGE_SIZE)) || 20,
    },
    storage: {
        type: process.env.STORAGE_TYPE || "mongo",
        mongoConfiguration: {
            connectionString: process.env.MONGO_URI || "mongodb://mongo1:30001,mongo2:30002,mongo3:30003/my-replica-set",
            databaseName: process.env.MONGO_DATABASE || "development"
        },
    },
} 

function exctractStorageConfiguration(type: "mongo" | string): any {
    const { storage } = Configuration;
    let storageConfiguration;

    switch (type) {
        case "mongo":
            storageConfiguration = storage.mongoConfiguration;
        default:
            storageConfiguration = storage.mongoConfiguration;
            break;
    }

    return storageConfiguration;
}

export { Configuration, exctractStorageConfiguration, IConfiguration, IMongoConfiguration, IStorageConfiguration, IApplicationConfiguration}