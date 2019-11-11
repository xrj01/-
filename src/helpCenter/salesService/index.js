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
                        售后服务
                    </div>
                    {/* 内容 */}
                    <div className='thatTemplate-content-box'>
                        <div className='thatTemplate-content-title'>Q：送货要多长时间？</div>
                        <div className='thatTemplate-content-character'>
                            A：目前合作的配送公司有中通，宅急送，顺丰。根据地域的不同，会在确认订单后的3-7个工作日内将货品送送到您手中。
                        </div>
                    </div>
                    <div className='thatTemplate-content-box'>
                        <div className='thatTemplate-content-title'>Q：为什么好久都没收到货？</div>
                        <div className='thatTemplate-content-character'>
                            A：企牛采的商品是交给专业靠谱的快递公司运送的，但偶尔会有些不可抗力导致运送缓慢。如果您查不到物流信息或运送出现问题，请及时与我
                            们的客服联系。（在APP、网站上点击“在线客服”，或拨打028-83368980）
                        </div>
                    </div>
                    <div className='thatTemplate-content-box'>
                        <div className='thatTemplate-content-title'>Q：想改收货地址怎么办？</div>
                        <div className='thatTemplate-content-character'>
                            A：请您直接联系客服修改，如果已经发货了，客服会帮您查询快递公司或配送员的联系方式。
                        </div>
                    </div>
                    <div className='thatTemplate-content-box'>
                        <div className='thatTemplate-content-title'>Q：需要退换货怎么办？</div>
                        <div className='thatTemplate-content-character'>
                            A：请先联系客服沟通，非质量问题退换货运费由客户承担，质量问题退换货运费请客户先垫付，之后我司会将垫付的运费返还。更多退换货规则查
                            看→ 客户退换货服务政策
                        </div>
                    </div>
                    <div className='thatTemplate-content-box'>
                        <div className='thatTemplate-content-title'>Q：为什么商品在购物车里价格变化了？</div>
                        <div className='thatTemplate-content-character'>
                            A：我们会不定时推出各种优惠活动，可能您把商品放在购物车里的那段时间，商品因为活动有调价。如果想查看最新的优惠，请关注活动版块哦。
                        </div>
                    </div>
                  <WinButton/>
                </div>
            </div>
        )
    }
}