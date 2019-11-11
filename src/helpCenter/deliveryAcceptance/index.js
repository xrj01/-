import React from "react";
import "./index.scss";
import WinButton from "../../components/winButton/index"
export default class ThatTemplate extends React.Component{
    constructor(props) {
        super(props);
        this.state={
        }
    }

    render(){
        return(
            <div className='thatTemplate-box'>
                <div className='thatTemplate-container'>
                    <div className='thatTemplate-title'>
                        配送与验收
                    </div>
                    <div>
                        <h3>关于配送</h3>
                        <p>
                            平台商品有平台配送……<br/>
                            第三方供应商商品由第三方供应商配送……<br/>
                            支付完成与商家协商配送服务，按协议进行配送……<br/>
                        </p>
                    </div>
                    <div>
                        <h3>关于验收</h3>
                        <p>
                            采购方收到货物后，验明无误，在采购后台进行收货操作……<br/>
                        </p>
                    </div>
                    
                </div>
             <WinButton/>
            </div>
        )
    }
}