import React from "react";
import {Link, Route} from 'react-router-dom';
import Nav from "./../components/nav";
import List from "./list/list";
import { Input, Icon,Button} from 'antd';
import "./index.scss";
import api from "../component/api";
import { Pagination } from 'antd';
import Null from "./../components/noList/null";
import HelpCenterFooter from "./../components/footer/helpCenterFooter"
import Footer from './../components/footer/newFootHelp/Footer'
import WinButton from "../components/winButton/index"
export default class GoodSupplier extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            resData: "",
            the_page: 1,// ← 当前是多少页
            name:""

            // ↓ ---------- 接受到的数据 ------------

        }
    }

    // ↓ ------------------ 供应商搜索页面 Ajax ----------------------
    goodSupplierAjax(){

        const data={
            page_number:this.state.the_page, // ← 页码
            page_size:"15",// ← 每页数量
            name:this.state.name // ← 模糊查询

        };
        api.axiosPost('getGoodSupplier',data)
            .then((res)=>{
                this.setState({resData:res.data.data})
            })

    }


    componentDidMount(){
        this.goodSupplierAjax()
    }
    emitEmpty = () => {
        this.userNameInput.focus();
        this.setState({ name: '' });
    };
    onChangeUserName = (e) => {
        this.state.name=e.currentTarget.previousElementSibling.firstElementChild.value;
        this.setState({ name: e.currentTarget.previousElementSibling.firstElementChild.value });
        this.goodSupplierAjax();
    };

    changePage(pageNumber){
        this.state.the_page=pageNumber;
        this.setState({the_page:pageNumber});
        this.goodSupplierAjax()
    }
    render(){
        const { name } = this.state;
        const suffix = name ? <Icon type="close-circle" onClick={this.emitEmpty} /> : null;
        return(
            <div className="goodSupplier">
                <Nav match="/GoodSupplier"/>

                <div className="body">
                    <div className="srach_input_box clear">
                        <div className= "inputer_BG">
                            <div className="srach_input">
                                <Input
                                    placeholder="请输入供应商名称"
                                    suffix={<Icon type="search" />}
                                    // value={name}
                                    // onInput={this.onChangeUserName}
                                    ref={node => this.userNameInput = node}
                                    className="inputer"
                                />
                                <Button className="inputerButton" onClick={this.onChangeUserName.bind(this)}>搜索</Button>
                            </div>
                        </div>
                    </div>
                    <List data={this.state.resData}/>
                    <div className="page">
                        {
                            this.state.resData.total_page > 0 ?
                            <Pagination defaultCurrent={this.state.the_page} // ← 当前页
                                        total={this.state.resData.total_page} // ← 数据总数（实际放入的是后台计算好的多少页）
                                        pageSize ={1} // ← 每页条数（实际放入的就是1）
                                        onChange={this.changePage.bind(this)}/> :
                                <Null />
                        }

                    </div>
                </div>
                <Footer/>
                {/*<HelpCenterFooter/>*/}
                <WinButton/>
            </div>
        )
    }


}