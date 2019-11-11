import React from "react";
import Header from "./../../components/header";
import Footer from "./../../components/footer/newFootHelp/Footer";
import {Icon,Upload,Button,message,Modal,Spin } from "antd";
import { createHashHistory } from 'history';
import api from "./../../component/api";
import publicFn from "./../../component/prompt";
import "./index.scss";
const history = createHashHistory();
export default class PayOrder extends React.Component{
    constructor(props) {
        super(props);
        const parent_order_id = window.location.hash.split("=")[1];
        this.state={
            fileList:[],
            parent_order_id,
            approval_id:"",
            approvalList:[],
            order_price:"",
            time_limit:"",
            time:"03:00:00",
            signature:null,
            imgSpin:false
        }
    }
    componentDidMount() {
        this.getApprovalList();
        this.getProductSign();
    }
    //获取签名
    getProductSign=(file,index,fn)=>{
        const {parent_order_id} = this.state;
        const data={
            id:parent_order_id,
            dir:publicFn.getProductSign(null,parent_order_id)
        };
        api.axiosGet("getProductSign",data).then((res)=>{
            if(res.status == 200){
                this.setState({
                    signature:res.data
                },()=>{
                    if(file && fn){
                        fn(file);
                    }
                })
            }
        })
    };
    //审批流id改变
    changeApprovalId=(id)=>{
        this.setState({approval_id:id})
    };
    //获取审批流程
    getApprovalList=()=>{
        const {parent_order_id} = this.state;
        const data={
            parent_order_id
        };
        api.axiosPost("orderApprovalList",data).then((res)=>{
            if(res.data.code == 1){
                const file = res.data.data.file;
                const fileList = [];
                file.map((item,index)=>{
                    fileList.push({
                        uid: index,
                        name: item && item.substring(item.indexOf("-")+1),
                        status: 'done',
                        url: `${api.imgUrl}/${item}`,
                        storageUrl:item
                    })
                });
                this.setState({
                    approvalList:res.data.data.approval_list,
                    order_price:res.data.data.order_price,
                    time_limit:res.data.data.time_limit,
                    fileList
                },()=>{
                    this.orderSetInterval();
                })
            }else{
                message.error(res.data.msg)
            }
        })
    };
    //图片删除
    deleteImg=(file)=>{
        const {parent_order_id,fileList} = this.state;
        const data={
            bucket:"cn-anmro-qiniucai-datas",
            parent_order_id,
            file:file.storageUrl
        };
        return new Promise((resolve,reject)=>{
            api.axiosPost("getProductSignDelete",data).then((res)=>{
                if(res.status == 200){
                    const newFile = fileList.filter((item)=>{
                        if(item.storageUrl !== file.storageUrl){
                            return item
                        }
                    });
                    this.setState({fileList:newFile});
                    resolve(false);
                }else{
                    resolve(false)
                }
            });
        });
    };
    //图片回调
    handleChange = (file) => {
        const {fileList} = this.state;
        if(file.fileList.length < fileList.length) return;
        this.setState({
            imgSpin:true
        },()=>{
            this.goodsImg(file)
        })

    };
    //添加附件地址
    goodsImg=(file)=>{
        const {signature,fileList,parent_order_id} = this.state;
        publicFn.antdUpFile(file,signature,parent_order_id).then((res)=>{
            if(res.status == 'ok'){
                fileList.push(res.data);
                this.setState({
                    fileList
                });
                this.storageOrderFile(res.data.storageUrl);
            }
            this.setState({
                imgSpin:false
            })
        }).catch((error)=>{
            this.getProductSign(file,this.goodsImg);
        });
    };
    //存储上传的附件
    storageOrderFile=(file)=>{
        const {parent_order_id} = this.state;
        const data={
            parent_order_id,
            file
        };
        api.axiosPost("order_file",data).then((res)=>{
            if(res.data.code !== 1){
                message.error(res.data.msg)
            }
        })
    };
    //提交订单
    submitOrder=()=>{
        const {parent_order_id,approval_id} = this.state;
        const data={
            approval_id,
            parent_order_id
        };
        if(!approval_id){
            this.showModal("未选择审批流");
            return false;
        }
        api.axiosPost("submit_audit",data).then((res)=>{
            if(res.data.code == 1){
                history.push(`/AuditOrder?parent_order_id=${parent_order_id}`);
            }else{
                message.error(res.data.msg)
            }
        })
    };
    //弹出框
    showModal=(msg)=>{
        Modal.warning({
            title: msg,
        })
    };
    //查看附件
    lookFile=(item)=>{
        const data={
            file_name:item
        };
        api.axiosGet("getProductLookSign",data).then((res)=>{
            if(res.status == 200){
                window.open(res.data.url)
            }
        })
    };

