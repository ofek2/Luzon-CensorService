interface IErrorMetadata {
    error: string,
    type: "inputValidation" | "logic" | "authorization",
    stackTrace?: string
    code?: number
}

export { IErrorMetadata }