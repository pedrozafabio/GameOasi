import React, { Component } from 'react'
import Item from './Item';
import styles from './ItemList.module.css'

class ItemList extends Component {
    

    render() {
        let data = [...this.props.data];

        let dataToItem = data ? data.map( (item,index) => {
            let itemClick = (e) => { 
                item.index = index;
                if(this.props.onClick)
                this.props.onClick(e, item)
            };
            
            return <Item id={index} 

            key={index}
            onClick={itemClick}
            selected={this.props.itemSelected} 
            image={item.icon}
             color={item.color} 
             value={item.value} 
             purchased={false}/>
        }) : null;


      return  <div className={styles.itens}>
            {dataToItem}
        </div>    
    }
}


export default ItemList;