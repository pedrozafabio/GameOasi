import React from 'react'

import modules from './Products.module.css'
import Card from './Card'
import Product from './Product'

export default function Products(props) {
    return (
        <div className={modules.ProductsGrid}>
            {
                props.products.map((p,i) =>{
                    return (
                    <div key={i} onClick={() => {props.onSelect(p)}}>
                        <Product produto={p} maxLength={70}></Product>
                    </div>
                    )
                })
            }
        </div>
    )
}
