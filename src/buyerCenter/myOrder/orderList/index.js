import React from "react";
import { Link } from "react-router-dom";
import api from "./../../../component/api";
import { Icon, Button, Pagination, Modal, message, Input, DatePicker, Select } from "antd";
import ApprovalModal from "./../approvalModal";
import FileModal from "./../fileModal";
import { createHashHistory } from "history";
import Null from "./../../../components/noList/nullMerchants";
import "./index.scss";

const history = createHashHistory();
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD'; // 规定日期选择器的格式
const Option = Select.Option;


export default class OrderList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page_number: 1,
            page_size: 10,
            fatherOrderList: [],
            timeList: [],
            newTime: [],
            total: 0,
            approvalModal: false,
            fileModal: false,
            fileList: [],
            stepData: {},
            isNull: false,
            dateRange: [null, null],  // 日期范围
            projectArr: [],           // 项目信息
            project_id: undefined,           // 项目id  没有传0
            parent_order_id: '',      // 父订单id    没有请传0
            begin_time: '',           // 开始时间
            end_time: '',             // 结束时间
        }
    }

  
    componentDidMount() {
        this.getOrderList();
        // 获取审批项目信息
        this.getProjectInfo();
    }
    //取消订单
    cancel_order = (parent_order_id) => {
        const data = { parent_order_id };
        const _this = this;
        Modal.confirm({
            title: '是否取消当前订单?',
            okText: '确定',
            cancelText: '再想想',
            width: 440,
            centered: true,
            okType: 'default',
            className: "confirm-order-modal cancel-modal",
            onOk() {
                api.axiosPost("cancel_order", data).then((res) => {
                    if (res.data.code == 1) {
                        message.success(res.data.msg);
                        _this.getOrderList();
                    } else {
                        message.error(res.data.msg);
                    }
                })
            }
        });
    };

    //获取订单
    getOrderList = (isTAB = false,isCheckAll = true ) => {
        if(isTAB){
            this.setState({
                parent_order_id: '',
                project_id: undefined,
                dateRange: [null, null]
            })
        }
        const { page_number, page_size, parent_order_id, project_id, begin_time, end_time } = this.state;
        const { user_page_size, state } = this.props;
        const data = {
            page_number,
            page_size: user_page_size ? user_page_size : page_size,
            state: state,
            parent_order_id: isCheckAll? '0' : parent_order_id == '' ? '0' : parent_order_id,
            project_id:      isCheckAll? 0 : project_id == undefined ? 0 : project_id,
            begin_time:      isCheckAll? '' : begin_time,
            end_time:        isCheckAll? '' : end_time,
        };
        api.axiosPost("getOrderList", data).then((res) => {
            if (res.data.code == 1) {
                const fatherOrderList = res.data.data.list;
                const timeList = [];
                fatherOrderList.map((item) => {
                    if (item.time_limit) {
                        timeList.push(item.time_limit)
                    } else {
                        timeList.push(false)
                    }
                });
                this.props.getOrderLength && this.props.getOrderLength(fatherOrderList.length)
                this.setState({
                    fatherOrderList,
                    total: res.data.data.total_row,
                    isNull: true,
                    timeList
                }, () => { this.orderSetInterval() })
            }
        })
    };
    orderSetInterval = () => {
        const { timeList } = this.state;
        this.interval = setInterval(() => {
            const newTime = [];
            /*let date = new Date();
            let now = date.getTime();*/
            const timeListLeng = timeList.length;
            for (let i = 0; i < timeListLeng; i++) {
                if (timeList[i] && timeList[i] !== "已超时") {
                    // let end = timeList[i];
                    // let leftTime = end - now; //时间差
                    let leftTime = timeList[i]; //时间差
                    let h, m, s;
                    if (leftTime >= 0) {
                        h = Math.floor(leftTime / 1000 / 60 / 60);
                        m = Math.floor(leftTime / 1000 / 60 % 60);
                        s = Math.floor(leftTime / 1000 % 60);
                        if (s < 10) { s = "0" + s; }
                        if (m < 10) { m = "0" + m; }
                        if (h < 10) { h = "0" + h; }
                        newTime.push(`${h}:${m}:${s}`);

                        timeList[i] -= 1000;
                    } else {
                        newTime.push("已超时")
                    }
                } else {
                    newTime.push(false)
                }
            }
            this.setState({ newTime,timeList});
        }, 1000)
    };
    componentWillUnmount = () => {
        clearInterval(this.interval)
    };
    //分页数据改变
    paginationChange = (page) => {
        window.document.getElementById('root').scrollIntoView(true)
        this.setState({
            page_number: page
        }, () => {
            clearInterval(this.interval)
            this.getOrderList(false, false);
        })
    };
    //获取审批流详情
    orderApprovalProcess = (parent_order_id) => {
        const data = { parent_order_id, type: 1 };
        api.axiosPost("order_approval_process", data).then((res) => {
            if (res.data.code == 1) {
                this.setState({
                    stepData: res.data.data,
                    approvalModal: true
                });
            } else {
                message.error(res.data.msg)
            }
        })
    };
    //隐藏弹出框
    isHideModal = (type, isTrue) => {
        this.setState({
            [type]: isTrue
        })
    };
    //获取订单附件
    getOrderFile = (parent_order_id) => {
        const data = { parent_order_id };
        api.axiosPost("get_order_file", data).then((res) => {
            if (res.data.code == 1) {
                const fileList = res.data.data;
                this.setState({
                    fileList,
                    fileModal: true
                })
            } else {
                message.error(res.data.msg)
            }
        })
    };
    //再次购买
    buyAgain = (parent_order_id) => {
        const data = { parent_order_id };
        api.axiosPost("buy_again", data).then((res) => {
            if (res.data.code == 1) {
                message.success(res.data.msg);
                history.push('/ShoppingCart')
            } else {
                message.error(res.data.msg)
            }
        })
    };
    // input ===> onChange
    handleOnchange = (type, val) => {
        // console.log('val', val);
        this.setState({
            [type]: val
        })
    }
    // 日期
    DateChange = (dates, dateStrings) => {
        this.setState({
            begin_time: dateStrings[0],
            end_time: dateStrings[1],
            dateRange: dates
        })
    }
    // 获取项目下拉信息
    getProjectInfo = () => {
        api.axiosPost('getProjectInfo').then(res => {
            // console.log('res', res);
            if(res.data.code === 1) {
                this.setState({
                    projectArr: res.data.data
                },()=>{
                    // console.log('this.state.projectArr', this.state.projectArr);
                })
            }
        })   
    }
    // 重置订单
    resetOrder = () => {
        this.setState({
            parent_order_id: '',
            project_id: undefined,
            dateRange: [null, null]
        },()=>{
            this.getOrderList(false, true)
        })
    }

    render() {
        const { fatherOrderList, total, approvalModal, stepData, fileModal, fileList, isNull, newTime, dateRange, projectArr, project_id, parent_order_id } = this.state;
        const { paging } = this.props;
        const approvalData = {
            display: approvalModal,
            stepData,
            isHideModal: this.isHideModal
        };
        const fileData = {
            display: fileModal,
            fileList,
            isHideModal: this.isHideModal
        };
        return (
            <div className='all-order-list-warp'>
                {
                    fatherOrderList.length > 0 && window.location.hash !== '#/BuyerCenter'?
                    <div className="search-main-box">
                        <div className="input-box">
                            订单编号：
                            <Input placeholder="请输入订单编号" className="name" value={parent_order_id}  onChange={(e) => { this.handleOnchange('parent_order_id', e.target.value) }} />
                        </div>
                        <div className="input-box">
                            所属项目：
                            <Select className="select-input" placeholder="请选择所属项目" value={project_id}  onChange={(value) => { this.handleOnchange('project_id', value) }} >
                                {
                                    projectArr.length && projectArr.map((item, index) => {
                                        return <Option value={item.id} key={item.id}>{item.project_name}</Option>
                                    })
                                }
                            </Select>
                        </div>
                        <div className="input-box">
                            下单时间：
                            <RangePicker
                                value={dateRange}
                                format={dateFormat}
                                className='date'
                                onChange={this.DateChange}
                            />
                        </div>
                        
                        <div className="btn-box">
                            <Button onClick={() => { this.getOrderList(false, false) }}>搜索</Button>
                            <Button onClick={this.resetOrder}>重置</Button>
                        </div>
                    </div> : ''
                }
                {
                    fatherOrderList && fatherOrderList.map((item, index) => {
                        let state = "";
                        let isProject = true
                        switch (item.state) {
                            case 0:
                                state = "待提交";
                                isProject = false;
                                break;
                            case 1:
                                state = "待付款";
                                break;
                            case 2:
                                state = "待发货";
                                break;
                            case 3:
                                state = "运输中";
                                break;
                            case 4:
                                state = "已完成";
                                break;
                            case -1:
                                state = "已取消";
                                isProject = false;
                                break;
                            case -2:
                                state = "已关闭";
                                break;
                            case -3:
                                state = "已驳回";
                                break;
                        }
                        return (
                            <div className="order-list-box" key={item.id}>
                                <div className="order-list-head">
                                    <div className="time">
                                        下单时间：{item.create_time}
                                    </div>
                                    <div className="code">
                                        父订单编号：{item.id}
                                    </div>
                                    <div>
                                        {
                                            isProject &&
                                            <span>
                                                项目信息：{item.project}
                                            </span>
                                        }
                                    </div>
                                    <div>
                                        {
                                            (item.state == 0 || item.state == 1) && <p> <Icon type="clock-circle" /> &nbsp;待付款截止 {newTime[index]} </p>
                                        }
                                        {
                                            item.state == 0 &&
                                            <div>
                                                <Button type='primary'>
                                                    <Link to={`/payOrder?order_id=${item.id}`}>提交审批</Link>
                                                </Button> &nbsp;
                                                <Button onClick={() => { this.cancel_order(item.id) }}>取消订单</Button> &nbsp;
                                                <Link to={`/BuyerCenter/FatherOrdersDetails?order_id=${item.id}`}>查看详情</Link>
                                            </div>
                                        }
                                        {
                                            (item.state == 1 || item.state == 2 || item.state == 3) &&
                                            <div>
                                                <Link to={`/BuyerCenter/FatherOrdersDetails?order_id=${item.id}`}>查看详情</Link> &nbsp;
                                                {
                                                    item.approval_state == 1 && <span onClick={() => { this.orderApprovalProcess(item.id) }}>审批流程</span>
                                                }
                                                &nbsp; <span onClick={() => { this.getOrderFile(item.id) }}>查看附件</span>
                                            </div>
                                        }
                                        {
                                            item.state == -1 &&
                                            <div>
                                                <Button onClick={() => { this.buyAgain(item.id) }}>再次购买</Button>&nbsp;
                                                <Link to={`/BuyerCenter/FatherOrdersDetails?order_id=${item.id}`}>查看详情</Link>
                                            </div>
                                        }
                                        {
                                            (item.state == -3 || item.state == -2 || item.state == 4) &&
                                            <div>
                                                <Button onClick={() => { this.buyAgain(item.id) }}>再次购买</Button> &nbsp;
                                                <Link to={`/BuyerCenter/FatherOrdersDetails?order_id=${item.id}`}>查看详情</Link>  &nbsp;
                                                {
                                                    item.approval_state == 1 && <span onClick={() => { this.orderApprovalProcess(item.id) }}>审批流程</span>
                                                }
                                                &nbsp;<span onClick={() => { this.getOrderFile(item.id) }}>查看附件</span>
                                            </div>
                                        }
                                    </div>
                                </div>
                                <div className="order-list-content">
                                    <div>{item.product_count}种商品，共计{item.sum_count}件</div>
                                    <div>{state}</div>
                                    <div>账期支付</div>
                                    <div>¥{item.order_price}</div>
                                </div>
                            </div>
                        )
                    })
                }

                {
                    fatherOrderList.length == 0 && isNull && <Null title="暂无订单" type='order' />
                }


                {
                    total > 0 && !paging &&
                    <div className="pagination">
                        <Pagination current={this.state.page_number}
                            pageSize={this.state.page_size}
                            hideOnSinglePage={true}
                            onChange={this.paginationChange}
                            total={total} />
                    </div>
                }



                <ApprovalModal {...approvalData} />
                <FileModal {...fileData} />
            </div>
        )
    }

}