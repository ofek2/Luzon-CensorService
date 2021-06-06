import React, { useState, useEffect } from 'react';
import './WordsFile.css';
import ListService from '../../services/listsService';
import ReactTooltip from 'react-tooltip';

function WordsFile(props) {
	// State & props
	const { isAddToWhitelist, onUpdate } = props;
	const [isLoading, setIsLoading] = useState(false);
	const [words, setWords] = useState([]);

	// Side effects
	useEffect(() => { // On init side effect
		setIsLoading(true);

		ListService.getWords('graylist', 0, 50, { sortBy: "censoredCount", ascending: -1 })
			.then(response => {
				setWords(response.data.list);
			})
			.catch(err => console.log(err))
			.then(() => setIsLoading(false));
	}, []);

	useEffect(() => { // On init side effect
		setIsLoading(true);

		ListService.getWords('graylist', 0, 50, { sortBy: "censoredCount", ascending: -1 })
			.then(response => {
				setWords(response.data.list);
			})
			.catch(err => console.log(err))
			.then(() => setIsLoading(false));
	}, [props.shouldUpdateFlag]);
	

	// Handlers
	const deleteOrAddWord = (word) => {
		const listToPost = isAddToWhitelist ? "whitelist" : "blacklist";
		const whitelistWord = { 
			word: word, 
			isDeleted: false, 
			forbiddenSequences: []
		};
		const wordToSend = isAddToWhitelist ? whitelistWord : word;
		
		ListService.deleteWord('graylist', word)
			.then(response => {
				ListService.createOrUpdateWord(listToPost, wordToSend)
					.then(() => { 
						onUpdate(listToPost);
						ListService.getWords('graylist', 0, 50, { sortBy: "censoredCount", ascending: -1 })
							.then(response => {
								setWords(response.data.list);
							})
							.catch(err => console.log(err))
					})
			})
			.catch(err => console.log(err));
	}

	// Rendering
	return (
		<div className={`words-file-container ${isAddToWhitelist ? "pencil-corsor" : "eraser-corsor"}`}>
			{
				words.map((word, index) => 
					<span key={index} data-tip={`המילה הופיעה ב-${word.censoredCount} ${word.censoredCount === 1 ? 'Document' : "Documents"}`} onClick={() => deleteOrAddWord(word.word)} className={`word ${isAddToWhitelist ? "word-to-add" : "word-to-remove"}`} style={{ marginLeft: "1.5em" }}>
						{`${word.word}`}
						<ReactTooltip />
					</span>)
			}
		</div>
	);
}

export default WordsFile;
