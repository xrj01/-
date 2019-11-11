import React from "react";
import "./index.scss";
import {Button,Icon} from "antd";
import prompt from "../../component/prompt";
export default class Attribute extends React.Component{
    constructor(props) {
        super(props);
        const url = window.location.host;
        this.state={
            skuActive:["__","__","__","__","__"],
            url:url,
            skuList:[false,false,false,false,false]
        }
    }

    //组合SKU
    selectAttribute=(k,j)=>{
        const {skuActive} = this.state;
        const {classId} = this.props;
        let sku = classId;
        skuActive[k] = (j == "__" ? "__" : j);
        skuActive.map((item)=>{
            let skuIndex = "__";
            if(item !== "__"){
                skuIndex = prompt.addZero(item + 1 )
            }
            sku = sku + skuIndex
        });
        this.setState({ skuActive});
        this.props.skuChange([sku])
    };

    //重新进入时初始话数据
    newDate=()=>{
        this.setState({
            skuActive:["__","__","__","__","__"]
        })
    };

    //分类点击跳转页面
    levelClassClick=(class_id,class_name)=>{
        const {url} = this.state;
        const classInformation={ class_id, class_name };
        prompt.setSession("classInformation",JSON.stringify(classInformation));
        window.open(`http://${url}/#/classList?v=${Math.random()*10000}`, '_blank');
    };
    //隐藏显示更多属性
    isShowSpan=(k)=>{
        const {skuList} = this.state;
        skuList[k] = !skuList[k];
        this.setState({ skuList });
    };
    render(){
        const {level,typeClass,class_name_2}=this.props;
        const {skuActive,skuList} = this.state;
        return(
            <div className='attribute-list-box-c'>
                <ul>
                    {
                        level == 3 && typeClass && typeClass.map((item)=>{
                            return(
                                item.name && item.name.map((itemName,k)=>{
                                    if(item.display[k]){
                                        const attr = skuActive[k];
                                        return(
                                            <li>
                                                <div className='attribute-name'>{itemName}：</div>
                                                <div className='attribute-list-title'>
                                                    <div className='attribute-list-span-all'>
                                                        <span className={attr == "__" ? "active" : ""} onClick={()=>{this.selectAttribute(k,"__")}}>全部</span>
                                                    </div>
                                                    <div className="attribute-list-span">
                                                        {
                                                            item.val[0] && item.val[0][k] && item.val[0][k].map((val,j)=>{
                                                                return(
                                                                    <span className={attr == j ? "active" : ""}
                                                                          style={{display: j > 7 && !skuList[k] ? "none" : "block"}}
                                                                          onClick={()=>{this.selectAttribute(k,j)}}
                                                                          key={val}>
                                                                            {val}
                                                                        </span>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                    {
                                                        item.val[0] && item.val[0][k].length>7 &&
                                                        <Button onClick={()=>{this.isShowSpan(k)}}>
                                                            {
                                                                skuList[k] ? <span>收起<Icon type="up"/></span> : <span>更多<Icon type="down"/></span>
                                                            }
                                                        </Button>
                                                    }
                                                </div>
                                            </li>
                                        )
                                    }
                                })
                            )
                        })
                    }
                    {
                        level == 2 &&
                        <li>
                            <div className='attribute-name'>{class_name_2}：</div>
                            <div className='attribute-list-title'>
                                {
                                    level == 2 && typeClass && typeClass.map((item)=>{
                                        return(
                                            <span key={item.id} onClick={()=>this.levelClassClick(item.id,item.name)}>
                                            {item.name}
                                        </span>
                                        )
                                    })
                                }
                            </div>
                        </li>
                    }

                </ul>
            </div>
        )
    }

}