const { Censor } = require("../src/workers/CensorTextWorker.js");

test('Censoring a json', () => {
    const text = {
        "calender-name": "test",
        "calender": {
            "day-1": {
                "desctiption": "testing the library",
                "content": "the library works awesome"
            }
        }
    };
    const censor = new Censor({
        whitelist: {
            "testing": true,
            "the": {
                "library": {
                    "works": false,
                    "is": {
                        "sucks": false
                    }
                }
            },
        },
        fixedAllowedWords: {
            "calender-name": true,
            "calender": true,
            "day-1": true,
            "desctiption": true,
            "content": true
        },
        fixedAllowedChars: [
            "{",
            "}",
            ":",
            ",",
            "."
        ],
        prefixAllowedLettersCount: 1,
        suffixAllowedLettersCount: 0,
        mixSpaceBetweenPrefixAndSuffix: 1,
        replaceString: 'q',
        withChangeWordLength: true
    });
    const { censoredText, droppedWords } = censor.replaceFromJson(JSON.stringify(text));
    const outputRegex = /{"calender-name":"tq+","calender":{"day-1":{"desctiption":"testing the lq+","content":"tq+ lq+ wq+ aq+"}}}/;
    const outputArray = ["test", "library", "the", "works", "awesome"].sort();
    
    expect(censoredText).toMatch(outputRegex);
    expect(Object.keys(droppedWords).sort()).toStrictEqual(outputArray);
});

test('Censoring a json with single prop missing', () => {
    const text = {
        "calender-name": "test",
        "calender": {
            "day-1": {
                "desctiption": "testing the library",
                "content": "the library works awesome"
            }
        }
    };
    const censor = new Censor({
        whitelist: {
            "testing": true,
            "the": {
                "library": {
                    "works": false,
                    "is": {
                        "sucks": false
                    }
                }
            },
        },
        fixedAllowedWords: {
            "calender-name": true,
            "day-1": true,
            "desctiption": true,
            "content": true
        },
        fixedAllowedChars: [
            "{",
            "}",
            ":",
            ",",
            "."
        ],
        prefixAllowedLettersCount: 1,
        suffixAllowedLettersCount: 0,
        mixSpaceBetweenPrefixAndSuffix: 1,
        replaceString: 'q',
        withChangeWordLength: true
    });
    const { censoredText, droppedWords } = censor.replaceFromJson(JSON.stringify(text));
    const output = /{"calender-name":"tq+","cq+":{"day-1":{"desctiption":"testing the lq+","content":"tq+ lq+ wq+ aq+"}}}/;
    
    expect(censoredText).toMatch(output);
});

test('Censoring a json with suffixAllowedLettersCount 1', () => {
    const text = {
        "calender-name": "test",
        "calender": {
            "day-1": {
                "desctiption": "testing the library",
                "content": "the library works awesome"
            }
        }
    };
    const censor = new Censor({
        whitelist: {
            "testing": true,
            "the": {
                "library": {
                    "works": false,
                    "is": {
                        "sucks": false
                    }
                }
            },
        },
        fixedAllowedWords: {
            "calender-name": true,
            "calender": true,
            "day-1": true,
            "desctiption": true,
            "content": true
        },
        fixedAllowedChars: [
            "{",
            "}",
            ":",
            ",",
            "."
        ],
        prefixAllowedLettersCount: 1,
        suffixAllowedLettersCount: 1,
        mixSpaceBetweenPrefixAndSuffix: 1,
        replaceString: '*'
    });
    const { censoredText, droppedWords } = censor.replaceFromJson(JSON.stringify(text));
    expect(censoredText).toBe(`{"calender-name":"t**t","calender":{"day-1":{"desctiption":"testing the l*****y","content":"t*e l*****y w***s a*****e"}}}`);
    expect(Object.keys(droppedWords).sort()).toStrictEqual(["test", "library", "the", "works", "awesome"].sort());
});

