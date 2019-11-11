import React from "react";
import {Link} from 'react-router-dom';
import { Button,Modal,Form,Input ,message,Icon} from 'antd';
import api from './../../component/api'
import ChangePwdForm from './changePwdForm'
import {createHashHistory} from "history";
import "./index.scss";
const history = createHashHistory();

class busSecuritySet extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state={
            visible: false,
        }
    }
    
    
    render(){
        
        return(
            <div className='busSecuritySet-security-box'>
                <div className='busSecuritySet-security-content'>
                    <div className='busSecuritySet-security-title'>您当前的账户：{sessionStorage.getItem('user_name')}</div>
                    <div className='busSecuritySet-security-row'>
                        <div className='text-center'>
                            <img src={require('./../../image/img_mima.png')} alt='' className='busSecuritySet-icon'/>
                            {/* <Icon type="check-circle" className='busSecuritySet-icon' /> */}
                            <div className='busSecuritySet-security-pwd'>
                                <div className='busSecuritySet-security-col'>登录密码</div>
                                <div className='ft12'>建议您定期更换密码，设置安全性高的密码可以使账户更安全</div>
                            </div>
                        </div>
                        <div>
                            <Button type="primary" onClick={this.showModal} className='btn' style={{width:'88px',height:'32px'}}>
                                修改
                            </Button>
                            <Modal
                                className='busSecuritySet-edit-model'
                                destroyOnClose //清空弹窗
                                title="修改密码"
                                width='520px'
                                centered = {true}
                                maskClosable = {false}
                                visible={this.state.visible}
                                onOk={this.handleOk}
                                onCancel={this.handleCancel}
                                footer={[
                                    <div className='busSecuritySet-edit-btn'>
                                        <Button key="back" onClick={this.handleCancel} style={{width:'80px',height:'40px'}}>
                                            取消
                                        </Button>
                                        <Button key="submit" type="primary" onClick={this.handleOk} style={{width:'80px',height:'40px'}}>
                                            保存
                                        </Button>
                                    </div>
                                ]}
                            >
                                <ChangePwdForm wrappedComponentRef={(e)=>{this.changePwdForm = e}}/>
                            </Modal>
                        </div>
                       
                    </div>
                </div>

            </div>
        )
    }
    componentDidMount(){
        
    }
    //修改密码
    handleOk = e => {
        let pwdDemo = this.changePwdForm
        //表单验证
        pwdDemo.props.form.validateFields((err, values) => {
            console.log(values);
            
          if (!err) {
            //发送修改密码请求
            let pwdData = {
                old_pwd : values.oldPassword,
                new_pwd : values.password,
            }
            api.axiosPost("modifyPassWord",pwdData).then((res)=>{
                //console.log(res);
                if (res.data.code === 1) {
                    message.success("修改成功,需要重新登录。3秒后自动跳转",3,()=>{
                        history.push('/');
                    });
                    //清空表单
                    //pwdDemo.props.form.resetFields()
                    //关闭弹窗
                    /* this.setState({
                        visible: false,
                    }); */
                }else{
                    message.error(res.data.msg)
                }
            });
            
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
        });
    };
    
    
}


export default Form.create()(busSecuritySet)