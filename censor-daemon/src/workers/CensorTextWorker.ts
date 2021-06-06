import { ICensorArgs, Censor } from "../classes/CensorJS";
import { logger } from "../clients/loggerClient";
import { workerData, parentPort } from 'worker_threads';

/**
 * This code is design to run in a seperated worker thread.
 * The main process of node will not will be the one to run this code 
 * because of high computing time.
 * The code from the main tread will only scadule a new task to this worker.
 */

/**
 * Read data from for worker
 */
const { text, whitelist, fixedAllowedChars, fixedAllowedWords, replaceString,
    mixSpaceBetweenPrefixAndSuffix, prefixAllowedLettersCount, suffixAllowedLettersCount } = workerData;

/**
 * Censoring a text function
 * @param text the plaintext
 * @param args the config arguments
 * @returns censored text
 */
function censorText(text: string, args: ICensorArgs): { censoredText: string, droppedWords: any } {
    const censorObj = new Censor({
        whitelist: whitelist,
        fixedAllowedChars,
        fixedAllowedWords,
        replaceString,
        mixSpaceBetweenPrefixAndSuffix,
        prefixAllowedLettersCount,
        suffixAllowedLettersCount
    });
    const { censoredText, droppedWords } = censorObj.replaceFromJson(text);

    return { censoredText, droppedWords };
}

/**
 * Try to invoke the censoring logic.
 * In case of fail exit with error code 1.
 */
try {
    const { censoredText, droppedWords } = censorText(text, {
        whitelist, 
        fixedAllowedChars, 
        fixedAllowedWords, 
        replaceString, 
        mixSpaceBetweenPrefixAndSuffix, 
        prefixAllowedLettersCount, 
        suffixAllowedLettersCount
    });
    
    parentPort.postMessage({ censoredText, droppedWords })
} catch(error) {
    logger.error(`Censor worker error: ${error}`);
    process.exit(1);
}