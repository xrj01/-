import React,{Component} from "react";
import {Link} from 'react-router-dom';
import {Modal, Row, Col, message, Input} from "antd";
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
            key1:{
                name:"",
                key:"00",
                val:""
            },
            key2:{
                name:"",
                key:"00",
                val:""
            },
            key3:{
                name:"",
                key:"00",
                val:""
            },
            key4:{
                name:"",
                key:"00",
                val:""
            },
            key5:{
                name:"",
                key:"00",
                val:""
            }
        }
    }
    //点击取消按钮
    onCancel=()=>{
        const {store} = this.props;
        store.contrast.isShowModal(false);
        this.reductionDate();
    };
    //点击属性
    addContrast=()=>{
        const {store} = this.props;
        const goodsType = store.contrast.goodsType;
        const {key1,key2,key3,key4,key5} = this.state;
        const goods = store.contrast.goods;
        const SKUList = store.contrast.SKUList;
        const contrastLength = store.contrast.contrastLength;
        if(contrastLength >= 5){
            message.error("最多添加5条商品进行比价");
            return false;
        }
        let contrastSKU =`${store.contrast.classId}${key1.key}${key2.key}${key3.key}${key4.key}${key5.key}`;
        const isSKU = SKUList.filter((item)=>{
            return item.sku == contrastSKU;
        });
        if(!isSKU.length && goodsType!=="jd"){
            message.error('该规格暂无报价');
            return false;
        }
        const skuVal = `${key1.name && key1.name + ":"}${key1.val && key1.val} ${key2.name && key2.name + ":"}${key2.val && key2.val} ${key3.name && key3.name + ":"}${key3.val && key3.val} ${key4.name && key4.name + ":"}${key4.val && key4.val} ${key5.name && key5.name + ":"}${key5.val && key5.val}`;

        if(goodsType == "jd"){
            goods.sku = store.contrast.classId;
            contrastSKU = store.contrast.classId;
        }
        store.contrast.contrastSKU = contrastSKU;
        goods.sku = contrastSKU;
        goods.skuVal = skuVal;
        store.contrast.updateGoodsSKU(goods);
        store.contrast.addContrast(goods);
        store.contrast.isShowModal(false);
        this.reductionDate();
    };
    //选择属性并生成sku
    selectAttribute=(skuObj,attrObj)=>{
        const type = `key${skuObj.skuIndex+1}`;
        this.setState({
            [type]:{
                name:skuObj.skuName,
                key:prompt.addZero(attrObj.attrIndex),
                val:attrObj.skuValue
            }
        });
    };
    //还原数据
    reductionDate=()=>{
        this.setState({
            key1:{
                name:"",
                key:"00",
                val:""
            },
            key2:{
                name:"",
                key:"00",
                val:""
            },
            key3:{
                name:"",
                key:"00",
                val:""
            },
            key4:{
                name:"",
                key:"00",
                val:""
            },
            key5:{
                name:"",
                key:"00",
                val:""
            },
        })
    };
    render(){
        const {store} = this.props;
        const attribute = store.contrast.attribute;
        const goods = store.contrast.goods;
        const param = store.contrast.SKUParamList;
        const goodsType = store.contrast.goodsType;
        return(
            <Modal
                visible={store.contrast.skuModal}
                okText="确定"
                title='请选择商品属性'
                cancelText="取消"
                centered={true}
                maskClosable={false}
                width={600}
                className='modal'
                onOk={this.addContrast}
                onCancel={this.onCancel}
            >
                <div className="goods-modal-box">
                    <div className="good-img">
                        {
                            goodsType == "jd" ? <img src={goods && goods.pic} alt=""/> :
                                <img src={prompt.imgUrl(goods && goods.merchant_id,goods && goods.id,100)} alt=""/>
                        }
                    </div>
                    <div className="goods-modal-number">
                        <h4>{ goods ? goods.title : ""}</h4>
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
                                                        <span className={this.state[activeK]["key"] == prompt.addZero(j+1) ? "active" : ""}
                                                              onClick={()=>{this.selectAttribute({skuIndex:k,skuName:itemName},{attrIndex:j+1,skuValue:val})}}
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
