import React from "react";
import "./index.scss";
export default class Footer extends React.PureComponent{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className='pt_footer-box'>
                <div className="footer-box clear">
                    <p>铁路商城：铁路专用器具采购平台_100%品质保证，超低折扣，品类齐全，正品行货行货，全国联保。</p>
                    <div>
                        <p><span>全球领先的铁路专业用品网上购物中心。超过100万种商品在线热销! Powered by tdsc360.com</span>
                            <span>Copyright © 蜀ICP备16032302号-1</span>
                        </p>
                    </div>

                    <p>投诉与建议： <a target='_blank' href="http://contact@tdsc360.com">contact@tdsc360.com</a> &emsp;
                        技术支持： <a target='_blank' href="http://admin@tdsc360.com">admin@tdsc360.com</a> &emsp;
                    </p>
                </div>
            </div>
        )
    }
}