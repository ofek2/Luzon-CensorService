import { Whitelist } from "../src/classes/Whitelist";

test('Test Whitelist class cast from mongo list objects to nested map for censor algo', () => {
    const whitelist = new Whitelist([
        {"word":"בדיקה","isDeleted":false,"forbiddenSequences":[{"word":"חשובה","forbiddenSequences":[]}]},
        {"word":"test","isDeleted":false,"forbiddenSequences":[]},
        {"word":"שלום","isDeleted":false,"forbiddenSequences":[]},

    ]);
    const expected = {
        "בדיקה": {
            "חשובה": false
        },
        "test": true,
        "שלום": true
    };
    expect(whitelist.WhitelistNestedMap).toStrictEqual(expected);
});

test('Test Whitelist get single word value from nested map', () => {
    const whitelist = new Whitelist([
        {"word":"בדיקה","isDeleted":false,"forbiddenSequences":[{"word":"חשובה","forbiddenSequences":[]}]},
        {"word":"test","isDeleted":false,"forbiddenSequences":[]},
        {"word":"שלום","isDeleted":false,"forbiddenSequences":[]},

    ]);
    const expected = { "חשובה": false };

    expect(whitelist.getFromWhitelist("בדיקה")).toStrictEqual(expected);
});

test('Test Whitelist delete single word value from nested map', () => {
    const whitelist = new Whitelist([
        {"word":"בדיקה","isDeleted":false,"forbiddenSequences":[{"word":"חשובה","forbiddenSequences":[]}]},
        {"word":"test","isDeleted":false,"forbiddenSequences":[]},
        {"word":"שלום","isDeleted":false,"forbiddenSequences":[]},

    ]);
    const expected = {
        "test": true,
        "שלום": true
    };

    whitelist.removeFromWhitelist("בדיקה");
    expect(whitelist.WhitelistNestedMap).toStrictEqual(expected);
});

test('Test Whitelist update single word value from nested map', () => {
    const whitelist = new Whitelist([
        {"word":"בדיקה","isDeleted":false,"forbiddenSequences":[{"word":"חשובה","forbiddenSequences":[]}]},
        {"word":"test","isDeleted":false,"forbiddenSequences":[]},
        {"word":"שלום","isDeleted":false,"forbiddenSequences":[]},

    ]);
    const expected = {
        "בדיקה": {
            "חשובה": false,
            "לא": {
                "חשובה": false
            }
        },
        "test": true,
        "שלום": true
    };

    whitelist.updateWhitelist({"word":"בדיקה","isDeleted":false,"forbiddenSequences":[{"word":"חשובה","forbiddenSequences":[]}, {"word":"לא","forbiddenSequences":[{"word":"חשובה","forbiddenSequences":[]}]}]},);
    expect(whitelist.WhitelistNestedMap).toStrictEqual(expected);
});