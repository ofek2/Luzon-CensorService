import { Request, Response } from "express";
import { IErrorMetadata } from "../interfaces/model/IErrorMetadata";
import { StatusCodes } from "http-status-codes";
import { StorageResources } from "../enums/StorageResources";
import { dalFactory } from "../dal/DalFactory";
import { IWhitelistWord } from "../interfaces/model/IWords";

class ListsController {
    public static createGetFromListFunction(listType: StorageResources): (req: Request, res: Response, next: (error?: IErrorMetadata) => void) => void {
        return async (req: Request, res: Response, next: (error?: IErrorMetadata) => void) => {
            const { pageNumber, pageSize, search, sortBy, ascending } = req.query;
            const filter: any = { };

            search ? filter.word = { $regex: `.*${search}.*` } : undefined; // add search filtering 
            listType === StorageResources.WHITELIST ? filter.isDeleted = false : undefined;

            try {
                const result = await dalFactory.DalComposer.Api.ListDal.getList({ 
                    listType, 
                    pageNumber: parseInt(pageNumber as string), 
                    pageSize: parseInt(pageSize as string),
                    filter,
                    sortBy: sortBy as string,
                    ascending: parseInt(ascending as string)
                });

                res.status(StatusCodes.OK).send(result);
            } catch(error) {
                next({
                    error: `Failed to get list data - ${listType}`,
                    code: StatusCodes.INTERNAL_SERVER_ERROR,
                    type: "logic",
                    stackTrace: error
                });
            }
        }
    }

    public static async createWordInWhitelist(req: Request, res: Response, next: (error?: IErrorMetadata) => void) {
        const requestBody: { wordMetadata: IWhitelistWord } = req.body;

        try {
            await dalFactory.DalComposer.Api.ListDal.createOrUpdateWhitelistWord({ 
                wordMetadata: requestBody.wordMetadata 
            });

            res.status(StatusCodes.OK).send(requestBody.wordMetadata);
        } catch(error) {
            next({
                error: `Failed to create word: ${requestBody.wordMetadata.word}  in whitelist`,
                code: StatusCodes.INTERNAL_SERVER_ERROR,
                type: "logic",
                stackTrace: error
            });
        }
    }
 
    public static async deleteWordFromBlacklist(req: Request, res: Response, next: (error?: IErrorMetadata) => void) {
        const { word } = req.params;

        try {
            const result = await dalFactory.DalComposer.Api.ListDal.deleteBlacklistWord({ word });

            res.status(StatusCodes.OK).send(result);
        } catch(error) {
            next({
                error: `Failed to delete word from blacklist: ${word}`,
                code: StatusCodes.INTERNAL_SERVER_ERROR,
                type: "logic",
                stackTrace: error
            });
        }
    }
    
    public static async deleteWordFromGraylist(req: Request, res: Response, next: (error?: IErrorMetadata) => void) {
        const { word } = req.params;

        try {
            const result = await dalFactory.DalComposer.Api.ListDal.deleteGraylistWord({ word });

            res.status(StatusCodes.OK).send(result);
        } catch(error) {
            next({
                error: `Failed to delete word from graylist: ${word}`,
                code: StatusCodes.INTERNAL_SERVER_ERROR,
                type: "logic",
                stackTrace: error
            });
        }
    }

    public static async createWordInBlacklist(req: Request, res: Response, next: (error?: IErrorMetadata) => void) {
        const requestBody: { wordMetadata: string } = req.body;

        try {
            const result = await dalFactory.DalComposer.Api.ListDal.createBlacklistWord({ 
                wordMetadata: { word: requestBody.wordMetadata }
            });

            res.status(StatusCodes.OK).send(result);
        } catch(error) {
            next({
                error: `Failed to create word: ${requestBody.wordMetadata}  in blacklist`,
                code: StatusCodes.INTERNAL_SERVER_ERROR,
                type: "logic",
                stackTrace: error
            });
        }
    }

    public static async updateWordsInGraylist(req: Request, res: Response, next: (error?: IErrorMetadata) => void) {
        const requestBody: { words: Array<string> } = req.body;

        try {
            await dalFactory.DalComposer.Api.ListDal.createOrUpdateGraylistWords({ 
                words: requestBody.words
            });

            res.status(StatusCodes.OK).send();
        } catch(error) {
            next({
                error: `Failed to update words in graylist`,
                code: StatusCodes.INTERNAL_SERVER_ERROR,
                type: "logic",
                stackTrace: error
            });
        }
    }

    public static async validateWhitelistWordCreation(req: Request, res: Response, next: (error?: IErrorMetadata) => void) {
        const requestBody: { wordMetadata: IWhitelistWord } = req.body;

        try {
            const getFromBlacklist =  dalFactory.DalComposer.Api.ListDal.getWord({ 
                word: requestBody.wordMetadata.word, 
                listType: StorageResources.BLACKLIST
            });
            const getFromGraylist = dalFactory.DalComposer.Api.ListDal.getWord({ 
                word: requestBody.wordMetadata.word, 
                listType: StorageResources.GRAYLIST
            });
            const [blacklistResult, graylistResult] = await Promise.all([getFromBlacklist, getFromGraylist]);

            if(!blacklistResult && !graylistResult && requestBody.wordMetadata.word.trim() !== '') {
                next();
            } else {
                next({
                    error: `Word already exist in other list`,
                    code: StatusCodes.INTERNAL_SERVER_ERROR,
                    type: "logic",
                });
            }
        } catch(error) {
            next({
                error: `Failed to validate create in whitelist request`,
                code: StatusCodes.INTERNAL_SERVER_ERROR,
                type: "logic",
                stackTrace: error
            });
        }
    }

    public static async validateBlacklistWordCreation(req: Request, res: Response, next: (error?: IErrorMetadata) => void) {
        const requestBody: { wordMetadata: string } = req.body;

        try {
            const getFromWhitelist =  dalFactory.DalComposer.Api.ListDal.getWord({ 
                word: requestBody.wordMetadata, 
                listType: StorageResources.WHITELIST
            });
            const getFromGraylist = dalFactory.DalComposer.Api.ListDal.getWord({ 
                word: requestBody.wordMetadata, 
                listType: StorageResources.GRAYLIST
            });
            const [whitelistResult, graylistResult] = await Promise.all([getFromWhitelist, getFromGraylist]);
            console.log(whitelistResult);
            console.log(graylistResult);
            
            if(!whitelistResult && !graylistResult && requestBody.wordMetadata.trim() !== '') {
                next();
            } else {
                next({
                    error: `Word already exist in other list`,
                    code: StatusCodes.INTERNAL_SERVER_ERROR,
                    type: "logic",
                });
            }
        } catch(error) {
            next({
                error: `Failed to validate create in whitelist request`,
                code: StatusCodes.INTERNAL_SERVER_ERROR,
                type: "logic",
                stackTrace: error
            });
        }
    }
}

export { ListsController }