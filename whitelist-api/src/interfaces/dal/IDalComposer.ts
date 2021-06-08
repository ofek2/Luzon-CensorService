import { IListsDal } from "./IListsDal";

interface IDalComposerGetApi {
    ListDal: IListsDal
}

interface IDalComposer {
    initialize(configuration: any): Promise<string>,
    client: any,
    Api: IDalComposerGetApi
}

export { IDalComposer, IDalComposerGetApi }