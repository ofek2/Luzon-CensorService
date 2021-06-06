import axios, { AxiosResponse } from "axios";
import { Configuration } from "../../Configuration";

class ListService {
    private url: string;

    constructor(url: string) {
        this.url = url;
    }

    public addToGraylist(words: Array<string>): Promise<AxiosResponse> {
        return axios.post(this.url, {
            words
        });
    }
}

const listService = new ListService(Configuration.application.listsServiceUrl);

export { listService }