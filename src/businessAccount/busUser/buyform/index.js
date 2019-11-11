import React from "react";
import {Form,Input,Cascader, Tree} from 'antd';
import api from '../../../component/api'
import "./index.scss";

const { TreeNode } = Tree;
class buyform extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state={
            confirmDirty: false,
            areaOption: [],   // 级联选择器数据
            getId:[],//级联默认值
            treeData : [], //穿梭框数据
            targetKeys: [],

            selectTreeId:[],
            rightTree:[],
            class_ids:[],
            selectCheckedLevel3:[]
        }
    }
    componentDidMount(){
        //console.log(3333,this.props.editRecord.sub_credit);
        if(!this.props.buyer){
            //获取回填数据ID
            let getId = []
            for(let item in this.props.editRecord.department){

                if(item != 'count'){
                    getId.push(this.props.editRecord.department[item].id)
                }
            }
            // 数组排序
            getId = getId.sort(this.sortNumber);
            this.setState({getId})
            this.props.form.setFieldsValue({
                username : this.props.editRecord.user_name,
                name : this.props.editRecord.real_name,
                //tel : this.props.editRecord.phone,
                mailbox : this.props.editRecord.email  ? this.props.editRecord.email : '',
                credit : `${this.props.editRecord.sub_credit}`
            })
        }
        
        
        this.getDepartment()
        this.getProduct()
    }
    // 数组排序
    sortNumber(a,b){return a - b}
    // 获取下拉数据
    getDepartment = () => {
        const data = {
            type : 'people',
        };
        api.axiosPost('get_department',data).then( (res) => {
          if(res.data.code === 1){
            this.deletTree(res.data.data)
            /* res.data.data.map((oneItem)=>{
                if(oneItem.child.length == '0'){
                    delete oneItem.child
                }else{
                    oneItem.child.map((twoItem)=>{
                        if(twoItem.child.length == '0'){
                            delete twoItem.child
                        }else{
                            twoItem.child.map((threeItem)=>{
                                if(threeItem.child.length == '0'){
                                    delete threeItem.child
                                }else{
                                    threeItem.child.map((fourItem)=>{
                                        if(fourItem.child.length == '0'){
                                            delete fourItem.child
                                        }else{
                                            fourItem.child.map((fiveItem)=>{
                                                if(fiveItem.child.length == '0'){
                                                    delete fiveItem.child
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
                
            }) */
            this.setState({
                areaOption:res.data.data
            })
          }
        }) 
    };
    deletTree = (data) =>{
        data && data.map((item)=>{
            if(item.child.length === 0){
                delete item.child
            }else{
                this.deletTree(item.child)
            }
        })
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
    onChange = targetKeys => {
        this.setState({ targetKeys });
    };

    //树形数据回显
    treeShowCheck=(class_ids)=>{
       this.setState({
           class_ids,
           selectTreeId:class_ids
       });
    };

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
        console.log(treeData)
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
    render(){

        const { targetKeys ,treeData,rightTree,selectLevel3} = this.state;
        //表单
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 4 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 4 },
                sm: { span: 17 },
            },
        };

        const {buyer,editRecord} = this.props;
        //级联
        const fieldNames = {label: 'department', value: 'id', children: 'child'};

        return(

            <Form onSubmit={this.handleSubmit} className='buyform' {...formItemLayout}>
                
                <Form.Item label="账户名称：">
                    {getFieldDecorator('username', {
                        rules: [
                            { required: true, message: '请填写账户名称' },{ pattern: /^([a-z0-9\.\@\!\#\$\%\^\&\*\(\)]){4,20}$/i, message: '账户名称长度范围为4-20位字符(不能输入中文)!'}
                        ]
                    })(
                        <Input placeholder='请输入账户名称'/>
                    )}
                </Form.Item>
                

                <Form.Item label="真实姓名：">
                    {getFieldDecorator('name', {
                        rules: [
                            { required: true, message: '请填写真实姓名' },{pattern:  /^[a-zA-Z\u4E00-\u9FA5]{1,20}$/, message: '请输入中文或英文名字，最长20位字符!'}
                        ]
                    })(
                        <Input placeholder='请输入真实姓名'/>,
                    )}
                </Form.Item>
                <Form.Item label="所属部门：">
                    {getFieldDecorator('superiorDepartment', {
                        rules: [
                            { required: true, message: '请选择所属部门' },
                        ],
                        initialValue : this.state.getId
                    })(
                        <Cascader
                            style={{width:'398px'}}
                            placeholder="请选择"
                            options={this.state.areaOption}
                            fieldNames={fieldNames}
                            loadData={this.loadData}
                            onChange={this.onChange}
                            changeOnSelect
                            getPopupContainer = {(triggerNode)=>{return triggerNode}}
                            // displayRender={displayRender}
                        />
                    )}
                </Form.Item>

                <Form.Item label="独享额度：" className='credit-parent'>
                    {getFieldDecorator('credit', {
                        rules: [
                            { required: true, message: '请填写授信额度!' },{max:9,message:"授信额度不能超过1亿"},{ pattern: /^(0|\+?[1-9][0-9]*)$/, message: '授信额度必须为正整数！'}

                        ]
                    })(

                        <Input placeholder='请输入授信额度'/>

                    )}
                    <div className='credit-son'>(元)</div>
                </Form.Item>

                {
                    buyer ?
                    <Form.Item label="手机号码：">
                        {getFieldDecorator('tel', {
                            rules: [
                                { required: true, message: '请输入手机号!' },{pattern: /^((\+)?86|((\+)?86)?)0?1[345789]\d{9}$/, message: '请输入正确的手机号!'},
                            ]
                        })(
                            <Input placeholder='请输入手机号码，可用于登录'/>,
                        )}
                    </Form.Item> :
                    <Form.Item label="手机号码：">
                        <span>{editRecord.phone}</span>
                    </Form.Item>
                }      
                
                {
                    buyer ?
                        <Form.Item label="登录密码：">
                            <span>默认初始密码123456</span>
                        </Form.Item> : ''

                }
                <Form.Item label="邮箱账户：">
                    {getFieldDecorator('mailbox', {
                        rules:[
                            {type:'email',message:'请输入正确邮箱'}
                        ]
                    })(
                        <Input />
                    )}
                </Form.Item>
                <div className='procurement-head'><span>*&nbsp;</span>采购分类信息</div>
                <div className="procurement-box">
                    <div className='procurement-content'>
                        <div className='color'>选择分类信息</div>
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
                    <div className='procurement-content'>
                        <div className='color'>已选择的分类信息</div>
                        <Tree
                            showLine
                            defaultExpandAll={true}
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
                </div>
            </Form>
        )

    }
}

export default Form.create()(buyform)