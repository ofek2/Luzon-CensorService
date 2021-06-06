interface IForbiddenWord {
    word: string,
    forbiddenSequences: Array<IForbiddenWord>
}

interface IWord extends IForbiddenWord {
    isDeleted: boolean,
}

export { IWord, IForbiddenWord }