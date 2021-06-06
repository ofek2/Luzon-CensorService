import { StorageResources } from "../enums/StorageResources";
import { Whitelist } from "../classes/Whitelist";
import { dalFactory } from "../dal/DalFactory";

class WhitelistService {
    static whitelist: Whitelist;

    static async initialize() {
        const opPromise = new Promise<void>(async (resolve, reject) => {
            try {
                const whitelistData = await dalFactory.DalComposer.Api.ListDal.getList({listType: StorageResources.WHITELIST});

                WhitelistService.whitelist = new Whitelist(whitelistData.list);
                dalFactory.DalComposer.Api.ListDal.mountChangesStream({
                    collectionToMountOn: StorageResources.WHITELIST,
                    onInsertOrReplace: (fulldocument) => {
                        const { word, isDeleted, forbiddenSequences } = fulldocument;

                        if(isDeleted) {
                            WhitelistService.whitelist.removeFromWhitelist(word);
                        } else {
                            WhitelistService.whitelist.updateWhitelist({
                                word, 
                                isDeleted,
                                forbiddenSequences
                            });
                        } 
                    }
                });

                resolve();
            } catch (err) {
                reject(err);
            }
        });

        return opPromise;
    }

    static getWhitelistNestedMap() {
        if (WhitelistService.whitelist) {
            return WhitelistService.whitelist.WhitelistNestedMap;
        } else {
            throw new Error("Whitelist service must be initialized");
        }
    }
}

export { WhitelistService };