    orderSetInterval=()=>{
        let {time_limit} = this.state;
        this.interval = setInterval(()=>{
            /*let date = new Date();
            let now = date.getTime();
            let endDate = new Date(Number(time_limit));//设置截止时间
            let end = endDate.getTime();*/
            // let leftTime = end - now; //时间差
            let leftTime = time_limit; //时间差
            console.log(time_limit)
            let h, m, s,time;
            if(leftTime >= 0) {
                // d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
                h = Math.floor(leftTime / 1000 / 60 / 60);
                m = Math.floor(leftTime / 1000 / 60 % 60);
                s = Math.floor(leftTime / 1000 % 60);
                if(s < 10) { s = "0" + s;  }
                if(m < 10) { m = "0" + m; }
                if(h < 10) { h = "0" + h; }
                time = `${h}:${m}:${s}`;
                time_limit -= 1000;
            } else {
                time = "已超时"
            }
            this.setState({time,time_limit});
        },1000)
    };
    componentWillUnmount=()=>{
        clearInterval(this.interval)
    };
    render(){
        const {imgSpin,fileList,approvalList,approval_id,parent_order_id,order_price,time_limit,time} = this.state;
        const uploadButton = (
            <Button>
                <Icon type="upload" /> 上传附件
            </Button>
        );
        return(
            <div className='order-pay-warp'>
                <Header />
                <div className="order-pay-box">
                    <h5>订单提交</h5>
                    <div className="order-pay-title-box">
                        <Icon type="check-circle" theme="filled" />
                        <div className="order-pay-content">
                            <h4>订单{parent_order_id}生成完毕，请尽快提交审核。如需改价请联系销售经理</h4>
                            <p>
                                请在
                                <span>{time}</span>
                                小时内完成订单审核，超时该订单将自动取消
                            </p>
                        </div>
                        <div className="order-pay-total">
                            订单总额：<span>¥{order_price}</span>
                        </div>
                    </div>
                    <h6>
                        <span>*</span>选择审批流程
                    </h6>
                    <div className="order-project-list">
                        {
                            approvalList && approvalList.map((item)=>(
                                <div
                                    onClick={()=>{this.changeApprovalId(item.id)}}
                                    className={approval_id == item.id ? "active" : ""} key={item.id}>
                                    {item.content}
                                </div>
                            ))
                        }
                    </div>
                    <h5>上传附件</h5>
                    <div className='order-pay-upload-box'>
                        <Upload
                            listType="picture"
                            className='upload-list-inline'
                            fileList={fileList}
                            accept='image/*,text/*,application/msexcel,application/msword,application/pdf,.zip,.xls'
                            beforeUpload={()=>{return false}}
                            onRemove={(file)=>{this.deleteImg(file)}}
                            onChange={(file)=>{this.handleChange(file)}}
                        >
                            {fileList.length >= 5 ? null : uploadButton}
                        </Upload>
                        <Spin spinning={imgSpin}>
                            <div className="pay-order-file-list-box">
                                {
                                    fileList && fileList.map((item)=>{
                                        return(
                                            <div key={item.uid} className='pay-order-file-list'>
                                                <em> </em>
                                                <p>{item.name}</p>
                                                <a href="javascript:;" onClick={()=>{this.lookFile(item.storageUrl)}}>查看附件</a>
                                                <Icon type="close-circle" onClick={()=>{this.deleteImg(item)}}/>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </Spin>
                    </div>

                    <div className="order-button-box">
                        <Button type='primary' onClick={this.submitOrder}>
                            确认提交
                        </Button>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }

}