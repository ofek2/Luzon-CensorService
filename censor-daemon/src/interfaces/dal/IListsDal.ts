import { StorageResources } from "../../enums/StorageResources";
import { IWord } from "../model/IWord";

interface IMountChangesStreamArgs {
    collectionToMountOn: StorageResources,
    onInsertOrReplace(fullDocument: any): void
}

interface IGetListArgs {
    listType: StorageResources,
    pageNumber?: number,
    pageSize?: number
}

/**
 * The polymorphic base to the data access layer of the lists resource.
 */
interface IListsDal {
    getList(args: IGetListArgs): Promise<{ list: Array<any>, count: number }>,
    mountChangesStream(args: IMountChangesStreamArgs): void
}

export { IListsDal, IMountChangesStreamArgs, IGetListArgs }