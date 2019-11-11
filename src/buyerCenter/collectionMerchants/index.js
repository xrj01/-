import React from "react";
import {Icon,message,Pagination,Modal} from "antd";
import {Link} from "react-router-dom";
import api from "./../../component/api";
import "./index.scss"
import prompt from "../../component/prompt";
import Null from "./../../components/noList/nullMerchants";
export default class CollectionMerchants extends React.PureComponent{
    constructor(props) {
        super(props);
        this.state={
            page_number:1,
            page_size:12,
            merchantList:[],
            total:0,
            defaultNull:false
        }
    }

    componentDidMount() {
        this.collectionMerchantList()
    }

    pageChange=(size)=>{
        this.setState({
            page_number:size
        },()=>{
            this.collectionMerchantList();
        })
    };

    collectionMerchantList=()=>{
        const {page_number,page_size} = this.state;
        const data={
            page_number,
            page_size
        };
        api.axiosPost("collection_merchant_list",data).then((res)=>{
            if(res.data.code == 1){
                this.setState({
                    merchantList:res.data.data.list,
                    total:res.data.data.total_row,
                    defaultNull:true
                })
            }else{
                message.error(res.data.msg);
            }
        })
    };

    //取消收藏
    collection_merchant=(id)=>{
        const _this = this;
        const data={
            merchant_id:id,
            type:0
        };
        Modal.confirm({
            title: '是否取消收藏商家?',
            okText: '确定',
            cancelText: '取消',
            onOk() {
                api.axiosPost("collection_merchant",data).then((res)=>{
                    if(res.data.code == 1){
                        message.success(res.data.msg);
                        _this.collectionMerchantList();
                    }else{
                        message.error(res.data.msg)
                    }
                })
            }
        });

    };

    render(){
        const {merchantList,defaultNull} = this.state;
        return(
            <div className='collection-merchants-warp'>
                <h5>
                    <span>收藏的店铺</span>
                </h5>
                <div className="collection-merchants-box">
                    {
                        merchantList && merchantList.map((item)=>{
                            return(
                                <div className="merchants-box" key={item.merchants_id}>
                                    <Link to={`/SupplierDetails?${item.merchants_id}`}>
                                        <img src={prompt.getGoodsImgUrl(item.merchants_id,item.merchants_id,"387",9)} alt=""/>
                                    </Link>

                                    <p>{item.company}</p>
                                    <div className="delete-box">
                                        <Icon type="delete" onClick={()=>{this.collection_merchant(item.merchants_id)}}/>
                                    </div>
                                   
                                </div>
                            )
                        })
                    }
                </div>

                {
                    this.state.total == 0 && defaultNull ? <Null title='暂无收藏店铺'/> :
                    <div className='pagination'>
                        <Pagination
                            hideOnSinglePage={true}
                            onChange={this.pageChange}
                            current={this.state.page_number} total={this.state.total}/>
                    </div>
                }
            </div>
        )
    }

}