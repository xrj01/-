import React from "react";
import {Link} from 'react-router-dom';
import './index.scss'
export default class Registered extends React.Component{
    constructor(props) {
        super(props);
    }

    render(){
        return(
            <div className='reg-box'>
                
                <div className='reg-box-title'>
                    <div className='reg-title-container'>
                        <img src={require('./../image/NEW_LOGO.png')} alt=''/>
                        <div className='reg-title-right'>
                            已有账号，<Link to='/'>立即登录</Link>
                        </div>
                    </div>
                </div>
                <div className='reg-content'>
                    <div>新用户注册</div>
                    <div className='reg-content-box'>
                        申请企业账号需联系企牛采官方。<span>客服热线：<span className='ftw'>028-83368980</span></span>
                    </div>
                    <div className='reg-content-footer'>
                        <ul>
                            <li><Link to="/CommonProblems/AboutUs" onClick={this.setOutGoing}>关于我们</Link></li>
                            <li><Link to="/HelpCenter" onClick={this.setOutGoing}>帮助中心</Link></li>
                            <li><Link to="/CommonProblems/SalesService" onClick={this.setOutGoing}>售后服务</Link></li>
                            <li><Link to="/CommonProblems/DeliveryAcceptance" onClick={this.setOutGoing}>配送与验收</Link></li>
                            <li><Link to="/CommonProblems/BusinessCooperation" onClick={this.setOutGoing}>商务合作</Link></li>
                        </ul>
                        <div>CopyRight @ 企牛采 2015 - 2019</div>
                    </div>
                </div>
               
            </div>
        )
    }
    setOutGoing = () => {
        if(!sessionStorage.getItem('out')){
            sessionStorage.setItem('out', true)
        }
    }

}