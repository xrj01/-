import React, { Component, PureComponent } from "react";
import { Link, Route } from 'react-router-dom';
import { observer, inject } from "mobx-react";
import { Icon } from "antd";
import Header from "./../header";
import "./index.scss";
import api from "../../component/api";
import { createHashHistory } from "history";
import Prompt from "./../../component/prompt";
const history = createHashHistory();
@inject("store")
@observer
class Home extends Component {
    constructor(props) {
        super(props);
        const url = window.location.host;
        this.state = {
            navList: [
                { path: "/Home", name: "首页" },
                { path: "/supplierMap", name: "供应商地图" },
                // { path:"/GoodSupplier",name:"优质供应商"}
            ],
            url: url,
            isShowSecondary: false,
            classList: [],
            level3List: [],
            iconList: {
                11: {
                    icon: "icondiangongdianqi",
                    size: "18",
                    left: "2"
                },
                17: {
                    icon: "icongongchengbu",
                    size: "18",
                    left: "2"
                },
                18: {
                    icon: "icontielu",
                    size: "24",
                    left: "-4"
                },
                15: {
                    icon: "iconyousejinshu",
                    size: "22",
                    left: "-2"
                },
                13: {
                    icon: "icontubiaozhizuomoban_huabanfuben",
                    size: "20",
                    left: "0"
                },
                14: {
                    icon: "iconjixie",
                    size: "20",
                    left: "0"
                },
                16: {
                    icon: "iconyiqiyibiao",
                    size: "20",
                    left: "0"
                },
                12: {
                    icon: "iconliangjuguanli",
                    size: "25",
                    left: "-5",
                    iconLeft: "-2"
                },
                19: {
                    icon: "iconguidao",
                    size: "20",
                    left: "0"
                },
                670: {
                    icon: "icondiannao-tianchong",
                    size: "18",
                    left: "0"
                },
                14065: {
                    icon: "icongongyepin-shi",
                    size: "18",
                    left: "0"
                },
                "ty": {
                    icon: "iconchache01",
                    size: "20",
                    left: "0"
                }
            },
        }
    }
    // ↓ ------------ 设置获取商品分类列表的axios请求 --------------G
    getNAVClass_data() {
        const data = {};
        api.axiosPost('gitHomeNAV_Class_data', data).then((res) => {
            if (res.data.code == 1) {
                this.setState({
                    classList: res.data.data
                })
            }
        })
    }
    // ↓ ------------ 页面载入时发起axios请求 --------------G
    componentDidMount() {
        this.getNAVClass_data()
    }

    //分类点击跳转页面
    levelClassClick = (class_id, class_name) => {
        const { url } = this.state;
        const classInformation = { class_id, class_name };
        Prompt.setSession("classInformation", JSON.stringify(classInformation));
        window.open(`http://${url}/#/classList?v=${Math.random() * 10000}`, '_blank');
    };
    //分类点击跳转京东页面
    levelClassClickJD = (class_id, class_name, e, class_level) => {
        e.preventDefault();
        const { url } = this.state;
        const classInformation = { class_id, class_name, class_level };
        Prompt.setSession("classInformation", JSON.stringify(classInformation));
        window.open(`http://${url}/#/ClassJDList?v=${Math.random() * 10000}`, '_blank');
    };
    
