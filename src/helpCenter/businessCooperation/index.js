import React from "react";
import "./index.scss";
import WinButton from "../../components/winButton/index"

export default class ThatTemplate extends React.Component{
    constructor(props) {
        super(props);
        this.state={
        }
    }

    render(){
        return(
            <div className='thatTemplate-box'>
                <div className='thatTemplate-container'>
                    <div className='thatTemplate-title'>
                        商务合作
                    </div>
                    {/* 内容 */}
                    <div className='thatTemplate-content-box'>
                        <div className='thatTemplate-content-title'>电话：028-83368980</div>
                        <div className='thatTemplate-content-character'>地址：成都市高新区天府三街218号峰汇中心1号楼701</div>
                    </div>
                </div>
                <WinButton/>
            </div>
        )
    }
}