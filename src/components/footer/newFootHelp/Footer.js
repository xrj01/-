import React from "react";
import {Link} from "react-router-dom";
import "./Footer.scss"
import serve from  "../../../image/footer/serve.png"
import wrench from  "../../../image/footer/wrench.png"
import good from  "../../../image/footer/good.png"
import wechat from  "../../../image/footer/wechat.png"
import code from "../../../image/footer/code.jpg"
export default class HelpCenterFooter extends React.PureComponent{
    constructor(props){
        super(props);
        this.state={
        }
    }

    render(){
        return(
            <div className="footer-box_help">
                <div className="footer-box_up">
                    <div >
                        <div className="img_box">
                            <img src={serve} alt=""/>
                        </div>
                        <p>30年服务保证</p>
                    </div>
                    <div>
                        <div className="img_box">
                            <img src={wrench} alt=""/>
                        </div>
                        <p>领先制造工艺</p>
                    </div>
                    <div>
                        <div className="img_box">
                            <img src={good} alt=""/>
                        </div>
                        <p>企牛采品牌信誉</p>
                    </div>
                </div>
                <div className="footer-box_down">
                    <div className="foot_box_img">
                        <div className="footer-box_down_box">
                            <div className="footer-box_down_up clear">
                                <ul>
                                    <li><Link to="/CommonProblems/AboutUs">关于我们</Link></li>
                                    <li><Link to="/HelpCenter">帮助中心</Link></li>
                                    <li><Link to="/CommonProblems/SalesService">售后服务</Link></li>
                                    <li><Link to="/CommonProblems/DeliveryAcceptance">配送与验收</Link></li>
                                    <li><Link to="/CommonProblems/BusinessCooperation">商务合作</Link></li>
                                </ul>
                                <p>服务热线</p>
                                <p>关注微信公众号</p>
                                <img src={wechat} alt=""/>
                            </div>
                            <div className="footer-box_down_down clear">
                                <div>
                                    <p>
                                        铁路专用器具采购平台100% 品质保证，超低折扣，品类齐全，正品行货，全国联保，全球领先的工业品商城。超过
                                        100万种商品在线热销!<br/>CopyRight © 企牛采 2016 - 2019 版权所有 蜀 ICP 16032302 号 -1<br/>
                                        增值电信业务经营许可证：川 B2-20170405 站长统计<br/>
                                        地址：四川省成都市天府新区天府三街 218 号峰汇中心
                                    </p>
                                </div>
                                <div className="footer-box_time">
                                    <p>028-83368980</p>
                                    <p>服务时间：周一至周五</p>
                                    <p>(法定节假日除外)9:00-18:00</p>
                                </div>
                                <img src={code} alt=""/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}