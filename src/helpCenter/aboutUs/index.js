import React from "react";
import "./index.scss";
import WinButton from "../../components/winButton/index"
export default class ThatTemplate extends React.Component{
    constructor(props) {
        super(props);
        this.state={
        }
    }

    render(){
        return(
            <div className='thatTemplate-box'>
                <div className='thatTemplate-container'>
                    <div className='thatTemplate-title'>
                        关于我们
                    </div>
                    {/* 内容 */}
                    <div className='thatTemplate-content-box'>
                        <div className='thatTemplate-content-character'>
                            昂牛工铁贸科技有限公司创立于2016年,旗下包含昂牛铁道商城（www.tdsc360.com）和跨境电商平台(www.goforrail.com)及国内外线下永久体
                            验馆三个业务版块。昂牛集团是专业做铁路物资、工程物资及MRO工业品的B2B、V2V全球电商交易平台。分别为客户供应铁道物资装备、工程
                            物资装备、电力/市政工程物资、小批量零星采购（低值易耗品）、工程非安装设备物资、智能通信信号、强弱四电工程物资、机电设备及配件、
                            电工电料、数码电子类综合、家电产品、酒店用品、劳保用品、办公用品的物资采购。
                        </div>
                    </div>
                    <div className='thatTemplate-content-box'>
                        <div className='thatTemplate-content-character'>
                            昂牛集团全球电商交易平台是线上与线下的有机结合，设线下永久体验馆（永不落幕的国际会展中心），在国内18个省会设立物流配送中心基地，
                            满足全国铁路局集团公司和26个中铁工程局等物资供应配送。我们紧跟“一带一路”和“高铁出海”政策，布局海外市场战略。
                        </div>
                    </div>
                    <div className='thatTemplate-content-box'>
                        <div className='thatTemplate-content-character'>
                            战略布局：我们联合“海外铁路运营公司”共同设立“物资供应公司或物资供应总段”，为海外“铁路公司运维物资”和“工程施工物资”提供
                            采购保障，并提供现货存储仓库和办事处采销机构。
                        </div>
                    </div>
                    <div className='thatTemplate-content-box'>
                        <div className='thatTemplate-content-character'>
                            解决方案：昂牛铁道商城+跨境电商平台+永久线下体验馆+自贸区库存+海外仓配送+售后服务+购物体验+线上线下支付+供应链金融+全球定制。
                        </div>
                    </div>
                    <WinButton/>
                </div>
            </div>
        )
    }
}