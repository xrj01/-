import React from "react";
import { Route, Switch ,Link} from 'react-router-dom';
import {Pagination,message,Button} from "antd";
import {createHashHistory} from "history";
import api from "./../../component/api";
import Null from "./../../components/noList/nullMerchants";
import "./index.scss"
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
    isReadMessage=(message_id,orderId)=>{
        const data={message_id}
        api.axiosPost("read_message",data);
        history.push(`/ApproverAccount/ParentOrder?${orderId}`)
    };
    // 分页数量切换
    onShowSizeChange = (number,size) =>{
        this.setState({
            page_number:number,
            page_size:size
        },()=>{this.getMessageList()})
    }
    render(){
        const {messageList,total,isNull} = this.state;
        const pagination={
            current:this.state.page_number,
            pageSize:this.state.page_size,
            total:this.state.total,
            hideOnSinglePage:true,
            onChange:(page,size)=>{
                this.setState({
                    page_number:page,
                    page_size:size,
                },()=>{
                    this.getMessageList();
                })
                document.getElementById('root').scrollIntoView(true)
            }
        };
        return(
            <div className='user-message-box1'>
                <div className="user-message-head1">
                    <span style={{color:'#1890ff'}}>系统消息</span>
                </div>

                {
                    messageList && messageList.map((item)=>(
                        <div className="user-message-list1" key={item.id}>
                            <div onClick={()=>{this.isReadMessage(item.id,item.parent_order_id)}}>
                                {
                                    item.is_read == 0 && <span> </span>
                                }
                                <h5 style={{marginLeft:item.is_read == 0?'':'11px'}}>{item.content}</h5>
                                {/* <Link to={`/ApproverAccount/ParentOrder?${item.parent_order_id}`}>查看订单></Link> */}
                                <a href="javascript:;" onClick={()=>{this.isReadMessage(item.id,item.parent_order_id)}}>{item.create_time}</a>
                            </div>
                            {/* <p className={item.is_read === 0 ?'pl10':''}>{item.create_time}</p> */}
                        </div>
                    ))
                }
               {/*  {
                    messageList.length == 0 && isNull &&<Null type='message' title="暂时没有消息"/>
                } */}
                {
                     messageList.length === 0 ?
                     <div className='admin-myApp-nodata'>
                        <img src={require('./../../image/img_zwxx.png')} alt=''/><span>暂无消息</span>
                    </div>
                    :''
                }
                <div className="class-pagination-box mtop">
                    {/* <Pagination {...pagination}/> */}
                    
                    <Pagination 
                        defaultCurrent={1} 
                        itemRender={this.itemRender} 
                        total={total}  
                        {...pagination} 
                        hideOnSinglePage={true} 
                        showSizeChanger 
                        showQuickJumper={{goButton: <Button className='pagination-btn'>确定</Button>}} 
                        onShowSizeChange={this.onShowSizeChange}
                    />
                   
                </div>
            </div>
        )
    }

}