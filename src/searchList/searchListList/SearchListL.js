import React from "react";
import {inject, observer} from 'mobx-react'
import Li from "./../../home/componentLi";
import "./SearchListL.scss";
@inject("store")
@observer
class SeaechListL extends React.Component{
    constructor(props) {
        super(props);
        this.state = {}
    }
    render(){
        const {listData} = this.props;
        return(
            <div className="searchList_body clear">
                <div className="supplies-list">
                    <ul>
                        {
                            listData && listData.map((item,index)=>(
                                <Li key={item.id} {...item} item={item}/>
                            ))
                        }
                    </ul>
                </div>
            </div>

        )
    }
}export default SeaechListL