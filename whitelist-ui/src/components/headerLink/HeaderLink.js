import React from 'react';
import './HeaderLink.css';

function HeaderLink(props) {
	// State & props
	const { title } = props;

	// Rendering
	return (
		<div className="header-link-container">
			{title}
		</div>
	);
}

export default HeaderLink;