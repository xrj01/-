import React from "react";
import {Link} from "react-router-dom";
import Header from "./../components/header";
import HelpCenterFooter from './../components/footer/helpCenterFooter'
import Footer from './../components/footer/newFootHelp/Footer'
import hellpBannerImg from '../image/help/helpBanner.jpg'
import help from '../image/help/help.png'
import TEL from '../image/help/24hTel.png'
import WinButton from "../components/winButton/index"
import "./index.scss";


export default class HelpCenter extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            list:[
                    [
                        {name:'购物常见问题',path:'/CommonProblems/ThatTemplate'},
                        {name:'发票常见问题',path:'/CommonProblems/Invoicefaqs'},
                    ],
                    [
                        {name:'售后服务',path:'/CommonProblems/SalesService'},
                        {name:'企牛采客户介绍',path:'/CommonProblems/ClientIntroduce'},

                    ],
                    [
                        {name:'商务合作',path:'/CommonProblems/BusinessCooperation'},
                        {name:'配送与验收',path:'/CommonProblems/DeliveryAcceptance'},
                    ],
                    [
                        {name:'关于我们',path:'/CommonProblems/AboutUs'},
                    ],
            ]
        }
    }

    render(){
        return(
            <div className='helpCenter-box'>
                <Header />
                {/* 帮助中心 */}
                <div className='helpCenter-container'>
                    {
                        sessionStorage.getItem('type') == '2' ?
                        <div className='helpCenter-header'>
                            <Link to="/home">首页 > </Link>
                            <Link to="/HelpCenter" className='color-red'>帮助中心</Link>
                        </div>
                        :
                        <div className='helpCenter-header'></div>
                    }
                    
                    {/* banner */}
                    <div className='helpCenter-banner'>
                        <img src={hellpBannerImg} alt=""/>
                    </div>
                    {/* 常见问题 */}
                    <div className='helpCenter-faq'>
                        <div className='helpCenter-faq-header'>
                            常见问题
                        </div>
                        <div className='helpCenter-faq-list'>
                            {
                                this.state.list.map((items,index)=>(
                                    <ul key={index} className='helpCenter-faq-ul'>
                                        {items.map((item,index)=>(
                                            <li key={index} className='helpCenter-faq-li'>
                                                <i className='helpCenter-faq-li-icon'>•</i>
                                                <Link className="link" to={item.path}>{item.name}</Link>
                                            </li>
                                        ))}
                                    </ul>
                                ))
                            }
                        </div>
                    </div>
                    {/* 联系客服 */}
                    <div className='helpCenter-contact-service'>
                        <div className='helpCenter-contact-header'>
                            联系客服
                        </div>
                        <div className='helpCenter-contact-box'>
                            <div className='helpCenter-contact-box-left'>
                                <div className='helpCenter-contact-margin'>
                                    <div className='helpCenter-contact-box-img'><img src={TEL} alt=""/></div>
                                    <div className='helpCenter-contact-box-ft'>
                                        <p className='helpCenter-contact-ft30'>7×24在线聊天</p>
                                        <p className='helpCenter-contact-ft18'>专业客服在线对话，为您解决遇到的问题</p>
                                    </div>
                                </div>
                            </div>
                            <div className='helpCenter-contact-box-right'>
                                <div className='helpCenter-contact-marginlf'>
                                    <div className='helpCenter-contact-box-img'><img src={help} alt=""/></div>
                                    <div className='helpCenter-contact-ft'>
                                        <p className='helpCenter-contact-ft30'>商城服务热线</p>
                                        <p className='helpCenter-contact-ft24'>028-83368980</p>
                                        <p className='helpCenter-contact-ft18'>周一至周五 9:00-18:00</p>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
                <Footer/>
                {/*<HelpCenterFooter />*/}
                <WinButton/>
            </div>
        )
    }
}