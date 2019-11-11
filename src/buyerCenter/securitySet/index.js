import React from "react";
import { Route, Switch ,Link} from 'react-router-dom';
import {Button} from "antd";
import EditModal from "./editPassword";
import "./index.scss";
export default class SecuritySet extends React.PureComponent{
    constructor(props) {
        super(props);
        this.state={
            modalDisplay:false,
            userName:""
        }
    }
    componentDidMount() {
        const userName = sessionStorage.getItem("user_name");
        this.setState({userName})
    };

    //隐藏显示弹出层
    isShowModal=(isBlock)=>{
        this.setState({
            modalDisplay:isBlock
        })
    };
    render(){
        const {modalDisplay,userName} = this.state;
        const modalDate={
            display:modalDisplay,
            isShowModal:this.isShowModal
        };
        return(
            <div className='user-security-box'>
                <div className="user-security-head">
                    <p>您当前账户 <span>{userName}</span></p>
                </div>
                <div className="user-security-set-box">
                    <div className="user-security-img">
                        <span> </span>
                        登录密码
                    </div>
                    <p>建议您定期更换密码，设置安全性高的密码可以使账户更安全</p>
                    <Button type='primary' onClick={()=>{this.isShowModal(true)}}>修改</Button>
                </div>

                <div className="user-security-set-title">
                    <div className="user-security-set-head">
                        安全服务提示
                    </div>
                    <div className="user-security-set-title-content">
                        <p>
                            • 确认您登录的是企牛采网址，注意防范进入钓鱼网站，不要轻信各种即时通讯工具发送的商品或支付链接，谨防网购诈骗
                        </p>
                        <p>
                            • 建议您安装杀毒软件，并定期更新操作系统等软件补丁，确保账户及交易安全
                        </p>
                    </div>
                </div>

                <EditModal {...modalDate}/>
            </div>
        )
    }

}