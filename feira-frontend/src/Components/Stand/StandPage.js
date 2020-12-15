import React, { Component } from 'react'

import modules from './StandPage.module.css';
import Products from './Products';
import { MdChat, MdShoppingCart, MdPublic} from "react-icons/md";
import ButtonStand from './ButtonStand';

import { FaWhatsapp, FaInstagram  } from "react-icons/fa";
import StandLayout from './StandLayout';
import ProductSelected from './ProductSelected';

const bg = require("../../assets/imgs/player_01.png")


export default class StandPage extends Component {
    
    state={
        product : null
    }

    setProduct = (produto) =>{
        this.setState({product : produto});
    }

    render() {



    return (this.state.product ? 
        <ProductSelected stand={this.props.stand} produto={this.state.product} onBack={()=>{this.setState({product: null})} }/> : 
            <StandLayout stand={this.props.stand} onSelect={this.setProduct.bind(this)}/>

            //         <div className={modules.StandVideo}>
        //             { <iframe width="420" height="236" src={`https://www.youtube.com/embed/${standInfo.linkYoutube}`} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>}
        //         </div>
        //     </div>
        // </div>
    )
}
}