import React from 'react';
import './TextRadio.css';

function TextRadio(props) {
	// State & props
	const { text, color, isSelected, onClick } = props;

	// Rendering
	return (
		<div className="opacity" style={{ display: "flex", alignItems: "start", opacity: 0.7 }}>
			<input id={text} type="radio" name="radio-group"  defaultChecked={isSelected} onSelect={onClick} onClick={onClick} />
			<label htmlFor={text} style={{ color: isSelected ? color : "#9e9e9e" }}>{text}</label>
		</div>
		
	);
}

export default TextRadio;
