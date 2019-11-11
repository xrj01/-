import React from "react";
import {Link} from "react-router-dom";
import "./trateName_data.scss";
import { Button } from 'antd';
export default class Trate extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            // data :this.props.data
        }
    }
    componentDidMount(){
        // this.setState({data:this.props.data})
    }
    render(){
        const data = this.props.data;
        // ↓ -------- 设置缩写文章 --------
        const maxWidth = 15,
            textMaxWidth = 178;
        var title ="",
            text = "";
        if(data.title.length>maxWidth){
            title = data.title.substr(0,maxWidth)+"...";
            text = data.description.substr(0,textMaxWidth)+"...";
        }
        else {
            title = data.title;
            text = data.description
        }

        return(
            <div className="trateName_box">
                <div className="trateName">
                    <div className="title"title={title}>
                        <p>{title}</p>
                    </div>
                    <div className="tel_box">
                        <p><span>电话：</span>{data.tel}</p>
                        <p><span>地址：</span>{data.district}</p>
                    </div>
                    <div className="button_box">
                        <Button className="button">收藏店铺</Button>
                        <Button className="button">进入店铺</Button>
                    </div>
                    <div className="description">
                        <p>{text}</p>
                    </div>
                </div>
            </div>
        )
    }
}