test('Censoring a json with prefixAllowedLettersCount 2 and suffixAllowedLettersCount 1', () => {
    const text = {
        "calender-name": "test",
        "calender": {
            "day-1": {
                "desctiption": "testing the library",
                "content": "the library works awesome"
            }
        }
    };
    const censor = new Censor({
        whitelist: {
            "testing": true,
            "the": {
                "library": {
                    "works": false,
                    "is": {
                        "sucks": false
                    }
                }
            },
        },
        fixedAllowedWords: {
            "calender-name": true,
            "calender": true,
            "day-1": true,
            "desctiption": true,
            "content": true
        },
        fixedAllowedChars: [
            "{",
            "}",
            ":",
            ",",
            "."
        ],
        prefixAllowedLettersCount: 2,
        suffixAllowedLettersCount: 1,
        mixSpaceBetweenPrefixAndSuffix: 1,
        replaceString: '*'
    });
    const { censoredText, droppedWords } = censor.replaceFromJson(JSON.stringify(text));
    expect(censoredText).toBe(`{"calender-name":"te*t","calender":{"day-1":{"desctiption":"testing the li****y","content":"*** li****y wo**s aw****e"}}}`);
    expect(Object.keys(droppedWords).sort()).toStrictEqual(["test", "library", "the", "works", "awesome"].sort());
});

test('Censoring a json with replaceString: $', () => {
    const text = {
        "calender-name": "test",
        "calender": {
            "day-1": {
                "desctiption": "testing the library",
                "content": "the library works awesome"
            }
        }
    };
    const censor = new Censor({
        whitelist: {
            "testing": true,
            "the": {
                "library": {
                    "works": false,
                    "is": {
                        "sucks": false
                    }
                }
            },
        },
        fixedAllowedWords: {
            "calender-name": true,
            "calender": true,
            "day-1": true,
            "desctiption": true,
            "content": true
        },
        fixedAllowedChars: [
            "{",
            "}",
            ":",
            ",",
            "."
        ],
        prefixAllowedLettersCount: 1,
        suffixAllowedLettersCount: 0,
        mixSpaceBetweenPrefixAndSuffix: 1,
        replaceString: '$'
    });
    const { censoredText, droppedWords } = censor.replaceFromJson(JSON.stringify(text));
    expect(censoredText).toBe(`{"calender-name":"t$$$","calender":{"day-1":{"desctiption":"testing the l$$$$$$","content":"t$$ l$$$$$$ w$$$$ a$$$$$$"}}}`);
    expect(Object.keys(droppedWords).sort()).toStrictEqual(["test", "library", "the", "works", "awesome"].sort());
});

test('Censoring a json with prefixAllowedLettersCount 3 and suffixAllowedLettersCount 1 mixSpaceBetweenPrefixAndSuffix: 1', () => {
    const text = {
        "calender-name": "test",
        "calender": {
            "day-1": {
                "desctiption": "testing the library",
                "content": "the library works awesome"
            }
        }
    };
    const censor = new Censor({
        whitelist: {
            "testing": true,
            "the": {
                "library": {
                    "works": false,
                    "is": {
                        "sucks": false
                    }
                }
            },
        },
        fixedAllowedWords: {
            "calender-name": true,
            "calender": true,
            "day-1": true,
            "desctiption": true,
            "content": true
        },
        fixedAllowedChars: [
            "{",
            "}",
            ":",
            ",",
            "."
        ],
        prefixAllowedLettersCount: 3,
        suffixAllowedLettersCount: 1,
        mixSpaceBetweenPrefixAndSuffix: 1,
        replaceString: '*'
    });
    const { censoredText, droppedWords } = censor.replaceFromJson(JSON.stringify(text));
    expect(censoredText).toBe(`{"calender-name":"****","calender":{"day-1":{"desctiption":"testing the lib***y","content":"*** lib***y wor*s awe***e"}}}`);
});
