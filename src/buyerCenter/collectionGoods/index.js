import React from "react";
import { Route, Switch ,Link} from 'react-router-dom';
import Li from "./../../home/componentLi";
import api from "./../../component/api";
import "./index.scss"
import PriceConponents from "../../components/priceComponents";
import {Pagination} from "antd";
import Null from "./../../components/noList/nullMerchants";
export default class CollectionGoods extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            productList:[],
            page_number:1,
            page_size:12,
            total:0,
            defaultNull:false
        }
    }
    componentDidMount() {
        this.getCollectionGoods();
    }
    //获取收藏的商品列表
    getCollectionGoods=()=>{
        const {page_size,page_number} = this.state;
        const data={
            page_number,
            page_size
        };
        api.axiosPost("collection_product_list",data).then((res)=>{
            if(res.data.code == 1){
                this.setState({
                    productList:res.data.data.list,
                    total:res.data.data.total_row,
                    defaultNull:true
                })
            }
        })
    };
    paginationChange=(page)=>{
        window.document.getElementById('root').scrollIntoView(true)
        this.setState({
            page_number:page
        },()=>{
            this.getCollectionGoods();
        })
    };

    render(){
        const {productList,defaultNull} = this.state;
        return(
            <div className='collection-goods-warp'>
                <h5>
                    <span>收藏的商品</span>
                </h5>
                <div className="collection-goods-box">
                    <ul>
                        {
                            productList && productList.map((item)=>(
                                <Li key={item.id} {...item} item={item} isCollection={true} getCollectionGoods={this.getCollectionGoods}/>
                            ))
                        }
                    </ul>
                </div>

                <PriceConponents />
                {
                    this.state.total == 0 && defaultNull ? <Null title="暂无收藏商品"/> :
                        <div className='pagination'>
                            <Pagination
                                hideOnSinglePage={true}
                                pageSize={this.state.page_size}
                                total={this.state.total}
                                onChange={this.paginationChange}
                                current={this.state.page_number}/>
                        </div>
                }

            </div>
        )
    }

}