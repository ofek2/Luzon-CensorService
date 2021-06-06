
import { Db, MongoClient } from "mongodb";
import { IMongoConfiguration } from '../../../Configuration'

class MongoClientFacade {
    private client: MongoClient;
    private databaseName : string;
    private database: Db;

	initMongoClient(configuration: IMongoConfiguration): void {
		this.client = new MongoClient(configuration.connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
		this.databaseName = configuration.databaseName;
		this.database = null;
	}

	connect(onResolve: (msg: string) => void, onReject: (msg: string) => void): void {
		if (!this.client) {
			onReject("Error: mongo client must be initialized");
		} else {
			// If already connected, invoke the done function
			this.database ? onResolve("Succeed: connection to the database is already exist") : () => {};

			this.client.connect(err => {
				if (err === null) { // If connection to the db can not open
					this.database = this.client.db(this.databaseName);
					onResolve("Succeed: a connection to the database have been established");
				} else {
					onReject("Error: could not open a connection to the database");
				}
			});
		}
	}

	get Database(): Db {
		if(this.database) {
			return this.database;
		} else {
			throw new Error('Mongo database is null or undefined');
		}
	}

	get Client(): MongoClient {
		if(this.client) {
			return this.client;
		} else {
			throw new Error('Mongo client is null or undefined');
		}
	}

	close(): void {
		if (this.database) {
			this.client.close(() => {
				this.database = null;
			});
		}
	}
}

export { MongoClientFacade }