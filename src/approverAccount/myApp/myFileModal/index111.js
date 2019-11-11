import React from "react";
import {Link} from "react-router-dom";
import api from "../../../component/api";
import { Icon,Button,Pagination,Modal,message,Steps } from "antd";
import "./index.scss";
const { Step } = Steps;
export default class ApprovalModal extends React.Component{
    constructor(props) {
        super(props);
    }
    hideModal=()=>{
        this.props.isHideModal("fileModal",false)
    };
    render(){
        const {fileList} = this.props;
        return(
            <Modal
                className='accessory-model'
                destroyOnClose //清空弹窗
                width='560px'
                visible={this.props.display}
                //title='附件列表'
                onCancel={this.hideModal}
                maskClosable={false}
                footer={[<div></div>]}
            >

                <div className="approval-modal-box">
                    {
                        fileList.length > 0 ?
                            fileList.map((item)=>{
                                const fileType = item.substring(item.lastIndexOf(".")+1);
                                let typeIcon = null;
                                switch (fileType) {
                                    case "ppt":
                                        typeIcon = <Icon className='ppt' type="file-ppt" theme="filled" />;
                                        break;
                                    case "word":
                                        typeIcon = <Icon className='word' type="file-word" theme="filled" />;
                                        break;
                                    case "pdf":
                                        typeIcon = <Icon className='pdf' type="file-pdf" theme="filled" />;
                                        break;
                                    case "xlsx":
                                        typeIcon = <Icon className='xlsx' type="file-excel" theme="filled" />;
                                        break;
                                }
                                const name = item.substring(item.indexOf("-")+1);
                                return(
                                    <div className="file-list-box" key={name}>
                                        <div>
                                            {
                                                typeIcon ? typeIcon : <img src={`${api.imgUrl}${item}`} alt=""/>
                                            }
                                        </div>
                                        <p>{name}</p>
                                        <a target='_blank' href={`${api.imgUrl}${item}`}>查看文件</a>
                                    </div>
                                )
                            }):
                            <p>暂无附件</p>
                    }
                </div>
            </Modal>
        )
    }

}