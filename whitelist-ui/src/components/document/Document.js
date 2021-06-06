import React from 'react';
import './Document.css';

function Document(props) {
    const { style } = props;

	return (
		<div className="floating" style={{ transform: "rotate(-4deg)", padding: "30px", height: "390px", width: "290px", background: "white", borderRadius: "6px", ...style}}>
            <div className="text-placeholder" style={{ width: "93%" }}/>
            <div className="text-placeholder" style={{ width: "90%" }}/>
            <div className="text-placeholder" style={{ width: "95%", background: "#ef5350" }}/>
            <div className="text-placeholder" style={{ width: "70%", background: "#81c784" }}/>
            <div className="text-placeholder" style={{ width: "80%" }}/>
            <div className="text-placeholder" style={{ width: "90%" }}/>
            <div className="text-placeholder" style={{ width: "75%", background: "#81c784" }}/>
            <div className="text-placeholder" style={{ width: "45%" }}/>
            <div className="text-placeholder" style={{ width: "95%", background: "#ef5350" }}/>
            <div className="text-placeholder" style={{ width: "70%" }}/>
            <div className="text-placeholder" style={{ width: "80%", background: "#81c784" }}/>
            <div className="text-placeholder" style={{ width: "90%", background: "#ef5350" }}/>
            <div className="text-placeholder" style={{ width: "75%" }}/>
            <div className="text-placeholder" style={{ width: "45%" }}/>
		</div>
	);
}

export default Document;