    render() {
        const { match, isClassList, isFixed } = this.props;
        const { navList, classList, iconList, fixNav } = this.state;
        return (
            <div className='home-class-box'>
                <Header searchValue={this.props.searchValue} isFixed={isFixed} isSearch={true} isUser={true}/>
                {/* 当header-box固定的时候   需要用一个同样高度的空div来占位 */}
                <div className={`home-nav`} ref={ref=>{this.homeNav = ref}}>

                    <div className="home-nav-box">
                        <div className="home-nav-all">
                            <Icon type="unordered-list" />&nbsp; 全部商品分类
                            <div className="home-class-list" style={{ display: isClassList && !fixNav ? "block" : "none" }}>
                                <div style={{ "width": "100%", height: "10px", background: "#F6F5F5" }}></div>
                                <ul>
                                    {
                                        classList.product_class && classList.product_class.map((item, index) => {
                                            const sizeObj = iconList[item.id] ? iconList[item.id] : iconList.ty;
                                            return (
                                                <li key={item.id}>
                                                    <h4 className="class_list_lv3">
                                                        <i
                                                            style={{ fontSize: `${sizeObj.size}px`, marginLeft: `${sizeObj.iconLeft ? sizeObj.iconLeft : 0}px` }}
                                                            className={`iconfont ${sizeObj.icon}`}> </i> &nbsp;
                                                        <span style={{ marginLeft: `${sizeObj.left}px` }} className="head_nav_title">{item.name}</span>
                                                    </h4>
                                                    <p>
                                                        {
                                                            item.child && item.child.length > 0 && item.child.map((level2, index) => {
                                                                if (index < 3) {
                                                                    return (
                                                                        <a href="javascript:;" onClick={() => { this.levelClassClick(level2.id, level2.name) }}>{level2.name}</a>
                                                                    )
                                                                }
                                                            })
                                                        }
                                                    </p>

                                                    <div className="home-class-secondary">
                                                        <div className="home-class-secondary-box">
                                                            <ul>
                                                                {
                                                                    item.child && item.child.length > 0 && item.child.map((level2, i, ) => {
                                                                        return (
                                                                            <li key={level2.id}>
                                                                                <div className="level2_box">
                                                                                    <a href="javascript:;"
                                                                                        title={level2.name}
                                                                                        onClick={() => { this.levelClassClick(level2.id, level2.name) }}>{level2.name}</a>
                                                                                    <div className="jiao">
                                                                                        &gt;
                                                                                    </div>
                                                                                </div>
                                                                                <div className='home-class-secondary-box-a'>
                                                                                    {/*<Link
                                                                                            onClick={()=>{initiaList && initiaList(level3.id)}}
                                                                                            key={i} to={'/classList'+'?'+`${level3.id}`+`?${encodeURI(level3.name)}`+`?${encodeURI(level2.name)}`}> {level3.name} </Link>*/}
                                                                                    {
                                                                                        level2.child && level2.child.map((level3, i) => (
                                                                                            <a href="javascript:;" onClick={() => { this.levelClassClick(level3.id, level3.name) }}>{level3.name}</a>
                                                                                        ))
                                                                                    }
                                                                                </div>
                                                                            </li>
                                                                        )
                                                                    })
                                                                }
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </li>
                                            )
                                        })
                                    }
                                    {
                                        classList.jd_product_class && classList.jd_product_class.map((item, index) => {
                                            const sizeObj = iconList[item.id] ? iconList[item.id] : iconList.ty;
                                            return (
                                                <li key={item.id}>
                                                    <h4 className="class_list_lv3">
                                                        <i
                                                            style={{ fontSize: `${sizeObj.size}px`, marginLeft: `${sizeObj.iconLeft ? sizeObj.iconLeft : 0}px` }}
                                                            className={`iconfont ${sizeObj.icon}`}> </i> &nbsp;
                                                        <span style={{ marginLeft: `${sizeObj.left}px` }} className="head_nav_title">{item.name}</span>
                                                    </h4>
                                                    <p>
                                                        {
                                                            item.child && item.child.length > 0 && item.child.map((level2) => {
                                                                return (
                                                                    <a href="javascript:;">{level2.name}</a>
                                                                )
                                                            })
                                                        }
                                                    </p>

                                                    <div className="home-class-secondary">
                                                        <div className="home-class-secondary-box">
                                                            <ul>
                                                                {
                                                                    item.child && item.child.length > 0 && item.child.map((level2, i, ) => {
                                                                        return (
                                                                            <li key={level2.id}>
                                                                                <div className="level2_box">
                                                                                    {/* <Link className="lvel2List" title={level2.name} to={'/classList'+'?'+`${level2.id}`+`?`+`?${encodeURI(level2.name)}`}>{level2.name}</Link> */}
                                                                                    <a href="javascript:;" onClick={(e) => { this.levelClassClickJD(level2.id, level2.name, e, 2) }}>{level2.name}</a>
                                                                                    <div className="jiao">
                                                                                        &gt;
                                                                                    </div>
                                                                                </div>
                                                                                <div className='home-class-secondary-box-a'>
                                                                                    {
                                                                                        level2.child && level2.child.map((level3, i) => (
                                                                                            //<Link key={i} to={'/classList'+'?'+`${level3.id}`+`?${encodeURI(level3.name)}`+`?${encodeURI(level2.name)}`}> {level3.name} </Link>
                                                                                            <a href="javascript:;" onClick={(e) => { this.levelClassClickJD(level3.id, level3.name, e, 3) }}>{level3.name}</a>
                                                                                        ))
                                                                                    }
                                                                                </div>
                                                                            </li>
                                                                        )
                                                                    })
                                                                }
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            </div>
                        </div>
                        <ul>
                            {
                                navList && navList.map((item, index) => {
                                    return (
                                        <li key={index} className={match == item.path ? "active" : ""}>
                                            <Link to={item.path}>{item.name}</Link>
                                        </li>
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
export default Home