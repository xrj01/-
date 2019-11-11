import React from "react";
import { Route, Switch ,Link} from 'react-router-dom';
import {Tabs,Button,Table,Pagination,Modal,Input,Select,DatePicker,Steps,Popover,message,Icon} from "antd";
import Turnform from './turnform'
import MyApprovalModal from './../myApprovalModal'
import MyFileModal from './../myFileModal'
import "./index.scss"
import api from "../../../component/api";
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD'; // 规定日期选择器的格式
export default class MyApp extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            
            
            current :0,
            tabskey:'', // tab切换
            auditData:[], // 审核数据
            getAppr:false, // 通过审核弹窗
            turn:false, // 驳回弹窗
            appProcess:false,
            page_number: 1,        //  当前页码
            page_size: 10,         //  每页显示数量
            total:0,
            
            parent_order_id:'',
            dateRange: [null, null],         //  时间范围
            // ------------------- 搜索关键词
            projectList:[],         //项目列表
            order_info: '',              //  下单人、订单编号
            address: '',           //  地址
            begin_time: '',        //  开始时间
            end_time: '',          //  结束时间
            project_name:undefined,       //  项目名称

            stepData:{},
            approvalModal:false,
            fileModal:false,
            fileList:[],
            is_last:'',
            other:'',
            btnClassNameArry:[],
            ReasonBtn:[]
        }
        
    

    }
   
    render(){
        const {tabskey,dateRange,dateFormat,order_info,page_number, page_size, total,is_last,auditData,projectList,stepData,approvalModal,fileModal,fileList,isSearch,other,ReasonBtn,btnClassNameArry} = this.state;
        const { TabPane } = Tabs;
        // 动态加载下拉数据
        const { Option } = Select;
        
        const children = [];
        
        for (let i = 0; i < projectList.length; i++) {
            children.push(<Option key={i} value={projectList[i].id}>{projectList[i].project_name}</Option>);
        }
        // 分页配置
        const pagination={
            total:total,
            pageSize:page_size,
            current:page_number,
            onChange:(page,size)=>{
                this.setState({page_number:page, page_size:size, spinning:true},()=>{
                    if(isSearch){
                        this.getAppList(true)
                    }else{
                        this.getAppList(false)
                    }
                })
                document.getElementById('root').scrollIntoView(true)
            }
        };
        const approvalData={
            display:approvalModal,
            stepData,
            isHideModal:this.isHideModal
        };
        const fileData={
            display:fileModal,
            fileList,
            isHideModal:this.isHideModal
        };
        //console.log(111,btnClassNameArry)
        return(
            <div>
                {/* 搜索栏 */}
                <div className='myApp-nav'>
                    <div className='myApp-nav-input'>
                        <div className='marginR'>
                            订单编号： 
                            <Input className="width-176" onChange={(e) => { this.handleInputOnchange('order_info', e.target.value) }} value={order_info} placeholder="请输入订单编号"></Input>
                        </div>
                        <div className='marginR'>
                            所属项目：
                            <Select placeholder="请选择" style={{ width: '153px'}} onChange={this.onChangeProject} value = {this.state.project_name}>
                                {children}
                            </Select>
                        </div>
                        <div className='marginR'>
                            下单时间：
                            <RangePicker
                                style={{width:212}}
                                value={dateRange}
                                format={dateFormat}
                                onChange={this.DateChange}
                            />
                        </div>
                    </div>
                    <div className='myApp-nav-btn'>
                        <Button type="primary" onClick={() => { this.searchBtn() }}>搜索</Button>
                        <Button type="primary" onClick={() => { this.resetBtn() }}>重置</Button>
                    </div>
                </div>
                {/* 内容 */}
                {
                    auditData && auditData.map((item,index)=>(
                        <div className='myApp-content'>
                            <div className='myApp-content-top'>
                                <div className='ft14 width300'>
                                    <div>下单时间：{item.create_time}</div>
                                    <div className='mt30'>项目信息：{item.project}</div>
                                </div>
                                <div className='ft14 width440'>
                                    <div>订单编号：{item.id}</div>
                                </div>
                                {
                                    tabskey == '0'?
                                    <div className='margin33'>
                                        <div><Button onClick={()=>{this.showOpenModal(item.id,item.is_last)}}>通过</Button></div>
                                        <div><Button onClick={()=>{this.showTurnModal(item.id)}} className='mt10'>驳回</Button></div>
                                    </div>
                                    :<div className='margin33'></div>
                                }
                                <div className='myApp-content-top-link'>
                                    <div>
                                        <Link target="_blank" to={`/ApproverAccount/ParentOrder?${item.id}`}>订单详情</Link>
                                    </div>
                                    <div onClick={()=>{this.orderApprovalProcess(item.id)}}>审批流程</div>
                                    <div onClick={()=>{this.getOrderFile(item.id)}}>查看附件</div>
                                </div>
                            </div>

                            <div className='myApp-content-footer'>
                                <div>{item.product_count}种商品，共计{item.sum_count}件</div>
                                <div>
                                    {
                                        item.state
                                    }
                                </div>
                                <div>账期支付</div>
                                <div>¥{item.order_price}（含运费：¥{item.freight}元）</div>
                            </div>
                        </div>
                    ))
                }
                {
                    auditData.length == 0 ?
                    // <div className='myApp-nodata'>
                        
                    // </div>
                    <div className='admin-myApp-nodata'>
                        <img src={require('./../../../image/img_kzt.png')} alt=''/><span>暂无数据</span>
                    </div>
                    :''
                }
                <div className="class-pagination-box">
                    <Pagination 
                        defaultCurrent={1} 
                        total={total}  
                        {...pagination} 
                        hideOnSinglePage={true} 
                        showSizeChanger 
                        showQuickJumper={{goButton: <Button className='pagination-btn'>确定</Button>}} 
                        onShowSizeChange={this.onShowSizeChange}
                    />
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
                            is_last == 1 ? <div>通过审核后，将立即支付订单，是否继续？</div> :  <div>通过审核后，将提交订单给下一个审核人，是否继续？</div>
                        
                        }
                        </div>
                        /* is_last == 1 ? <div>通过审核后，将立即支付订单，是否继续？</div> :  <div>通过审核后，将提交订单给下一个审核人，是否继续？</div> */

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
                {/* 审批流程 弹窗 */}
                <MyApprovalModal {...approvalData} ref={ref=>{this.myApprovalModal = ref}}/>
                <MyFileModal {...fileData}/>
            </div>
        )
    }
    componentDidMount(){
        this.getProductList()
        this.setState({
            tabskey : this.props.tabskey
        },()=>{this.getAppList(false)})
    }
    // 通过审核 弹窗
    showOpenModal = (parent_order_id,is_last) => {
        this.setState({
            getAppr: true,
            parent_order_id,
            is_last
        });
    };
    handleCancel = (e) =>{
        this.setState({
            getAppr: false,
            turn: false,
            appProcess: false,
            btnClassNameArry :  []
        })
    }
    handleOk = (e) =>{
        const data = {
            parent_order_id : `${this.state.parent_order_id}`,
            state : '1',
            reason : []
        }
        api.axiosPost('approval_order',data).then((res)=>{
            if(res.data.code === 1){
                message.success(res.data.msg)
                this.setState({
                    getAppr: false,
                },()=>{this.getAppList()})
                
            }else{
                message.error(res.data.msg)
                this.setState({
                    getAppr: false,
                },()=>{this.getAppList()})
            }
        })
        
    }

    // 驳回 弹窗
    showTurnModal = (parent_order_id) =>{
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
                    parent_order_id
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
        // console.log(btnClassNameArry);
        
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
                parent_order_id : `${this.state.parent_order_id}`,
                state : '0',
                reason : btnClassNameArry
            }
            api.axiosPost('approval_order',data).then((res)=>{
                if(res.data.code === 1){
                    message.success(res.data.msg)
                    this.setState({
                        turn: false,
                    },()=>{this.getAppList()})
                    
                }else{
                    message.error(res.data.msg)
                    this.setState({
                        turn: false,
                    },()=>{this.getAppList()})
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
   //获取审批流详情
   orderApprovalProcess=(id)=>{
       
        const data={parent_order_id:`${id}`,type:1};
        api.axiosPost("order_approval_process",data).then((res)=>{
            if(res.data.code == 1){
                this.setState({
                    stepData:res.data.data,
                    approvalModal:true
                },()=>{
                    this.myApprovalModal.getTabledata(res.data.data)
                });
            }else{
                message.error(res.data.msg)
            }
        })
    };  
    //获取订单附件
    getOrderFile=(id)=>{
        const data={parent_order_id : `${id}`};
        api.axiosPost("get_order_file",data).then((res)=>{

            if(res.data.code == 1){
                const fileList = res.data.data;
                this.setState({
                    fileList,
                    fileModal:true
                })
            }else{
                message.error(res.data.msg)
            }
        })
    }; 
    //审批员获取项目数据
    getProductList = e =>{
        const data = {
            type : this.props.tabskey
        }
        api.axiosPost('get_product_list_to_dicts',data).then((res)=>{
            if(res.data.code ===1){
                this.setState({
                    projectList:res.data.data
                })
            }
        })
    }
    
    // 审批人员获取订单列表
    getAppList = (overall) =>{
        const {page_number,page_size,tabskey,begin_time,end_time,project_name,order_info} = this.state
        const data ={
            page_number : page_number,
            page_size : page_size,
            project_id : overall && project_name ? project_name : 0,
            parent_order_id : overall && order_info ? order_info:'0' ,
            begin_time : overall && begin_time ? begin_time :'',
            end_time : overall && end_time ? end_time :'',
            approval_state : tabskey
        }
        api.axiosPost('approval_order_list',data).then((res)=>{
            if(res.data.code ===1){

                this.setState({
                    auditData : res.data.data.list,
                    total : res.data.data.total_row
                })
            }
        })
    }
    // 获取项目名称 下拉框
    onChangeProject = (value) =>{
        //console.log(`selected ${value}`);
        this.setState({project_name : value})
    }
    // 获取下单人、订单编号信息
    handleInputOnchange = (type, val) => {

        this.setState({
            [type]: val
        })
        
    }
    // 日期
    DateChange = (dates, dateStrings) => {
        this.setState({
            begin_time: dateStrings[0],
            end_time: dateStrings[1],
            dateRange: dates
        })
    }
    // 搜索按钮
    searchBtn = () => {
        const {project_name,end_time,begin_time,order_info} = this.state
        if(!project_name && end_time==='' && begin_time==='' && order_info===''){
            message.error('未设置搜索条件')
        }
        this.setState({
            page_number:1,
            page_size:10,
            isSearch: true ,
        },()=>{this.getAppList(true)})
        
    }
    // 重置按钮
    resetBtn = () =>{
        this.setState({
            page_number:1,
            page_size:10,
            isSearch : false,
            order_info : '',
            begin_time : '',
            end_time : '',
            dateRange : [null,null],
            project_name : undefined,
        },()=>{this.getAppList()})
        
    }
    // 分页数量切换
    onShowSizeChange = (number,size) =>{
        this.setState({
            page_number:number,
            page_size:size
        },()=>{this.getAppList()})
    }
    // 订单审批
    orderApproval = () =>{
       
    }
}