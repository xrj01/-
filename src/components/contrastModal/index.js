import React from "react";
import {observer,inject} from "mobx-react";
import {Icon,Button} from "antd";
import {Link} from "react-router-dom";
import api from "./../../component/api";
import "./index.scss";
import prompt from "../../component/prompt";
@inject("store")
@observer
class ContrastModal extends React.PureComponent{
    constructor(props) {
        super(props);
        this.state={
            modalDom:null,
        }
    }
    componentDidMount() {
        const {store} = this.props;
        //获取对比数据
        store.contrast.saveindexedDB([],"get")
    };

    //点击对比
    onContrast=()=>{
        const {store} = this.props;
        store.contrast.addPriceRecord();
    };
    render(){
        const {store} = this.props;
        const contrastList = store.contrast.contrast;
        const loading = store.contrast.loadingButton;
        return(
            <div className='contrast-modal-box' style={{right: `${store.contrast.domPosition}px`}}>
                <div className="contrast-modal-title">
                    <p>比价框({contrastList.length}/5)</p>
                    <Icon type="close-circle" onClick={()=>{store.contrast.isShowContrastDom(false)}}/>
                </div>
                <ul>
                    {
                        store.contrast.contrast && store.contrast.contrast.map((item,index)=>{
                            return(
                                <li key={index}>
                                    <Icon type="minus-circle" onClick={()=>{store.contrast.removeContrast(item)}}/>
                                    {
                                        item.type == "jd" ? <img src={item.pic} alt=""/> :
                                            <img src={prompt.imgUrl(item.merchant_id,item.id,50)} alt=""/>
                                    }
                                    <div className="contrast-goods-introduce">
                                        <p title={item.skuVal}>
                                            <Link to={item.type == "jd" ? `/JDgoodsDetails?${item.id}` : `/GoodsDetails?${item.id}`}>
                                                {
                                                    item.title && item.title.length > 28 ? item.title.substring(0,28)+"..." : item.title
                                                }
                                            </Link>

                                        </p>
                                        {/*<p title={item.title}>{item.title}</p>*/}
                                        {/*<p><span>￥{item.price}</span></p>*/} {/*←  打开就有价格*/}
                                    </div>
                                </li>
                            )
                        })
                    }
                </ul>
                <div className="contrast-modal-footer">
                    <Button type="primary" loading={loading} onClick={this.onContrast}>对比</Button>
                    <Button onClick={()=>{store.contrast.deleteContrast()}}>清空对比栏</Button>
                </div>
            </div>
        )
    }
}
export default ContrastModal;