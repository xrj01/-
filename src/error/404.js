import React from "react";
import "./index.scss";
export default class Error extends React.Component{
    constructor(props) {
        super(props);
    }
    render(){
        return(
            <div className='error404'>
                <img src={require(`./../image/404.jpg`)} alt="404图片"/>
            </div>
        )
    }
}