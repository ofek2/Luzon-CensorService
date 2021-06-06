import React, {useRef, useEffect, useState} from 'react';
import TreeDots from '../../treeDots/TreeDots';
import getCaretCoordinates from 'textarea-caret';
import ListService from '../../../services/listsService';
import "./AddWordsInputs.css";
 
function AddWordsInput(props) {
    const { onCreateDone } = props;
    const wordsMaxChunkSize = 20;
    const textareaRef = useRef({});
    const [location, setLocation] = useState({x:654, y:2});
    const [failedWords, setFailedWords] = useState();

    const createChunks = (array, chunkSize) => {
        return array.reduce((resultArray, item, index) => { 
            const chunkIndex = Math.floor(index / chunkSize);
          
            if(!resultArray[chunkIndex]) {
              resultArray[chunkIndex] = [] 
            }
    
            resultArray[chunkIndex].push(item);
          
            return resultArray
          }, []);
    }

    useEffect(() => {
        textareaRef.current.addEventListener('keydown', e => {
            const coordinates = getCaretCoordinates(textareaRef.current, e.target.selectionStart);

            if(e.keyCode === 13) { // is enter pressed 
                e.preventDefault();
                saveWordsArray();
            } else {
                setLocation({x: coordinates.left, y: Math.min(coordinates.top, 162)});
            }
        });
        textareaRef.current.addEventListener('input', e => {
            const coordinates = getCaretCoordinates(textareaRef.current, e.target.selectionStart);
            
            setLocation({x: coordinates.left, y: Math.min(coordinates.top, 162)});
        });  
    }, [])

    const onDivClick = () => {
        textareaRef.current.focus();
    }

    const saveWordsArray = async () => {
        const wordsArray = textareaRef.current.value.trim().replace(/\s+/g, " ").split(" ");
        let failedWords = [];

        if(wordsArray[0] === "הכנס" && (wordsArray[1] === "מילים:" || wordsArray[1] === "מילים")) {
            const wordsToInsert = wordsArray.splice(2, wordsArray.length - 2);
            const chunks = createChunks(wordsToInsert, wordsMaxChunkSize);

            for(let chunk of chunks) {
                const axiosRequestsPromises = chunk.map(async word => {
                    const whitelistWord = { 
                        word: word, 
                        isDeleted: false, 
                        forbiddenSequences: []
                    };
                    await ListService.deleteWord("graylist", word);
                    const createPromise = ListService.createOrUpdateWord("whitelist", whitelistWord);
    
                    return createPromise;
                });
                const result = await Promise.allSettled(axiosRequestsPromises);
                const failedWordsArray = result.filter(response => response.status !== "fulfilled").map(failedWord => JSON.parse(failedWord.reason.config.data).wordMetadata.word);

                failedWords = [
                    ...failedWords,
                    ...failedWordsArray
                ];
            }
            
            textareaRef.current.value = ""; 
            setLocation({x:654, y:2});
            setFailedWords(failedWords);
            onCreateDone();
            setTimeout(() => setFailedWords(undefined), 5000);
        }
    }

    return (
        <div className="add-words-input" onClick={onDivClick} style={{position: "relative"}}>
            <div style={{position: 'absolute', left: "20px", top: "15px"}}>
                <TreeDots color="rgb(255, 152, 0)"/>
            </div>
            <span style={{position: "absolute", top: `${location.y + 25}px`, left: `${location.x + 20}px`}} className="blinking-cursor">_</span>
            <textarea ref={textareaRef} className="add-words-textarea"/>
            <span className="caret" style={{position: "absolute", right: "21px", top: "32px"}}>{'>'}</span>
            {
                failedWords ? 
                    failedWords.length === 0 ? 
                        <div style={{ color: "white", display: "flex", alignItems: "center", justifyContent: "center", position: "absolute", bottom: "0px", right: "0px", width: "100%", height: "20px", background: "#4caf50", borderRadius: "0px 0px 5px 5px"}}>
                            <span>
                                מילים נוצרו בהצלחה
                            </span>
                        </div> : 
                        <div style={{ color: "white", display: "flex", alignItems: "center", justifyContent: "center", position: "absolute", bottom: "0px", right: "0px", width: "100%", height: "20px", background: "#f44336", borderRadius: "0px 0px 5px 5px"}}>
                            <span style={{textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden", height: "100%", width: "100%"}}>
                                מילים שלא נשמרו כראוי: {failedWords.toString().replaceAll(",", ", ")}
                            </span>
                        </div>
                    : 
                    <></>
            }
            
        </div>
    )
}

export default AddWordsInput
