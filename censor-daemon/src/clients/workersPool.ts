import { Configuration } from "../../Configuration";
import { StaticPool } from "node-worker-threads-pool";
import { ICensorArgsPartial } from "../classes/CensorJS";
import { ICensorTextPayload } from "../services/TextService";

// Configuration for all workers, staticly from the env
const { fixedAllowedChars, fixedAllowedWords, replaceString, mixSpaceBetweenPrefixAndSuffix, 
    prefixAllowedLettersCount, suffixAllowedLettersCount } = Configuration.application;

interface IWorkersParams {
    text: string,
    whitelist: object
}

class WorkersPool {
    private pool: StaticPool<IWorkersParams, ICensorTextPayload, ICensorArgsPartial>;

    constructor(size: number, filePath: string, workerData: ICensorArgsPartial) {
        this.pool = new StaticPool({
            size,
            task: filePath,
            workerData,
        })
    }

    public get Pool() {
        return this.pool;
    }
}

const workersPool = new WorkersPool(5, "./src/workers/CensorTextWorker.js", { 
    fixedAllowedChars,
    fixedAllowedWords,
    mixSpaceBetweenPrefixAndSuffix,
    prefixAllowedLettersCount,
    replaceString,
    suffixAllowedLettersCount
});

export { workersPool };