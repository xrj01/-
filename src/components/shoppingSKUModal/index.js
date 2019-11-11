import React,{Component} from "react";
import {Link} from 'react-router-dom';
import {Modal,Row,Col,message,Input} from "antd";
import api from "./../../component/api";
import {observer,inject} from "mobx-react";
import prompt from "./../../component/prompt";
import "./index.scss";
@inject("store")
@observer
class SKUModal extends React.PureComponent{
    constructor(props) {
        super(props);
        this.state={
            key1:"00",
            key2:"00",
            key3:"00",
            key4:"00",
            key5:"00",
            number:1
        }
    }
    //点击取消按钮
    onCancel=()=>{
        const {store} = this.props;
        store.shoppingCart.isShowShopping(false);
        this.reductionDate();
    };
    //点击属性
    addContrast=()=>{
        const {store} = this.props;
        const goodsType = store.shoppingCart.goodsType;
        const {key1,key2,key3,key4,key5} = this.state;
        const SKUList = store.shoppingCart.SKUList;
        let contrastSKU =`${store.shoppingCart.classId}${key1}${key2}${key3}${key4}${key5}`;
        const isSKU = SKUList.filter((item)=>{
            return item.sku == contrastSKU;
        });
        if(!isSKU.length && goodsType != "jd"){
            message.error('该规格暂无报价');
            return false;
        }

        const data={
            sku:contrastSKU,
            product_id:store.shoppingCart.goods.id,
            count:this.state.number
        };
        if(goodsType == "jd"){
            contrastSKU = store.shoppingCart.classId;
            data.type = "jd";
            data.title = store.shoppingCart.goods.title;
            data.pic = store.shoppingCart.goods.pic;
            data.price = store.shoppingCart.goods.price;
            data.sku = store.shoppingCart.goods.id;
        }

        store.shoppingCart.contrastSKU = contrastSKU;
        store.shoppingCart.isShowShopping(false);
        store.shoppingCart.addShopping(data);
        this.reductionDate();
    };
    //选择属性并生成sku
    selectAttribute=(skuIndex,attrIndex)=>{
        const type = `key${skuIndex+1}`;
        this.setState({
            [type]:prompt.addZero(attrIndex)
        });
    };
    //还原数据
    reductionDate=()=>{
        this.setState({
            key1:"00",
            key2:"00",
            key3:"00",
            key4:"00",
            key5:"00",
            number:1
        })
    };
    shoppingNumber=(type)=>{
        let {number} = this.state;
        if(type == "+"){
            number = parseInt(number+1);
        }else{
            number -=1;
            if(number<=1){
                number = 1;
            }
        }
        this.setState({number})
    };
    //输入框改变
    inputChange=(e)=>{
        if(prompt.isNumber(e.target.value)){
            this.setState({
                number:e.target.value
            })
        }
    };
    render(){
        const {store} = this.props;
        const goods = store.shoppingCart.goods;
        const attribute = store.shoppingCart.attribute;
        const param = store.shoppingCart.SKUParamList;
        const goodsType = store.shoppingCart.goodsType;
        return(
            <Modal
                visible={store.shoppingCart.shoppingSKUModal}
                okText="确定"
                maskClosable={false}
                centered={true}
                title='请选择商品属性'
                cancelText="取消"
                width={600}
                className='modal'
                onOk={this.addContrast}
                onCancel={this.onCancel}
            >
                <div className="goods-modal-box">
                    <div className="good-img">
                        {
                            goodsType == "jd" ?
                                <img src={goods && goods.pic} alt=""/>
                                :
                                <img src={prompt.imgUrl(goods&&goods.merchant_id,goods&&goods.id,80)} alt=""/>
                        }
                    </div>
                    <div className="goods-modal-number">
                        <h4>{ goods ? goods.title : ""}</h4>
                        <div className='shopping-number-box'>
                            <span>
                                    <button onClick={()=>{this.shoppingNumber("-")}}>-</button>
                                <Input onChange={this.inputChange} value={this.state.number}/>
                                    <button onClick={()=>{this.shoppingNumber("+")}}>+</button>
                            </span>
                        </div>
                    </div>
                </div>
                {
                    param && param.map((item)=>{
                        return item.name && item.name.map((itemName,k)=>{
                            if(item.display[k]){
                                const isShow = attribute[k+1]['00'];
                                let activeK = `key${k+1}`;
                                return(
                                    <Row key={itemName} className='line-height-30' style={{display:isShow ? "none" : "block"}}>
                                        <Col span={4} className='text-right'>
                                            {itemName} ：
                                        </Col>
                                        <Col span={20} className='attribute-list'>
                                            {
                                                item.val[0] && item.val[0][k] && item.val[0][k].map((val,j)=>{
                                                    let defaultChecked = false;
                                                    if(attribute[k+1][prompt.addZero(j+1)]){
                                                        defaultChecked = true;
                                                    }
                                                    return(
                                                        <span className={this.state[activeK] == prompt.addZero(j+1) ? "active" : ""}
                                                              onClick={()=>{this.selectAttribute(k,j+1)}}
                                                              key={val} style={{display:defaultChecked ? "inline-block" : "none"}}>
                                                            {val}
                                                        </span>
                                                    )
                                                })
                                            }
                                        </Col>
                                    </Row>
                                )
                            }
                        })
                    })
                }
            </Modal>
        )
    }
}
export default SKUModal;
