import { Request, Response } from "express";
import { IErrorMetadata } from "../interfaces/model/IErrorMetadata";
import { StatusCodes } from "http-status-codes";
import { Configuration } from "../../Configuration";
import { TextService } from "../services/TextService";
import { listService } from "../services/ListService";
import { logger } from "../clients/loggerClient";

class TextController {
    public static async isCreateCensorTextReqValid(req: Request, res: Response, next: (error?: IErrorMetadata) => void) {
		const isReqValid = Object.keys(req.body).length !== 0 ;

		if(isReqValid) {
			next();
		} else {
            next({
                error: `Not valid body`,
                code: StatusCodes.BAD_REQUEST,
                type: "logic",
            });
		}
	}

	public static async createCensorText(req: Request, res: Response, next: (error?: IErrorMetadata) => void) {
        try {
            const dynamicBodyString = JSON.stringify(req.body);
            const { censoredText, droppedWords } = await TextService.censorText(dynamicBodyString);
            const censoredTextAsJson = JSON.parse(censoredText);
    
            listService.addToGraylist(Object.keys(droppedWords))
                .catch(error => {
                    logger.error(`Failed to update graylist: ${error}`);
                });

            res.json(censoredTextAsJson);
        } catch(error) {
            next({
                error: `Failed to censor text`,
                code: StatusCodes.INTERNAL_SERVER_ERROR,
                type: "logic",
                stackTrace: error
            });
        }
	}
}

export { TextController }