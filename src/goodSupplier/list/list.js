import React from "react";
import {Link, Route} from 'react-router-dom';
import { Icon } from 'antd';
import "./list.scss";
import api from "../../component/api";
import {createHashHistory} from 'history';
import prompt from "../../component/prompt";
export default class List extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    componentDidMount(){

    }
    goSupplierDetails(e){
        const history = createHashHistory(),
            id = e.currentTarget.id;
        history.push('/SupplierDetails?'+id+"?");
    }

    render(){
        const data = this.props.data;
        const {store} = this.props;
        // const imgSize = prompt.imgSize('387');
        return(
            <div className="supplier_list clear">
                {data.list&&data.list.map((item,index) =>
                    <div key={index} id={item.id} className="supplier_box" >
                        <div id={item.id} className="title_box" onClick={this.goSupplierDetails.bind(this)}>
                        <div  className="supplier_img_box" >
                            {/*<img src={`${api.imgUrl}merchant/${item.id}/${item.id}-0.jpg${imgSize}`} alt=""/>*/}
                            <img src={prompt.getGoodsImgUrl(item.id,item.id,387,9)} alt=""/>
                        </div>
                        <h3 className="supplier_title">{item.company}</h3>
                        <div>
                            <p className="supplier_textDescription">{item.introduce.length>80?item.introduce.substr(0,80)+"...":item.introduce}</p>
                        </div>
                        </div>
                        <div className="foot_box">
                            <div className="foot_conter_box">
                                <Icon type="heart"
                                      style={{color:"red"}}
                                      className={"icon"}/>
                                收藏
                                <div className="goodsNum_box">
                                    共<span>{item.product_count}</span>件商品
                                </div>
                            </div>
                        </div>
                    </div>)}
            </div>
        )
    }


}
