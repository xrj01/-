import React from "react";
import {Modal,Icon,Button} from "antd";
import "./index.scss";

export default class ShoppingModal extends React.PureComponent{
    constructor(props) {
        super(props);
    }

    //隐藏弹出层
    hideModal=(isFun)=>{
        this.props.hideModal(isFun);
    };

    render(){
        return(
            <Modal
                onCancel={()=>{this.hideModal(false)}}
                maskClosable={false}
                width={440}
                height={174}
                footer={[
                    <Button type='primary' onClick={()=>{this.hideModal(this.props.performFn)}}>确定</Button>
                ]}
                className='shopping-modal'
                visible={this.props.displayModal}>

                <div className='shopping-modal-box'>
                    <p>
                        <Icon type="exclamation-circle" />
                        {this.props.modalTitle}
                    </p>
                </div>
            </Modal>
        )
    }

}

