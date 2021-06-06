import { FilterQuery } from "mongodb";
import { StorageResources } from "../../enums/StorageResources";
import { IBlacklistWord, IGraylistWord, IGraylistWordBase, IWhitelistWord } from "../model/IWords";

interface IGetListArgs {
    listType: StorageResources,
    pageNumber?: number,
    pageSize?: number,
    filter?: FilterQuery<any>,
    sortBy?: string,
    ascending?: number
}

interface ICreateOrUpdateWhitelistWordArgs {
    wordMetadata: IWhitelistWord
}

interface IListLeftOuterJoin {
    listType: StorageResources,
    words: Array<string>
}

interface ICreateOrUpdateGraylistWordArgs {
    word: string
}

interface ICreateOrUpdateGraylistWordsArgs {
    words: Array<string>
}

interface ICreateBlacklistWordArgs {
    wordMetadata: IBlacklistWord
}

interface IDeleteGraylistWord {
    word: string
}

interface IDeleteBlacklistWord {
    word: string
}

interface IGetWordArgs {
    listType: StorageResources,
    word: string
}

/**
 * The polymorphic base to the data access layer of the lists resource.
 */
interface IListsDal {
    getList(args: IGetListArgs): Promise<{ list: Array<any>, count: number }>,
    getWord(args: IGetWordArgs): Promise<IWhitelistWord | IGraylistWord | IBlacklistWord>,
    createOrUpdateWhitelistWord(args: ICreateOrUpdateWhitelistWordArgs): Promise<IWhitelistWord>,
    createOrUpdateGraylistWord(args: ICreateOrUpdateGraylistWordArgs): Promise<IGraylistWord>,
    createOrUpdateGraylistWords(args: ICreateOrUpdateGraylistWordsArgs): Promise<Array<Promise<IGraylistWord>>>,
    deleteGraylistWord(args: IDeleteGraylistWord): Promise<IGraylistWord>,
    createBlacklistWord(args: ICreateBlacklistWordArgs): Promise<IBlacklistWord>,
    deleteBlacklistWord(args: IDeleteBlacklistWord): Promise<IBlacklistWord>
}

export { IListsDal, IGetListArgs, ICreateOrUpdateWhitelistWordArgs, ICreateOrUpdateGraylistWordArgs,
    ICreateOrUpdateGraylistWordsArgs, IDeleteBlacklistWord, ICreateBlacklistWordArgs, IDeleteGraylistWord,
    IGetWordArgs, IListLeftOuterJoin }