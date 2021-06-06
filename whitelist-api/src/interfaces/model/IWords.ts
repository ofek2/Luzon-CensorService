interface IForbiddenWord {
    word: string,
    forbiddenSequences: Array<IForbiddenWord>
}

interface IWhitelistWord extends IForbiddenWord {
    isDeleted: boolean,
}

interface IGraylistWordBase {
    word: string,
}

interface IGraylistWord extends IGraylistWordBase {
    censoredCount: number
}

interface IBlacklistWord {
    word: string,
}

export { IBlacklistWord, IGraylistWord, IGraylistWordBase, IWhitelistWord, IForbiddenWord }