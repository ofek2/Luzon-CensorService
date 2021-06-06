interface ICensorArgsPartial {
    fixedAllowedWords: object, 
    fixedAllowedChars: Array<string>,
    prefixAllowedLettersCount: number,
    suffixAllowedLettersCount: number, 
    mixSpaceBetweenPrefixAndSuffix: number, 
    replaceString: string
}

interface ICensorArgs extends ICensorArgsPartial {
    whitelist: object,
}

interface IRecursiveWordsCensor {
    isFoundSequence: boolean,
    censorText: string,
    iJump: number
}

class Censor {
    private whitelist: any;
    private fixedAllowedWords: any; 
    private fixedAllowedChars: Array<string>;
    private prefixAllowedLettersCount: number;
    private suffixAllowedLettersCount: number; 
    private mixSpaceBetweenPrefixAndSuffix: number; 
    private replaceString: string;
    private droppedWords: any;

	constructor(args: ICensorArgs) {
        const { whitelist, fixedAllowedWords, fixedAllowedChars, prefixAllowedLettersCount, 
            suffixAllowedLettersCount, mixSpaceBetweenPrefixAndSuffix, replaceString } = args;

		this.whitelist = whitelist;
		this.fixedAllowedWords = fixedAllowedWords;
		this.fixedAllowedChars = fixedAllowedChars;
		this.prefixAllowedLettersCount = prefixAllowedLettersCount;
		this.suffixAllowedLettersCount = suffixAllowedLettersCount;
		this.mixSpaceBetweenPrefixAndSuffix = mixSpaceBetweenPrefixAndSuffix;
		this.replaceString = replaceString;
		this.droppedWords = {};
	}

	private censorWord(word: string, withSpace: boolean): string {
		let censoredWord = '';
		this.droppedWords[word] = true;

		if (word.length >= this.suffixAllowedLettersCount + this.prefixAllowedLettersCount + this.mixSpaceBetweenPrefixAndSuffix) {
			for (let i = 0; i < word.length; i++) {
				if (i < this.prefixAllowedLettersCount) {
					censoredWord += word[i];
				} else {
					censoredWord += this.replaceString;
				}
			}
		} else {
			for (let i = 0; i < word.length; i++) {
				censoredWord += this.replaceString;
			}
		}

		return withSpace ? `${censoredWord} ` : censoredWord;
	}

	private recursiveWordsCensor(sourceText: string, wordsRelationshipObject: any, currentIndex: number): IRecursiveWordsCensor {
		let i = 1;
		let currentChar = sourceText[currentIndex + i];
		let currentWord = '';

		if (wordsRelationshipObject === false) {
			return {
				isFoundSequence: true,
				censorText: '',
				iJump: 0
			};
		} else if (wordsRelationshipObject === undefined) {
			return {
				isFoundSequence: false,
				censorText: null,
				iJump: null
			};
		}

		while (currentChar !== ' ' && currentChar !== '"') {
			i++;
			currentWord += currentChar;
			currentChar = sourceText[currentIndex + i];
		}

		const { isFoundSequence, censorText, iJump } = this.recursiveWordsCensor(sourceText, wordsRelationshipObject[currentWord], currentIndex + i);

		if (isFoundSequence === true) {
			return {
				isFoundSequence: isFoundSequence,
				censorText: `${this.censorWord(currentWord, false)}${censorText}`,
				iJump: i + iJump
			};
		} else {
			return {
				isFoundSequence: isFoundSequence,
				censorText: ``,
				iJump: 0
			};
		}

	}

	public replaceFromJson(source: string) {
		let sourceLength = source.length;
		let finalCensorText = '';
		let currentWord = '';
		let isInStartApostrophes = false;

		for (let i = 0; i <= sourceLength - 1; i++) {
			let currentChar = source[i];

			if (currentChar === '"' && isInStartApostrophes === false) {
				isInStartApostrophes = true;
				finalCensorText += currentChar;
				currentWord = '';
			} else if (currentChar === '"' && isInStartApostrophes === true) {
				isInStartApostrophes = false;
				// End situation when you have one word like "description": "שלום"
				if (currentWord.replace(/\s/g, '').length) {
					if (this.fixedAllowedWords[currentWord] === true) {
						finalCensorText += currentWord;
						currentWord = '';
					} else if (typeof this.whitelist[currentWord] === 'object') { // When you have black list for the word
						const { isFoundSequence, censorText, iJump } = this.recursiveWordsCensor(source, this.whitelist[currentWord], i);

						if (isFoundSequence === true) {
							finalCensorText += `${this.censorWord(currentWord, false)}${censorText}`;
							i += iJump - 1;
							currentWord = '';
						} else {
							finalCensorText += `${currentWord}`;
							currentWord = '';
						}
					} else if (this.whitelist[currentWord] === true) {
						finalCensorText += currentWord;
						currentWord = '';
					} else {
						finalCensorText += this.censorWord(currentWord, false);
					}
				}

				finalCensorText += currentChar;
				currentWord = '';
			} else if (isInStartApostrophes === false && this.fixedAllowedChars.some(char => currentChar === char)) {
				finalCensorText += currentChar;
			} else if (isInStartApostrophes === true) {
				if (currentChar !== " ") {
					currentWord += currentChar;
				} else {
					if (currentWord.replace(/\s/g, '').length) {
						if (this.fixedAllowedWords[currentWord] === true) { // When you don't have black list to the word
							finalCensorText += `${currentWord} `;
							currentWord = '';
						} else if (typeof this.whitelist[currentWord] === 'object') { // When you have black list for the word
							const { isFoundSequence, censorText, iJump } = this.recursiveWordsCensor(source, this.whitelist[currentWord], i);

							if (isFoundSequence === true) {
								finalCensorText += `${this.censorWord(currentWord, false)} ${censorText}`;
								i += iJump - 1;
								currentWord = '';
							} else {
								finalCensorText += `${currentWord} `;
								currentWord = '';
							}
						} else if (this.whitelist[currentWord] === true) {
							finalCensorText += `${currentWord} `;
							currentWord = '';
						} else {
							finalCensorText += this.censorWord(currentWord, true);
							currentWord = '';
						}
					}
				}
			}
		}

		return { censoredText: finalCensorText, droppedWords: this.droppedWords };
	}
}

export { Censor, ICensorArgs, ICensorArgsPartial }