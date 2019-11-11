import React from "react";
import "./index.scss";

export default class Shuffling extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            imgList:["shuffling1.png","shuffling3.jpg"],
            showIndex:0
        }
    };
    componentDidMount() {
        this.interval = setInterval(()=>{
            const {showIndex} = this.state;
            this.listIndex(showIndex + 1);
        },5000)
    };
    componentWillUnmount(){ clearInterval(this.interval); }
    //控制轮播图片当前的显示
    listIndex=(index)=>{
        const imgListLength = this.state.imgList && this.state.imgList.length;
        let showIndex = index;
        if(showIndex < 0){ showIndex = imgListLength-1; }
        if(showIndex > imgListLength-1){ showIndex = 0; }
        this.setState({ showIndex })
    };
    render(){
        const {imgList,showIndex} = this.state;
        return(
            <div className='shuffling-box'>
                <ul>
                    {
                        imgList && imgList.map( (item,index) =>(
                            <li key={index} style={{zIndex:index + 10}} className={showIndex == index ? "active" : ""}>
                                <img src={require(`./../../image/${item}`)} alt=""/>
                            </li>
                        ))
                    }
                </ul>
                <div className="imgUp" onClick={()=>{this.listIndex(showIndex - 1)}}> </div>
                <div className="imgDown" onClick={()=>{this.listIndex(showIndex + 1)}}> </div>
                <div className="imgListNav">
                    {
                        imgList && imgList.map((item,index)=>(
                            <span key={index} onClick={()=>{this.listIndex(index)}} className={(showIndex == index) ? "active" : ""}> </span>
                        ))
                    }
                </div>
            </div>
        )
    }
}