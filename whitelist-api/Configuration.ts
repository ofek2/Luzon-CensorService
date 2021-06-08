import dotenv from 'dotenv';
import { SamlConfig } from "passport-saml";

dotenv.config();

interface IConfiguration {
    application: IApplicationConfiguration,
    storage: IStorageConfiguration,
    authentication: IAuthenticationConfiguration
}

interface IApplicationConfiguration {
    port: number,
    jsonBodyMaxSize: string,
    isProduction: boolean,
    maxPageSize: number,
    frontendUrl: string,
    allowedUsers: Array<string>
}

interface IStorageConfiguration {
    type: "mongo" | string,
    mongoConfiguration?: IMongoConfiguration,
}

interface IProfileExtractor {
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    displayName: string
}

interface IMetadata {
    entityId: string
}

interface IAuthenticationConfiguration {
    saml: SamlConfig,
    profileExtractor: IProfileExtractor,
    metadata: IMetadata
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
        frontendUrl: process.env.FRONTEND_URL || "localhost:3000",
        allowedUsers: (process.env.ALLOWED_USERS && process.env.ALLOWED_USERS.split(",")) || ["s8142049"],
        maxPageSize: (process.env.MAX_PAGE_SIZE && parseInt(process.env.MAX_PAGE_SIZE)) || 20,
    },
    storage: {
        type: process.env.STORAGE_TYPE || "mongo",
        mongoConfiguration: {
            connectionString: process.env.MONGO_URI || "mongodb://mongo1:30001,mongo2:30002,mongo3:30003/my-replica-set",
            databaseName: process.env.MONGO_DATABASE || "development"
        },
    },
    authentication: {
        saml: {
            entryPoint:
                process.env.SAML_ENTRY_POINT ||
                "http://localhost:8080/simplesaml/saml2/idp/SSOService.php",
            issuer: process.env.SAML_ISSUER || "http://localhost:9002/metadata.xml",
            callbackUrl:
                process.env.SAML_CALLBACK_URL ||
                "http://localhost:9002/auth/saml/callback",
            authnContext:
                "http://schemas.microsoft.com/ws/2008/06/identity/authenticationmethod/windows",
        },
        profileExtractor: {
            id: process.env.PROFILE_EXTRACTOR_ID || "uid",
            firstName: process.env.PROFILE_EXTRACTOR_FIRST_NAME || "email",
            lastName: process.env.PROFILE_EXTRACTOR_LAST_NAME || "email",
            email: process.env.PROFILE_EXTRACTOR_MAIL || "email",
            displayName: process.env.PROFILE_EXTRACTOR_DISPLAY_NAME || "email"
        },
        metadata: {
            entityId: process.env.METADATA_ENTITY_ID || 'http://localhost:9002/metadata.xml'
        },
    }
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