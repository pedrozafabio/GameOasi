import React, { Component } from 'react'

import modules from './StandLayout.module.css';
import Products from './Products';
import { MdChat, MdShoppingCart, MdPublic} from "react-icons/md";
import ButtonStand from './ButtonStand';

import { FaWhatsapp, FaInstagram  } from "react-icons/fa";

const bg = require("../../assets/imgs/player_01.png")


export default class StandLayout extends Component {
    

    render() {


    let standInfo = this.props.stand;

    let openUrl = (url) => {
        window.open(url);
    }

    return (

        <div className={modules["container-main"]}>
            <div className={modules["container-header"]}>
                <div className={modules["card-background"]} style={{backgroundImage: `url(${bg})`}}/>        
                <div className={modules["container-header-content"]}>
                    <div className={modules["container-infos"]}>
                        <div className={modules["container-logo"]}>

                            <img src={standInfo.linkLogo}></img>

                        </div>
                        <div className={modules["container-title"]}>
                            <div className={modules["title"]}>{standInfo.nome}</div>
                            <div className={modules["subtitle"]}>{standInfo.tipoProduto}</div>
                            </div>
                    </div>
                    <div className={modules["container-links"]}>
                        {standInfo.site !== "" && standInfo.site ? <ButtonStand icon={<MdPublic/>} onClick={() => {openUrl(standInfo.site)}}>SITE</ButtonStand> : null}
                        {standInfo.mercadoLivre !== ""  && standInfo.mercadoLivre ? <ButtonStand icon={<MdPublic/>} onClick={() => {openUrl(standInfo.mercadoLivre)}}>MERCADO LIVRE</ButtonStand>: null}
                        {standInfo.enjoei !== "" && standInfo.enjoei ? <ButtonStand icon={<MdPublic/>} onClick={() => {openUrl(standInfo.enjoei)}}>ENJOEI</ButtonStand>: null}
                        {standInfo.elo !== "" && standInfo.elo ? <ButtonStand icon={<MdPublic/>} onClick={() => {openUrl(standInfo.elo)}}>ELO7</ButtonStand>: null}
                        {standInfo.instagram !== ""  && standInfo.instagram? <ButtonStand icon={<FaInstagram/>} onClick={() => {openUrl(standInfo.instagram)}}>INSTAGRAM</ButtonStand>: null}
                        {standInfo.celular !== "" && standInfo.celular? <ButtonStand icon={<FaWhatsapp/>} onClick={() => {openUrl(standInfo.celular)}}>WHATSAPP</ButtonStand>: null}
                    </div>
                </div>

            </div>
            <div className={modules["container-body"]}>

                <div className={modules["container-body-description"]}>
                    <div className={modules["p"]}> Atendimento dos Expositores</div>
                    <div style={{textAlign: 'left'}}>Sexta a domingo</div>
                    <div style={{textAlign: 'left'}}>16h às 20h</div>
                    <div style={{textAlign: 'left'}}>O atendimento também pode ser feito pelo whatsapp do Expositor caso ele não esteja on-line em Oasi :)</div>
                    <div className={modules["description"]}>{standInfo.descricao}</div>
                    <div className={modules["p"]}> <MdShoppingCart/>{`Para comprar um produto, converse com o vendedor ${standInfo.vendedor} pelo chat privado.`}</div>
                </div>
                <div className={modules["container-body-products"]}>
                   <div className={modules["products-title"]}>PRODUTOS</div> 
                   <div className={modules["products-list"]}><Products products={standInfo.catalogo} onSelect={this.props.onSelect}></Products></div>                     
                </div>

            </div>

        </div>

    )
}
}