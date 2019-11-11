import React, { Component } from "react";
import { Link, Route } from 'react-router-dom';
import { createHashHistory } from 'history';
import { Form, Icon, Input, Button, Checkbox, message, Modal, Divider } from 'antd';
import Header from "./../components/header";
import api from "./../component/api";
import "./index.scss";
import { inject, observer } from "mobx-react";
import { log } from "util";
const history = createHashHistory();
@inject("store")
@observer
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userStatus: false,
            passwordStatus: false,
            codeStatus: false,
            phone: "",
            password: "",
            code: "",
            login_type: 1, // 1 ===> 密码登录 2 ===> 快捷登录
            codeIsClicked: true,
            codeBtnText: '获取验证码',
        }
    }

    IeModal = (title) => {
        Modal.warning({
            title: title,
            content: '推荐使用：谷歌、火狐，或者其他双核浏览器。如果您的使用的是360、搜狗、QQ等双核浏览器，请在最顶部切换到极速模式访问',
        });
    };
    // 切换登录方式
    switchLoginMode = () => {
        const { login_type } = this.state;
        this.setState({
            login_type: login_type === 1 ? 2 : 1
        })
        const phone = this.props.form.getFieldValue('phone');
        // console.log('phone', phone);
        this.props.form.resetFields();
        // 切换时保存手机号
        phone && this.props.form.setFieldsValue({phone: phone})
    }
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
        if (navigatorType.indexOf("MSIE") > 0 || navigatorType.indexOf('Trident') > 0) {
            this.IeModal("当前浏览器不推荐使用");
        }
    }

    setOutGoing = () => {
        if(!sessionStorage.getItem('out')){
            sessionStorage.setItem('login', true)
        }
    }

    render() {
        // 状态
        const { login_type, codeBtnText, codeIsClicked } = this.state;
        //路由参数
        const { routes } = this.props;
        
        //控制header的搜索框是否显示
        const header = { login: true };
        const { getFieldDecorator } = this.props.form;
        // console.log('codeBtnText', codeBtnText);
        return (
            <div className='login-warp'>
                <Header {...header} />
                <div className="login-box">
                    <div className="login-inner-box">
                        <div className='login-form-box'>
                            <h3 className="login-head">{login_type === 1 ?　'密码登录' : '快捷登录'}</h3>
                            <Form onSubmit={this.handleSubmit} className="login-form" hideRequiredMark={true}>
                                <Form.Item>
                                    {getFieldDecorator('phone', {
                                        rules: [
                                            { required: true, message: '请输入您的手机号' },
                                            { pattern: /^1[345789]\d{9}$/, message: '手机号不正确，请仔细检查' }
                                        ],

                                    })(
                                        <Input
                                            autoComplete="off"
                                            placeholder="请输入手机号"
                                            prefix={<i className="iconfont iconshouji" style={{fontSize: 26}} />}
                                            type="text"
                                            allowClear
                                    />)}
                                </Form.Item>
                                {
                                    login_type === 1 ? 
                                    <Form.Item>
                                        {getFieldDecorator('password', {
                                            rules: [
                                                { required: true, message: '请输入您的密码' },
                                            ],
                                        })(
                                            <Input
                                                placeholder="请输入密码"
                                                prefix={<i className="iconfont iconmima" />}
                                                type="password"
                                                allowClear
                                            />,
                                        )}
                                    </Form.Item> : ''
                                }
                                
                                {
                                   login_type === 2 ? 
                                    <div>
                                        <Form.Item className="verification-code">
                                            {getFieldDecorator('code', {
                                                rules: [
                                                    { required: true, message: '请输入验证码' },
                                                ],
                                            })(
                                                <Input
                                                    placeholder="请输入验证码"
                                                    className="verification-code-input"
                                                    autoComplete="off"
                                                    type="text"
                                                    allowClear
                                                />,
                                            )}
                                        </Form.Item>
                                        <Button className={['get-code-btn', !codeIsClicked ? 'read-only-btn': ''].join(' ')} onClick={this.handelCode}>
                                            {codeBtnText}
                                        </Button>
                                    </div> : ''
                                }
                                <Form.Item>
                                    <Button type="primary"
                                        htmlType="submit"
                                        className="login-form-button btn-login">登录</Button>
                                    <p className='forget-password'>
                                        <Link to="/Registered">新用户注册</Link>
                                        <span onClick={this.switchLoginMode}>{login_type === 1 ?　'快捷登录' : '密码登录'}</span>
                                    </p>
                                </Form.Item>
                            </Form>

                        </div>
                    </div>
                    <div className="footer">
                        <div className="footer-inner">
                            <div>
                                <span><Link to="/CommonProblems/AboutUs" onClick={this.setOutGoing}>关于我们</Link></span>
                                <Divider type="vertical" />
                                <span><Link to="/HelpCenter" onClick={this.setOutGoing}>帮助中心</Link></span>
                                <Divider type="vertical" />
                                <span><Link to="/CommonProblems/SalesService" onClick={this.setOutGoing}>售后服务</Link></span>
                                <Divider type="vertical" />
                                <span><Link to="/CommonProblems/DeliveryAcceptance" onClick={this.setOutGoing}>配送与验收</Link></span>
                                <Divider type="vertical" />
                                <span><Link to="/CommonProblems/BusinessCooperation" onClick={this.setOutGoing}>商务合作</Link></span>
                            </div>
                            <div className="copyRight">
                                CopyRight © 企牛采 2015 - 2019  
                            </div>
                        </div>
                    </div>

                </div>

                {/*配置子路由*/}
                {routes && routes.length && routes.map((route, i) => {
                    return (
                        <Route key={i} path={route.path}
                            render={props => (
                                <route.component {...props} routes={route.routes} />
                            )}
                        />
                    )
                })}
            </div>
        )
    }
    //表单提交
    handleSubmit = (e) => {
        const { store } = this.props;
        const { login_type } = this.state;
        //history.push('/home');
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                //发送提交请求
                let data = {
                    phone: values.phone,
                    login_type
                }
                if(login_type === 1) {
                    data.pass_word = values.password;
                } else {
                    data.code = values.code;
                }
                // console.log(data)
                // return;
                api.axiosPost('login', data).then((res) => {
                    if (res.data.code === 1) {
                        message.success('登录成功！！')
                        sessionStorage.setItem("token", res.data.data.token);
                        sessionStorage.setItem("user_name", res.data.data.user_name);
                        sessionStorage.setItem("type", res.data.data.type);
                        sessionStorage.removeItem('out');
                        sessionStorage.setItem('company_id',res.data.data.company_id)
                        
                        store.login_type.setType(res.data.data.type);

                        if (res.data.data.type === 0) {
                            history.push('/BusinessAccount');
                        } else if (res.data.data.type === 1) {
                            history.push('/AdminAccount');
                        } else if (res.data.data.type === 2) {
                            history.push('/home');
                        } else if (res.data.data.type === 3) {
                            history.push('/ApproverAccount');
                        }

                    } else {
                        message.error(res.data.msg)
                    }
                })
            } else {
                return;
            }
        });
    }
    // 处理验证码按钮
    handelCode = () => {
        let {codeIsClicked, codeBtnText} = this.state;
        this.props.form.validateFields(['phone'],(error, value)=>{
            let second = 60;
            if(!error && codeIsClicked){
                this.setState({ codeIsClicked : false, })
                this.getLoginVertiCode(value).then(res=>{
                    if(res.status){
                        message.success('短信已发送至您的手机，请注意查收。')
                        let timer = setInterval(() => {
                            second--;
                            codeBtnText = `倒计时${second}s`;
                            this.setState({
                                codeBtnText: codeBtnText
                            })
                            if(second === 0){
                                clearInterval(timer);
                                this.setState({
                                    codeIsClicked : true,
                                    codeBtnText: '重新获取'
                                })
                                return;
                            }
                            
                        }, 1000);
                    } else {
                        message.error(res.data.msg);
                        this.setState({ codeIsClicked : true, })
                    }
                })
            } else {
                return
            }
        });
    
    }
    // 获取验证码
    getLoginVertiCode = (phone) => {
        return new Promise((resolve, reject) => {
            api.axiosPost('getLoginVertiCode', phone)
            .then((res)=>{
                if(res.data.code === 1){
                    resolve({
                        status: true,
                        data: res.data
                    })
                   
                } else {
                    resolve({
                        status: false,
                        data: res.data
                    })
                }
                
            }).catch(err => {
                reject(err)
            })
        })
    }
}
export default Form.create()(Login);