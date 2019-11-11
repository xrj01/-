import React from "react";
import { Route, Switch ,Link} from 'react-router-dom';
import {Pagination,message, Icon} from "antd";
import {createHashHistory} from "history";
import api from "./../../component/api";
import Null from "./../../components/noList/nullMerchants";
import "./index.scss";
const history = createHashHistory();
export default class MessageCenter extends React.PureComponent{
    constructor(props) {
        super(props);
        this.state={
            page_number:1,
            page_size:10,
            total:0,
            messageList:[],
            isNull:false
        }
    }

    componentDidMount() {
        this.getMessageList();
    }

    getMessageList=()=>{
        const {page_number,page_size} = this.state;
        const data = {
            page_number,
            page_size
        };
        api.axiosPost("getMessageList",data).then((res)=>{
            if(res.data.code == 1){
                const list = res.data.data.list;
                this.setState({
                    messageList:list,
                    isNull:true,
                    total:res.data.data.total_row
                })
            }
        });
    };

    //消息已读
    isReadMessage=(message_id,orderId,sub_order_id)=>{
        const data={message_id}
        api.axiosPost("read_message",data);
        if(sub_order_id == "0"){
            history.push(`/BuyerCenter/FatherOrdersDetails?order_id=${orderId}`)
        }else{
            history.push(`/BuyerCenter/ChildOrderDetails?order_id=${sub_order_id}`)
        }

    };
    render(){
        const {messageList,isNull} = this.state;
        const pagination={
            current:this.state.page_number,
            pageSize:10,
            total:this.state.total,
            hideOnSinglePage:true,
            onChange:(page)=>{
                this.setState({
                    page_number:page
                },()=>{
                    this.getMessageList();
                })
                document.getElementById('root').scrollIntoView(true)
            }
        };
        return(
            <div className='user-message-box'>
                <div className="user-message-head">
                    <span>系统消息</span>
                </div>

                {
                    messageList && messageList.map((item)=>(
                        <div className="user-message-list" key={item.id}>
                            <div>
                                {
                                    item.is_read == 0 && <span> </span>
                                }
                                <h5>{item.content}</h5>
                                <a href="javascript:;" style={{fontSize: 12}} onClick={()=>{this.isReadMessage(item.id,item.parent_order_id,item.sub_order_id)}}>查看订单 <Icon type="right" /></a>
                            </div>
                            <p>{item.create_time}</p>
                        </div>
                    ))
                }
                {
                    messageList.length == 0 && isNull &&<Null type='message' title="暂时没有消息"/>
                }

                <div className='user-message-pagination'>
                    <Pagination {...pagination}/>
                </div>
            </div>
        )
    }

}