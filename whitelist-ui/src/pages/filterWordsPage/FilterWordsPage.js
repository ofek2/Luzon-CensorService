import React, { useState } from 'react';
import './FilterWordsPage.css';
import WordsTable from '../../components/wordsTable/WordsTable';
import WordsFile from '../../components/wordsFile/WordsFile';
import TextRadio from '../../components/textRadio/TextRadio';
import goodList from '../../assets/images/goodlist.svg';
import badList from '../../assets/images/badlist.svg';
import { FaPlus, FaTimes, FaStaylinked } from 'react-icons/fa';
import WordsActionsEvents from '../../model/maps/WordsActionsEvents';
import ListService from '../../services/listsService';

function FilterWordsPage() {
	// State & props
	const [isAddWhitelistActive, setIsAddWhitelistActive] = useState(true);
	const [shouldUpdateWhitelist, setShouldUpdateWhitelist] = useState(0);
	const [shouldUpdateBlacklist, setShouldUpdateBlacklist] = useState(0);
	const [shouldUpdateGraylist, setShouldUpdateGraylist] = useState(0);
	const [goodWordsEvent, setGoodWordsEvent] = useState({
		
	});
	const goodWordsWordActions = [
		{ 
			onClick: (word) => { 
				setGoodWordsEvent({targetWord: word, type: WordsActionsEvents.VIEW_WORDS_CHAIN}) 
			}, 
			component: <FaStaylinked title="צפייה ברצפים אסורים" style={{ color: "#64b5f6", marginRight: "5px", cursor: "pointer" }} /> 
		},
		{
			onClick: async (word) => { 
				setGoodWordsEvent({targetWord: word, type: WordsActionsEvents.ADD_WORD_CHAIN})
			}, 
			component: <FaPlus title="הוסף רצף אסור" style={{ color: "#66bb6a", marginRight: "5px", cursor: "pointer" }} /> 
		},
		{  
			onClick: async (word) => { 
				try {
					const whitelistWord = { 
						word: word, 
						isDeleted: true, 
						forbiddenSequences: []
					};

					await ListService.createOrUpdateWord("whitelist", whitelistWord);

					setShouldUpdateWhitelist(oldVal => oldVal += 1);
				} catch(error) {
					console.log(error);
				}
			},
			component: <FaTimes title="הסר מילה מרשימת מילים מותרות" style={{ color: "#e57372", marginRight: "5px", cursor: "pointer" }} />
	 }
	];
	const [badWordsEvent, setBadWordsEvent] = useState({
	});
	const badWordsWordActions = [
		{ 
			onClick: async (word) => { 
				try {
					await ListService.deleteWord("blacklist", word);
					
					setShouldUpdateBlacklist(oldVal => oldVal += 1);
				} catch(error) {
					console.log(error);
				}
			}, 
			component: <FaTimes title="הסר מילה מרשימת מילים אסורות" style={{ color: "#e57372", marginRight: "5px", cursor: "pointer" }} />
		}
	];

	// Handlers
	const handleWordsFileUpdate = (listName) => {
		if (listName === 'whitelist') {
			setShouldUpdateWhitelist(oldVal => oldVal += 1);
			console.log(shouldUpdateWhitelist)
		} else {
			setShouldUpdateBlacklist(oldVal => oldVal += 1);
		}
	}

	const handleGraylistUpdate = () => {
		setShouldUpdateGraylist(oldVal => oldVal += 1);
	}

	// Rendering
	return (
		<div className="page-container filter-words-page">
			<WordsTable isVertical={true} updateGraylist={handleGraylistUpdate} listName="whitelist" color="#81c784" secondaryColor="#66bb6a" title="מילים מותרות" shouldUpdateFlag={shouldUpdateWhitelist} wordRowActions={goodWordsWordActions} actionsEvent={goodWordsEvent} subTitle={<img src={goodList} style={{ height: "70px", opacity: 0.8 }} />} />
			<div style={{ display: "flex", flexDirection: "column", width: "100%", alignItems: "center" }}>
				<div style={{ width: "100%", height: "40px", display: "flex", justifyContent: 'space-evenly' }}>
					<TextRadio text='הוסף ל-"מילים מותרות"' color="#66bb6a" isSelected={isAddWhitelistActive} onClick={() => setIsAddWhitelistActive(true)} />
					<TextRadio text='הוסף ל-"מילים אסורות"' color="#ef534f" isSelected={!isAddWhitelistActive} onClick={() => setIsAddWhitelistActive(false)} />
				</div>
				<WordsFile shouldUpdateFlag={shouldUpdateGraylist} isAddToWhitelist={isAddWhitelistActive} onUpdate={handleWordsFileUpdate} />
			</div>
			<WordsTable isVertical={true} updateGraylist={handleGraylistUpdate} listName="blacklist" color="#ef9a9a" secondaryColor="#e57373" title="מילים אסורות" shouldUpdateFlag={shouldUpdateBlacklist} wordRowActions={badWordsWordActions} actionsEvent={badWordsEvent} subTitle={<img src={badList} style={{ height: "70px", opacity: 0.8 }} />} />
		</div>
	);
}

export default FilterWordsPage;