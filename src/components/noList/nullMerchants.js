import React from "react";
import "./null.scss";
import  nullImg from "./../../image/img_wsp.png";
import nullAdd from "./../../image/nullAdd.png";
import nullOrder from "./../../image/null-order.png";
import nullMessage from "./../../image/nullMessage.png";
class SearchNull extends React.Component{

    constructor(props) {
        super(props);

        this.state = {
        }

    }

    render(){
        const {title,type,isTop} = this.props;
        let img = nullImg;
        switch (type) {
            case "add":
                img = nullAdd;
                break;
            case "order":
                img = nullOrder;
                break;
            case "message":
                img = nullMessage;
                break;
        }
        return(
            <div className="searchNull">
                <div className="imgBox">
                    <img className="nullImg" src={img} alt="搜索空页面图片"/>
                </div>
                <div className="textBox">
                    <p>
                        {
                            title ? title :" 没有收藏到有商家，快去收藏吧"
                        }
                    </p>
                </div>
            </div>
        )
    }
}export default SearchNull