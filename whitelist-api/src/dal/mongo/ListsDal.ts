import { MongoClientFacade } from "./MongoClientFacade";
import { ICreateBlacklistWordArgs, ICreateOrUpdateGraylistWordArgs, ICreateOrUpdateGraylistWordsArgs, ICreateOrUpdateWhitelistWordArgs, IDeleteBlacklistWord,
IDeleteGraylistWord, IGetListArgs, IGetWordArgs, IListLeftOuterJoin, IListsDal } from "../../interfaces/dal/IListsDal";
import { IWhitelistWord, IGraylistWord, IBlacklistWord } from "../../interfaces/model/IWords";
import { StorageResources } from "../../enums/StorageResources";

/**
 * This class is a concreate implementation to the IListDal interface.
 * All the logic of the list resource in the storage is encapsulated here.
 */
class ListsDal implements IListsDal {
    /**
     * Private class members.
     * mongoClientFacade - is the object to interact with the database.
     */
    private mongoClientFacade: MongoClientFacade;

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
        const { listType, pageNumber, pageSize, filter, sortBy, ascending } = args;
        let cursor = this.mongoClientFacade.Database.collection(listType).find(filter).sort({_id: -1});

        if(sortBy && ascending) {
            cursor = cursor.sort(sortBy, ascending);
        }

        if (pageNumber !== undefined && pageSize != undefined) {
            cursor = cursor.skip(pageNumber * pageSize).limit(pageSize).project({ _id: 0 });
        }

        const whitelistArrayPromise = cursor.toArray();
        const countWhitelistTotal = cursor.count(false);
        const [list, count] = await Promise.all([whitelistArrayPromise, countWhitelistTotal])

        return { list, count };
    }

    public getWord(args: IGetWordArgs): Promise<IWhitelistWord | IBlacklistWord | IGraylistWord> {
        const query: any = { word: args.word };

        if(args.listType === StorageResources.WHITELIST) {
            query.isDeleted = false;
        }

        return this.mongoClientFacade.Database
            .collection(args.listType)
            .findOne(query)
            .then(result => result);
    }

    public createOrUpdateWhitelistWord(args: ICreateOrUpdateWhitelistWordArgs): Promise<IWhitelistWord> {
        return this.mongoClientFacade.Database
            .collection(StorageResources.WHITELIST)
            .findOneAndReplace({ word: args.wordMetadata.word }, args.wordMetadata, { upsert: true })
            .then(mongoResult => mongoResult.value);
    }

    public createOrUpdateGraylistWord(args: ICreateOrUpdateGraylistWordArgs): Promise<IGraylistWord> {
        return this.mongoClientFacade.Database
            .collection(StorageResources.GRAYLIST)
            .findOneAndUpdate({ word: args.word },
                { $set: { word: args.word }, $inc: { censoredCount: 1 } }, 
                { upsert: true })
            .then(mongoResult => mongoResult.value);
    }

    private async listRigthAntiJoin(args: IListLeftOuterJoin): Promise<Array<string>> {
        const foundedWords = (await this.mongoClientFacade.Database.collection(args.listType).find({word: { $in: args.words }}).toArray()).map(foundObj => foundObj.word);
        
        return args.words.filter(word => foundedWords.indexOf(word) < 0);
    }

    public async createOrUpdateGraylistWords(args: ICreateOrUpdateGraylistWordsArgs): Promise<Array<Promise<IGraylistWord>>> {
        const blackFilteredWords = await this.listRigthAntiJoin({ listType: StorageResources.BLACKLIST, words: args.words });
        const whiteFilteredWords = await this.listRigthAntiJoin({ listType: StorageResources.WHITELIST, words: args.words });

        return blackFilteredWords.filter(word => whiteFilteredWords.indexOf(word) > -1).map(word => this.createOrUpdateGraylistWord({ word }));
    }

    public deleteGraylistWord(args: IDeleteGraylistWord): Promise<IGraylistWord> {
        return this.mongoClientFacade.Database
            .collection(StorageResources.GRAYLIST)
            .findOneAndDelete({ word: args.word })
            .then(mongoResult => mongoResult.value);
    }

    public createBlacklistWord(args: ICreateBlacklistWordArgs): Promise<IBlacklistWord> {
        return this.mongoClientFacade.Database
        .collection(StorageResources.BLACKLIST)
        .insertOne({ word: args.wordMetadata.word })
        .then(mongoResult => mongoResult.result.ok === 1 ? args.wordMetadata : null);
    }

    public deleteBlacklistWord(args: IDeleteBlacklistWord): Promise<IBlacklistWord> {
        return this.mongoClientFacade.Database
        .collection(StorageResources.BLACKLIST)
        .findOneAndDelete({ word: args.word })
        .then(mongoResult => mongoResult.value);
    }
}

export { ListsDal }