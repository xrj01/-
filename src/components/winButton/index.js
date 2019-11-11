import React from "react";
import "./index.scss";
// import "../../index.css"
import { BackTop,Icon } from 'antd';
export default class WinButton extends React.Component{
/*    showOn_off(){
        const on_off = document.getElementsByClassName("on-off");
        if (on_off[0].style.display =="none"){
            on_off[0].style.display = "block";
            on_off[1].style.display = "block";
        }
        else {
            on_off[0].style.display = "none";
            on_off[1].style.display = "none";
        }
    }*/
    render(){
        return(
            <div className='backTop'>
                    <BackTop visibilityHeight={400}>
                        <div className="backTop_button iconStyle"><Icon type="up" /></div>
                    </BackTop>
                <div className="backTop_tel iconStyle"><i className="iconfont icondianhua"/></div>
                {/*<div className="backTop_kefu iconStyle"><i className="iconfont iconkefu"/></div>*/}
               <ul className="text_left_box">
                   {/*<li>联系我们</li>
                   <li>400-000-000</li>*/}
                   <li>客服座机</li>
                   <li>028-83368980</li>
               </ul>
                <div className="sanjiao"/>
            </div>
        )
    }
}