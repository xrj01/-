import React from "react";
import { Route, Switch ,Link} from 'react-router-dom';
import {DatePicker,Button,Pagination,Spin,message } from "antd";
import api from "./../../component/api";
import "./index.scss";
import prompt from "../../component/prompt";
import Null from "./../../components/noList/nullMerchants";
const {RangePicker} = DatePicker;
export default class PriceComparison extends React.PureComponent{
    constructor(props) {
        super(props);
        this.state={
            time_begin:"",
            time_end:"",
            page_number:1,
            page_size:10,
            compare_list:[],
            total:0,
            spinning:true
        }
    }

    componentDidMount() {
        this.getCompareRecord();
    }
    //获取比价记录
    getCompareRecord=()=>{
        const {time_begin,time_end,page_number,page_size} = this.state;
        const data={ time_begin, time_end, page_number, page_size };
        api.axiosPost("compareRecord",data).then((res)=>{
            if(res.data.code == 1){
                this.setState({
                    compare_list:res.data.data.compare_list,
                    total:res.data.data.total_row
                })
            }else{
                message.error(res.data.msg)
            }
            this.setState({spinning:false})
        })
    };

    //时间改变
    timeChange=(str,strData)=>{
        this.setState({
            time_begin:strData[0],
            time_end:strData[1],
        })
    };
    //点击搜索
    searchList=()=>{
        this.setState({
            page_number:1,
            spinning:true
        },()=>{
            this.getCompareRecord();
        })
    };

    render(){
        const {compare_list,total,spinning} = this.state;
        const token = prompt.getSession("token");
        const pagination={
            total:total,
            current:this.state.page_number,
            pageSize:this.state.page_size,
            onChange:(page)=>{
                this.setState({page_number:page},()=>{
                    this.getCompareRecord();
                })
                document.getElementById('root').scrollIntoView(true)
            }
        };
        return(
            <div className='price-comparison-box'>
                <div className="price-comparison-title">
                    <span>比价记录</span>
                </div>
                <div className="price-comparison-time-box">
                    比价时间：
                    <RangePicker onChange={this.timeChange}/> &emsp;
                    <Button onClick={this.searchList} type='primary'>搜索</Button>
                </div>
                <Spin spinning={spinning} tip="数据加载中...">
                    {
                        total ?
                            <div style={{"minHeight":"100px"}}>
                                {
                                    compare_list && compare_list.length>0 && compare_list.map((item)=>(
                                        <div className="export-price-record">
                                            <div className="export-price-title">
                                                <p>比价时间：{item.create_time}</p>
                                                <Button type='primary'>
                                                    <a target='_blank' href={`${api.urlApi.excelWriteWithHead}?id=${item.id}&token=${token}`}>
                                                        导出比价单
                                                    </a>
                                                </Button>
                                            </div>

                                            <div className="export-price-th">
                                                <div>商品名称</div>
                                                <div>规格型号</div>
                                                <div>供应商</div>
                                                <div>单价</div>
                                                <div>单位</div>
                                                <div>库存</div>
                                            </div>

                                            {
                                                item.product_info && item.product_info.length > 0 && item.product_info.map((info)=>(
                                                    <div className="export-price-td">
                                                        <div>
                                                            <p>{ info.product_title }</p>
                                                        </div>
                                                        <div>
                                                            <p>{info.product_standards}</p>
                                                        </div>
                                                        <div>
                                                            <p>{info.product_company}</p>
                                                        </div>
                                                        <div>
                                                            <p>￥{info.product_price}</p>
                                                        </div>
                                                        <div>
                                                            <p>{info.product_unit}</p>
                                                        </div>
                                                        <div>
                                                            <p>{info.product_inventory}</p>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    ))
                                }
                            </div> :
                            <Null title='暂无比价记录'/>
                    }
                </Spin>
                <div className='pagination' style={{display:total ? "block" : "none"}}>
                    <Pagination {...pagination} hideOnSinglePage/>
                </div>
            </div>
        )
    }

}