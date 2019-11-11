import React from "react";
import "./null.scss";
import  nullImg from "./../../image/img_wsp.png"
class SearchNull extends React.Component{

    constructor(props) {
        super(props);

        this.state = {
        }

    }

    render(){
        return(
            <div className="searchNull">
                <div className="imgBox">
                    <img className="nullImg" src={nullImg} alt="搜索空页面图片"/>
                </div>
                <div className="textBox">
                    <p>抱歉，没有找到相关的商品</p>
                    <p>您可以直接联系客服<span> 028-83368980 </span>告知您的需求</p>
                </div>
            </div>
        )
    }
}export default SearchNull