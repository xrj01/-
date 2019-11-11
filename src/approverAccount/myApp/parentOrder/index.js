import React from "react";
import { Popover, Button,Icon,message,Modal,Input } from "antd";
import { Link } from "react-router-dom";
import MyApprovalModal from './../myApprovalModal'
import MyFileModal from './../myFileModal'
import "./index.scss";
import api from "../../../component/api";
import prompt from './../../../component/prompt'
import Item from "antd/lib/list/Item";

export default class parentOrder extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            fid : '',
            parentDate : {},    // 父订单数据
            invoice_info : [], // 发票信息
            address_info : [], // 收货人信息
            order_list : [], // 订单列表
            stepData:{},
            approvalModal:false,
            getAppr: false,
            time_limit:'',
            time:"",
            other:'',
            ReasonBtn:[],
            btnClassNameArry:[]
            
            
        }
    }

    render(){
        

        const {invoice_info,parentDate,address_info,order_list,fid,approvalModal,stepData,time,other,ReasonBtn,btnClassNameArry} = this.state
        const content = (
            <div style={{fontSize:'12px',color:'#666',width:'329px'}}>
                {
                    invoice_info.bank ?
                    <p>开户银行：{invoice_info.bank}</p>:''
                }
                {
                    invoice_info.register_address ?
                    <p>注册地址：{invoice_info.register_address}</p>:''
                }
                {
                    invoice_info.register_tel ?
                    <p>公司电话：{invoice_info.register_tel}</p>:''
                }
                {
                    invoice_info.taker_name || invoice_info.taker_tel || invoice_info.taker_address ?
                    <p>收票信息：{invoice_info.taker_name} {invoice_info.taker_tel} {invoice_info.taker_address}  </p> :''
                }
                
            </div>
                                     
        );
        const approvalData={
            display:approvalModal,
            stepData,
            isHideModal:this.isHideModal
        };
        //console.log(2222,time);
        
        return(
            <div className='appParentOrder-box'>
                    <div className='appParentOrder-container-title'>
                        <div className='appParentOrder-container-title-img mt20'>
                            {
                                 parentDate.state == '0'? <img src={require('./../../../image/newsubmit.png')} alt='' />
                                :parentDate.state == '1'? <img src={require('./../../../image/newdaifukuan.png')} alt='' />
                                :parentDate.state == '2'? <img src={require('./../../../image/newdaifahuo.png')} alt='' />
                                :parentDate.state == '3'? <img src={require('./../../../image/newyifahuo.png')} alt='' />
                                :parentDate.state == '4'? <img src={require('./../../../image/newyiwancheng.png')} alt='' />
                                :parentDate.state == '-1'?<img src={require('./../../../image/newyiquxiao.png')} alt='' />
                                :parentDate.state == '-2'?<img src={require('./../../../image/newyiguanbi.png')} alt='' />
                                :parentDate.state == '-3'?<img src={require('./../../../image/newyibohui.png')} alt='' />
                                :''
                            }
                            <div className='ft16 mt5'>
                                {
                                    parentDate.state == '0'?'待提交'
                                    :parentDate.state == '1'?'待付款'
                                    :parentDate.state == '2'?'待发货'
                                    :parentDate.state == '3'?'已发货'
                                    :parentDate.state == '4'?'已完成'
                                    :parentDate.state == '-1'?'已取消'
                                    :parentDate.state == '-2'?'已关闭'
                                    :parentDate.state == '-3'?'已驳回'
                                    :''
                                }
                            </div>
                        </div>
                        <div className='appParentOrder-number'>
                            <div>父订单编号</div>
                            <div>{fid}</div>
                        </div>
                        <div className='appParentOrder-number'>
                            <div>下单时间</div>
                            <div>{parentDate.create_time}</div>
                        </div>
                        {
                            parentDate.state == '1' || parentDate.state == '0'?
                            <div className='appParentOrder-number'>
                                <div>付款截止</div>
                                <div style={{color:'#d01d00'}}>{time}</div>
                            </div>
                            :''
                        }
                        
                        <div className='appParentOrder-btn-box'>
                            <div onClick={this.orderApprovalProcess} className={parentDate.approval_state == '0' && time !== '已超时' ?'':'mr60'}>审批流程</div>
                            {
                                parentDate.approval_state == '0' && time !== '已超时' ?
                                <React.Fragment>
                                    <div onClick={()=>{this.showTurnModal()}}>驳回</div>
                                    <div onClick={()=>{this.showOpenModal()}}>通过</div>
                                </React.Fragment>
                                :''
                            }
                            
                        </div>
                    </div>

                    <div className='appParentOrder-container-content'>
                        {
                            parentDate.state == -3 || parentDate.state == -2 ?
                            <div className ="appParentOrder-dismiss-reason">
                                <div>{parentDate.state == -3 ?'驳回原因':'关闭原因'}</div>
                                <div>{parentDate.close_reason}</div>
                            </div>
                            :''
                        }
                        
                        <div className='ft14'>商品信息</div>
                        <div className='appParentOrder-container-header'>
                            <div>商品信息</div>
                            <div>单价</div>
                            <div>数量</div>
                            <div>小计</div>
                        </div>
                        {
                            order_list && order_list.map((item,index)=>(
                                <div className='appParentOrder-product-box' key={index}>
                                    {/* 头部 */}
                                    <div className='appParentOrder-product-title'>
                                        <div className='appParentOrder-product-title-left'>
                                            <div className='ml15'>
                                                <span>下单时间：</span>
                                                <span>{item.create_time}</span>
                                            </div>
                                            <div>
                                                <span>订单编号：</span>
                                                <span>{item.id}</span>
                                            </div>
                                            <div>
                                                <span>供应商名称：</span>
                                                <span>{item.merchant_name}</span>
                                            </div>
                                        </div>
                                        <div className='appParentOrder-product-title-right'>
                                            {
                                                item.state  == '0'?'待提交'
                                                :item.state == '1'?'待付款'
                                                :item.state == '2'?'待发货'
                                                :item.state == '3'?'已发货'
                                                :item.state == '4'?'已完成'
                                                :item.state == '-1'?'已取消'
                                                :item.state == '-2'?'已关闭'
                                                :item.state == '-3'?'已驳回'
                                                :item.state == '-101'?'删除'
                                                :''
                                            }
                                        </div>
                                    </div>
                                    {/* 内容 */}
                                    <div className='appParentOrder-product-content'>
                                        <div className='appParentOrder-product-content-details'>
                                            <div>
                                                <img src={item.type == 'jd' ? item.pic : prompt.imgUrl(item.merchant_id,item.product_id)} alt="" className='appParentOrder-product-content-img'/>
                                                
                                            </div>
                                            <div>
                                                <div className='ft12 color66 mr14'>
                                                    {
                                                        item.type == 'jd' ? <Link to={`/AdminJDdetails?${item.product_id}`} target="_blank">{item.product_name}</Link>
                                                        : <Link to={`/Admindetails?${item.product_id}+${item.sku}`} target="_blank">{item.product_name}</Link>
                                                    } 
                                                </div>
                                                <div className='ft12 color89 mt15 mr14'>
                                                    <span className='mr20'>{item.param}</span>
                                                    {/* <span>颜色：黑色</span> */}
                                                </div>
                                                {/* <div className='ft12 color89'>型号：1235446RT</div> */}
                                            </div>
                                        </div>
                                        <div className='width188'>￥{item.price}</div>
                                        <div className='width188'>{item.count}{item.unit ? `/${item.unit}` : ""}</div>
                                        <div className='width188'>
                                            <div className='red'>￥{item.order_price}</div>
                                            {/* <div>(含运费：￥{item.freight})</div> */}
                                        </div>
                                        {/* <div className='width188 width141'><Link to={`/BusinessAccount/SonOrder?${item.sub_order_num}`}>订单详情</Link></div> */}
                                    </div>
                                    {/* 尾部 */}
                                    <div className='appParentOrder-product-footer'>
                                        <span>备注：</span>
                                        <span>{item.remark}</span>
                                    </div>
                                </div>
                            ))
                        }
                       

                        <div className='appParentOrder-container-info'>
                            <div className='appParentOrder-info-consignee'>
                                <div className='ft14 mb20'>收货信息</div>
                                <p>收 货 人 : {address_info.consignee}</p>
                                <p>联系方式 : {address_info.phone}</p>
                                <p>收货地址 : {address_info.address_1}{address_info.address_2}{address_info.address_3}{address_info.address_info}</p>
                            </div>
                            <div className='appParentOrder-info-consignee'>
                                <div className='ft14 mb20'>支付方式</div>
                                <p>
                                    支付方式：账期支付
                                </p>
                            </div>
                            <div className='appParentOrder-info-consignee'>
                                <div className='ft14 mb20'>发票信息</div>
                                
                                <p>
                                    发票类型：{
                                                invoice_info && invoice_info.invoice_type || invoice_info.invoice_type == 0 ? invoice_info.invoice_type == '0' ?"普通发票" : "增值税发票" : "集中开票"

                                             }
                                </p>
                                {
                                    invoice_info && invoice_info.invoice_type != undefined &&
                                    <p>企业名称：{invoice_info.company}</p>
                                }
                                {
                                    invoice_info && invoice_info.invoice_type != undefined &&
                                    <p>对公账户：{invoice_info.bank_account}</p>
                                }
                                {
                                    invoice_info && invoice_info.invoice_type != undefined &&
                                    <p>纳税人识别号：{invoice_info.taxpayer_identification_code}</p>
                                }
                                {
                                    invoice_info && invoice_info.invoice_type != undefined &&
                                    <Popover placement="bottomLeft" content={content} trigger="click">
                                        <p className='blue'>更多</p>
                                    </Popover>
                                }
                            </div>
                            <div className='appParentOrder-info-invoice'>
                                <div className='ft14 mb20'>项目信息</div>
                                <p>项目名称：{parentDate && parentDate.project_name}</p>
                                <p>项目经理：{parentDate && parentDate.project_manager}</p>
                            </div>
                        </div>
                        {/* 
                            parentDate.order_file && parentDate.order_file.length > 0 &&
                            <div>
                                <h3 className='appParentOrder-accessory'>附件</h3>
                                <div className="appParentOrder-order-file-list">
                                    {parentDate.order_file.map((item,index)=>{
                                        const fileType = item.substring(item.lastIndexOf(".")+1);
                                        let typeIcon = null;
                                        switch (fileType) {
                                            case "ppt":
                                                typeIcon = <Icon className='ppt' type="file-ppt" theme="filled" />;
                                                break;
                                            case "word":
                                                typeIcon = <Icon className='word' type="file-word" theme="filled" />;
                                                break;
                                            case "pdf":
                                                typeIcon = <Icon className='pdf' type="file-pdf" theme="filled" />;
                                                break;
                                            case "xlsx":
                                                typeIcon = <Icon className='xlsx' type="file-excel" theme="filled" />;
                                                break;
                                        }
                                        return(
                                            <div className='file-list'>
                                                <div className="file-list-img">
                                                    {
                                                        typeIcon ? typeIcon : <img src={`${api.imgUrl}${item}`} alt=""/>
                                                    }
                                                </div>
                                                <p title={item.substring(item.indexOf("-")+1)}>
                                                    {item.substring(item.indexOf("-")+1)}
                                                </p>
                                                <a href={`${api.imgUrl}${item}`}>查看</a>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div> */}
                        
                        {
                            parentDate.order_file && parentDate.order_file.length > 0 &&
                            <div>
                                <h3 className='appParentOrder-accessory'>附件</h3>
                                <div className="appParentOrder-order-file-list">
                                    {parentDate.order_file.map((item,index)=>{
                                        const fileType = item.substring(item.lastIndexOf(".")+1);
                                        let typeIcon = null;
                                        switch (fileType) {
                                            case "ppt":
                                                typeIcon = "img_ppt.png";
                                                break;
                                            case "word":
                                                typeIcon = "img_word.png";
                                                break;
                                            case "pdf":
                                                typeIcon = "img_pdf.png";
                                                break;
                                            case "xlsx":
                                                typeIcon = "img_exl.png";
                                                break;
                                            case "xls":
                                                typeIcon = "img_exl.png";
                                                break;
                                            case "doc":
                                                typeIcon = "img_word.png";
                                                break;
                                        }
                                        return(
                                            <div className='file-list'>
                                                <div className="file-list-img">
                                                    <span>
                                                       {typeIcon && <img src={require(`./../../../image/${typeIcon}`)} alt=""/>}
                                                    </span>
                                                </div>
                                                <p title={item.substring(item.indexOf("-")+1)}>
                                                    {item.substring(item.indexOf("-")+1)}
                                                </p>
                                                <a href='javascript:;' onClick={()=>{this.fileLink(item)}}>查看文件</a>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        }
                        <div className='appParentOrder-container-payment'>
                            <div>
                                商品件数：<span>{parentDate.product_sum}件</span>
                            </div>
                            <div>
                                商品总价：<span>￥{parentDate.order_price_without_all_freight}</span>
                            </div>
                            <div>
                                运费：
                                <span>￥{parentDate.all_freight}</span>
                            </div>
                            <div>
                                应付总额：
                                <span className='ft18'>￥{parentDate.all_order_price}</span>
                            </div>
                            
                        </div>
                    </div>
                    {/* 通过审核 弹窗 */}
                    <Modal
                        className='busUser-open-model'
                        destroyOnClose //清空弹窗
                        width='440px'
                        centered = {true}
                        closable = {false}
                        maskClosable = {false}
                        //title='通过审核'
                        visible={this.state.getAppr}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        footer={[
                            <div className='busUser-open-btn'>
                                <Button key="back" onClick={this.handleCancel} style={{width:'70px',height:'32px'}}>
                                    取消
                                </Button>
                                <Button key="submit" type="primary" onClick={this.handleOk} style={{width:'70px',height:'32px'}}>
                                    确定
                                </Button>
                            </div>
                        ]}
                    >   
                        {
                            <div className='delet-box'>
                            <Icon type="exclamation-circle" className="delet-icon"></Icon>
                            {
                                parentDate && parentDate.is_last == 1 ? <div>通过审核后，将立即支付订单，是否继续？</div> :  <div>通过审核后，将提交订单给下一个审核人，是否继续？</div>
                            
                            }
                            </div>
                        }
                        
                    </Modal> 
                    {/* 驳回审核 弹窗 */}
                    <Modal
                        className='busUser-turn-model'
                        destroyOnClose //清空弹窗
                        width='560px'
                        centered = {true}
                        closable = {false}
                        maskClosable = {false}
                        title='驳回订单'
                        visible={this.state.turn}
                        onOk={this.handleTurn}
                        onCancel={this.handleCancel}
                        footer={[
                            <div className='busUser-turn-btn'>
                                <Button key="back" onClick={this.handleCancel} style={{width:'80px',height:'40px'}}>
                                    取消
                                </Button>
                                <Button key="submit" type="primary" onClick={this.handleTurn} style={{width:'80px',height:'40px'}}>
                                    确定
                                </Button>
                            </div>
                        ]}
                    >   
                        {/* <Turnform wrappedComponentRef={(e)=>{this.addform = e}}/> */}
                        <div className='busUser-turn-title'>请选择驳回原因</div>
                        <div className ='busUser-turn-checkbox' >
                            {
                                ReasonBtn && ReasonBtn.map((item,index)=>(
                                    <Button className={btnClassNameArry.indexOf(item.content) > -1?'active':''} onClick={()=>{this.handReasonBtn(item.content)}}>{item.content}</Button>
                                ))
                            }
                        </div>
                        <div  className='busUser-turn-other'>其它原因</div>
                        <Input className="width-176" onChange={(e) => { this.handleOtherOnchange('other', e.target.value) }} value={other} placeholder="请输入驳回原因，最多输入20字符~"></Input>
                    </Modal> 
                    {/* 审批流程弹窗 */}
                    <MyApprovalModal {...approvalData}/>
                    
           
            </div>
        )
    }
    componentDidMount(){
        const fid = this.props.location.search.split('?')[1]
        this.setState({
            fid
        },()=>{this.getParent()})

        if(this.state.time == "已超时"){
            this.getParent()
        }
    }
    // 通过审核 弹窗
    showOpenModal = () => {
        this.setState({
            getAppr: true,
            //parent_order_id,
            //is_last
        });
    };
    handleCancel = (e) =>{
        this.setState({
            getAppr: false,
            turn: false,
            appProcess: false,
        })
    }
    handleOk = (e) =>{
        const data = {
            parent_order_id : `${this.state.fid}`,
            state : '1',
            reason : []
        }
        api.axiosPost('approval_order',data).then((res)=>{
            if(res.data.code === 1){
                message.success(res.data.msg)
                this.setState({
                    getAppr: false,
                },()=>{this.getParent()})
                
            }else{
                message.error(res.data.msg)
                this.setState({
                    getAppr: false,
                },()=>{this.getParent()})
            }
        })
        
    }
    // 驳回 弹窗
    showTurnModal = (e) =>{
        const data = {
            type : 0
        }
        api.axiosPost('approval_reason_model_list',data).then((res)=>{
            if(res.data.code === 1){
                let arr = [...res.data.data.global_model,...res.data.data.local_model]
                //console.log(arr);
                this.setState({
                    ReasonBtn : arr,
                    turn: true,
                    //parent_order_id : `${this.state.fid}`,
                });
            }else {
                message.error(res.data.msg)
            }
        })
        
    }
    handReasonBtn = (id) =>{
        //console.log(id);
        const { btnClassNameArry } = this.state;

        // 如果点击的在数组中已经存在，则从数组删除，否则，添加到数组
        if(btnClassNameArry.indexOf(id) > -1){

            btnClassNameArry.splice(btnClassNameArry.indexOf(id), 1);

        }else{
            btnClassNameArry.push(id);
        }
        //console.log(btnClassNameArry);
        
        this.setState({
            btnClassNameArry
        });

    }
    handleTurn = (e) =>{
        const {other,btnClassNameArry} = this.state
        if(!other && btnClassNameArry.length === 0){
            message.error('请选择驳回原因或填写其它原因!')
        }else if(other.length>20){
            message.error('驳回原因不能超过20个字符')
        }else{
            if(other){
                btnClassNameArry.push(other)
            }
            //console.log(btnClassNameArry);
            
            const data = {
                parent_order_id : `${this.state.fid}`,
                state : '0',
                reason : btnClassNameArry
            }
            api.axiosPost('approval_order',data).then((res)=>{
                if(res.data.code === 1){
                    message.success(res.data.msg)
                    this.setState({
                        turn: false,
                    },()=>{this.getParent()})
                    
                }else{
                    message.error(res.data.msg)
                    this.setState({
                        turn: false,
                    },()=>{this.getParent()})
                }
            })
        }
        
        
    }
    // 获取其它原因
    handleOtherOnchange = (type, val) => {
        this.setState({
            [type] : val
        })
        
        //console.log(type, val);
        
    }
    //隐藏弹出层
    isHideModal=(type,isTrue)=>{
        this.setState({
            [type]:isTrue
        })
    };
    // 获取父订单详情
    getParent = e =>{
        const data = {
            parent_order_id : this.state.fid
        }
        api.axiosPost('approvaler_get_order_info',data).then((res)=>{
            if(res.data.code === 1){
                
                this.setState({
                    invoice_info : res.data.data.order_invoice_info,
                    address_info : res.data.data.order_address_info,
                    order_list : res.data.data.sub_order_list,
                    parentDate : res.data.data.order_info,
                    time_limit : res.data.data.order_info.time_limit
                },()=>{
                    if(res.data.data.order_info.time_limit && this.state.time !== '已超时'){
                        this.countDown()
                    }
                })
                
                
            }
        })
    }
    //获取审批流详情
    orderApprovalProcess=()=>{
        const data={parent_order_id:this.state.fid,type:1};
        api.axiosPost("order_approval_process",data).then((res)=>{
            if(res.data.code == 1){
                this.setState({
                    stepData:res.data.data,
                    approvalModal:true
                });
            }else{
                message.error(res.data.msg)
            }
        })
    }; 
    // 倒计时
    countDown = () =>{
        //console.log(1111,timeResidue1);
        this.interval = setInterval(()=>{
            let {time_limit} = this.state;
            if(!time_limit){return false};
            /* let date = new Date();
            let now = date.getTime();
            let endDate = new Date(Number(timeResidue1));//设置截止时间
            let end = endDate.getTime();
            let leftTime = end - now; //时间差 */
            let leftTime = time_limit;
            let h, m, s,time;
            if(leftTime >= 0) {
                // d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
                h = Math.floor(leftTime / 1000 / 60 / 60);
                m = Math.floor(leftTime / 1000 / 60 % 60);
                s = Math.floor(leftTime / 1000 % 60);
                if(s < 10) { s = "0" + s;  }
                if(m < 10) { m = "0" + m; }
                if(h < 10) { h = "0" + h; }
                time = `${h}:${m}:${s}`
                time_limit -= 1000
            } else {
                time = "已超时"
                this.getParent()
                clearInterval(this.interval);
                this.interval = undefined
            }
            this.setState({time,time_limit});
        },1000)

    }
    componentWillUnmount=()=>{
        clearInterval(this.interval)
    };

    //查看附件
    fileLink=(item)=>{
        const data={
            file_name:item
        };
        api.axiosGet("getProductLookSign",data).then((res)=>{
            if(res.status == 200){
                window.open(res.data.url)
            }
        })
    };
}