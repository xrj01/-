import React from "react";
import ContrastModal from "../contrastModal";
import CompareBarModal from "../compareBarModal";
import SKUModal from "../contrastSKUModal";
import ShoppingSKUModal from "../shoppingSKUModal";
export default class PriceComponents extends React.PureComponent{
    constructor(props) {
        super(props);
    }
    render(){
        return(
            <div>
                {/*框比价*/}
                <ContrastModal />
                {/*比价栏*/}
                <CompareBarModal/>
                {/*对比选择sku弹出框*/}
                <SKUModal />
                {/* 购物车选择sku弹出框*/}
                <ShoppingSKUModal />
            </div>
        )
    }

}