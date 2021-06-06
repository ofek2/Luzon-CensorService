const { workerData, parentPort } = require('worker_threads');

class Censor {
	constructor(args) {
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

	censorWord(word, withSpace) {
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

	recursiveWordsCensor(sourceText, wordsRelationshipObject, currentIndex) {
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

	replaceFromJson(source) {
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

/**
 * This code is design to run in a seperated worker thread.
 * The main process of node will not will be the one to run this code 
 * because of high computing time.
 * The code from the main tread will only scadule a new task to this worker.
 */

/**
 * Read data from for worker
 */
const { fixedAllowedChars, fixedAllowedWords, replaceString,
    mixSpaceBetweenPrefixAndSuffix, prefixAllowedLettersCount, suffixAllowedLettersCount } = workerData;

/**
 * Censoring a text function
 * @param text the plaintext
 * @param args the config arguments
 * @returns censored text
 */
function censorText(text, whitelist) {
    const censorObj = new Censor({
        whitelist,
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

parentPort.on("message", (params) => {
	/**
 * Try to invoke the censoring logic.
 * In case of fail exit with error code 1.
 */
	try {
		const { censoredText, droppedWords } = censorText(params.text, params.whitelist);
		
		parentPort.postMessage({ censoredText, droppedWords })
	} catch(error) {
		process.exit(1);
	}
});

