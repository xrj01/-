import React from "react";
import {Modal,message,Table,Input,Button,InputNumber } from "antd";
import {inject, observer} from "mobx-react";
import api from "./../../component/api";
import prompt from "./../../component/prompt";
import "./index.scss";
@inject("store")
@observer
class CompareModal extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            columns:[
                {
                    title: '商品名称',
                    dataIndex: 'title',
                    key: 'title',
                },
                {
                    title: '规格型号',
                    dataIndex: 'standards',
                    key: 'standards',
                },
                {
                    title: '供应商',
                    dataIndex: 'company',
                    key: 'company',
                },
                {
                    title: '单价',
                    dataIndex: 'price',
                    key: 'price',
                    width:90,
                    align: 'center',
                    sorter: (a, b) => a.price - b.price,
                    render:(text)=>{
                        return <span>￥{text}</span>
                    }
                },
                {
                    title: '库存',
                    dataIndex: 'inventory',
                    key: 'inventory',
                    width:90,
                    align: 'center',
                    sorter: (a, b) => a.inventory - b.inventory,
                },
                {
                    title: '数量',
                    dataIndex: 'number',
                    key: 'number',
                    render:(text,record)=>{
                        return(
                            <div className='price-comparison-input-number'>
                                <button onClick={()=>{this.numberChange("-",record)}}>-</button>
                                <InputNumber
                                    style={{textAlign:"center"}}
                                    onChange={(value)=>{this.numberChange(value,record)}}
                                    value={text}
                                    min={1}
                                    max={record.inventory}
                                    className='price-comparison-input compare-bar-input'/>
                                    <button onClick={()=>{this.numberChange("+",record)}}>+</button>
                            </div>
                        )
                    }
                },
                {
                    title: '小计',
                    dataIndex: 'subtotal',
                    key: 'subtotal',
                    render:(text,record)=>{
                        return(
                            <span>￥{(record.number * record.price).toFixed(2)}</span>
                        )
                    },
                    sorter: (a, b) => (a.price * a.number) - (b.price * b.number),
                },
                {
                    title: '操作',
                    dataIndex: 'operation',
                    key: 'operation',
                    align: 'center',
                    render:(text,record)=>{
                        return(
                            <Button type='primary' onClick={()=>{this.addShopping(record)}}>加入购物车</Button>
                        )
                    }
                },
            ]
        }
    };
    //模板点击取消事件
    onCancel=()=>{
        const {store} = this.props;
        store.contrast.isShowCompareBarModal(false);
    };
    //数量改变
    numberChange=(value,record)=>{
        const {store} = this.props;
        if(value == "+" || value == "-" || prompt.isNumber(value)){
            if(value > record.inventory){
                message.error("数量大于库存，不能操作"); return
            }
            const newArr = [];
            store.contrast.compareBarModalList.map((item,index)=>{
                if(item.sku == record.sku){
                    if(value == "-"){
                        let number = record.number - 1;
                        if(number < 1){number = 1}
                        record.number = number;
                    }else if(value == "+"){
                        let number = record.number + 1;
                        if(number > record.inventory){number = record.inventory}
                        record.number = number;
                    }else{
                        record.number = parseInt(value);
                    }
                    record.key = item.sku;
                }
                newArr.push(item);
            });
            store.contrast.compareBarModalList = newArr
        }else{
            return;
        }
    };
    //加入购物车
    addShopping=(record)=>{
        const {store} = this.props;
        if(!prompt.isNumber(record.number)){
            message.error('输入的数量不符合规定');
            return false;
        }
        const data={
            product_id:record.product_id,
            count:record.number,
            sku:record.sku
        };
        if(record.type == "jd"){
            data.title = record.title;
            data.pic = record.pic;
            data.price = record.price;
            data.type = record.type
        }
        store.shoppingCart.addShopping(data)
    };
    render(){
        const {columns} = this.state;
        const {store} = this.props;
        const token = prompt.getSession("token");
        const dataSource = store.contrast.compareBarModalList;
        return(
            <Modal
                width={1200}
                visible={store.contrast.compareBarModal}
                title="对比栏"
                className='modal'
                maskClosable={false}
                footer={[
                    <Button type='primary' className="modal-comparison-btn">
                        <a target='_blank' href={`${api.urlApi.excelWriteWithHead}?id=${store.contrast.exportId}&token=${token}`}>导出比价表</a>
                    </Button>
                ]}
                onCancel={this.onCancel}
            >
                <Table bordered dataSource={dataSource} className='price-comparison-table-box' columns={columns} pagination={false}> </Table>
            </Modal>
        )
    }
}

export default CompareModal;