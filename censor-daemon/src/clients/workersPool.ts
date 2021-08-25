import { Configuration } from "../../Configuration";
import { WorkersPool } from "../classes/WorkersPool";

// Configuration for all workers, staticly from the env
const { fixedAllowedChars, fixedAllowedWords, replaceString, mixSpaceBetweenPrefixAndSuffix, 
    prefixAllowedLettersCount, suffixAllowedLettersCount } = Configuration.application;

const workersPool = new WorkersPool(5, "./src/workers/CensorTextWorker.js", { 
    fixedAllowedChars,
    fixedAllowedWords,
    mixSpaceBetweenPrefixAndSuffix,
    prefixAllowedLettersCount,
    replaceString,
    suffixAllowedLettersCount
});

export { workersPool };