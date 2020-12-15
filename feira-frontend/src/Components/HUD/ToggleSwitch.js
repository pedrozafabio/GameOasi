import React, { Component } from "react";
import styles from './ToggleSwitch.module.css'
export default class ToggleSwitch extends Component {

    state={
        checked : false
    }

    componentDidMount(){
        this.setState({checked : this.props.initialValue})
    }

    render(){
        return (
            <div className={styles.container} style={{paddingRight:' 10px' }}>  
        <div className={styles.switch} onClick={() => {this.setState({checked: !this.state.checked}); this.props.onClick()}}>
            
        <input type="checkbox" checked={this.state.checked} onChange={() => {}}/>
        <span className={styles.slider + " " + styles.round}></span>
      </div>
      {this.state.checked ? this.props.labelTrue : this.props.labelFalse}
      </div>     )
    }
}