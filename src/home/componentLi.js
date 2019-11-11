import React,{PureComponent} from "react";
import {Link} from 'react-router-dom';
import api from "./../component/api";
import {observer,inject} from "mobx-react";
import "./componentLi.scss";
import prompt from "../component/prompt";
import {message,Icon ,Modal} from "antd";
@inject('store')
@observer
class Component extends React.Component{
    constructor(props) {
        super(props);
    }

    //弹出选择属性的框
    showModal=(goodsId,classId,type)=>{

        const {store} = this.props;
            store.contrast.getDBValue();
        // const contrastLength = store.contrast.contrast.length;
        const goods = this.props.item;
        // console.log(goods)
        store.contrast.domPosition = 0;
        if(type == "jd" && goods.price == "暂无报价"){
            message.error("该商品暂不支持比价");
            return false
        }
        // const contrastLength = store.contrast.contrastLength;
       /* if(contrastLength >= 5){
            message.error("最多添加5条商品进行比价");
            return false;
        }*/

       if(type == "jd"){
           const class_Id = classId;
           const contrastLength = store.contrast.contrast.length;
           const jdGoods={
               type:"jd",
               class_id:class_Id,
               id:goods.product_id,
               title:goods.title,
               sku:goods.id,
               pic:goods.pic,
               skuVal:goods.title,
               merchant_id:goods.merchant_id
           };
           if(contrastLength >= 5){
               message.error("最多添加5条商品进行比价");
               return false;
           }
           store.contrast.addContrast(jdGoods);
       }else{
           store.contrast.isShowModal(true,goodsId,classId,goods,type);
       }
    };

    //加入购物车弹出属性选择框
    showAttrModal=(goodsId,classId,goods,type)=>{
        const {store} = this.props;
        if(type == "jd" && goods.price == "暂无报价"){
            message.error("该商品暂不支持购买");
            return false
        }
        if(type == "jd"){
            const data={
                sku:goods.product_id,
                product_id:goods.product_id,
                count:1,
                type:"jd",
                title:goods.title,
                pic:goods.pic,
                price:goods.price,
            };
            store.shoppingCart.addShopping(data);
        }else{
            store.shoppingCart.isShowShopping(true,goodsId,classId,goods,type)
        }
    };

    //取消收藏
    cancelCollection=(id,type)=>{
        const _this = this;
        Modal.confirm({
            title: '是否取消收藏?',
            okText: '确定',
            cancelText: '取消',
            onOk() {
                const data={
                    product_id:id,
                    type:0
                };
                let url = "collection_product";
                if(type == "jd"){
                    url = "collection_product_jd"
                }
                api.axiosPost(url,data).then((res)=>{
                    if(res.data.code == 1){
                        message.success(res.data.msg);
                        _this.props.getCollectionGoods();
                    }else{
                        message.error(res.data.msg);
                    }
                })
            }
        });
    };
    imgError = (e) => {
        e.target.style.background = 'transparent'
    }

    render(){
        const {type,isCollection} = this.props;
        const {store} = this.props;
        const searchValue = store.seachDataBus.searchValue;
        // console.log('searchValue', searchValue);
        const matchTitle = () => {
            let newTitle = this.props.title.length > 30 ? this.props.title.substring(0,30)+"..." : this.props.title;
            if(newTitle.indexOf(searchValue) > -1){
                newTitle = newTitle.replace(searchValue, `<i style='color: #D01D00'>${searchValue}</i>`)
                return newTitle
            }else{
                return newTitle
            }
        }

        const toLink = type == "jd" ? "/JDgoodsDetails" : "/GoodsDetails";
        return(
            <li className='good-thing-li'>
                <div className="home-new-icon" style={{display:this.props.isShowNew ? "block" : "none"}}> </div>
                {
                    isCollection && this.props.state != 1 &&
                    <div className="collection-shelves"> </div>
                }
                {
                    isCollection &&
                    <div className='goods-delete-collection'>
                        <Icon type="delete" onClick={()=>{this.cancelCollection(this.props.id,this.props.type)}}/>
                    </div>
                }
                <Link to={`${toLink}?${this.props.id}`} target='_blank'>
                    <div className="img-box">
                        {
                            type == "jd" ?  <img src={this.props.pic} alt=""/> : <img src={prompt.imgUrl(this.props.merchant_id,this.props.id)} onError={this.imgError} alt=""/>
                        }
                    </div>
                </Link>
                <Link to={`${toLink}?${this.props.id}`} target='_blank'>
                    {/* <h6 className="goods_box_title" title={this.props.title}>{this.props.title.length > 30 ? this.props.title.substring(0,30) + "..." : this.props.title}</h6> */}
                    <h6 className="goods_box_title" title={this.props.title} ><span dangerouslySetInnerHTML={{__html:matchTitle()}}></span></h6>
                </Link>
                <div className="goods-price-box">
                    {/*<div className="collection">
                        <i className='iconfont iconshoucang-copy'> </i>
                        收藏
                    </div>*/}
                    <p style={{textAlign:"left"}}>￥{this.props.price}</p>
                </div>

                <div className="home-good-operation-box">
                    <div className='button-div' onClick={()=>{this.showAttrModal(this.props.id,this.props.class_id,this.props.item,type)}}>
                        <i className='iconfont icongouwuche color-red font-bold'> </i>
                        加入购物车
                    </div>
                    <div className='button-div button-div-hover' onClick={()=>{this.showModal(this.props.id,this.props.class_id,type)}}>
                        <i className=''> </i>
                        加入比价
                    </div>
                </div>

                {
                    isCollection && this.props.state != 1 &&
                    <div className="collection-mask">  </div>
                }
            </li>
        )
    }
}
export default Component