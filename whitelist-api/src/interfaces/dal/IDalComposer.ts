import { IListsDal } from "./IListsDal";

interface IDalComposerGetApi {
    ListDal: IListsDal
}

interface IDalComposer {
    initialize(configuration: any): Promise<string>,
    Api: IDalComposerGetApi
}

export { IDalComposer, IDalComposerGetApi }