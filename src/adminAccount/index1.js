import React from "react";

import { Route, Switch ,Link} from 'react-router-dom';
import Header from "../components/header";
import Footer from '../components/footer/newFootHelp/Footer'
import WinButton from "../components/winButton/index"

import "./index.scss"

export default class businessAccount extends React.Component{
    constructor(props) {
        super(props);
    }

    render(){
        const {routes} = this.props;
 
        //console.log(222,window.location.hash.split('?')[0].slice(1));
        return(
            <div>
                <Header />
                <div className='businessAccount-box'>
                    <div className='businessAccount-container'>
                        <div className='businessAccount-header'>
                            {/* <Link to="/Home" className='color-d6'>首页 > </Link> */}
                            <span className='color-d6'>我的账户 ></span>
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
                                    <div className='approve-center-nav'>
                                        <img src={require('./../image/img_wdzh.png')} alt='' style={{marginLeft:'20px',marginRight:'12px'}}/>
                                        <div>我的账户</div>
                                    </div>
                                </li>
                                {/* {
                                    routes && routes.map((item,index)=>{
                                        if(item.meta === '账户中心')
                                        return(
                                            <li className='businessAccount-sub-list'>
                                                <Link className={window.location.hash.slice(1) === item.path  ? 'active-link' : 'default-link'} key={index} to={item.path}>{item.name} &emsp;</Link>
                                            </li>
                                        )
                                    })
                                }  */}
                                <li className='businessAccount-sub-list'>
                                    <Link className={window.location.hash.slice(1) === "/AdminAccount"  ? 'active-link' : 'default-link'}  to="/AdminAccount">个人中心 &emsp;</Link>
                                </li>
                                <li className='businessAccount-sub-list'>
                                    <Link className={window.location.hash.slice(1) === "/AdminAccount/AdminBusSecuritySet"  ? 'active-link' : 'default-link'}  to="/AdminAccount/AdminBusSecuritySet">安全设置 &emsp;</Link>
                                </li>
                                {/* 管理中心导航 */}
                                <li className='businessAccount-title businessAccount-about'>
                                    <div className='approve-center-nav'>
                                        <img src={require('./../image/img_zhzx.png')} alt='' style={{marginLeft:'19px',marginRight:'8px'}}/>
                                        <div>账号中心</div>
                                    </div>
                                </li>
                                {
                                    routes && routes.map((item,index)=>{
                                        if(item.meta === '账号中心')
                                        return(
                                            <li>
                                                <Link className={window.location.hash.slice(1) === item.path ? 'active-link' : 'default-link'} key={index} to={item.path}>{item.name} &emsp;</Link>
                                            </li>
                                        )
                                    })
                                } 
                                {/* 统计中心导航 */}
                               {/*  <li className='businessAccount-title businessAccount-about'>
                                    <i className="iconfont icontongji"/><span>统计中心</span>
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
                                }  */}
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
}