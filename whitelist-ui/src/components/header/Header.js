import React from 'react';
import logo from '../../assets/images/logo.png';
import './Header.css';
import { Link } from "react-router-dom";
import HeaderLink from '../headerLink/HeaderLink';

function Header() {
	return (
		<div className="header-container">
			<img className="header-logo" src={logo} />
			<Link to="/"><HeaderLink title="ראשי"/></Link>
			<Link to="/words-inputes"><HeaderLink title="הוספת מילים" /></Link>
			<Link to="/words"><HeaderLink title="מילים נופלות" /></Link>
			<div style={{flexGrow: 1}}/>
			{/* <Link to="/about"><HeaderLink title="about" /></Link> */}
			<div style={{width: "25px"}}/>
		</div>
	);
}

export default Header;
