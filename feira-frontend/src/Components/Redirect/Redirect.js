import React, { Component } from "react";

export default class Redirect extends Component {

    componentDidMount(){
        window.location.href = 'https://oasi.vc/' || process.env.REACT_APP_OASI_URL;
    }

    render(){
        return <div></div>
    }
}