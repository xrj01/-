import React from "react";
import "./index.scss";
import WinButton from "../../components/winButton/index"

export default class Invoicefaqs extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            list:[  
                {title:"1. 发票的类型有哪些？",content:"目前可以开具电子增值税普通发票(简称“电子发票”)、纸质增值税普通发票(简称“纸质发票”)、以及增值税专用发票(简称“专用发票”)。"},
                {title:"2. 发票内容可以开什么？",content:"订单中含有办公用品（箱包、文具、口罩），可选开票内容：办公用品等、耗材等、日用品、家居用品、食品、酒/饮料、服饰、化妆品； 不含有办公用品，可选开票内容：日用品、家居用品、食品、酒/饮料、服饰、化妆品；礼品卡开票内容：预付卡。"},
                {title:"3. 发票的金额包含运费或活动金额吗？",content:"发票总金额等于您实际支付的消费金额（含运费），不包括未实际支出的折扣的金额和使用礼品卡支付的金额。"},
                {title:"4. 为什么我的订单不支持开发票？",content:"当您的订单金额为0元或者该订单完全使用礼品卡支付的时候；或特殊渠道下单时不支持开发票。"},
                {title:"5. 为什么使用礼品卡支付时不支持开发票？",content:"在购买礼品卡时已支持开具发票，因此在使用礼品卡消费时，不再支持重复开票。"},
                {title:"6. 什么是电子发票？",content:`电子发票是指在购销商品、提供或者接受服务以及从事其他经营活动中，开具、收取的以电子方式存储的收付款凭证。严选开具的电子发票均为真实有效
                    的合法发票，与传统纸质发票具有同等法律效力。电子发票可以用于财务报销、保修和维权。根据国家税务总局公告2015年84号《关于推行通过增值税电子发票系统开具的增值税电子普通发
                    票有关问题的公告》第三条：增值税电子普通发票的开票方和受票方需要纸质发票的，可以自行打印增值税电子普通发票的版式文件，其法律效力、基本用途、基本使用规定等与税务
                    机关监制的增值税普通发票相同。`},
                {title:"7. 电子发票什么时候开具？",content:"电子发票将会在订单下所有包裹确认收货后开具。"},
                {title:"8. 电子发票在哪里下载？",content:"您可在电脑网页版的网易严选“个人中心——订单详情”中进行下载。"},
                {title:"9. 电子发票如何在网上查验？",content:"可在浙江省国家税务局发票查验系统查询，网址为：http://www.zjtax.gov.cn/fpcx/include2/wlfpcybd_lscx.jsp"},
                {title:"10. 如果申请退换货，发票如何处理？",content:"您在申请退货后，已经开具的发票将会作废。如您还需要对其他商品开发票，可联系客服处理。"},
                {title:"11. 纸质增值税普通发票和增值税专用发票怎么开？",content:"如您需要开具增值税专用发票，请在购买后联系客服帮忙处理。"},
            ]
        }
    }

    render(){
        return(
            <div className='thatTemplate-box'>
                <div className='thatTemplate-container'>
                    <div className='thatTemplate-title'>
                        发票常见问题
                    </div>
                    {this.state.list.map((item,index)=>(
                        <div className='thatTemplate-content-box'>
                            <div className='thatTemplate-content-title'>{item.title}</div>
                            <div className='thatTemplate-content-character'>{item.content}</div>
                        </div>
                        
                    ))}
                </div>
               <WinButton/>
            </div>
        )
    }
}