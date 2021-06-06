import { IForbiddenWord, IWord } from "src/interfaces/model/IWord";

class Whitelist {
    private whitelistNestedMap: any;
    
    public constructor(whitelistArray: Array<IWord>) {
        if(whitelistArray && Array.isArray(whitelistArray)) {
                this.whitelistNestedMap = this.wordsArrToNestedTree(whitelistArray);
        } else {
            throw new Error("Censor service error, the array given is not allowed");
        }
    }

    // Getters
    public get WhitelistNestedMap(): object {
        const isWhitelistNestedMap = Boolean(this.whitelistNestedMap);

        if(isWhitelistNestedMap) {
            return this.whitelistNestedMap;
        } else {
            throw new Error("Censor service error, WhitelistNestedMap not defined");
        }
    }

    private wordsArrToNestedTree(list: Array<IWord>): any {
        const wordsMap: any = {};

        list.forEach((wordMetadata) => {
            if(!wordMetadata.isDeleted) {
                const key = wordMetadata.word;

                wordsMap[key] = this.wordToNestedTree(wordMetadata, true);
            }
        });

        return wordsMap;
    }

    private wordToNestedTree(wordMetadata: IWord | IForbiddenWord, isRoot: boolean): any {
        let valueToReturn: any;

        if(wordMetadata.forbiddenSequences.length === 0) {
            valueToReturn = isRoot;
        } else {
            valueToReturn = {};
            wordMetadata.forbiddenSequences.forEach(sequence => {
                valueToReturn[sequence.word] = this.wordToNestedTree(sequence, false);
            })
        }

        return valueToReturn;
    }

    public updateWhitelist(wordMetadata: IWord) {
        const singleWordTree = this.wordsArrToNestedTree([ wordMetadata ]);

        this.whitelistNestedMap[wordMetadata.word] = singleWordTree[wordMetadata.word];
    }

    public removeFromWhitelist(word: string) {
        delete this.whitelistNestedMap[word];
    }

    public getFromWhitelist(word: string) {
        return this.whitelistNestedMap[word];
    }
}

export { Whitelist };