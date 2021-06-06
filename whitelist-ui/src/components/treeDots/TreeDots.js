import React from 'react'

function TreeDots(props) {
    const { color } = props;
    return (
        <div style={{display: 'flex', flexDirection: 'row'}}>
            <div style={{height: "8px", width: "8px", borderRadius: "50%", backgroundColor: "#f44336", marginRight: "6px"}}/>
            <div style={{height: "8px", width: "8px", borderRadius: "50%", backgroundColor: "#fff176", marginRight: "6px"}}/>
            <div style={{height: "8px", width: "8px", borderRadius: "50%", backgroundColor: "#66bb6a", marginRight: "6px"}}/>
        </div>
    )
}

export default TreeDots
