import React from "react";
import {Button, Modal, Input, Row, Col, Form, Select,message} from "antd";
import api from "./../../../component/api";
import "./index.scss";
const Option = Select.Option;
class EditPassModal extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            provincesList:[],
            cityList:[],
            streetList:[],
            provinces:"",  //省份id
            city:"",   //市id
            street:"", //街道id
            parent_id:0, //省市街道父级ID
            addressId:""
        }
    }
    //获取省市区
    getArea=(id,type)=>{
        const parent_id = id ? id : this.state.parent_id;
        const data={parent_id:parent_id};
        api.axiosPost("get_area",data).then((res)=>{
            if(res.data.code == 1){
                if( parent_id == 0){
                    this.setState({
                        provincesList:res.data.data
                    })
                }else if(type == "provinces"){
                    this.setState({
                        cityList:res.data.data
                    })
                }else if(type == "city"){
                    this.setState({
                        streetList:res.data.data
                    });
                }
            }
        })
    };
    //下拉框改变
    selectChange=(type,value)=>{
        this.props.form.setFieldsValue({
            [type]:value
        });
        if(type == "provinces"){
            this.props.form.setFieldsValue({
                city:undefined,
                street:undefined,
            });
            this.setState({
                cityList:[],
                streetList:[]
            })
        }else if(type == "city"){
            this.props.form.setFieldsValue({
                street:undefined,
            });
            this.setState({
                streetList:[]
            })
        }
        this.setState({
            [type]:value
        });
        if(type !== "street"){
            this.getArea(value,type)
        }
    };
    //隐藏弹出框
    hideModal=()=>{
        this.props.isShowModal(false)
    };
    //点击确定按钮
    handleSubmit=(e)=>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const {isEdit} = this.props;
                const data={
                    address:`${values.provinces},${values.city ? values.city : "000000"},${values.street ? values.street : "000000"}`,
                    address_info:values.address_info,
                    consignee:values.consignee,
                    phone:`${values.phone}`,
                    postal_code:values.postal_code ? values.postal_code : ""
                };
                let url = "addAddress";
                if(isEdit == "edit"){
                    url = "editAddress";
                    data.id = this.state.addressId;
                }
                api.axiosPost(url,data).then((res)=>{
                    if(res.data.code == 1){
                        message.success(res.data.msg);
                        this.hideModal();
                        this.props.getAddressList()
                    }else{
                        message.error(res.data.msg);
                    }
                })
            }
        });
    };

    //修改地区数据
    getRegionData=(props,id)=>{
        this.setState({
            provincesList:props.province,
            cityList:props.city,
            streetList:props.country,
            addressId:id
        });
    };

    render(){
        const {provincesList,cityList,streetList} = this.state;
        const { getFieldDecorator } = this.props.form;
        const {isEdit} = this.props;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
            },
        };
        return(
            <Modal
                className='modal user-add-modal-boxs'
                visible={this.props.display}
                title={`${isEdit == "add" ? "新增" : "编辑"}收货地址`}
                footer={[
                    <Button onClick={this.hideModal}>取消</Button>,
                    <Button htmlType="submit" onClick={this.handleSubmit} type='primary'>确定</Button>
                ]}
                width='610px'
                onCancel={this.hideModal}
                maskClosable={false}
                height={450}
            >
                <Form {...formItemLayout} onSubmit={this.handleSubmit} className='address-box-modal'>
                    <Form.Item label="收货人">
                        {getFieldDecorator('consignee', {
                            rules: [
                                {
                                    required: true,
                                    message: '收货人不能为空',
                                }
                            ],
                        })(<Input maxLength={20} key='consignee' placeholder='请输入收货人姓名'/>)}
                    </Form.Item>
                    <Form.Item label="手机号">
                        {getFieldDecorator('phone', {
                            rules: [
                                {
                                    required: true,
                                    pattern:/^1[345789]\d{9}$/,
                                    message: '手机号格式不正确',
                                }
                            ],
                        })(<Input key='phone' placeholder='请输入手机号'/>)}
                    </Form.Item>
                    <Form.Item label="收货地址" required className='nested-from'>
                        <Form.Item  style={{ display: 'inline-block', width: 'calc(33% - 12px)' }}>
                            {getFieldDecorator('provinces', {
                                rules: [
                                    {
                                        required: true,
                                        message: '省份不能为空',
                                    }
                                ],
                            })(
                                <Select
                                    onChange={(value)=>{this.selectChange("provinces",value)}}
                                    key='provinces' placeholder="选择省份">
                                    {
                                        provincesList && provincesList.map((item)=>{
                                            return(
                                                <Option value={item.id}>{item.name}</Option>
                                            )
                                        })
                                    }
                                </Select>)}
                        </Form.Item> &emsp;
                        <Form.Item  style={{ display: 'inline-block', width: 'calc(33% - 12px)' }}>
                            {getFieldDecorator('city', {
                                rules: [
                                    {
                                        required: false,
                                        message: '市区不能为空',
                                    }
                                ],
                            })(
                                <Select
                                    onChange={(value)=>{this.selectChange("city",value)}}
                                    key='city' placeholder="选择市区">
                                    {
                                        cityList && cityList.map((item)=>{
                                            return(
                                                <Option value={item.id}>{item.name}</Option>
                                            )
                                        })
                                    }
                                </Select>)}
                        </Form.Item>&emsp;
                        <Form.Item style={{ display: 'inline-block', width: 'calc(33% - 12px)' }}>
                            {getFieldDecorator('street')(
                                <Select
                                    onChange={(value)=>{this.selectChange("street",value)}}
                                    key='street' placeholder="选择街道">
                                    {
                                        streetList && streetList.map((item)=>{
                                            return(
                                                <Option value={item.id}>{item.name}</Option>
                                            )
                                        })
                                    }
                                </Select>)}
                        </Form.Item>
                    </Form.Item>
                    <Form.Item label="详细地址">
                        {getFieldDecorator('address_info', {
                            rules: [
                                {
                                    required: true,
                                    message: '详细地址不能为空',
                                }
                            ],
                        })(<Input.TextArea maxLength={60} key='address_info' placeholder='请填写详细收货地址，如街道名称、门牌号、小区楼栋号、单元等信息。'/>)}
                    </Form.Item>
                    <Form.Item label="邮政编码">
                        {getFieldDecorator('postal_code', {
                            rules: [
                                {
                                    required: false,
                                }
                            ],
                        })(<Input key='postal_code' maxLength={6} placeholder='请输邮政编码'/>)}
                    </Form.Item>
                </Form>
            </Modal>
        )
    }
}
const EditPassModalForm = Form.create({
    name: 'register',
    mapPropsToFields(props) {
        const editAddresData = props.editAddresData;
        return {
            city: Form.createFormField({
                value: editAddresData.city_id ? parseInt(editAddresData.city_id) : undefined
            }),
            provinces: Form.createFormField({
                value: editAddresData.province_id ? parseInt(editAddresData.province_id) : undefined
            }),
            street: Form.createFormField({
                value: editAddresData.country_id ? parseInt(editAddresData.country_id) : undefined
            }),
            postal_code: Form.createFormField({
                value: editAddresData.postal_code
            }),
            address_info: Form.createFormField({
                value:editAddresData.address_info
            }),
            phone:Form.createFormField({
                value: editAddresData.phone
            }),
            consignee:Form.createFormField({
                value: editAddresData.consignee
            }),
        };
    },
})(EditPassModal);
export default EditPassModalForm