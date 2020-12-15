import React from 'react'
import PropTypes from 'prop-types'

function ThreeShowChats(props) {
    console.log(props);
    return (
        <div>
             <ul>
                {props.tabs.map((x, i)=>{
                    return (
                    <li key={i}>
                        <div onClick={()=>{
                            props.onClick(x)
                        }}>
                            {x.split("Sala@").length > 1 ? "Sala Atual" : x}
                        </div>
                    </li>
                    );
                })}
            </ul>
        </div>
    )
}

ThreeShowChats.propTypes = {
    tabs : PropTypes.array,
    onClick : PropTypes.func
}

export default ThreeShowChats

