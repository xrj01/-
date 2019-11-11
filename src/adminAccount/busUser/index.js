

import React from "react";
import { Input, Button, DatePicker,Pagination, Select , Icon, Table, Divider, Cascader, message, Empty, Modal ,Tree} from "antd";
import moment from 'moment';
import { Link } from "react-router-dom";
import Adminform from './adminform';
import Approveform from './approveform'
import Buyform from './buyform'
//import AddEditModal from './addeditModal';
import { createHashHistory } from 'history';
import api from './../../component/api';
import WinButton from "../../components/winButton/index"
import './index.scss';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD'; // 规定日期选择器的格式
const history = createHashHistory();
const { confirm } = Modal;

const { TreeNode } = Tree;
class busUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // 列表表头信息
            columns: [
                /* {
                    title: '序号',
                    dataIndex: 'index',
                    align: 'center'
                }, */
                {
                    title: '手机号码',
                    dataIndex: 'phone',
                    align: 'center'
                },
                {
                    title: '真实姓名',
                    dataIndex: 'real_name',
                    align: 'center'
                },
                {
                    title: '角色类型',
                    dataIndex: 'type',
                    align: 'center'
                },
                {
                    title: '独享额度(元)',
                    dataIndex: 'sub_credit',
                    align: 'center',
                    render:(text)=>{
                        return(
                            <div>
                                {text ? text :'-'}
                            </div>
                        )
                    }
                },
                {
                    title: '创建时间',
                    dataIndex: 'create_time',
                    width: '103px',
                    align: 'center'
                },
                {
                    title: '账户状态',
                    dataIndex: 'state',
                    align: 'center'
                },
                {
                    title: '操作',
                    dataIndex: 'operation',
                    align: 'center',
                    render: (text, record) => {
                        return (
                            <div>
                                <div className='table-btn'>
                                    <span onClick={()=>{this.showModal(record,true,'add')}}>查看</span> 
                                    
                                    <span onClick={()=>{this.showEditModal(record,false,'edit')}}>编辑</span>
                                    {
                                        record.state === '关闭' ? <span onClick={()=>{this.showOpenModal(record)}}>开启</span>
                                        :<span onClick={()=>{this.showOpenModal(record)}}>关闭</span>
                                    }
                                    <span onClick={()=>{this.resetPwd(record)}}>重置密码</span>
                                </div>
                            </div>
                        )
                    }
                }
            ],
            
            // 弹窗
            visible: false,
            editadmin: false,
            open: false,
            createUser : false,
            // 新建账户按钮状态
            administrator : false,
            buyer : false, 
            partapproval : false,
            // 新建账户管理员弹窗
            createAdmin : false,
            // 表格数据
            tableData: [],
            record:'',//当前行数据
            tableLoading: false,  //  表格是否在加载中
            editRecord : '', //编辑行数据
            lookRecord : '', //查看行数据
            buyer_id:'',// 编辑行ID
            department:'', // 所属部门回填
            page_number: 1,        //  当前页码
            page_size: 10,         //  每页显示数量
            total:0,
            
            select : undefined,
            dateRange: [null, null],         //  时间范围
            //isSearch: 0,           //  当前是 全局展示 还是 搜索展示
            cascaderValue: [],     //  级联的值
            // ------------------- 搜索关键词
            name: '',              //  公司名称/账户/名称
            address: '',           //  地址
            start_time: '',        //  开始时间
            end_time: '',          //  结束时间

            rightTree:[],
            treeData : [], //穿梭框数据
            selectTreeId:[],
            class_ids:[],
            selectCheckedLevel3:[]
        }
        // 子组件实例的方法
        this.child = ''
    }
    render() {
        const { page_number, page_size, total, dateRange, name, areaOptions, cascaderValue ,editRecord ,lookRecord,isSearch} = this.state;
        // 分页配置
        const pagination={
            total:total,
            pageSize:page_size,
            current:page_number,
            onChange:(page,size)=>{
                this.setState({page_number:page,page_size:size,spinning:true},()=>{
                    if(isSearch){
                        this.getUserList(true)
                    }else{
                        this.getUserList(false)
                    }
                    
                })
                document.getElementById('root').scrollIntoView(true)
            }
        };
        // 新建账户和编辑账户弹框所需props
        /* const addClassDate = {
            display: this.state.visible,
            hideModal: this.isShowModal,
            isAddNew: this.state.isAddNew,
            isSearch: this.state.isSearch,
            refresh: this.getUserAccount
        }; */
        const { Option } = Select;
        const fieldNames = { label: 'name', value: 'id', children: 'children' };
        // 无数据的文案
        const empty = (
            <Empty
                description={
                    <span className='block'>
                        <span className='block'>服务器请求超时...</span>
                        <span className='block'>请按&nbsp;<i className="blue" style={{ fontWeight: 'bold', fontSize: '18px' }}>F5</i>&nbsp;手动刷新</span>
                    </span>
                }
                image='https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original' />
        )
        const {columns,tableData,administrator,partapproval,record,department,buyer,rightTree,treeData,selectLevel3} = this.state
        return (
            <div className="busUser-box">
                <div className='busUser-container'>
                    <div className='title'>
                        <span>账户列表</span>
                    </div>
                    <div className='busUser-nav'>
                        <div className='busUser-nav-input'>
                            <div className='marginR'>
                                账户信息：   
                                <Input className="width-176" onChange={(e) => { this.handleInputOnchange('name', e.target.value) }} value={name} placeholder="账户名称/真实姓名"></Input>
                            </div>
                            <div className='marginR'>
                                角色类型：
                                <Select
                                    showSearch
                                    style={{ width: 86 }}
                                    placeholder="请选择"
                                    optionFilterProp="children"
                                    onChange={this.SelectonChange}
                                    value = {this.state.select}
                                    //defaultValue={this.state.admin}
                                >
                                    {/* <Option value='1'>管理员</Option> */}
                                    <Option value="3">审批员</Option>
                                    <Option value="2">采购员</Option>
                                </Select>
                            </div>
                            <div className='marginR'>
                                创建时间：
                                <RangePicker
                                    style={{width:230}}
                                    value={dateRange}
                                    format={dateFormat}
                                    onChange={this.DateChange}
                                />
                            </div>
                        </div>
                        <div className='busUser-nav-btn'>
                            <Button type="primary" onClick={() => { this.searchBtn() }}>搜索</Button>
                            <Button type="primary" onClick={() => { this.resetBtn() }}>重置</Button>
                        </div>
                    </div>
                    <div className='table-title'>
                        <div className='table-title-font'>
                            <i className='iconfont iconyonghu'></i>
                            <div className='mt10'>账户总数：{total}</div>
                        </div>
                        <div className="addNew">
                            <Button className='btn-style' onClick={() => { this.showCreateModal() }} style={{width:'100px'}}>新增账户</Button>
                        </div>
                    </div>
                    {/* 表格 */}
                    <div className="table-box busDepartment-table-padding">
                        <Table 
                            columns={columns} 
                            dataSource={tableData} 
                            bordered
                            pagination = {false}
                            hideDefaultSelections={true}
                            loading={this.state.tableLoading}
                        />
                    </div>
                    {
                        tableData.length === 0 ?'':
                        <div className="class-pagination-box">
                            {/* <Pagination defaultCurrent={1} {...pagination} showQuickJumper/> */}
                            <Pagination defaultCurrent={1} total={total}  {...pagination} hideOnSinglePage={true} showSizeChanger showQuickJumper={{goButton: <Button className='pagination-btn'>确定</Button>}} onShowSizeChange={this.onShowSizeChange}/>
                        </div>
                    }
                </div>
                {/* 查看弹窗 */}
                <Modal
                    className='busUser-check-model'
                    destroyOnClose //清空弹窗
                    width='560px'
                    centered = {true}
                    maskClosable = {false}
                    title={lookRecord.type === 1?"管理员账户详情":lookRecord.type === 2?"采购帐户详情":lookRecord.type === 3 ?"审批帐户详情" :''}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    footer={null}
                >
                    <div>账户名称：<span>{lookRecord.user_name}</span></div>
                    <div>真实姓名：<span>{lookRecord.real_name}</span></div>
                    {
                        lookRecord.type === 3 || lookRecord.type === 2?
                        <div>所属部门：<span>{department}</span></div> :''
                    }
                    {
                        lookRecord.type === 2 ?
                        <div>授信额度：<span>{lookRecord.sub_credit}元</span></div> :''

                    }
                    <div>手机号码：<span>{lookRecord.phone}</span></div>
                    {
                        lookRecord.email ?
                        <div>邮箱账户：<span>{lookRecord.email}</span></div> : ''
                    }
                    {
                        lookRecord.type === 2 ?
                        <div>
                            <div className='busUser-user-info'>采购分类信息</div>
                            <div className='procurement-content' style={{display:'none'}}>
                                <div>选择分类信息</div>
                                <Tree
                                    checkable
                                    checkedKeys={selectLevel3}
                                    // defaultCheckedKeys={["11"]}
                                    onCheck={this.onCheck}
                                >
                                    {
                                        treeData && treeData.map((level1)=>{
                                            return(
                                                <TreeNode title={level1.title} key={level1.key}>
                                                    {
                                                        level1.children && level1.children.map((level2)=>{
                                                            return(
                                                                <TreeNode title={level2.title} key={level2.key}>
                                                                    {
                                                                        level2.children && level2.children.map((level3)=>{
                                                                            return(
                                                                                <TreeNode title={level3.title} key={level3.key} />
                                                                            )
                                                                        })
                                                                    }
                                                                </TreeNode>
                                                            )
                                                        })
                                                    }
                                                </TreeNode>
                                            )
                                        })
                                    }
                                </Tree>
                            </div>
                            <div className='busUser-check-content'>
                                <Tree
                                    showLine
                                    defaultExpandAll={false}
                                    onCheck={this.onCheck}
                                >
                                    {
                                        rightTree && rightTree.map((level1)=>{
                                            return(
                                                <TreeNode title={level1.title} key={level1.key}>
                                                    {
                                                        level1.children1 && level1.children1.map((level2)=>{
                                                            return(
                                                                <TreeNode title={level2.title} key={level2.key}>
                                                                    {
                                                                        level2.children1 && level2.children1.map((level3)=>{
                                                                            return(
                                                                                <TreeNode title={level3.title} key={level3.key} />
                                                                            )
                                                                        })
                                                                    }
                                                                </TreeNode>
                                                            )
                                                        })
                                                    }
                                                </TreeNode>
                                            )
                                        })
                                    }
                                </Tree>
                            </div>
                        </div> : ''
                        
                        
                    }
                    
                </Modal>
                {/* 新建 、编辑管理员账户弹窗 */}
                <Modal
                    className='busUser-edit-model'
                    destroyOnClose //清空弹窗
                    title = {   
                                administrator?"新增管理员账户"
                                :record.type === '管理员'?'编辑管理员账户'
                                :partapproval?'新增审批员帐户'
                                :record.type === '审批员'?'编辑审批员账户'
                                :buyer?'新增采购员账户'
                                :record.type === '采购员'?'编辑采购员账户':''
                            }
                    width= {
                                 buyer?'630px'
                                :record.type === '采购员'?'630px':'560px'
                    }
                    centered = {true}
                    maskClosable = {false}
                    visible={this.state.editadmin}
                    onOk={this.adduserOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <div className={buyer || record.type === '采购员'?'busUser-edit-btn':''}>
                            <Button key="back" onClick={this.handleCancel} style={{width:'80px',height:'40px'}}>
                                取消
                            </Button>
                            <Button key="submit" type="primary" onClick={this.adduserOk} style={{width:'80px',height:'40px'}}>
                                保存
                            </Button>
                        </div>
                    ]}
                    >
                    {
                        record.type === '管理员' || administrator?
                        <Adminform wrappedComponentRef={(e)=>{this.addform = e}} administrator={administrator} editRecord={editRecord}/> :
                        record.type === '审批员' || partapproval?
                        <Approveform wrappedComponentRef={(e)=>{this.approveform = e}} partapproval={partapproval} editRecord={editRecord}/> :
                        record.type === '采购员' || buyer?
                        <Buyform wrappedComponentRef={(e)=>{this.buyform = e}}
                                 buyer={buyer}
                                 editRecord={editRecord}/> : ''
                    }
                    
                </Modal>
                {/* 开启、关闭弹窗 */}
                <Modal
                    className='busUser-open-model'
                    destroyOnClose //清空弹窗
                    width='440px'
                    centered = {true}
                    closable = {false}
                    maskClosable = {false}
                    //title={record.state === '关闭' ?"开启账户":'关闭账户'}
                    visible={this.state.open}
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
                                record.state === '关闭' ?<div>确认开启账户？</div>
                                :<div>确认关闭账户？</div>
                            
                            }
                        </div>
                        //record.state === '关闭' ?
                        //<div>确认开启账户？</div> : <div>关闭成功，账户将无法正常使用，继续关闭吗？</div>
                    }
                    
                </Modal>
                {/* 新建账户弹窗 */}
                <Modal
                    className='busUser-create-model'
                    destroyOnClose //清空弹窗
                    width='560px'
                    centered = {true}
                    maskClosable = {false}
                    title="选择角色"
                    visible={this.state.createUser}
                    onOk={this.createOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <div className='busUser-create-btn'>
                            <Button key="back" onClick={this.handleCancel} style={{width:'80px',height:'40px'}}>
                                取消
                            </Button>
                            <Button key="submit" type="primary" onClick={this.createOk} style={{width:'80px',height:'40px'}}>
                                确定
                            </Button>
                        </div>
                    ]}
                >
                    <div className='admin-create-content-btn'>
                        {/* <Button onClick={this.administrator}>管理员</Button> */}
                        <Button onClick={this.buyer}>采购员</Button>
                        <Button onClick={this.partapproval}>审批员</Button>
                    </div>
                </Modal>
                {/* 新建管理员账户弹窗 */}
                {/* <Modal
                    className='busUser-edit-model'
                    destroyOnClose //清空弹窗
                    title="编辑管理员账户"
                    width='610px'
                    visible={this.state.createAdmin}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <div className='busUser-edit-btn'>
                            <Button key="back" onClick={this.handleCancel} style={{width:'130px',height:'42px'}}>
                                取消
                            </Button>,
                            <Button key="submit" type="primary" onClick={this.handleOk} style={{width:'130px',height:'42px'}}>
                                保存
                            </Button>
                        </div>
                    ]}
                    >
                    <Adminform wrappedComponentRef={(e)=>{this.addform = e}}/>
                </Modal> */}
               <WinButton/>
            </div>
            )
                

                
                
             

        
    }
    componentDidMount(){
        this.getUserList(false)
    }
    // 查看弹窗
    showModal = (record) => {
        const data = {
            buyer_id : record.id
        }
        api.axiosPost('get_buyer',data).then((res)=>{

            if(res.data.code ===1){
                if(res.data.data.department){
                    //处理所属部门数据
                    var department =[]
                    
                    for(var i=0;i<res.data.data.department.count;i++){
                        department.push(res.data.data.department['department_'+(i+1)]['department'])

                    }
                    department = department.join('/') 

                    this.setState({department})
                }

                this.setState({
                    lookRecord : res.data.data, //查看行数据
                    class_ids : res.data.data.class_ids,
                    selectTreeId : res.data.data.class_ids,
                    visible: true,
                    record
                },this.getProduct());
                
                
            }
        })
        
    };
    handleCancel = e => {
        //console.log(e);
        this.setState({
            visible : false,
            editadmin : false,
            open : false,
            createUser : false,
            createAdmin : false,

            buyer : false,
            administrator : false,
            partapproval : false
        });
    };
    // 编辑弹窗
    showEditModal = (record) => {
        this.setState({record})
        if(record.type === '管理员' || record.type === '审批员' || record.type === '采购员'){
            this.getEditInfo(record)
        }
        
        
        
        /* this.setState({
            editadmin: true,
            administrator : false,
        }); */
        
        
    };
    // 编辑时获取管理员账户信息
    getEditInfo = (record) =>{
        //console.log(1111,this.addform);
        const data = {
            buyer_id : record.id
        }
        this.setState({buyer_id :record.id})
        api.axiosPost('get_buyer',data).then((res)=>{

            if(res.data.code ===1){
                //console.log(222,res.data.data);
                
                this.setState({
                    editRecord : res.data.data, //编辑行数据
                    editadmin: true,
                    administrator : false,
                    buyer : false,
                    partapproval : false
                });
                if(res.data.data.type === 2){
                    this.buyform.treeShowCheck(res.data.data.class_ids)
                }
                
            }
        })
        
    }
    
    // 开启、关闭弹窗
    showOpenModal = (record) => {
       
        this.setState({
            open: true,
            record
        });
    };
    // 开启、关闭弹窗 ---保存按钮
    handleOk = () =>{

        const {record} = this.state
        const data = {
            buyer_id : record.id,
            //state : record.state === '关闭'? 1 : 0
        }
        api.axiosPost('buyer_switch',data).then((res)=>{
            if(res.data.code ===1){
                message.success(res.data.msg)
                this.getUserList()
                this.setState({
                    open: false,
                });
            }
        })
    }
    // 新建账户弹窗
    showCreateModal = () => {
        this.setState({
            createUser: true,
            record:'', //清空当前行数据
        });
    };
    createOk = () =>{
        const {administrator,buyer,partapproval} = this.state
        if(administrator || partapproval || buyer){
            this.setState({
                editadmin : true,
                createUser : false
            })
        }else{
            message.error('请选择角色')
        }
        
    }

    // 新建账户管理员按钮
    administrator = () => {
        this.setState({
            administrator : true,
            buyer : false,
            partapproval : false
        })
    }
    // 新建账户采购员按钮
    buyer = () => {
        this.setState({
            buyer : true,
            administrator : false,
            partapproval : false
        })
    }
    // 新建账户审批员按钮
    partapproval = () => {
        this.setState({
            partapproval : true,
            administrator : false,
            buyer : false
        })
    }

    // 新建、编辑管理员 ---保存按钮
    adduserOk = (e) =>{
        // console.log();
         
        const {administrator,partapproval,buyer,record} = this.state
        
        if(administrator){
            // 新建管理员
            let addform = this.addform
            // 表单验证
            addform.props.form.validateFields((err, values) => {
                e.preventDefault();
                if (!err) {
                    
                    const addDate = {
                        user_name : values.username,
                        real_name : values.name,
                        department_id : 0,
                        phone : values.tel,
                        email : values.mailbox ? values.mailbox : '',
                        type : 1
                    }
                    api.axiosPost('add_buyer',addDate).then((res)=>{
                        if(res.data.code ===1){
                            message.success(res.data.msg)
                            this.setState({
                                editadmin : false
                            })
                            this.getUserList()
                        }else{
                            message.error(res.data.msg)
                        }
                        
                    })
                }   
            })
        }else if(record.type === '管理员'){
            //编辑管理员
            let addform = this.addform
            // 表单验证
            addform.props.form.validateFields((err, values) => {
                e.preventDefault();
                if (!err) {
                    
                    const editDate = {
                        user_name : addform.props.editRecord.user_name,
                        real_name : values.name,
                        department_id : 0,
                        phone : `${values.tel}`,
                        email : values.mailbox ? values.mailbox : '',
                        buyer_id : this.state.buyer_id,
                        type : this.state.editRecord.type
                    }
                    //console.log(editDate);
                    api.axiosPost('update_buyer',editDate).then((res)=>{
                        if(res.data.code ===1){
                            message.success(res.data.msg)
                            this.setState({
                                editadmin : false
                            })
                            this.getUserList()
                        }else{
                            message.error(res.data.msg)
                        }
                        
                    })
                    
                }
            })
        }else if(partapproval){
            //新建审批员
            let approveform = this.approveform
            //表单验证
            approveform.props.form.validateFields((err, values) => {
                e.preventDefault();
                if (!err) {
                    // console.log(values);
                    let id = []
                    values.superiorDepartment.map((item)=>{
                        id.push(item)
                    })

                    const addApprove = {
                        user_name : values.username,
                        real_name : values.name,
                        department_id : id.pop(),
                        phone : values.tel,
                        email : values.mailbox ? values.mailbox : '',
                        type : 3,
                        sub_credit : 0
                    }
                    //console.log(addApprove);
                    api.axiosPost('add_buyer',addApprove).then((res)=>{
                        if(res.data.code ===1){
                            message.success(res.data.msg)
                            this.setState({
                                editadmin : false
                            })
                            this.getUserList()
                        }else{
                            message.error(res.data.msg)
                        }
                        
                    })
                    
                }
            })
        }else if(record.type === '审批员'){
            //编辑审批员
            let approveform = this.approveform
            // 表单验证
            approveform.props.form.validateFields((err, values) => {
                e.preventDefault();
                if (!err) {
                    //console.log(111,values);
                    var emptyID = []
                    values.superiorDepartment && values.superiorDepartment.map((item)=>{
                        emptyID.push(item)
                    })
                    var emptysID = emptyID.pop()

                    const editDate = {
                        user_name : values.username,
                        real_name : values.name,
                        department_id : emptysID,
                        phone : `${approveform.props.editRecord.phone}`,
                        email : values.mailbox ? values.mailbox : '',
                        buyer_id : this.state.buyer_id,
                        type : this.state.editRecord.type
                    }
                    //console.log(222,editDate);
                   api.axiosPost('update_buyer',editDate).then((res)=>{
                        if(res.data.code ===1){
                            message.success(res.data.msg)
                            this.setState({
                                editadmin : false
                            })
                            this.getUserList()
                        }else{
                            message.error(res.data.msg)
                        }
                        
                    })
                    
                }
            })
        }else if(buyer){
            //新建采购员
            let buyform = this.buyform
            //表单验证
            buyform.props.form.validateFields((err, values) => {
                e.preventDefault();
                if (!err) {
                    //console.log(111,values);
                    //console.log(333,this.buyform);
                    if(buyform.state.rightTree.length === 0){
                        message.error('请选择采购分类信息')
                    }else{
                        let id = []
                        values.superiorDepartment.map((item)=>{
                            id.push(item)
                        })

                        const addApprove = {
                            user_name : values.username,
                            real_name : values.name,
                            department_id : id.pop(),
                            phone : values.tel,
                            email : values.mailbox ? values.mailbox : '',
                            type : 2,
                            sub_credit : values.credit,
                            class_ids : this.buyform.state.selectTreeId
                        }
                        api.axiosPost('add_buyer',addApprove).then((res)=>{
                            if(res.data.code ===1){
                                message.success(res.data.msg)
                                this.setState({
                                    editadmin : false
                                })
                                this.getUserList()
                            }else{
                                message.error(res.data.msg)
                            }
                            
                        })
                    }
                    
                    
                }
            })
        }else if(record.type === '采购员'){
            //编辑采购员
            let buyform = this.buyform
            // 表单验证
            buyform.props.form.validateFields((err, values) => {
                e.preventDefault();
                if (!err) {
                    //console.log(111,values);
                    if(buyform.state.rightTree.length === 0){
                        message.error('请选择采购分类信息')
                    }else{
                        var emptyID = []
                        values.superiorDepartment && values.superiorDepartment.map((item)=>{
                            emptyID.push(item)
                        })
                        var emptysID = emptyID.pop()

                        const editDate = {
                            user_name : values.username,
                            real_name : values.name,
                            department_id : emptysID,
                            phone : `${buyform.props.editRecord.phone}`,
                            email : values.mailbox ? values.mailbox : '',
                            buyer_id : this.state.buyer_id,
                            type : this.state.editRecord.type,
                            sub_credit : values.credit,
                            class_ids : this.buyform.state.selectTreeId
                        };
                        api.axiosPost('update_buyer',editDate).then((res)=>{
                            if(res.data.code ===1){
                                message.success(res.data.msg)
                                this.setState({
                                    editadmin : false
                                });
                                this.getUserList()

                            }else{
                                message.error(res.data.msg)
                            }
                                
                        })
                    }
                    
                    
                }
            })
        }
    };
            
            
        
            
    // 获取账户信息
    handleInputOnchange = (type, val) => {
        this.setState({
            [type]: val
        })
    }
    // 获取角色类型
    SelectonChange =(value) => {
        
        // console.log(`selected ${value}`);
        
            this.setState({
                select : value
            })
      }
    // 日期
    DateChange = (dates, dateStrings) => {
        this.setState({
            start_time: dateStrings[0],
            end_time: dateStrings[1],
            dateRange: dates
        })
    }
    
    // 搜索按钮
    searchBtn = () => {
        const {name,select,start_time,end_time} = this.state
        if(name === '' && select === undefined && start_time === '' && end_time === ''){
            message.error('您尚未设置筛选条件')
        }else{
            this.setState({
                page_number: 1,
                page_size: 10,
                isSearch: true ,
            },()=>{this.getUserList(true)})
            
        }
        
    }
    // 重置按钮
    resetBtn = () =>{
        this.setState({
            page_number: 1,
            page_size: 10,
            isSearch : false,
            name : '',
            start_time : '',
            end_time : '',
            dateRange : [null,null],
            select : undefined
        },()=>{this.getUserList()})
        
    }
    // 重置密码
    resetPwd = (record) =>{
       
        confirm({
            className:'resetPwd-modal',
            //title: '重置密码',
            content: '重置之后的密码为123456。',
            okText: '确认',
            okType: 'primary',
            cancelText: '取消',
            width:'440px',
            centered:true,
            icon:<Icon type="exclamation-circle" className='delet-icon'></Icon>,
            onOk() {
                return new Promise((resolve, reject) => {
                    api.axiosPost('reset_password', { buyer_id: record.id }).then(res => {
                        // console.log(res)
                        if (res.data.code === 1) {
                            message.success(res.data.msg);
                            resolve(true);
                        } else {
                            message.error(res.data.msg);
                            reject(false);
                        }
                    })
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel() {
                // console.log('Cancel');
            },
        });

    }
    // 获取树状数据
    getProduct = () =>{
        const data = {}
        api.axiosPost('product_class',data).then((res)=>{
            if(res.data.code === 1){
                this.setState({
                    treeData : res.data.data
                },()=>{
                    const {class_ids} = this.state;
                    const selectCheckedLevel3 = [];
                    class_ids && class_ids.length>0 && class_ids.map((ids)=>{
                        if(ids > 99999){
                            selectCheckedLevel3.push(ids)
                        }
                    });
                    this.setState({
                        selectCheckedLevel3
                    },()=>{
                        this.onCheck(class_ids)
                    });

                })
            }
        })
    };
    
    //树形数据回显
    
     onCheck = (checkedKeys,info) => {
         const {selectCheckedLevel3} = this.state;
         const selectLevel1 = [];
         const selectLevel2 = [];
         const selectLevel3 = [];
         const selectTreeId = info ? checkedKeys.concat(info.halfCheckedKeys) : checkedKeys;
 
         selectTreeId && selectTreeId.map((item,index)=>{
             if(item > 99999){
                 selectLevel3.push(item)
             }else if(item > 99 && item < 99999){
                 selectLevel2.push(item)
             }else{
                 selectLevel1.push(item)
             }
         });
         const newLvel1 = this.treeArrData1(selectLevel1);  //获取一级数据
         const newLvel2 = this.treeArrData2(newLvel1,selectLevel2);  //获取二级数据
         const newLvel3 = this.treeArrData3(newLvel2,selectLevel3);  //获取三级数据
 
         this.setState({
             selectTreeId:selectTreeId,
             rightTree:newLvel3,
             selectLevel3:info ? checkedKeys : selectCheckedLevel3
         })
     };
    //判断层级关系
    treeArrData1=(arr1=[])=>{
        const {treeData} = this.state;
        // console.log(treeData)
        const newLvel1 = [];
        treeData.map((item)=>{
            arr1.map((ids)=>{
                if(ids == item.key){
                    const strItem = JSON.stringify(item);
                    newLvel1.push(JSON.parse(strItem))
                }
            })
        });
        return newLvel1
    };
    treeArrData2=(arr1=[],arr2=[])=>{
        arr1 && arr1.map((item)=>{
            const childs = [];
            item.children && item.children.map((child)=>{
                arr2 && arr2.map((ids)=>{
                    if(ids == child.key){
                        childs.push(child)
                    }
                });
            });
            item.children1 = childs;
        });
        return arr1
    };
    treeArrData3=(arr1=[],arr2=[])=>{
        arr1 && arr1.map((item)=>{
            item.children1 && item.children1.map((child)=>{
                const childs = [];
                child.children && child.children.map((child3)=>{
                    arr2 && arr2.map((ids)=>{
                        if(ids == child3.key){
                            childs.push(child3)
                        }
                    });
                });
                child.children1 = childs;
            });
        });
        return arr1
    };
    // 获取账户列表
    getUserList(overall){
        const data = {
            page_number : this.state.page_number,
            page_size : this.state.page_size,
            info : overall && this.state.name ? this.state.name :'',
            type : overall && this.state.select ? this.state.select : -1,
            begin_time : overall && this.state.start_time ? this.state.start_time :'',
            end_time : overall && this.state.end_time ? this.state.end_time :''

        }
        api.axiosPost('buyer_list',data).then((res)=>{
            if(res.data.code === 1){
                res.data.data.list.map((item,index)=>{
                    item.index = index+1
                    item.key = item.id
                })
                this.setState({
                    tableData : res.data.data.list,
                    total: res.data.data.total_row,
                })
            }
            
        })
    }
    // 分页数量切换
    onShowSizeChange = (number,size) =>{
        this.setState({
            page_number:number,
            page_size:size
        },()=>{this.getUserList()})
    }
    
}

export default busUser;