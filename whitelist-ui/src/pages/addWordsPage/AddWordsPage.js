import React, {useState} from 'react'
import AddWordsInput from '../../components/textInputes/addWordsInput/AddWordsInput';
import WordsTable from '../../components/wordsTable/WordsTable';
import ListService from '../../services/listsService';
import { FaPlus, FaTimes, FaStaylinked } from 'react-icons/fa';
import WordsActionsEvents from '../../model/maps/WordsActionsEvents';
import goodList from '../../assets/images/goodlist.svg';

function AddWordsPage() {
	const [shouldUpdateWhitelist, setShouldUpdateWhitelist] = useState(0);
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

    return (
        <div className="page-container filter-words-page" style={{display: 'flex', flexDirection: 'column', justifyContent: 'start', alignItems: 'center'}}>
            <div style={{ width: '100%', display: "flex", marginTop: "10px", marginBottom: "20px"}}>
                <div style={{ width: 'calc(40% - 10px)', display: 'inline-block', padding: "5px", textAlign: 'right'}}>
                    <h2 style={{margin: 0, marginBottom: "10px", color: "#ff9800"}}>הוספת מילים מותרות</h2>
                    <span>על מנת להכניס מילים חדשות לרשימת מילים מותרות הוסף את רשימת המילים באיזור הקלט</span><br/>
                    <span>יש להוסיף קודם הכנסת המילים את הפקודה <span style={{ fontWeight: "bold" }}>`הכנס מילים:`</span></span><br/>
                    <span>דוגמא </span><span style={{ backgroundColor: "#464646", color: "white", padding: "0px 5px", borderRadius: "5px"}}><span style={{color: "rgb(255, 152, 0)"}}>{'> '}</span>הכנס מילים: חדר כיסא שרת מטען ספר</span>
                </div>
                <div style={{ width: '60%', display: 'inline-block' }}>
                    <AddWordsInput onCreateDone={() => {setShouldUpdateWhitelist(oldVal => oldVal + 1)}}/>
                </div>
            </div>
            <div style={{ width: '100%', display: "flex", marginTop: "15px", marginBottom: "20px"}}>
    			<WordsTable isVertical={false} updateGraylist={() => {}} listName="whitelist" color="#81c784" secondaryColor="#66bb6a" title="מילים מותרות" shouldUpdateFlag={shouldUpdateWhitelist} wordRowActions={goodWordsWordActions} actionsEvent={goodWordsEvent} subTitle={<img src={goodList} style={{ height: "70px", opacity: 0.8 }} />} />
            </div>
        </div>
    )
}

export default AddWordsPage
