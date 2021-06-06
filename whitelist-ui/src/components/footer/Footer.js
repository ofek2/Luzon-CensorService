import React from 'react';
import { FaFile } from 'react-icons/fa';
import './Footer.css';

function Footer() {
	return (
		<div className="footer-container">
			<FaFile className="footer-file" />
			<span className="footer-good-letters-1 footer-good-word-1" style={{ top: -60 }}>צהריים</span>
			<span className="footer-good-letters-2 footer-good-word-2" style={{ top: -40 }}>בדיקה</span>
			<span className="footer-good-letters-3 footer-good-word-3" style={{ top: -52 }}>פגישה</span>
			<span className="footer-good-letters-1 footer-good-word-4" style={{ top: -80 }}>חשבון</span>
			<span className="footer-good-letters-1 footer-good-word-5" style={{ top: -74 }}>מיקום</span>
			<span className="footer-good-letters-2 footer-good-word-6" style={{ top: -65 }}>שינוי</span>
			<span className="footer-good-letters-2 footer-good-word-7" style={{ top: -44 }}>דחייה</span>
			
			<span className="footer-bad-letters-1 footer-bad-word-1" style={{ top: -55 }}>בסיס</span>
			<span className="footer-bad-letters-2 footer-bad-word-2" style={{ top: -44 }}>מטרות</span>
			<span className="footer-bad-letters-3 footer-bad-word-3" style={{ top: -39 }}>מסווג</span>
			<span className="footer-bad-letters-1 footer-bad-word-4" style={{ top: -78 }}>מערכת</span>
			<span className="footer-bad-letters-1 footer-bad-word-5" style={{ top: -84 }}>סייבר</span>
			<span className="footer-bad-letters-2 footer-bad-word-6" style={{ top: -66 }}>מתקפה</span>
			<span className="footer-bad-letters-2 footer-bad-word-7" style={{ top: -41 }}>חשאי</span>

			<span className="copy-rights" style={{bottom: 5}}>
				© פותח על-ידי צוות קליק
			</span>
		</div>
	);
}

export default Footer;
