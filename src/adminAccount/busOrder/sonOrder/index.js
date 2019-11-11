import React from "react";
import { Popover,Steps} from "antd";
import { Link } from "react-router-dom";
import "./index.scss";

export default class parentOrder extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            current: 0,
        }
    }
    
    render(){
        // 步骤条
        const { Step } = Steps;
        const steps = [
            {
                title: (<div className='parentOrder-steps-title'>提交订单</div>),
                description:(<div className='parentOrder-steps-activeTitle'>
                                <div>2017-08-19</div>
                                <div>15:03:26</div>
                            </div>),
                icon : (<img src={require('./../../../image/subOrder.png')} alt=''/>),
                iconActive : (<img src={require('./../../../image/subOrderAct.png')} alt=''/>)
            },
            {
                title: (<div className='parentOrder-steps-title'>提交审批</div>),
                description:(<div className='parentOrder-steps-activeTitle'>
                                <div>2017-08-19</div>
                                <div>15:03:26</div>
                            </div>),
                icon : (<img src={require('./../../../image/subApp.png')} alt=''/>),
                iconActive : (<img src={require('./../../../image/subAppAct.png')} alt=''/>)
            },
            {
                title: (<div className='parentOrder-steps-title'>付款成功</div>),
                description:(<div className='parentOrder-steps-activeTitle'>
                                <div>2017-08-19</div>
                                <div>15:03:26</div>
                            </div>),
                icon : (<img src={require('./../../../image/payment.png')} alt=''/>),
                iconActive : (<img src={require('./../../../image/paymentAct.png')} alt=''/>)
            },
            {
                title: (<div className='parentOrder-steps-title'>商品出库</div>),
                description:(<div className='parentOrder-steps-activeTitle'>
                                <div>2017-08-19</div>
                                <div>15:03:26</div>
                            </div>),
                icon : (<img src={require('./../../../image/outbound.png')} alt=''/>),
                iconActive : (<img src={require('./../../../image/outboundAct.png')} alt=''/>)
            },
            {
                title: (<div className='parentOrder-steps-title'>收货</div>),
                description:(<div className='parentOrder-steps-activeTitle'>
                                <div>2017-08-19</div>
                                <div>15:03:26</div>
                            </div>),
                icon : (<img src={require('./../../../image/takeGood.png')} alt=''/>),
                iconActive : (<img src={require('./../../../image/takeGoodAct.png')} alt=''/>)
            },
            {
                title: (<div className='parentOrder-steps-title'>交易完成</div>),
                description:(<div className='parentOrder-steps-activeTitle'>
                                <div>2017-08-19</div>
                                <div>15:03:26</div>
                            </div>),
                icon : (<img src={require('./../../../image/complete.png')} alt=''/>),
                iconActive : (<img src={require('./../../../image/completeAct.png')} alt=''/>)
            },
        ];
          

        // 气泡框
        const content = (
            <div style={{fontSize:'12px',color:'#666',width:'329px'}}>
              <p>开户银行：中国民生银行股份有限公司成都荷花池池支行</p>
              <p>注册地址：中国（四川）自贸区成都高新区天府大道北段1700号9栋1单元6层627号</p>
              <p>公司电话：028-5683572</p>
              <p>收票信息：张丹   15103378434    四川成都高新区天府  三街峰会中心001  </p>
            </div>
            
                                    
        );
        const {current} = this.state
        return(
            <div className='parentOrder-box'>
                    <div className='parentOrder-container-title'>
                        <div className='mr105 parentOrder-container-title-img'>
                            <img src={require('./../../../image/toSubmit.png')} alt='' style={{width:'42px',height:'42px'}}/>
                            <div className='ft16'>待提交</div>
                        </div>
                        <div className='parentOrder-number'>
                            <div>父订单编号</div>
                            <div>62205697599</div>
                        </div>
                        <div className='parentOrder-number'>
                            <div>下单时间</div>
                            <div>2018-01-06 17:09:35</div>
                        </div>
                        <div className='parentOrder-number'>
                            <div>关联父订单</div>
                            <div>3468753654</div>
                        </div>
                    </div>
                    <div className='parentOrder-container-content pt40'>
                        {/* 步骤条 */}
                        <div>
                            <Steps current={current} labelPlacement='vertical' className='parentOrder-container-steps'>
                                {steps.map(item => (
                                    <Step key={item.title} title={item.title} description={item.description} icon={item.icon}/>
                                ))}
                            </Steps>
                        </div>
                        <div className='ft14'>商品信息</div>
    
                        <div className='parentOrder-product-box'>
                            {/* 头部 */}
                            <div className='parentOrder-product-title'>
                                <div className='parentOrder-product-title-left'>
                                    <div className='ml15'>
                                        <span>下单时间：</span>
                                        <span>2018-01-08 15:02:00</span>
                                    </div>
                                    <div>
                                        <span>订单编号：</span>
                                        <span>62205697599</span>
                                    </div>
                                    <div>
                                        <span>供应商名称：</span>
                                        <span>刘伊特科技有限公司</span>
                                    </div>
                                </div>
                                <div className='parentOrder-product-title-right'>待提交</div>
                            </div>
                            {/* 内容 */}
                            <div className='parentOrder-product-content'>
                                <div className='parentOrder-product-content-details'>
                                    <div>
                                        <div className='parentOrder-product-content-img'></div>
                                    </div>
                                    <div>
                                        <div className='ft12 color66 mr14'>
                                            奥斯玛发电机家用3千瓦小型汽油单相220v3kw低音3000w 手启动汽油款
                                        </div>
                                        <div className='ft12 color89 mt15'>
                                            <span className='mr20'>商品编码：Z0043N</span>
                                            <span>颜色：黑色</span>
                                        </div>
                                        <div className='ft12 color89'>型号：1235446RT</div>
                                    </div>
                                </div>
                                <div className='width188'>￥55.00</div>
                                <div className='width188'>10/只</div>
                                <div className='width188'>
                                    <div>￥550.00</div>
                                    <div>(含运费：￥0.00)</div>
                                </div>
                            </div>
                            {/* 尾部 */}
                            <div className='parentOrder-product-footer'>
                                <span>备注：</span>
                                <span>请优先配送</span>
                            </div>
                        </div>

                        <div className='parentOrder-container-info'>
                            <div className='parentOrder-info-consignee'>
                                <div className='ft14 mb20'>收货信息</div>
                                <p>收 货 人 : 辛满意</p>
                                <p>联系方式 : 180****1849</p>
                                <p>收货地址 : 广东深圳市罗湖区清水河街道泥岗东路</p>
                            </div>
                            <div className='parentOrder-info-consignee'>
                                <div className='ft14 mb20'>支付方式</div>
                                <p>支付方式：账期支付</p>
                            </div>
                            <div className='parentOrder-info-invoice'>
                                <div className='ft14 mb20'>发票信息</div>
                                <p>发票类型：增值税专票</p>
                                <p>企业名称：四川昂牛工铁贸科技有限公司</p>
                                <p>对公账户：4563785348</p>
                                <p>纳税人识别号：91510100MA62L13X6F</p>
                                <Popover placement="bottomLeft" content={content} trigger="click">
                                    <p className='blue'>更多</p>
                                </Popover>
                            </div>
                        </div>

                        <div className='parentOrder-container-payment'>
                            <div>
                                商品件数：<span>4件</span>
                            </div>
                            <div>
                                商品总价：<span>￥1245.00</span>
                            </div>
                            <div>
                                运费：
                                <span>￥0.00</span>
                            </div>
                            <div>
                                应付总额：
                                <span className='ft18'>￥1245.00</span>
                            </div>
                            
                        </div>
                    </div>

                   
                    
                                     
                        
                        
             
            </div>
        )
    }
    

     
                            
}