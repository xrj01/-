import React,{Component} from "react";
import {observer,inject} from "mobx-react";
import Nav from "./../components/nav";
import Shuffling from "./../components/shuffling";
import SuppliesList from "./suppliesList";
import Footer from './../components/footer/newFootHelp/Footer'
import api from "./../component/api";
import PriceConponents from "./../components/priceComponents";
import WinButton from "../components/winButton/index"
import "./index.scss";
import {createHashHistory} from "history";
const history = createHashHistory();
@inject("store")
@observer
class Home extends Component{
    constructor(props) {
        super(props);
        const match = props.match.path;
        this.state={
            match:match,   //当前的路由
            homeGoodIndex:0,  //新鲜好物当前索引
            homeGoodDom:null,
            compareBarModal:false,
            floorList:[],
            jdFloorList:[]
        }
    }

    componentDidMount() {
        this.qiniuProductList();
        this.jdProductList();
        if(sessionStorage.getItem('type')!='2'){
            history.push('/404')
        }
        
    }

    //首页楼层商品
    qiniuProductList=()=>{
        api.axiosPost('qiniuProductList').then((res)=>{
            if(res.data.code == 1){
                this.setState({
                    floorList:res.data.data
                })
            }
        })
    };
    //首页JD楼层商品
    jdProductList=()=>{
        api.axiosPost('jdProductList').then((res)=>{
            if(res.data.code == 1){
                this.setState({
                    jdFloorList:res.data.data
                })
            }
        })
    };
    isShowModal=(type,isTrue)=>{
        this.setState({
            [type]:isTrue
        })
    };
    render(){
        const {match,floorList,jdFloorList} = this.state;
        const {store} = this.props;
        const nanDate={
            match,
            isClassList:true,  //设置导航显示全部分类菜单
            isFixed: true
        };
        const compareBarModalDate={
            display:this.state.compareBarModal,
            hideModal:this.isShowModal
        };
        return(
            <div style={{background:"#F6F5F5"}}>
                <Nav {...nanDate}/>
                <div className='home-warp'>
                    <div className="home-shuffling-warp">
                        <div className="home-shuffling-box">
                            <Shuffling />
                        </div>
                    </div>
                    {
                        floorList && floorList.length > 0 && floorList.map((item,index)=>(
                            <SuppliesList productList={item.product_list}
                                          listIndex={index} key={item.id}
                                          imgKey={item.id}
                                          type="anniu"
                                          suppliesNavList={item.child_class}
                                          titleName={item.name}/>
                        ))
                    }
                    {
                        jdFloorList && jdFloorList.length > 0 && jdFloorList.map((item,index)=>(
                            <SuppliesList productList={item.product_list}
                                          listIndex={index}
                                          key={item.id}
                                          type="jd"
                                          imgKey={item.id}
                                          suppliesNavList={item.child_class} titleName={item.name}/>
                        ))
                    }
                </div>
                <Footer />

                <PriceConponents />
                <WinButton/>
            </div>
        )
    }
}
export default Home