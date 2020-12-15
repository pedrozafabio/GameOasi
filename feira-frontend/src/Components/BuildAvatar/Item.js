import React from 'react'
import Button2 from './Button2';
import styles from './Item.module.css'
import { FaSun } from 'react-icons/fa';

const Item = (props) => {

    let available = props.value === undefined || props.value === 0 || props.purchased;
    let valueComponent = available ? "GRÁTIS" : <div className={styles.valueString}><FaSun style={{ paddingRight: '5px' }} /> {props.value} </div>

    let disabled = props.disabled || available;
    let styleButton = {};
    let labelDisabled = "";
    if(props.purchased){
        valueComponent = "COMPRADO";
    }

    let itemClick = (e) => {
        if(available){
            if(props.onClick)
            props.onClick(e);
        }
    }

    if(disabled){
       styleButton = {
            height: "16%",
            marginTop: "5%",
            width: "90%",
            backgroundColor: 'rgba(234,94,191)',
            backgroundImage: undefined
        };           

        labelDisabled = "SELECIONAR";
        if(props.selected === props.id){
            labelDisabled = "SELECIONADO"

            styleButton = {
                height: "16%",
                marginTop: "5%",
                width: "90%",
                backgroundColor: 'rgba(255,190,235)',
                backgroundImage: undefined
            };    
        }
    }else{
        styleButton = {
            height: "16%",
            marginTop: "5%",
            width: "90%"
        };
        labelDisabled = "COMPRAR";
    }

    return (
        <div className={styles.ItemContainer} id={props.id} style={{backgroundColor: props.selected === props.id ? "rgba(228,185,16)" : undefined}}>
            <div className={styles.Item} onClick={itemClick}>
                <div className={styles.ImageContainer}>
                    <div className={styles.Image} style={{backgroundColor: props.color ? props.color : undefined}}>
                        {props.image ? <img className={styles.Image2} src={props.image}></img> : null}
                    </div>
                </div>

                <div className={styles.ValueContainer} style={{backgroundColor: available ? 'rgba(0,0,0,0)' : undefined}}>
                    {valueComponent}
                </div>
                <Button2 noborder={disabled} disabled={disabled} style={styleButton}>{labelDisabled}</Button2>
            </div>
        </div>
    )
}

export default Item;