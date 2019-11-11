import React,{Component} from "react";
import {Link, Route} from 'react-router-dom';
import { createHashHistory } from 'history';
import { Form, Icon, Input, Button, Checkbox,message,Modal } from 'antd';
import Header from "./../components/header";
import api from "./../component/api";
import "./index.scss";
import {inject, observer} from "mobx-react";
const history = createHashHistory();
@inject("store")
@observer
class Login extends Component{
    constructor(props) {
        super(props);
        this.state={
            userStatus:false,
            passwordStatus:false,
            codeStatus:false,
            userName:"",
            password:"",
            code:""
        }
    }

    IeModal=(title)=>{
        Modal.warning({
            title: title,
            content: '推荐使用：谷歌、火狐，或者其他双核浏览器。如果您的使用的是360、搜狗、QQ等双核浏览器，请在最顶部切换到极速模式访问',
        });
    };

    /* inputChange =(type,value,status)=>{
        let verificationStatus = false;
        if( !value ){
            verificationStatus = Prompt.verificationStatus[2]
        }
        this.setState({
            [type]:value,
            [status]:verificationStatus
        })
    }; */

    componentDidMount() {
        const navigatorType = navigator.userAgent;
        if(navigatorType.indexOf("MSIE")>0 || navigatorType.indexOf('Trident') > 0){
            this.IeModal("当前浏览器不推荐使用");
        }
    }
    
    
    render(){
        
        //路由参数
        const {routes} = this.props;
        //控制header的搜索框是否显示
        const header={ login:true };
        const { getFieldDecorator } = this.props.form;
        return(
            <div className='login-warp'>
                <Header {...header}/>
                <div className="login-box">

                    <div className='login-form-box'>
                        <Form onSubmit={this.handleSubmit} className="login-form" hideRequiredMark={true}>
                            
                            <Form.Item label="用户名" >
                                {getFieldDecorator('userName', {
                                rules: [
                                    { required: true, message: '请输入您的用户名/手机号'},
                                ],
                                
                                })(
                                <Input
                                    autoComplete="off"
                                    placeholder="请输入用户名/手机号"
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="text"
                                    allowClear
                                />)}
                            </Form.Item>
                            <Form.Item label="密码" >
                                {getFieldDecorator('password', {
                                rules: [
                                    { required: true, message: '请输入您的密码'},
                                ],
                                })(
                                <Input
                                    placeholder="请输入密码"
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    allowClear
                                />,
                                )}

                            </Form.Item>
                            
                            <Form.Item>
                                <Button type="primary"
                                        htmlType="submit"
                                        className="login-form-button btn-login">登录</Button>
                                <p className='forget-password'>
                                    <Link to="/Registered">注册新用户</Link>
                                </p>
                            </Form.Item>
                        </Form>
                        
                    </div>
                    
                    {/* <div ref={(e)=>{this.code = e}}></div> */}
                   
                </div>

                {/*配置子路由*/}
                { routes && routes.length && routes.map((route, i) => {
                    return(
                        <Route key = {i} path={route.path}
                               render={ props => (
                                    <route.component {...props} routes={route.routes} />
                                )}
                        />
                    )
                })}
            </div>
        )
    }
    //表单提交
    handleSubmit = (e) =>{
        const {store} = this.props;
        //history.push('/home');
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                //发送提交请求
                let data = {
                    user_name : values.userName,
                    pass_word : values.password
                }
                api.axiosPost('login',data).then((res)=>{
                    if(res.data.code === 1){
                        message.success('登录成功！！')
                        sessionStorage.setItem("token",res.data.data.token);
                        sessionStorage.setItem("user_name",res.data.data.user_name);
                        sessionStorage.setItem("type",res.data.data.type);
                        
                        store.login_type.setType(res.data.data.type);

                        if(res.data.data.type === 0){
                            history.push('/BusinessAccount');
                        }else if(res.data.data.type === 1){
                            history.push('/AdminAccount');
                        }else if(res.data.data.type === 2){
                            history.push('/home');
                        }else if(res.data.data.type === 3){
                            history.push('/ApproverAccount');
                        }
                        
                    }else if(res.data.code === 0){
                        message.error(res.data.msg)
                    }
                })
            }else{
                return;
            }
        });
    }
}
export default Form.create()(Login);