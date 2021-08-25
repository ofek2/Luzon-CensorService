import { WorkersPool } from "../src/classes/WorkersPool";

test('Integration testing WorkersPool with censoring logic', async () => {
    const text = {
        "calender-name": "test",
        "calender": {
            "day-1": {
                "desctiption": "testing the library",
                "content": "the library works awesome"
            }
        }
    };
    const workersPool = new WorkersPool(5, "./src/workers/CensorTextWorker.js", { 
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
        replaceString: '*'
    });
    const { censoredText, droppedWords } = await workersPool.Pool.exec({ 
        text: JSON.stringify(text), 
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
        } 
    });
    const outputRegex = /{"calender-name":"t\*+","calender":{"day-1":{"desctiption":"testing the l\*+","content":"t\*+ l\*+ w\*+ a\*+"}}}/;
    
    await workersPool.closePool();
    expect(censoredText).toMatch(outputRegex);
});