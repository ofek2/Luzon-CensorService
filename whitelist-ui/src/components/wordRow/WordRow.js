import React, { useState, useEffect } from 'react';
import './WordRow.css';
import WordsActionsEvents from '../../model/maps/WordsActionsEvents';
import { FaSave, FaInfoCircle, FaSpinner } from 'react-icons/fa';
import ListService from '../../services/listsService';
import { CSSTransition } from 'react-transition-group';
import ReactTooltip from 'react-tooltip';

function WordRow(props) {
	// State & props
	const { index, word, actions, wordObject, event, onSaveClick } = props;
	const [inputMetadata, setInputMetadata] = useState({
		value: undefined,
		isAlreadyExist: false,
		isEmpty: true
	});
	const [isSaveLoading, setIsSaveLoading] = useState(false);
	const [isMounted, setIsMounted] = useState(false);

	// Side effects
	useEffect(() => {
		setIsMounted(true);
	}, []);

	// Methodes
	const recursiveWordTreeAdd = (object, arrayToAdd) => {
		const currentWord = arrayToAdd[0];
		const foundObject = object.forbiddenSequences.find(forbiddenSequence => forbiddenSequence.word === currentWord);

		if(arrayToAdd.length === 1) {
			if(foundObject) {
				foundObject.forbiddenSequences = [];
			} else {
				object.forbiddenSequences.push({
					word: currentWord,
					forbiddenSequences: []
				});
			}
			
			return;
		}


		if(foundObject) {
			arrayToAdd.shift();
			recursiveWordTreeAdd(foundObject, arrayToAdd)
		} else {
			object.forbiddenSequences.push({
				word: currentWord,
				forbiddenSequences: []
			});
			arrayToAdd.shift();
			recursiveWordTreeAdd(object.forbiddenSequences.find(forbiddenSequence => forbiddenSequence.word === currentWord), arrayToAdd)
		}
	}

	// Handlers
	const onActionClick = (actionOnClick) => (onClickDomEvent) => actionOnClick(word);

	const doNothing = () => {};

	const createWordsChainArray = (wordObject) => {
		let wordsChainArray = [];

		if(wordObject.forbiddenSequences.length === 0) {
			return [""];
		}

		wordObject.forbiddenSequences.forEach(forbiddenWord => {
			let wordsChain = createWordsChainArray(forbiddenWord);

			wordsChainArray = [...wordsChainArray, ...wordsChain.map(word => `${forbiddenWord.word} ${word}`)]
		});

		return wordsChainArray;
	}

	const onInputChange = (e) => {
		const { value } = e.target; 
		let chainArray = createWordsChainArray(wordObject);
		const trimValue = value && value.replace(/\s\s+/g, ' ').trim();

		if(trimValue.length > 0) {
			const isAlreadyExist = chainArray.findIndex(chain => chain.trim() === trimValue) !== -1;

			setInputMetadata({
				value,
				isEmpty: false,
				isAlreadyExist
			})
		} else {
			setInputMetadata({
				value,
				isEmpty: true,
				isAlreadyExist: false
			})
		}

	}

	const handleSaveClick = () => {
		const { value } = inputMetadata;
		const wordObjectClone = JSON.parse(JSON.stringify(wordObject));
		const valueAsArray = value.split(" ");
		setIsSaveLoading(true);

		recursiveWordTreeAdd(wordObjectClone, valueAsArray);
		ListService.createOrUpdateWord("whitelist", wordObjectClone)
			.then(() => {

			})
			.catch(() => {
				console.log("succeed")
			})
			.then(() => {
				setInputMetadata({
					value: "",
					isEmpty: true,
					isAlreadyExist: false
				})
				setIsSaveLoading(false);
				onSaveClick();
			});

	}

	// Rendering
	const renderWordChain = (word, wordObject) => {
		let chainArray = createWordsChainArray(wordObject);

		return (
			<>
				<span style={{fontSize: "14px", fontWeight: "bold", marginBottom: "3px"}}>רצפים אסורים:</span>
				<div style={{overflow: "auto", maxHeight: "70px", display: "flex", flexDirection: "column", width: "calc(100% - 18px)", alignItems: "start", paddingRight: "5px"}}>
				{
					wordObject.forbiddenSequences.length !== 0 ?
					chainArray.map((chain, index) => <span key={index} style={{fontSize: "14px", color: "rgb(102, 187, 106)"}}>{word}{<span key={index} style={{fontSize: "14px", color: "#f44336", marginRight: "4px"}}>{chain}</span>}</span>) :
					<span style={{fontSize: "14px", color: "#757575"}}>לא קיים רצף אסור</span>
				}
				</div>
			</>
		)
	};

	const renderAddWordChain = (word) => {
		const shadowSpan = document.createElement("span");
		const maxSpanSize = 60;

		shadowSpan.innerHTML = word
		shadowSpan.style.visibility = "hidden";
		shadowSpan.style.fontSize = "14px";
		document.body.appendChild(shadowSpan);
		let width = shadowSpan.getBoundingClientRect().width;
		width = width > maxSpanSize ? maxSpanSize : width;
		document.body.removeChild(shadowSpan);

		return (
			<div style={{position: "relative", right: "-7px", width: "calc(100% - 10px)"}}>
				<span style={{ position: "absolute", right: "8px", fontSize: "14px", maxWidth: `${maxSpanSize}px`, textOverflow: "ellipsis", marginRight: "1px", overflow: "hidden", marginTop: "10px", color:"rgb(102, 187, 106)", fontWeight: "bold"}}>{word}</span>
				<input value={inputMetadata.value} onChange={onInputChange} style={{padding: "5px", background: "#F1F0F0", paddingRight: `${width + 9}px`, paddingLeft: "23px", color: "#F44336", fontWeight: "bold", right: "4px", width: `calc(100% - ${width + 23 + 18}px)`, marginTop: "3px", borderRadius: "20px", marginBottom: "7px", border: "2px solid #eeeeee"}} placeholder="הקלד רצף אסור"/>
				{
					inputMetadata.isEmpty ?
						<></> :
						inputMetadata.isAlreadyExist ?
							<span>
								<FaInfoCircle data-tip="רצף אסור כבר קיים" style={{ position: "absolute", left: "11px", marginTop: "10px", color: "#2196f3", cursor: "default"}}/>
								<ReactTooltip />
							</span>:
							isSaveLoading ? 
							<FaSpinner title="טוען.." className="spinner" style={{ position: "absolute", left: "11px", marginTop: "10px", color: "#66bb6a", cursor: "default"}}/> : 
							<FaSave onClick={handleSaveClick} title="שמור רצף אסור" style={{ position: "absolute", left: "11px", marginTop: "10px", color: "#66bb6a", cursor: "pointer"}}/>
				}

			</div>
		)
	};

	return (
		<CSSTransition in={isMounted} timeout={300} classNames="word-row" unmountOnExit key={word} >
        	<div className="word-row-container" style={{ backgroundColor: "white", borderBottom: "5px solid rgb(241, 240, 240)", width: "calc(100% - 10px)", paddingRight: "10px", paddingTop: "4px", paddingBottom: "4px", display: "flex", justifyContent: "center", alignItems: "flex-start", flexDirection: "column"}}>
			<div style={{display: "flex", justifyContent: "flex-start", alignItems: "center"}}>
				<span style={{fontSize: "16px"}}>{word}</span>
				{
					actions && actions.map((action,index) => <div key={index} className="action-container" style={{display: "flex", margin: "9px 0px"}}>{React.cloneElement(action.component, {onClick: onActionClick(action.onClick)})}</div>)
				}
				
			</div>
			{
				
				WordsActionsEvents.EMPTY === event ?
					doNothing() :
					WordsActionsEvents.VIEW_WORDS_CHAIN === event ?
						renderWordChain(word, wordObject) :
						WordsActionsEvents.ADD_WORD_CHAIN === event ?
							renderAddWordChain(word, wordObject) :
							WordsActionsEvents.DELETE_WORD === event ?
								doNothing() :
								doNothing()
			}
		</div>
      </CSSTransition>
	);
}

export default WordRow;