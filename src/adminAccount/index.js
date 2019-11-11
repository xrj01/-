import React from "react";
import { Route, Switch ,Link} from 'react-router-dom';
import Header from "./../components/header";
import Footer from './../components/footer/newFootHelp/Footer';
import { Breadcrumb } from 'antd';
import "./index.scss";
export default class BuyerCenter extends React.Component{
    constructor(props) {
        super(props);
        const urlData = window.location.hash;
        this.state={
            navTitle:[
                {
                    name:"我的账户",
                    list:[]
                },
                {
                    name:"账号中心",
                    list:[]
                },
            ],
            urlData,
            levelName2:"我的账户",
            levelName3:"个人中心"
        }
    }

    componentDidMount() {
        //设置左边菜单栏
        const {routes} = this.props;
        let {navTitle,urlData,levelName2,levelName3}=this.state;
        navTitle.map((nav)=>{
            routes && routes.map((item)=>{
                if(item.meta == nav.name){
                    nav.list.push(item)
                }
                if(urlData == `#${item.path}`){
                    levelName2 = item.meta;
                    levelName3 = item.name;
                }
            })
        });
        this.setState({navTitle,levelName2,levelName3})
        
    }
    //刷新页面获取当前面包屑
    /* getNavName = (e) =>{
        const {routes} = this.props;
        routes && routes.map((item)=>{
            
            if(window.location.hash.split('?')[0].slice(1) === item.path){
                //console.log(item.name,item.meta);
                if(item.name =='新增审批流' || item.name =='编辑审批流'){
                    item.meta = '账号中心'
                    item.name = '审批流管理'
                }
                this.setState({
                    name:item.name,
                    meta:item.meta
                })
            }
        })
    } */
    linkChange=(path,levelName2,levelName3)=>{
        this.setState({
            urlData:`#${path}`,
            levelName2,
            levelName3,
        })
    };
    navName = (name) =>{
        if(name == '个人中心'){
            this.setState({
                levelName2:'我的账户',
                levelName3:'个人中心',
            })
        }else if(name == '安全设置'){
            this.setState({
                levelName2:'我的账户',
                levelName3:'安全设置',
            })
        }
        
    }
    render(){
        const {routes} = this.props;
        const {navTitle,levelName2,levelName3,name,meta} = this.state;
        const urlData = window.location.hash;
        let breadCrumbs = false;
        if(urlData.indexOf("/AdminAccount/AdminAdd") >-1 || urlData.indexOf("/AdminAccount/AdminEdit") >-1){
            breadCrumbs = true;
        }
        return(
            <div className='businessAccount-center-box'>
                <Header isUser={true} navName={this.navName}/>
                <div className="businessAccount-center-content-box">
                    {/* <Breadcrumb separator=">">
                        <Breadcrumb.Item>
                            {breadCrumbs?'账号中心':levelName2}
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>{breadCrumbs?'审批流管理':levelName3}</Breadcrumb.Item>
                    </Breadcrumb> */}

                    <div className="businessAccount-center-content">
                        <div className="businessAccount-content-nav">
                            {
                                navTitle.map((item,index)=>{
                                    return(
                                        <div className='businessAccount-nav-box'>
                                            <h6><img src={require(`./../image/a_${index+1}.png`)} className={`a_${index+1}`} alt=""/> {item.name}</h6>
        
                                            {
                                                item.list.map((link)=>{
                                                    let isApp = false;
                                                    if(link.name == "审批流管理"){
                                                        if(urlData.indexOf("/AdminAccount/AdminAdd") >-1 || urlData.indexOf("/AdminAccount/AdminEdit") >-1){
                                                            isApp = true;
                        
                                                        }
                                                    }
                                                    return(
                                                        <Link onClick={()=>{this.linkChange(link.path,item.name,link.name)}}
                                                              className={urlData == `#${link.path}` || isApp ? "active" : ""}
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