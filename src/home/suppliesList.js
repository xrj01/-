import React from "react";
import Li from "./componentLi";
import "./suppliesList.scss";
import ContrastModal from "../components/contrastModal";
import {Link, Route} from 'react-router-dom';
import Prompt from "../component/prompt";
import img1 from "./../image/class1.png";
import img2 from "./../image/class2.png";
import img3 from "./../image/class3.png";
import img4 from "./../image/class4.png";
import img5 from "./../image/class5.png";
import img6 from "./../image/class6.png";
import img7 from "./../image/class7.png";
import img8 from "./../image/class8.png";
export default class SuppliesList extends React.PureComponent{
    constructor(props) {
        super(props);
        const url = window.location.host;
        this.state={
            homeGood:[],
            url:url,
            listColorObj:{
                11:{
                    h6:"安全用电",
                    h5:"完美品质，安全保证",
                    color:"#E7E7E7",
                    img:img1
                },
                12:{
                    h6:"精准测量",
                    h5:"消灭丝毫误差",
                    color:"#E1F1FE",
                    img:img2
                },
                13:{
                    h6:"工品大全",
                    h5:"成熟工艺，打造精品",
                    color:"#dcf7fe",
                    img:img3
                },
                14:{
                    h6:"稳定起重",
                    h5:"强力坚韧，持久耐用",
                    color:"#ffedeb",
                    img:img4
                },
                15:{
                    h6:"精工细琢",
                    h5:"千锤百炼，势不可挡",
                    color:"#E7E7E7",
                    img:img5
                },
                16:{
                    h6:"精益求精",
                    h5:"仪态万千，表率天下",
                    color:"#d7f0dc",
                    img:img6
                },
                17:{
                    h6:"关闭数据",
                    h5:"测试使用",
                    color:"#E7E7E7",
                    img:img6
                },
                18:{
                    h6:"关闭数据",
                    h5:"测试使用",
                    color:"#E7E7E7",
                    img:img6
                },
                19:{
                    h6:"关闭数据",
                    h5:"测试使用",
                    color:"#E7E7E7",
                    img:img6
                },
                670:{
                    h6:"品质之选",
                    h5:"精而不简，成就非凡",
                    color:"#dcf7fe",
                    img:img8
                },
                14065:{
                    h6:"精工打造",
                    h5:"贸易工控，卓越品质",
                    color:"#ffede2",
                    img:img7
                }
            }
        }
    }

    //分类点击跳转页面
    levelClassClick=(class_id,class_name)=>{
        const {url} = this.state;
        const classInformation={ class_id, class_name };
        Prompt.setSession("classInformation",JSON.stringify(classInformation));
        window.open(`http://${url}/#/classList?v=${Math.random()*10000}`, '_blank');
    };
    //分类点击跳转京东页面
    levelClassClickJD=(class_id,class_name, e,class_level)=>{
        e.preventDefault();
        const {url} = this.state;
        const classInformation={ class_id, class_name ,class_level};
        Prompt.setSession("classInformation",JSON.stringify(classInformation));
        window.open(`http://${url}/#/ClassJDList?v=${Math.random()*10000}`, '_blank');
    };
    render(){
        const {productList,suppliesNavList,listIndex,imgKey,type} = this.props;
        const {listColorObj} = this.state;
        return(
            <div className='supplies-box'>
                <div className="supplies-title">
                    <div className="supplies-name">
                        {this.props.titleName}
                    </div>
                    <div className="supplies-nav-list">
                        {
                            suppliesNavList && suppliesNavList.map((item)=>{
                                return(
                                    <a key={item.id} onClick={(e)=>{
                                        if(type == "jd"){
                                            this.levelClassClickJD(item.id,item.name,e,2)
                                        }else{
                                            this.levelClassClick(item.id,item.name)
                                        }
                                    }}>
                                        {item.name}
                                    </a>
                                )
                            })
                        }
                    </div>
                </div>

                <div className="supplies-list-box">
                    <div className="supplies-summary"
                         style={{background:listColorObj[imgKey].color }}
                    >
                        <div className="supplies-summary-advertising">
                            <h6>{listColorObj[imgKey].h6}</h6>
                            <h5>{listColorObj[imgKey].h5}</h5>
                        </div>
                        <div style={{height: 428}}><img src={listColorObj[imgKey].img}/></div>
                        <a onClick={(e)=>{
                                if(type != "jd"){
                                    this.levelClassClick(suppliesNavList[0] && suppliesNavList[0].id,suppliesNavList[0] && suppliesNavList[0].name)
                                }else{
                                    this.levelClassClickJD(suppliesNavList[0] && suppliesNavList[0].id,suppliesNavList[0] && suppliesNavList[0].name,e,2)
                                }
                        }}>
                            查看更多 >
                        </a>
                    </div>
                    <div className="supplies-list">
                        <ul>
                            {
                                productList && productList.map((item)=>{
                                    if(item.type == "jd"){
                                        item.price = item.anmro_price;
                                        item.merchant_id = item.product_id;
                                        item.id = item.product_id;
                                    }
                                    return (
                                        <Li key={item.id} {...item} item={item}/>
                                    )
                                })
                            }
                        </ul>
                    </div>
                </div>
            </div>
        )
    }

}