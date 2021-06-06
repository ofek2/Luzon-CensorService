import { WhitelistService } from "./WhitelistService";
import { workersPool } from "../clients/workersPool";

interface ICensorTextPayload {
    censoredText: string,
    droppedWords: Array<string> 
}

class TextService {
    static censorText(text: string): Promise<ICensorTextPayload> {
        return new Promise(async (resolve, reject) => {
            try {
                const { censoredText, droppedWords } = await workersPool.Pool.exec({ 
                    text, 
                    whitelist: WhitelistService.getWhitelistNestedMap() 
                });
    
                resolve({ censoredText, droppedWords });
            } catch(error) {
                reject(error);
            }
        });
    }
}

export { TextService, ICensorTextPayload };