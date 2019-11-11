import React from "react";
import img from "./../../image/null-shopping.png";
import {Link} from "react-router-dom";
import "./index.scss";

export default class NullShopping extends React.PureComponent{
    constructor(props) {
        super(props);

    }

    render(){
        return(
            <div className='null-shopping-box'>
                <img src={img} alt=""/>
                <p>购物车内暂时没有商品</p>
                <Link to="/home">继续逛逛</Link>
            </div>
        )
    }

}