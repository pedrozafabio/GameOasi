import React, { useEffect, useRef, useState } from "react";
import { Modal } from "../BuildAvatar/Modal";
import Camera from "./Camera";
import styles from './Camera.module.css';
import { MdPhotoCamera } from "react-icons/md";
import Button2 from "../BuildAvatar/Button2";

export default function ModalCamera(props) {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState();

  const canvasRef = useRef(null);

  useEffect(() => {
      let img = new Image();
      img.src = require("../../assets/imgs/CabineDeFotos/cabineDeFotosTudoJunto.png");
      img.onload = () => setImage(img);
  },[]);


  function onclick () {

    setLoading(true);
    if (!loading) {
      let x = 1080;
      let y = 1080;
      let canvas = document.getElementById("canvasCamera");

      if(!canvas)
        return;

      let v = document.getElementById("video");
      
      let px = 128;
      let py = 292;
      let w = 824;
      let h = 465;

      var ctx = canvas.getContext("2d");


        ctx.drawImage(image, 0, 0, x, y);
        ctx.drawImage(v, px, py, w, h);

        let a = document.createElement("a");
        a.href = canvas.toDataURL("image/png");
        a.download = "Image.png";
        a.click();
        
        setLoading(false);
    }
  };
    

  return (  
    <div >
      <Modal width="35%" height="80%"  visible={props.visible} handleHide={props.handleHide}>
        <div
          id="teste"
          className={styles.main} >
          <div className={styles.header}></div>
          <div className={styles.center}>
                <div className={styles.right}></div>
                <div className={styles["center-center"]}>
                    <Camera></Camera>
                </div>
                <div className={styles.left}></div>
          </div>
          <div className={styles.footer}></div>
          <Button2 style={{  marginRight: "3%", width: '30%', padding: "5px", marginTop: '10px' }} onClick={
              () => { 
                  if(!loading){
                  onclick();
                }
              
              }}>
                  <MdPhotoCamera style={{ paddingRight: "5px"}}   /> TIRAR FOTO
              
            </Button2>
        </div>
        <canvas id="canvasCamera" style={{display: 'none'}} width="1080" height="1080"></canvas>
     
      </Modal>
      
    </div>
  );
}
