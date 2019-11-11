import React from "react";

import { Route, Switch ,Link} from 'react-router-dom';
import Header from "../components/header";
import Footer from '../components/footer/newFootHelp/Footer'
import WinButton from "../components/winButton/index"

import "./index.scss"

export default class businessAccount extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            name : ''
        }
    }
    render(){
        const {routes} = this.props;
        // console.log(444,routes);
        
        //console.log(222,window.location.hash.split('?')[0].slice(1));
        return(
            <div>
                <Header />
                <div className='businessAccount-box'>
                    <div className='businessAccount-container'>
                        <div className='businessAccount-header'>
                            
                            <span>我的账户</span>
                            {
                                routes && routes.map((item,index)=>(
                                    <Link className={window.location.hash.split('?')[0].slice(1) === item.path ? 'active-title' : 'default-title'} key={index} to={item.path}>{item.name} &emsp;</Link>
                                ))
                            } 
                        </div>
                        <div className='businessAccount-nav'>
                            <ul className='businessAccount-list'>
                                {/* 账户中心导航 */}
                                <li className='businessAccount-title'>
                                    {/* <i className="iconfont iconzhanghuzhongxin"/><span>账户中心</span> */}
                                    <div className='approve-center-nav'>
                                        <img src={require('./../image/zhanghuzhongxin.png')} alt='' style={{margin:'1px 8px 0px 19px'}}/>
                                        <div>账户中心</div>
                                    </div>
                                </li>
                                
                                <li className='businessAccount-sub-list'>
                                    <Link className={window.location.hash.slice(1) === "/BusinessAccount"  ? 'active-link' : 'default-link'}  to="/BusinessAccount">个人中心 &emsp;</Link>
                                </li>
                                <li className='businessAccount-sub-list'>
                                    <Link className={window.location.hash.slice(1) === "/BusinessAccount/BusSecuritySet"  ? 'active-link' : 'default-link'}  to="/BusinessAccount/BusSecuritySet">安全设置 &emsp;</Link>
                                </li>
                                {/* 管理中心导航 */}
                                <li className='businessAccount-title businessAccount-about'>
                                    {/* <i className="iconfont iconmanage"/><span>管理中心</span> */}
                                    <div className='approve-center-nav'>
                                        <img src={require('./../image/guanlizhongxin.png')} alt='' style={{margin:'1px 8px 0px 19px'}}/>
                                        <div>管理中心</div>
                                    </div>
                                </li>
                                {
                                    routes && routes.map((item,index)=>{
                                        if(item.meta === '管理中心')
                                        return(
                                            <li>
                                                <Link className={window.location.hash.slice(1) === item.path ? 'active-link' : 'default-link'} key={index} to={item.path}>{item.name} &emsp;</Link>
                                            </li>
                                        )
                                    })
                                } 
                                {/* 统计中心导航 */}
                                <li className='businessAccount-title businessAccount-about'>
                                    {/* <i className="iconfont icontongji"/><span>统计中心</span> */}
                                    <div className='approve-center-nav'>
                                        <img src={require('./../image/tongjizhongxin.png')} alt='' style={{margin:'0px 8px 0px 19px',height:'18px'}}/>
                                        <div>统计中心</div>
                                    </div>
                                </li>
                                {
                                    routes && routes.map((item,index)=>{
                                        if(item.meta === '统计中心')
                                        return(
                                            <li>
                                                <Link className={window.location.hash.slice(1) === item.path ? 'active-link' : 'default-link'} key={index} to={item.path}>{item.name} &emsp;</Link>
                                            </li>
                                        )
                                    })
                                } 
                            </ul>
                        

                            <div>
                                <Switch>
                                    {
                                        routes && routes.map((item,index)=>{
                                            return(
                                                <Route key={index} path={item.path}
                                                    render={ props => (
                                                        <item.component {...props} routes={item.routes} />
                                                        
                                                    )}
                                                />
                                            )
                                        })
                                    }
                                </Switch>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer/>
                <WinButton/>
            </div>
        )
    }
    componentDidMount(){
        
    }
}