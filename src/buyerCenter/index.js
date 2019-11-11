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
                    name:"交易管理",
                    list:[]
                },
                {
                    name:"我的收藏",
                    list:[]
                }
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

    linkChange=(path,levelName2,levelName3)=>{
        this.setState({
            urlData:`#${path}`,
            levelName2,
            levelName3
        })
    };
    navName = (name) =>{
        // console.log(111,name);
        
    };
    render(){
        const {routes} = this.props;
        const {navTitle,levelName2,levelName3} = this.state;
        const urlData = window.location.hash;
        let breadCrumbs = false;
        if(urlData.indexOf("/BuyerCenter/ChildOrderDetails") >-1 || urlData.indexOf("/BuyerCenter/FatherOrdersDetails") >-1){
            breadCrumbs = true;
        }
        return(
            <div className='buyer-center-box'>
                <Header isUser={true} navName={this.navName}/>
                <div className="buyer-center-content-box">
                    {/* <Breadcrumb separator=">">
                        <Breadcrumb.Item>
                            <Link to='/home'>首页</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            {breadCrumbs ? "交易管理" : levelName2}
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>{
                            breadCrumbs ?
                                <Link to="/BuyerCenter/MyOrder">我的订单</Link> :
                                levelName3 }
                        </Breadcrumb.Item>
                        {
                            breadCrumbs &&
                            <Breadcrumb.Item>
                                订单详情
                            </Breadcrumb.Item>
                        }
                    </Breadcrumb> */}

                    <div className="buyer-center-content">
                        <div className="buyer-content-nav">
                            {
                                navTitle.map((item,index)=>{
                                    return(
                                        <div className='buyer-nav-box' key={index}>
                                            <h6><img src={require(`./../image/c_${index+1}.png`)} alt=""/> {item.name}</h6>
                                            {
                                                item.name == '交易管理' ?
                                                    <Link to='/ShoppingCart'>购物车</Link> : null
                                            }
                                            {
                                                item.list.map((link,j)=>{
                                                    let isMyOrder = false;
                                                    if(link.name == "我的订单"){
                                                        if(urlData.indexOf("/BuyerCenter/ChildOrderDetails") >-1 || urlData.indexOf("/BuyerCenter/FatherOrdersDetails") >-1){
                                                            isMyOrder = true;
                                                        }
                                                    }
                                                    return(
                                                        <Link key={j} onClick={()=>{this.linkChange(link.path,item.name,link.name)}}
                                                              className={urlData == `#${link.path}` || isMyOrder ? "active" : ""}
                                                              to={link.path}>{link.name}</Link>
                                                    )
                                                })
                                            }
                                        </div>
                                    )
                                })
                            }

                        </div>
                        <div className="buyer-content-right-content">
                            <Switch>
                                {
                                    routes && routes.map((item,index)=>{
                                        return(
                                            <Route key={index} path={item.path}
                                                   exact={item.exact}
                                                   render={ props => (
                                                       <item.component {...props}  routes={item.routes} />
                                                   )}
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