import React from 'react';
import './HomePage.css';
import Footer from '../../components/footer/Footer';
import good from '../../assets/images/check.svg';
import bad from '../../assets/images/cancel.svg';

function HomePage() {
	return (
		<div className="page-container">
			<div className="home-page-main-section">
				<img src={good} className="good-image" />
				<div className="home-page-text">
					<h2 className="color-orange">שירות הפיכת תוכן לבלתי מסווג</h2>
					<p className="color-ligthgray">
						ברוכים הבאים לממשק ניהול של שירות whitelist <br /> כאן תוכלו להוסיף, להסיר ולשנות את המילים המותרות
					</p>
				</div>
				<img src={bad} className="bad-image" />
			</div>
			<Footer />
		</div>
	);
}

export default HomePage;
