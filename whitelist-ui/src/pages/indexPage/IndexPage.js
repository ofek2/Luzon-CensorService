import React from 'react';
import Document from '../../components/document/Document';
import './IndexPage.css';

function IndexPage() {
	return (
		<div className="page-container index-page">
			<div className="index-page-main-section">
				<div className="index-page-text" style={{textAlign: "right"}}>
					<h1 style={{color: "white", fontSize: "48px", margin: "5px 0px"}}>שירות whitelist</h1>
					<h1 style={{color: "white", fontSize: "48px", margin: "5px 0px"}}>שירות לבלמוס מידע מסווג</h1>
					<p style={{color: "white", margin: "20px 0px"}}>
						ברוכים הבאים לממשק ניהול של שירות whitelist <br /> כאן תוכלו להוסיף, להסיר ולשנות את המילים המותרות
					</p>
				</div>
			</div>
			<Document style={{position: "absolute", top: "40px", left: "130px"}}/>
			<div style={{display: "flex", flexDirection: "row", color: "white", width: "100%", justifyContent: "space-evenly"}}>
					<div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
						<span style={{fontSize: "37px", fontWeight: "bold"}}>+ 10k</span>
						<span style={{fontSize: "18px"}}>מילים מותרות</span>
					</div>
					<div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
						<span style={{fontSize: "37px", fontWeight: "bold"}}>+ 1k</span>
						<span style={{fontSize: "18px"}}>ביטויים אסורים</span>
					</div>
					<div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
						<span style={{fontSize: "37px", fontWeight: "bold"}}>+ 3k</span>
						<span style={{fontSize: "18px"}}>מילים אסורות</span>
					</div>
				</div>
		</div>
	);
}

export default IndexPage;
