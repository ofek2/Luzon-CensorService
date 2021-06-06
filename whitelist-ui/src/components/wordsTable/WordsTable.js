import React, { useState, useEffect } from 'react';
import './WordsTable.css';
import WordRow from '../wordRow/WordRow';
import ListService from '../../services/listsService';
import WordsActionsEvents from '../../model/maps/WordsActionsEvents';
import ReactPaginate from 'react-paginate';

function WordsTable(props) {
	// State & props
	const { color, listName, title, subTitle, delayAnimation, 
		wordRowActions, actionsEvent, updateGraylist, isVertical } = props;
	const [words, setWords] = useState([]);
	const [page, setPage] = useState(0);
	const [count, setCount] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [search, setSearch] = useState();
	const [isExistInList, setIsExistInList] = useState(false);
	const [isExistInOtherList, setIsExistInOtherList] = useState(false);
	const [shouldUpdateFlag, setShouldUpdateFlag] = useState(0);
	const pageSize = 27;

	// Side effects
	useEffect(() => {
		setIsLoading(true);
		ListService.getWords(listName, page, pageSize, { search })
			.then(fromResolve => {
				const { data: { list, count } } = fromResolve;
				
				setWords(list);
				setCount(count);
				setIsExistInList(list.findIndex(value => value.word === search) !== -1);
			})
			.catch(fromReject => console.log(fromReject) )
			.then(() => {
				setIsLoading(false);
			});
	}, [props.shouldUpdateFlag, shouldUpdateFlag, page, search]);

	useEffect(() => {
		ListService.getWords(listName === "whitelist" ? "blacklist" : "whitelist", page, pageSize, { search })
			.then(fromResolve => {
				const { data: { list } } = fromResolve;

				setIsExistInOtherList(list.findIndex(value => value.word === search) !== -1);
			})
			.catch(fromReject => console.log(fromReject) )
	}, [search]);

	// Handlers
	const onSearchChange = (event) => {
		const { value } = event.target;
		
		setSearch(value);
	}

	const onSaveClick = () => {
		const listToPost = listName;
		const whitelistWord = { 
			word: search, 
			isDeleted: false, 
			forbiddenSequences: []
		};
		const wordToSend = listName === "whitelist" ? whitelistWord : search;
		
	
		ListService.createOrUpdateWord(listToPost, wordToSend)
			.then(() => { 
				ListService.deleteWord('graylist', listName === "whitelist" ? whitelistWord.word : search)
					.then(response => {
						
					}).catch(() => {

					}).then(() => {
						setShouldUpdateFlag(oldVal => oldVal + 1);
						setSearch("");
						updateGraylist();
					});
				})
			.catch(err => console.log(err));
	}

	const renderVertical = () => {
		return (
			<>
			<div style={{ display: "flex", flexDirection: "column",overflowY: "auto", overflowX: "hidden", maxHeight: "calc(100% - 216px)"}}>
				{
					words.length > 0 ?
						words.map((wordObj, index) => <WordRow key={wordObj.word} event={ wordObj.word === actionsEvent.targetWord ? actionsEvent.type : WordsActionsEvents.EMPTY } index={index} word={wordObj.word} onSaveClick={() => setShouldUpdateFlag(oldVal => oldVal + 1)} wordObject={wordObj} actions={wordRowActions} />) :
						isLoading ? 
							<></>:
							isExistInOtherList ? 
								<div style={{background: "white", width: "100%", height: "75px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
									<span>{`המילה קיימת ב-${listName === "whitelist" ? "מילים אסורות" : "מילים מותרות"}`}</span> 
								</div> :
								isExistInList ? 
									<></>:
									!Boolean(search) ? 
										<></>:
										<div style={{background: "white", width: "100%", height: "75px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
											<span>המילה לא קיימת</span>
											<button onClick={onSaveClick} style={{ borderRadius:"3px", borderColor: color, borderStyle: "solid", fontFamily: "inherit", cursor: "pointer", fontWeight: "bold", margin:"5px", padding: "4px 6px", textDecoration: "none", color: "white", fontSize:"12px", backgroundColor: color, outline: "none",}} >הוספת מילה</button>
										</div>
				}
				{
					isExistInList || !Boolean(search) || count === 0  ? 
						<></>:
						isExistInOtherList ? 
								<div style={{background: "white", width: "100%", height: "75px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
									<span>{`המילה קיימת ב-${listName === "whitelist" ? "מילים אסורות" : "מילים מותרות"}`}</span> 
								</div> :
								<div style={{background: "white", width: "100%", height: "75px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
									<span>המילה לא קיימת</span>
									<button onClick={onSaveClick} style={{ borderRadius:"3px", borderColor: color, borderStyle: "solid", fontFamily: "inherit", cursor: "pointer", fontWeight: "bold", margin:"5px", padding: "4px 6px", textDecoration: "none", color: "white", fontSize:"12px", backgroundColor: color, outline: "none",}} >הוספת מילה</button>
								</div>
				}
			</div>
			<div className={`pagination-container ${listName}`} style={{display: "flex"}}>
				{
					isLoading && words.length === 0 ? 
						<></>:
						<ReactPaginate nextClassName="none" previousClassName="none" pageCount={count / pageSize} onPageChange={(selectedItem) => setPage(selectedItem.selected)} forcePage={page}/>
				}
			</div>
			</>
		)
	}

	const renderHorizontal = () => {
		return (
		<>
			{
				words.length > 0 ?
					words.map((wordObj, index) => <div style={{ width: "225px", paddingLeft: "5px", display: "inline-block" }}><WordRow key={wordObj.word} event={ wordObj.word === actionsEvent.targetWord ? actionsEvent.type : WordsActionsEvents.EMPTY } index={index} word={wordObj.word} onSaveClick={() => setShouldUpdateFlag(oldVal => oldVal + 1)} wordObject={wordObj} actions={wordRowActions} /></div>) :
					isLoading ? 
						<></>:
						isExistInOtherList ? 
							<div style={{ maxWidth: "225px", background: "white", width: "100%", height: "75px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
								<span>{`המילה קיימת ב-${listName === "whitelist" ? "מילים אסורות" : "מילים מותרות"}`}</span> 
							</div> :
							isExistInList ? 
								<></>:
								<div style={{maxWidth: "225px",background: "white", width: "100%", height: "75px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
									<span>המילה לא קיימת</span>
									<button onClick={onSaveClick} style={{ borderRadius:"3px", borderColor: color, borderStyle: "solid", fontFamily: "inherit", cursor: "pointer", fontWeight: "bold", margin:"5px", padding: "4px 6px", textDecoration: "none", color: "white", fontSize:"12px", backgroundColor: color, outline: "none",}} >הוספת מילה</button>
								</div>
			}
			{
				isExistInList || !Boolean(search) || count === 0  ? 
					<></>:
					isExistInOtherList ? 
							<div style={{ maxWidth: "225px", background: "white", width: "100%", height: "75px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
								<span>{`המילה קיימת ב-${listName === "whitelist" ? "מילים אסורות" : "מילים מותרות"}`}</span> 
							</div> :
							<div style={{maxWidth: "225px", background: "white", width: "100%", height: "75px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
								<span>המילה לא קיימת</span>
								<button onClick={onSaveClick} style={{ borderRadius:"3px", borderColor: color, borderStyle: "solid", fontFamily: "inherit", cursor: "pointer", fontWeight: "bold", margin:"5px", padding: "4px 6px", textDecoration: "none", color: "white", fontSize:"12px", backgroundColor: color, outline: "none",}} >הוספת מילה</button>
							</div>
			}
			{/* <div className={`pagination-container ${listName}`} style={{display: "flex", position: "absolute", bottom: "-30px"}}>
				{
					isLoading && words.length === 0 ? 
						<></>:
						<ReactPaginate nextClassName="none" previousClassName="none" pageCount={count / pageSize} onPageChange={(selectedItem) => setPage(selectedItem.selected)} forcePage={page}/>
				}
			</div> */}
			</>
		)
	}

	// Rendering
	return (
		<div className="table-container" style={{ position: "relative", animationDelay: delayAnimation || 0, maxWidth: isVertical ? "225px" : "none",
		flexWrap: "wrap", display: "flex", flexDirection: "column", maxHeight: isVertical ? "none" : "325px", alignContent: "flex-start"}}>
			<div className="table-header" style={{ backgroundColor: color, maxWidth: isVertical ? "none" : "225px", display: "inline-block"}}>
				<span className="table-title">{title}</span>
				<div style={{ backgroundColor: "white", borderBottom: "5px solid rgb(241, 240, 240)", borderTop: "3px solid rgb(241, 240, 240)", height: isVertical ? "95px" : "65px", width: "225px", display: "flex", justifyContent: "center", alignItems: "center" }}>
					{isVertical && subTitle}
					<div style={{display: "flex", flexDirection: "column", alignItems: "start"}}>
						<span style={{ marginBottom: "5px", marginTop: "7px", fontWeight: "bold"}}>סה"כ: {count}</span>
						<input onChange={onSearchChange} value={search} style={{ right: "4px", marginLeft: "8px", fontFamily: "VarelaRound", background: "#f1f0f0", width: "125px", paddingRight: "7px", marginTop: "3px", borderRadius: "12px", marginBottom: "7px", border: "2px solid #eeeeee" }} placeholder="חיפוש מילים..."/>
					</div>
				</div>
			</div>
			{
				isVertical ? renderVertical() : renderHorizontal() 
			}
		</div>
	);
}

export default WordsTable;