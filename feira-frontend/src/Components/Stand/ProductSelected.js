import React, { Component } from 'react'

import modules from './ProductSelected.module.css';
import Products from './Products';
import { MdChat, MdShoppingCart, MdPublic , MdChevronLeft} from "react-icons/md";
import ButtonStand from './ButtonStand';

import { FaWhatsapp, FaInstagram  } from "react-icons/fa";

const bg = require("../../assets/imgs/player_01.png")


export default class ProductSelected extends Component {
    

    render() {

        let standInfo = this.props.stand;
    let produto = this.props.produto;

    return (

        <div className={modules["container-main"]}>
            <div className={modules["container-header"]}>
                <div className={modules["card-background"]} style={{backgroundImage: `url(${bg})`}}/>        
                <div className={modules["container-header-content"]}>
                    <div className={modules["container-infos"]}>
                        <div className={modules["container-logo"]}>

                            <div className={modules["button"]} onClick={this.props.onBack}> <MdChevronLeft></MdChevronLeft> VOLTAR</div>

                        </div>
                        <div className={modules["container-title"]}>
                            <div className={modules["title"]}>{standInfo.nome}</div>
                            <div className={modules["subtitle"]}>{standInfo.tipoProduto}</div>
                            </div>
                    </div>
                    
                </div>

            </div>
            <div className={modules["container-body"]}>

                <div className={modules["container-body-photo"]}>
                    <img src={produto.foto} />
                </div>
                <div className={modules["container-body-product"]}>
                   <div className={modules["product-title"]}> {produto.tipoProduto}</div>                 
                   <div className={modules["price"]}>{`R$${
                       typeof(this.props.produto.valor) === 'number' ? this.props.produto.valor.toFixed(2).replace('.',',') : this.props.produto.valor

                   }`}</div>                 
                   <div className={modules["p"]}> Informações do produto: </div>                 
                   <div className={modules["description"]}>{produto.descricao}</div>                 
                   <div className={modules["p"]}> Detalhes do produto: </div>                 
                   <div className={modules["description"]}>{produto.detalhes}</div>                 
                </div>

            </div>

        </div>

    )
}
}