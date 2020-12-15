import React, { Component } from 'react';
import Card from './Card';

import modules from "./Product.module.css";

export default class Product extends Component {




    render(){
        let description = this.props.produto.descricao;

        if(this.props.maxLength !== undefined){
            if(description.length > this.props.maxLength){
                description = description.slice(0,this.props.maxLength) + "...";
            }
        }


        return <Card>
        <div className={modules["container"]}>
            <img src={this.props.produto.foto} />
            <div className={modules["title"]}>{this.props.produto.tipoProduto}</div>
            <div className={modules["description"]}>{description}</div>
            { this.props.showDetalhes ? <div>{this.props.produto.detalhes}</div> : null}
            <div className={modules["price"]}>{`R$${
                
                typeof(this.props.produto.valor) === 'number' ? this.props.produto.valor.toFixed(2).replace('.',',') : this.props.produto.valor
                
                }`}</div>
        </div>
    </Card>
    }
}