import React from "react";
import {Link} from "react-router-dom";
import api from "./../../../component/api";
import { Icon,Button,Pagination,Modal,message,Steps } from "antd";
//import "./../approvalModal/index.scss";
import './index.scss'
const { Step } = Steps;
export default class ApprovalModal extends React.Component{
    constructor(props) {
        super(props);
    }
    hideModal=()=>{
        this.props.isHideModal("fileModal",false)
    };

    //查看附件
    fileLink=(item)=>{
        const data={
            file_name:item
        };
        api.axiosGet("getProductLookSign",data).then((res)=>{
            if(res.status == 200){
                window.open(res.data.url)
            }
        })
    };
    render(){
        const {fileList} = this.props;
        return(
            <Modal
                className='accessory-model'
                visible={this.props.display}
                title='附件列表'
                onCancel={this.hideModal}
                width={650}
                centered = {true}
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
                                        typeIcon = "img_ppt.png";
                                        break;
                                    case "word":
                                        typeIcon = "img_word.png";
                                        break;
                                    case "pdf":
                                        typeIcon = "img_pdf.png";
                                        break;
                                    case "xlsx":
                                        typeIcon = "img_exl.png";
                                        break;
                                    case "xls":
                                        typeIcon = "img_exl.png";
                                        break;
                                    case "doc":
                                        typeIcon = "img_word.png";
                                        break;
                                }
                                const name = item.substring(item.indexOf("-")+1);
                                return(
                                    <div className="file-list-box" key={name}>
                                        <div>
                                            <span>
                                                {
                                                    typeIcon && <img src={require(`./../../../image/${typeIcon}`)} alt=""/>
                                                }
                                            </span>
                                        </div>
                                        <p>{name}</p>
                                        <a target='_blank' href='javascript:;' onClick={()=>{this.fileLink(item)}}>查看文件</a>
                                    </div>
                                )
                            }):
                            <p className='approval-modal-noatt'>暂无附件</p>
                    }
                </div>
            </Modal>
        )
    }

}