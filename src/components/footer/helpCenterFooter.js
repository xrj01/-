import React from "react";
import {Link} from "react-router-dom";
import "./helpCenterFooter.scss"
export default class HelpCenterFooter extends React.PureComponent{
    constructor(props){
        super(props);
        this.state={
        }
    }

    render(){
        return(
            <div className='helpCenterFooter-box'>
                {/* 页脚导航 */}
                <div className='helpCenterFooter-top'>
                    <div className='helpCenterFooter-container'>
                        <div className='helpCenterFooter-container-box'>
                            <div className='helpCenterFooter-img'></div>
                            <div className='helpCenterFooter-ft20'>
                                30年服务保证
                            </div>
                        </div>
                        <div className='helpCenterFooter-container-box'>
                            <div className='helpCenterFooter-img'></div>
                            <div className='helpCenterFooter-ft20'>
                                领先制造工艺 
                            </div>
                        </div>
                        <div className='helpCenterFooter-container-box'>
                            <div className='helpCenterFooter-img'></div>
                            <div className='helpCenterFooter-ft20'>
                                企牛采品牌信誉
                            </div>
                        </div>
                    </div>
                </div>
                {/* 页脚内容 */}
                <div className='helpCenterFooter-content'>
                    <div className='helpCenterFooter-content-container'>
                        <div className='helpCenterFooter-content-left'>
                            <ul className='helpCenterFooter-content-list'>
                                <li><Link to="/" className='border-none'>隐私声明</Link></li>
                                <li><Link to="/">使用协议</Link></li>
                                <li><Link to="/">联系方式</Link></li>
                                <li><Link to="/">企业文化</Link></li>
                                <li><Link to="/">关于我们</Link></li>
                            </ul>
                            <p>昂牛商城：铁路专用器具采购平台_100%品质保证，超低折扣，品类齐全，正品行货，全国联保。       全球领先的工业品商城。超过100万种商品在线热销!</p>
                            <p>Copyright © 2019 TDSC360.COM 版权所有 蜀ICP备16032302号-1</p>
                            <p>增值电信业务经营许可证：川B2-20170405 站长统计</p>
                            <p>投诉与建议： contact@tdsc360.com 技术支持： admin@tdsc360.com</p>
                        </div>
                        <div>
                            <div className='helpCenterFooter-content-img'></div>
                            <p className='mt13'>扫描关注微信公众号</p>
                        </div>
                        <div>
                            <div className='helpCenterFooter-content-img'></div>
                            <p className='mt13'>扫描下载昂牛APP</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}