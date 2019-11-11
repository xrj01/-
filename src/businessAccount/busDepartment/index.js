import React from "react";
import {Table,Input,Select,Button,message,Switch,Modal,Pagination,Icon} from "antd"
import Addform from './addform'
import AddSub from './addSub'
import "./index.scss";
import WinButton from "../../components/winButton/index"
import api from "../../component/api";

export default class busDepartment extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            columns:[
                /* {
                    title: '',
                    dataIndex: '',
                    align: 'center'
                }, */
                {
                    title: '部门名称',
                    dataIndex: 'department',
                    //align: 'center'
                },
                {
                    title: '部门成员',
                    dataIndex: 'member_count',
                    align: 'center'
                },
                {
                    title: '创建时间',
                    dataIndex: 'create_time',
                    align: 'center'
                },
                {
                    title: '操作',
                    dataIndex: 'operation',
                    align: 'center',
                    render:(text,record)=>{
                        return(
                            <div className='table-btn'>
                                {
                                    record.level === 10 ? '' : <span onClick={()=>{this.showModal1(record,true,'add')}}>新增下级</span> 
                                }
                                <span onClick={()=>{this.showModal1(record,false,'edit')}}>编辑</span>
                                <span onClick={()=>{this.deleteModal(record)}}>删除</span>
                            </div>
                        )
                    }
                }
            ],
            data:[],
            id:'',//当前行id
            fid:0, //上级部门id，没得传 0
            countNum:0, //部门数量
            department : '',//当前行部门名字
            addClassModal:false,
            delete: false,
            record: [], //删除当前行数据
            getId:[],//编辑时得到的id数组
            department1:[],
            addSub:'',
            editsub:"",
            singlrRowData: [],//当前行数据
            page_number: 1,        //  当前页码
            page_size: 10,         //  每页显示数量
            total:0,

        }
    }

    render(){
        const {columns,data,addSub,editsub,countNum,department,singlrRowData,getId,page_number,page_size,total,record,department1} = this.state;
        // 分页配置
        /* const pagination={
            total:total,
            pageSize:page_size,
            current:page_number,
            onChange:(page)=>{
                this.setState({page_number:page,spinning:true},()=>{
                    this.getList()
                })
            }
        }; */
        return(
            <div className='busDepartment-box'>
                <div className='busDepartment-container'>
                    <div className='title'>
                        <span>部门列表</span>
                    </div>
                    <div className='table-title'>
                        <div className='table-title-font'>
                            {/* <i className='iconfont iconbumen'></i> */}
                            <img src={require('./../../image/bumenguanli.png')} className='busDepartment-img' alt=''/>
                            <div>部门总数：{countNum}</div>
                        </div>
                        <div>
                            <Button className='btn-style' onClick={this.showModal} style={{width:'100px'}}>新增部门</Button>
                        </div>
                    </div>
                    {/* 表格 */}
                    <div className="table-box busDepartment-table-box">
                        <Table 
                            onExpand={(expanded, record)=>{this.queryChildren(expanded, record)}} 
                            columns={columns} 
                            dataSource={data}
                            pagination = {false} 
                            bordered
                            onExpandedRowsChange = {(expandedRows)=>{this.showRow(expandedRows)}}
                        />
                    </div>
                    {/* <div className="class-pagination-box">
                        <Pagination showQuickJumper defaultCurrent={1} total={total}  {...pagination}/>
                    </div> */}
                    {/* 新增部门弹窗 */}
                    <Modal
                        className='busDepartment-edit-model'
                        destroyOnClose //清空弹窗
                        width='560px'
                        centered = {true}
                        maskClosable = {false}
                        title="新增部门"
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        footer={[
                            <div className='busDepartment-edit-btn'>
                                <Button key="back" onClick={this.handleCancel} style={{width:'80px',height:'40px'}}>
                                    取消
                                </Button>
                                <Button key="submit" type="primary" onClick={this.handleOk} style={{width:'80px',height:'40px'}}>
                                    保存
                                </Button>
                            </div>
                        ]}
                    >
                    <Addform wrappedComponentRef={(e)=>{this.addform = e}}/>
                    </Modal>
                    {/* 新增下级/编辑 弹窗 */}
                    <Modal
                        className='busDepartment-edit-model'
                        destroyOnClose //清空弹窗
                        width='560px'
                        centered = {true}
                        maskClosable = {false}
                        title= {addSub ? "新增下级":"编辑部门"}
                        visible={this.state.visible1}
                        onOk={(e)=>{this.handleOk1(e)}}
                        onCancel={this.handleCancel}
                        footer={[
                            <div className='busDepartment-edit-btn'>
                                <Button key="back" onClick={this.handleCancel} style={{width:'80px',height:'40px'}}>
                                    取消
                                </Button>
                                <Button key="submit" type="primary" onClick={this.handleOk1} style={{width:'80px',height:'40px'}}>
                                    保存
                                </Button>
                            </div>
                        ]}
                    >
                    <AddSub wrappedComponentRef={(e)=>{this.addSub = e}} department={department} department1={department1} editsub={editsub} addSub={addSub} singlrRowData={singlrRowData} getId={getId}/>
                    </Modal>
                    {/* 删除弹窗 */}
                    <Modal
                        className='busUser-open-model'
                        destroyOnClose //清空弹窗
                        width='440px'
                        centered = {true}
                        closable = {false}
                        maskClosable = {false}
                        //title='删除部门'
                        visible={this.state.delete}
                        onOk={this.handleDeleteOk}
                        onCancel={this.handleCancel}
                        footer={[
                            <div className='busUser-open-btn'>
                                <Button key="back" onClick={this.handleCancel} style={{width:'70px',height:'32px'}}>
                                    取消
                                </Button>
                                <Button key="submit" type="primary" onClick={this.handleDeleteOk} style={{width:'70px',height:'32px'}}>
                                    确定
                                </Button>
                            </div>
                        ]}
                    >   
                        {
                            <div className='delet-box'>
                                <Icon type="exclamation-circle" className="delet-icon"></Icon>
                                <span>确认删除{record.department}？</span>
                            </div>
                        }
                        
                    </Modal>
                </div>
               <WinButton/>
            </div>
        )
    }
    componentDidMount(){
        this.getList()
        this.getCount()
    }
    // 获取部门总数
    getCount = e =>{
        const data = {}
        api.axiosPost('get_department_count',data).then((res)=>{
            if(res.data.code ===1){
                this.setState({
                    countNum : res.data.data
                })
            }
        })
    }
    // 新增部门
    handleOk = e => {
        let addform = this.addform
        //表单验证
        addform.props.form.validateFields((err, values) => {
            e.preventDefault();
            // console.log(values);
            const data ={
                fid : values.superiorDepartment && values.superiorDepartment.length > 0  ? values.superiorDepartment.pop() : 0 ,
                department : values.industryTitle
            }
            if (!err) {
                api.axiosPost('add_department',data).then((res)=>{
                    if(res.data.code === 1){
                        message.success('新增成功！')
                        this.setState({
                            visible: false,
                        });
                        this.getList()
                        this.getCount()
                    }else{
                        message.error(res.data.msg)
                    }
                    
                })
                
                
            }
        });
        
    };
    showModal = () => {
        this.setState({
          visible: true,
        });
    };
    handleCancel = e => {
        //console.log(e);
        this.setState({
            visible: false,
            visible1: false,
            delete : false,
        });
    };
    // 新增下级/编辑--点击保存
    handleOk1 = (e) => {
        let addSub = this.addSub
        // 表单验证
        addSub.props.form.validateFields((err, values) => {
            e.preventDefault();
            
            const {singlrRowData} = this.state
            if(this.state.addSub){
                // 新增下级请求
                const data = {
                    department : values.department,
                    fid : this.state.id
                }
                if (!err) {
                    //console.log(1111);
                    
                    api.axiosPost('add_department',data).then((res)=>{
                        if(res.data.code === 1){
                            message.success('新增成功！')
                            //console.log(111,res.data.data);
                            this.getCount()
                            // 前端数据回填
                            this.addSubFn(res.data.data)
                            this.setState({
                                visible1: false,
                            });
                        }else{
                            message.error(res.data.msg)
                        } 
                    }) 
                }
            }else{
                //编辑请求
                if(!err){
                    //console.log(1,values);
                    //console.log(2,this.state.getId);
                    
                    if((values.superiorDepartment && values.superiorDepartment.length == this.state.getId.length) || !values.superiorDepartment || values.superiorDepartment.length ===0){
                        //console.log(11,values.superiorDepartment);
                        //console.log(22,this.state.getId);
                        
                        // 获取父ID
                        let valuesId = [] 
                        values.superiorDepartment && values.superiorDepartment.map((item)=>{
                            valuesId.push(item)
                        })
                        //console.log(22,valuesId);
                        // 清空级联时，获取父级ID
                        if(values.superiorDepartment && values.superiorDepartment.length ===0){
                            var emptyID = []
                            this.state.getId && this.state.getId.map((item)=>{
                                emptyID.push(item)
                            })
                            var emptysID = emptyID.pop()
                        }
                        //console.log('fuji',emptysID);
                        
                        const Data = {
                            fid : valuesId.length ? valuesId.pop() : values.superiorDepartment && values.superiorDepartment.length === 0 ? emptysID : 0,
                            id : this.state.id,
                            department : values.department
                        }
                        //console.log('传给后台数据',Data);
                        
                        api.axiosPost('update_department',Data).then((res)=>{
                            if(res.data.code === 1){
                                console.log(values.superiorDepartment);
                                
                                if(values.superiorDepartment && values.superiorDepartment.toString() == this.state.getId.toString()){
                                    //前端更新
                                    this.edit(values.department)
                                }else{
                                    this.getList()
                                }
                                
                                this.setState({
                                    visible1: false,
                                });
                                message.success(res.data.msg)
                            }else{
                                message.error(res.data.msg)
                            }
                            
                        })
                    }else{
                        message.error('不支持更改部门层级，支持更改上级部门')
                    }
                    
                }
      
            }
            
        });
        
    };
    async showModal1(record,type){
        //console.log(333,record);
        if(type === true){
            //新增时数据回填
            const editData = {
                id : record.id,
                type : 0
            }
            let res = await api.axiosPost('get_department_info',editData)
            //console.log('回填数据',res);
            if(res.data.code === 1){
               
                //获取回填数据ID
                let department1 = []
                /* for(let item in res.data.data){

                    if(item != 'count'){
                        department1.push(res.data.data[item].department)
                    }
                } */
                for(let i = 0; i< res.data.data.count; i++) {
 
                    department1.push(res.data.data['department_'+(i+1)]['department'])
                }
                // 数组排序
                //department1 = department1.sort(this.sortNumber);
                this.setState({
                    //editData : res,
                    department1
                })
            }
            this.setState({
                addSub : true,
                editsub : false,
                id : record.id, //当前行id
                department : '',
                singlrRowData: record//当前行数据
            })

        }else{
            // console.log(333,record);
            //编辑时数据回填请求
            const editData = {
                id : record.id,
                type : 1,
            }
            let res = await api.axiosPost('get_department_info',editData)
            //console.log('回填数据',res);
            if(res.data.code === 1){
               
                //获取回填数据ID
                let getId = []
                for(let item in res.data.data){

                    if(item != 'count'){
                        getId.push(res.data.data[item].id)
                    }
                }
                // 数组排序
                getId = getId.sort(this.sortNumber);
                this.setState({
                    //editData : res,
                    getId
                })
            }
            this.setState({
                editsub : true,
                addSub : false,
                id : record.id, //当前行id
                department : record.department,
                singlrRowData: record,//当前行数据
            })

        }
        
        this.setState({
          visible1 : true,
        });
    };
    // 数组排序
    sortNumber(a,b){return a - b}
    // 查询子节点
    queryChildren=(expanded, record)=>{
        //const{store} = this.props;
        //console.log(33,record);
        
        if(expanded){
            const {data} = this.state;
            const fid = record.id;
            api.axiosPost("department_list",{fid}).then((res)=>{
                if(res.data.code == 1){
                    const childrenData = res.data.data.list;
                    childrenData.map((item)=>{
                        item.key = item.id;
                        if(item.level < 10){
                            item.children = []
                        }
                        
                    });
                    //console.log(222,childrenData);
                    
                    record.children=childrenData;
                    this.setState({
                        data : data,
                    })
                }
            })
        }
    };

    // 获取部门列表
    getList(){
        //const {fid} = this.state;
        const data={fid : 0};
        api.axiosPost('department_list',data).then((res)=>{
            if(res.data.code === 1){
                //console.log(res.data.data);
                const data = res.data.data.list;
                data.map( (item)=>{
                    item.key = item.id;
                    item.children=[]
                } );
                this.setState({
                    data : data,
                    count : res.data.data.count,
                    //fid : data[0].id
                })
            }
            
        })
    }
    // 部门删除
    /* delete(record){
        //console.log(11,record);
        const data = {
            id : record.id
        }
        api.axiosPost('delete_department',data).then((res)=>{
            if(res.data.code ===1){
                //前端删除更新
                this.handleDelete(record)
                message.success(res.data.msg)
            }else{
                message.error(res.data.msg)
            }
            

        })
    } */
    deleteModal(record){
        this.setState({
            delete : true,
            record
        })
    }
    handleDeleteOk = e =>{
        const data = {
            id : this.state.record.id
        }
        //console.log(this.state.record);
        
        api.axiosPost('delete_department',data).then((res)=>{
            if(res.data.code ===1){
                //前端删除更新
                this.handleDelete()
                this.getCount()
                this.setState({
                    delete : false,
                })
                message.success(res.data.msg)
            }else{
                message.error(res.data.msg)
            }
            

        })
    }
    // 新增下级对数据进行更新 -- 不从后台重新获取
    addSubFn(list){
        const {singlrRowData,data} = this.state;
        //console.log(list);
        if(list.level < 10){
            list.children = []
            list.key = Math.random()
        }

        singlrRowData.children.unshift(list)

        this.setState({
            singlrRowData
        })
    } 
    // 编辑部门 前端更新
    edit(department){
        const {data,singlrRowData} = this.state;
        
        singlrRowData.department = department

        this.setState({singlrRowData})
        
    }
    // 部门删除 前端更新
    handleDelete = (e) => {
        //console.log(222,this.state.data);
        let {record,data} = this.state
        
        data = this.findId(data,record.id)

        this.setState({
            data:[].concat(data),
        })
        
    };
    findId = (data,id) =>{
        data.forEach((item,index,data)=>{
            if(item.id == id){
                data.splice(index, 1)
            }else{
                this.findId(item.children,id)
            }
        })
        
        return data;
    }
    showRow = (e) =>{
        //console.log(555,e);
        
    }
}