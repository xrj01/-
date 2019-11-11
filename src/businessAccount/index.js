import React from "react";
import { Route, Switch ,Link} from 'react-router-dom';
import Header from "./../components/header";
import Footer from './../components/footer/newFootHelp/Footer';
import { Breadcrumb } from 'antd';
import "./index.scss";
export default class BuyerCenter extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            navTitle:[
                {
                    name:"账户中心",
                    list:[]
                },
                {
                    name:"管理中心",
                    list:[]
                },
                {
                    name:"统计中心",
                    list:[]
                }
            ],
            levelName2:"账户中心",
            levelName3:"个人中心"
        }
    }

    componentDidMount() {
        //设置左边菜单栏
        const {routes} = this.props;
        const {navTitle}=this.state;
        navTitle.map((nav)=>{
            routes && routes.map((item)=>{
                if(item.meta == nav.name){
                    nav.list.push(item)
                }
            })
        });
        this.setState({navTitle},()=>{this.getNavName()})
        //console.log(111,window.location);
        
    }
    //刷新页面获取当前面包屑
    getNavName = (e) =>{
        const {routes} = this.props;
        routes && routes.map((item)=>{
            if(window.location.hash.split('?')[0].slice(1) === item.path){
                //console.log(item.name,item.meta);
                if(item.meta=='父订单详情' || item.meta=='子订单详情'){
                    /* item.meta = '管理中心'
                    item.name = '订单管理' */
                    this.setState({
                        name:'订单管理',
                        meta:'管理中心'
                    })
                }else if(item.name =='新增审批流' || item.name =='编辑审批流'){
                    this.setState({
                        name:'审批流管理',
                        meta:'管理中心'
                    })
                }else{
                    this.setState({
                        name:item.name,
                        meta:item.meta
                    })
                }
                
            }
        })
    }
    linkChange=(path,levelName2,levelName3)=>{
        this.setState({
            urlData:`#${path}`,
            levelName2,
            levelName3,
            name:'',
            meta:''
        })
    };
    navName = (name) =>{
        // console.log(111,name);
        
        if(name == '个人中心'){
            this.setState({
                levelName2:'账户中心',
                levelName3:'个人中心',
                name:'',
                meta:''
            })
        }else if(name == '安全设置'){
            this.setState({
                levelName2:'账户中心',
                levelName3:'安全设置',
                name:'',
                meta:''
            })
        }
        
    }
    render(){
        const {routes} = this.props;
        const {navTitle,levelName2,levelName3,name,meta} = this.state;
        const urlData = window.location.hash;
        let breadCrumbs = false;
        if(urlData.indexOf("/BusinessAccount/ParentOrder") >-1 || urlData.indexOf("/BusinessAccount/SonOrder") >-1){
            breadCrumbs = true;
        }
        return(
            <div className='businessAccount-center-box'>
                <Header isUser={true} navName={this.navName}/>
                <div className="businessAccount-center-content-box">
                    {/* <Breadcrumb separator=">">
                        <Breadcrumb.Item>
                            {meta?meta:levelName2}
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>{name?name:levelName3}</Breadcrumb.Item>
                        <Breadcrumb.Item>{breadCrumbs?'订单详情':''}</Breadcrumb.Item>
                    </Breadcrumb> */}

                    <div className="businessAccount-center-content">
                        <div className="businessAccount-content-nav">
                            {
                                navTitle.map((item,index)=>{
                                    return(
                                        <div className='businessAccount-nav-box'>
                                            <h6><img src={require(`./../image/b_${index+1}.png`)} className={`b_${index+1}`} alt=""/> {item.name}</h6>
        
                                            {
                                                item.list.map((link)=>{
                                                    let isMyOrder = false;
                                                    let isApp = false;
                                                    if(link.name == "订单管理"){
                                                        if(urlData.indexOf("/BusinessAccount/ParentOrder") >-1 || urlData.indexOf("/BusinessAccount/SonOrder") >-1){
                                                            isMyOrder = true;
                                                            isApp = false;
                                                        }
                                                    }
                                                    if(link.name == "审批流管理"){
                                                        if(urlData.indexOf("/BusinessAccount/add") >-1 || urlData.indexOf("/BusinessAccount/edit") >-1){
                                                            isApp = true;
                                                            isMyOrder = false;
                                                        }
                                                    }
                                                    return(
                                                        <Link onClick={()=>{this.linkChange(link.path,item.name,link.name)}}
                                                              className={urlData == `#${link.path}` || isMyOrder || isApp ? "active" : ""}
                                                              to={link.path}>{link.name}</Link>
                                                    )
                                                })
                                            }
                                        </div>
                                    )
                                })
                            }

                        </div>
                        <div className="businessAccount-content-right-content">
                            <Switch>
                                {
                                    routes && routes.map((item,index)=>{
                                        return(
                                            <Route key={index} path={item.path}
                                                    exact={item.exact}
                                                    render={ props => {
                                                        document.title = item.title || "昂牛铁道商城-企牛采";
                                                        return <item.component {...props}  routes={item.routes} />
                                                       
                                                    }}
                                            />
                                        )
                                    })
                                }
                            </Switch>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }
}