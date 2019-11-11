
import React from "react";
import { Icon, Input, message, Button } from "antd";
import { observer, inject } from 'mobx-react';
import { createHashHistory } from 'history';
import { withRouter } from "react-router";
import { Link } from 'react-router-dom';
import prompt from './../../component/prompt'
import "./index.scss";
import api from "../../component/api";
const history = createHashHistory();
const Search = Input.Search;
@inject("store")
@observer
class Header extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            userName: "",
            isOut: false,
            company_id: '',
            needFixed: false,      // 是否需要固定
        }
    }

    componentDidMount() {
        const { login, isFixed } = this.props;
        if (login) { return false };
        const userName = sessionStorage.getItem("user_name");
        const type = sessionStorage.getItem('type')
        const company_id = sessionStorage.getItem("company_id");
        const isOut = sessionStorage.getItem('out');
        this.setState({ userName, type, company_id, isOut });
        !isOut && this.getShoppingNumber();
        // 注册滚动条事件
        if(isFixed){
            this.fixedHeader()
        }
        
    }
    // 固定头部
    fixedHeader = () => {
        const {controlNavShow} = this.props
        const fixedTop = this.headerBox.offsetTop
        // console.log('this.headerBox', this.headerBox.offsetTop, scrollTop);
	    window.addEventListener('scroll', ()=>{
            let scrollTop = Math.max(document.body.scrollTop, document.documentElement.scrollTop)
            //控制元素块A随鼠标滚动固定在顶部
            if (scrollTop >= fixedTop+100) {
                this.setState({ needFixed: true })
            } else if (scrollTop < fixedTop) {
                this.setState({ needFixed: false })
            }
        })
            
    }

    //获取购物车数量
    getShoppingNumber = () => {
        const { store } = this.props;
        store.shoppingCart.getShoppingNumber();
    };

    // ↓ ------------ 搜索页面请求数据 ---------------------

    search = (value) => {
        const { store } = this.props;
        if (!value) { message.error("请输入搜索的商品"); return; }
        store.seachDataBus.getSearchList(value);
        history.push('/SearchList');
    };

    searchChange = (e) => {
        const value = e.target.value;
        sessionStorage.setItem("SL-inputData", value);
    };
    //退出登录
    exitLogin = () => {
        sessionStorage.setItem("token", "");
        history.push('/');
    };

    render() {
        const { login, store, isUser,myCart,isSearch } = this.props;
        const { userName, type, company_id, isOut, needFixed } = this.state;
        let typeLink = "/";
        switch (type) {
            case "0":
                typeLink = "/BusinessAccount";
                break;
            case "1":
                typeLink = "/AdminAccount";
                break;
            case "2":
                typeLink = "/BuyerCenter";
                break;
            case "3":
                typeLink = "/ApproverAccount";
                break;
        }
        
        return (
            <header className='header' style={{height: isOut || login ? '124px' : '160px'}}>
                {
                    isOut || login ? '' :
                        <div className="header-nav-box">
                            <div className="header-nav">
                                <div className="header-position">
                                    <i className='iconfont icondianhua2'> </i>
                                    客服热线: 028-83368980
                                </div>
                                {
                                    !login &&
                                    <div className="header-nav-list">
                                        <div className="header-nav-content">
                                            {userName} <i className='iconfont iconshangla'></i>
                                            <div className="header-nav-secondary">
                                                {
                                                    type == "2" ?
                                                        <Link to='/BuyerCenter/securitySet'>安全设置</Link>
                                                        : type == '0' ?
                                                            <Link to='/BusinessAccount/BusSecuritySet' onClick={() => { this.props.navName && this.props.navName('安全设置') }}>安全设置</Link>
                                                            : type == '1' ?
                                                                <Link to='/AdminAccount/AdminBusSecuritySet' onClick={() => { this.props.navName && this.props.navName('安全设置') }}>安全设置</Link>
                                                                : type == '3' ?
                                                                    <Link to='/ApproverAccount/AppBusSecuritySet' onClick={() => { this.props.navName && this.props.navName('安全设置') }}>安全设置</Link>
                                                                    : <Link to='/'>安全设置</Link>
                                                }
                                                {
                                                    type == "2" &&
                                                    <Link to='/BuyerCenter/addressManagement'>地址管理</Link>
                                                }
                                                <a href="javascript:;" onClick={this.exitLogin}>退出登录</a>
                                            </div>
                                        </div>
                                        <Link to={typeLink} onClick={() => { this.props.navName && this.props.navName('个人中心') }}>
                                            <div className="header-nav-content">
                                                个人中心
                                            </div>
                                        </Link>
                                    </div>
                                }
                            </div>
                        </div>
                }
                {/* 当header-box固定的时候   需要用一个同样高度的空div来占位 */}
                {
                    needFixed && <div style={{ height: `${this.headerBox.clientHeight}px` }}></div>
                }

                {
                    type != '2' || !isUser ?
                        <div className={`header-box ${needFixed? 'header-box-fixed' : ''}`} ref={(ref)=>{this.headerBox = ref}}>

                            <div className="logo-box">
                                <a href="javascript:;"></a>
                            </div>
                            {/* <div className='logo-th' style={{marginRight: isUser ? "35px" : "128px"}}> </div> */}
                            {
                                isOut || login ? '':
                                <div>
                                    <img src={prompt.getGoodsImgUrl(company_id, company_id, 1000, 'operating')} alt="" className='logo-th' />
                                </div>
                            }
                            {
                                login ?  <div className="go-an-mall"><a href="http://www.tdsc360.com/mall/">返回昂牛商城</a></div>  : ''
                            }
                            
                        </div>
                        :
                        <div className={`header-box ${needFixed? 'header-box-fixed' : ''}`} ref={(ref)=>{this.headerBox = ref}}>
                            <div className="logo-box">
                                {/* <a href="javascript:;"></a> */}
                                <Link to="/home"></Link>
                            </div>
                            {
                                isOut ? '' :
                                    <div>
                                        <img src={prompt.getGoodsImgUrl(company_id, company_id, 1000, 'operating')} alt="" className='logo-th ' style={{marginRight: isSearch ? '128px':'340px' }} />
                                    </div>
                            }
                            {/* {
                                isUser && !myCart &&
                                <div className='is-user-box'>
                                    <Link to="/home">首页</Link>
                                    <Link to="/supplierMap">供应商地图</Link>
                                </div>
                            } */}

                            {
                                isOut ? '' :
                                    <div className="header-search-box" style={{ display: login ? "none" : "block",width: isSearch ? '570px':'370px',marginLeft: myCart ? '158px':'0' }}>
                                        <Search
                                            className='btn-box'
                                            placeholder="输入关键字"
                                            enterButton="搜索"
                                            size="large"
                                            defaultValue={this.props.searchValue}
                                            onChange={this.searchChange}
                                            onSearch={this.search}
                                            autoComplete="off"
                                        />
                                        {/*<span SearchBus={this.search}/>*/}

                                        <p>

                                        </p>
                                    </div>
                            }

                            {
                                isOut || myCart ? '' :
                                    <div className="header-shopping-box" style={{ display: login ? "none" : "block" }}>
                                        <Link to="/ShoppingCart">
                                            <Icon type="shopping-cart" /> &nbsp;&nbsp;
                                    <p>我的购物车</p> &nbsp;&nbsp;
                                    {
                                                store.shoppingCart.shopping ?
                                                    <span title={store.shoppingCart.shopping}>{store.shoppingCart.shopping > 999 ? `${99}+` : store.shoppingCart.shopping}</span> : ""
                                            }
                                        </Link>
                                    </div>
                            }
                            
                            

                        </div>
                }
            </header>
        )
    }

}
const ShowTheLocationWithRouter = withRouter(Header);
export default Header