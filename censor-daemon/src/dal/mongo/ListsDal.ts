import { IGetListArgs, IListsDal, IMountChangesStreamArgs } from "../../interfaces/dal/IListsDal";
import { MongoClientFacade } from "./MongoClientFacade";
import { ChangeStream, ChangeEventCR } from "mongodb";

/**
 * This class is a concreate implementation to the IListDal interface.
 * All the logic of the list resource in the storage is encapsulated here.
 */
class ListsDal implements IListsDal {
    /**
     * Private class members.
     * mongoClientFacade - is the object to interact with the database.
     * changesStream - is the ChangeStream object for listening to database collections changes.
     */
    private mongoClientFacade: MongoClientFacade;
    private changesStream: ChangeStream;

    /**
     * Constructor
     * @param mongoClientFacade the object to interact with the database
     */
    constructor(mongoClientFacade: MongoClientFacade) {
        this.mongoClientFacade = mongoClientFacade;
    }

    /**
     * Get list data from the storage
     * @param args the input arguments
     * @returns the paged list and the count of the total number
     */
    public async getList(args: IGetListArgs): Promise<{ list: Array<any>, count: number }> {
        const { listType, pageNumber, pageSize } = args;
        let cursor = this.mongoClientFacade.Database.collection(listType).find();

        if (pageNumber !== undefined && pageSize != undefined) {
            cursor = cursor.skip(pageNumber * pageSize).limit(pageSize);
        }

        const whitelistArrayPromise = cursor.toArray();
        const countWhitelistTotal = cursor.count(false);
        const [list, count] = await Promise.all([whitelistArrayPromise, countWhitelistTotal])

        return { list, count };
    }

    /**
     * Bind a callback function to specific list collection changes in the database
     * @param args argument to the function
     */
    public mountChangesStream(args: IMountChangesStreamArgs): void {
        const { collectionToMountOn, onInsertOrReplace } = args;

        if(this.changesStream === undefined) {
            this.changesStream = this.mongoClientFacade.Database.collection(collectionToMountOn).watch();
            this.changesStream.on("change", (changedMetadata: ChangeEventCR) => {
                const { operationType, fullDocument } = changedMetadata;

                switch (operationType) {
                    case "insert":
                    case "replace":
                        onInsertOrReplace(fullDocument);
                        break;
                }
            });
        } else {
            throw Error("ListDal Error: change stream is already exist, make sure not to invoke mountChangesStream more then once")
        }
    }
}

export { ListsDal }