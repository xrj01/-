import React from "react";
import "./compare.scss";
import { Table } from 'antd';
import { createHashHistory } from 'history';
import PriceConponents from "./../../components/priceComponents";
import {message} from "antd";
import {observer,inject} from "mobx-react";
// import SKUModal from "../../storesMobx/index.js"
import api from "../../component/api";
@inject('store')
@observer



class Compare extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            title: {title: "同品对比"},
            table: {
                columns: [{
                    className:"td1",
                    title: '商品编号',
                    dataIndex: 'num',
                    // ↓ 去除字母 判断数字顺序
                    sorter: (a, b) => a.num.replace(/[^0-9]/ig,"") - b.num.replace(/[^0-9]/ig,""),
                }, {
                    className:"td2",
                    title: '商品名称',
                    dataIndex: 'name',
                    sorter: (a, b) => a.name.soft,
                }, {
                    className:"td3",
                    title: '型号规格',
                    dataIndex: 'model',
                    sorter: (a, b) => a.address.length - b.address.length,
                },{
                    className:"td4",
                    title: '供应商',
                    dataIndex: 'codeName',
                    sorter: (a, b) => a.address.length - b.address.length,
                },{
                    className:"td5",
                    title: '单价',
                    dataIndex: 'cost',
                    sorter: (a, b) => a.compare - b.compare,
                },{
                    className:"td6",
                    title: '对比',
                    dataIndex: 'address'
                },{
                    className:"td7",
                    title: '库存',
                    dataIndex: 'compare',
                    sorter: (a, b) => a.compare - b.compare,
                },{
                    className:"td8",
                    title: '数量',
                    dataIndex: 'quantity',
                },{
                    className:"td9",
                    title: '操作',
                    dataIndex: 'make',
                },

                ],

                data: []
            }
        };
    }
    onChange(pagination, filters, sorter) {
        // console.log('params', pagination, filters, sorter);
    }
    gotoName(e){
        const history = createHashHistory();
        let id = e.target.id;
        history.push('/GoodsDetails?'+id);
    }
    gotoSD(e){
        let id = e.target.id;
        const history = createHashHistory();
        history.push('/SupplierDetails?'+id);
    }

//  ↓ ------------------- 表格添加比对商品 ----------------------

    addContrast=(goods)=>{
        const {store} = this.props;
        const contrastLength = store.contrast.contrast.length;
        store.contrast.domPosition = 0;
        if(contrastLength >= 5){
            message.error("最多添加5条商品进行比价");
            return false;
        }
        store.contrast.addContrast(goods);

    };

    // ↓ ------------- 修改表格购物车数量 ---------------
    changeNum(e){
        const type = e.target.innerHTML,
            num  = e.target.parentElement.getElementsByClassName("num")[0];
        if(type==="+"){
            num.innerText= parseInt(num.innerText)+1
        }
        if(type==="-"&&num.innerHTML>1){
            num.innerText= parseInt(num.innerText)-1
        }

    }

    // ↓ --------------- 添加购物车 --------------------
    addSPcar(e){
        const id = e.target.parentElement.parentElement.getElementsByClassName("td1")[0].innerText;
        const num = e.target.parentElement.parentElement.getElementsByClassName("td8")[0].getElementsByClassName("num")[0].innerHTML
        const data={
            sku:this.props.sku,
            product_id:id,//← 商品id
            count:num // ← 数量
        };
        api.axiosPost('addShoppingCartData',data)
            .then((res)=>{
                // console.log("发往购物车",res)
            })
    }

    render(){
        const data = this.props.data.data;
        const columns_ =[];
        if(data&&data.code===1){

            for (let i = 0; i <data.data.length;i++ ){
                let modo =  {
                    key: i,
                    num: data.data[i].article_number,
                    name: <a href="javascript:void(0);"
                             onClick={this.gotoName.bind(this)}
                             id={data.data[i].product_id}>{data.data[i].title}</a>,
                    model:"make10086",
                    codeName: <a href="javascript:void(0);"
                                 onClick={this.gotoSD.bind(this)}
                                 id={data.data[i].merchant_id}>{data.data[i].company}</a>,
                    cost:data.data[i].price,
                    address:<div><button onClick={()=>{this.addContrast({
                            class_id:this.props.class_name_3,
                            id:data.data[i].product_id,
                            price:data.data[i].price,
                            sku:this.props.sku,
                            title:data.data[i].title}
                            /*↑ ------- 添加比对商品的传值 --------*/
                    )}}>对比</button></div>,
                    compare:data.data[i].inventory,
                    quantity:<div><button onClick={this.changeNum.bind(this)}>-</button><span className="num">1</span><button onClick={this.changeNum.bind("dec")}>+</button></div>,
                    make:<button onClick={this.addSPcar.bind(this)}>加入购物车</button>
                };
                columns_.push(modo)
            }
            this.state.table.data = columns_


        }


        // console.log(this.state.table.data[0].num.replace(/[^0-9]/ig,""))
        return(
            <div className="commodity">
                <div className="compare_title_box">
                 <span className="title">
                     {this.state.title.title}
                 </span>
                </div>
                <div className="compare_table">
                    <Table columns={this.state.table.columns}
                           dataSource={this.state.table.data}
                           onChange={this.onChange}
                           pagination = {false}
                    />
                </div>
                <PriceConponents/>
            </div>
        )
    }

}export default Compare
