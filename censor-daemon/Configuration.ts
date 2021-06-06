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
    listsServiceUrl: string,
    maxPageSize: number,
    fixedAllowedChars: Array<string>,
    fixedAllowedWords: object,
    replaceString: string,
    mixSpaceBetweenPrefixAndSuffix: number,
    prefixAllowedLettersCount: number,
    suffixAllowedLettersCount: number
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
		listsServiceUrl: process.env.LISTS_SERVICE_URL || "http://localhost:9002/api/lists/graylist",
        fixedAllowedChars: (process.env.FIXED_ALLOWED_CHARS && [...process.env.FIXED_ALLOWED_CHARS.split(','), ',']) || ["{", "}", ":", ",", "."],
		fixedAllowedWords: getFixedAllowedWords() || { "calender-name": true, "calender": true, "day-1": true, "desctiption": true, "content": true },
		replaceString: process.env.REPLACE_STRING || "*",
		mixSpaceBetweenPrefixAndSuffix: (process.env.MIN_SPACE_BETWEEN_PREFIX_AND_SUFFIX && parseInt(process.env.MIN_SPACE_BETWEEN_PREFIX_AND_SUFFIX)) || 1,
		prefixAllowedLettersCount: (process.env.PREFIX_ALLOWED_LETTERS_COUNT && parseInt(process.env.PREFIX_ALLOWED_LETTERS_COUNT)) || 1,
		suffixAllowedLettersCount: (process.env.SUFFIX_ALLOWED_LETTERS_COUNT && parseInt(process.env.SUFFIX_ALLOWED_LETTERS_COUNT)) || 0,
    },
    storage: {
        type: process.env.STORAGE_TYPE || "mongo",
        mongoConfiguration: {
            connectionString: process.env.MONGO_URI || "mongodb://mongo1:30001,mongo2:30002,mongo3:30003/my-replica-set",
            databaseName: process.env.MONGO_DATABASE || "development"
        },
    },
} 

function getFixedAllowedWords(): object {
	let fixedAllowedWordsMap: any = {};

	if (process.env.FIXED_ALLOWED_WORDS) {
		process.env.FIXED_ALLOWED_WORDS && process.env.FIXED_ALLOWED_WORDS.split(',').forEach(word => fixedAllowedWordsMap[word] = true);
	} else {
		fixedAllowedWordsMap = null;
	}

	return fixedAllowedWordsMap;
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