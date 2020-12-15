import React, { useEffect, useState } from "react";
import SpinnerNinja from "./SpinnerNinja";

export default function Loading(props) {
  const [onLoading, setOnLoading] = useState(true);

  useEffect(() => {
    window.SetOnLoading = setLoading;
  });


  const setLoading = (v) => {
      
    if (props.onStart && v) {
      props.onStart();
    }

    if(props.onFinish && !v){
        props.onFinish();
    }
    setOnLoading(v);

    
  };

  return (
    onLoading ?
    <div
      style={{
        position: "fixed",
        left: "0",
        right: "0",
        width: "100%",
        display: 'flex',
        justifyContent : 'center',
        alignItems : 'center',
        height: "100%",
        backgroundColor: 'rgba(29,29,29)',
        zIndex: "101",
      }}
    >
      <SpinnerNinja onLoading={onLoading}></SpinnerNinja>
    </div> : null
  );
}
