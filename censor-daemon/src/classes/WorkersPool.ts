import { StaticPool } from "node-worker-threads-pool";
import { ICensorArgsPartial } from "../classes/CensorJS";
import { ICensorTextPayload } from "../services/TextService";

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

    public async closePool(): Promise<void> {
        return this.pool.destroy()
    }
}

export { WorkersPool, IWorkersParams }