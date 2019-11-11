import React from "react";
import "./index.scss";
import { Route, Switch ,Link} from 'react-router-dom';
import Header from "./../../components/header";
import HelpCenterFooter from "./../../components/footer/helpCenterFooter";
import "./index.scss"
import Footer from './../../components/footer/newFootHelp/Footer'
import WinButton from "../../components/winButton/index"
export default class Address extends React.Component{
    constructor(props) {
        super(props);
    }

    render(){
        const {routes} = this.props;
        
        return(
            <div className='commonProblems-box'>
                <Header />
                <div className='commonProblems-container'>
                    <div className='commonProblems-header'>
                        {
                            sessionStorage.getItem('type') == '2' ? <Link to="/Home" className='color-d6'>首页 > </Link> :''
                        }
                        
                        <Link to="/HelpCenter" className='color-d6'>帮助中心 > </Link>
                        {/* <Link to="/" className='color-red'>购物常见问题</Link> */}
                        {
                            routes && routes.map((item,index)=>(
                                <Link className={window.location.hash.slice(1) === item.path ? 'active-title' : 'default-title'} key={index} to={item.path}>{item.name} &emsp;</Link>
                            ))
                        } 
                    </div>
                    {/* 常见问题导航 */}
                    <div className='commonProblems-nav'>
                        <ul className='commonProblems-list help-center'>
                            <li className='commonProblems-title'>
                                {/*<i className='iconfont icon-dingdan commonProblems-img'></i>*/}
                                <i className="iconfont iconchangjianwenti"/><span>常见问题</span>
                            </li>
                            {
                                routes && routes.map((item,index)=>{
                                    if(item.meta === '常见问题')
                                    return(
                                        <li className='commonProblems-sub-list'>
                                            <Link className={window.location.hash.slice(1) === item.path ? 'active-link' : 'default-link'} key={index} to={item.path}>{item.name} &emsp;</Link>
                                        </li>
                                    )
                                })
                            } 
                            <li className='commonProblems-title commonProblems-about'>
                                {/*<i className='iconfont icon-919caidan_xiuli commonProblems-img'></i>*/}
                                <i className="iconfont iconguanyuwomen"/><span>关于我们</span>
                            </li>
                            {
                                routes && routes.map((item,index)=>{
                                    if(item.meta === '关于我们')
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
                <Footer/>
                <WinButton/>
            </div>
        )
    }
}