import React from "react";
import { Route, Switch ,Link} from 'react-router-dom';
import {Button,Modal,Input,message} from "antd";
import api from "./../../../component/api";
import {createHashHistory} from "history";
import "./index.scss";
const history = createHashHistory();
export default class EditPassModal extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            new_pwd1:"",
            new_pwd:"",
            old_pwd:""
        }
    }

    hideModal=()=>{
        this.props.isShowModal(false)
    };

    inputChange=(type,value)=>{
        this.setState({
            [type]:value
        })
    };

    modifyPassWord=()=>{
        const {new_pwd1,new_pwd,old_pwd} = this.state;
        if(new_pwd1 !== new_pwd){
            message.error("新密码输入不一致,从新输入");
            return false;
        }
        const data={
            new_pwd,
            old_pwd
        };
        api.axiosPost("modifyPassWord",data).then((res)=>{
            if(res.data.code == 1){
                message.success("修改成功,需要重新登录。3秒后自动跳转",3,()=>{
                    history.push('/');
                });
            }else{
                message.error(res.data.msg);
            }
        })
    };
    render(){
        return(
            <Modal
                className='modal modal-edit-pwd'
                visible={this.props.display}
                title="修改密码"
                okText="确定"
                cancelText='取消'
                width='610px'
                onOk={this.modifyPassWord}
                maskClosable={false}
                onCancel={this.hideModal}
                width={520}
                height={387}
            >
                <div className="edit-password-content">
                    <div>
                        <span>原密码：</span>
                        <Input onChange={(e)=>{this.inputChange("old_pwd",e.target.value)}} maxLength={8} value={this.state.old_pwd} placeholder='请输入原密码' autoComplete="off" type='password'/>
                    </div>
                    <div>
                        <span>新密码：</span>
                        <Input onChange={(e)=>{this.inputChange("new_pwd",e.target.value)}} maxLength={8} value={this.state.new_pwd} placeholder='设置6至8位登录密码' type='password'/>
                    </div>
                    <div>
                        <span>确认密码：</span>
                        <Input onChange={(e)=>{this.inputChange("new_pwd1",e.target.value)}} maxLength={8} value={this.state.new_pwd1} placeholder='请再次输入登录密码' type='password'/>
                    </div>
                </div>
            </Modal>
        )
    }

}