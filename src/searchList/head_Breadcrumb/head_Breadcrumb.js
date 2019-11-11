import React from "react";
import "./head_Breadcrumb.scss"
import { Breadcrumb } from 'antd';
export default class Head_Breadcrumb extends React.Component{
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render(){
        var data = this.props.data;
        if(data ===""){
            data = sessionStorage.getItem('SL-inputData')
        }
        return(
            <div className="head_breadaceumb_box">
                <Breadcrumb  separator=">">
                    <Breadcrumb.Item href="#/home">首页</Breadcrumb.Item>
                    <Breadcrumb.Item href="#/SearchList">搜索</Breadcrumb.Item>
                    <Breadcrumb.Item>{data}</Breadcrumb.Item>
                </Breadcrumb>
            </div>
        )
    }
}
