import React from "react";
import { Map, Marker, InfoWindow, Geocoder } from 'react-bmap';
import BMap from "BMap";
import { Input, Button, message, Select, Pagination } from "antd";
import Nav from "./../components/nav";
import Footer from "./../components/footer/newFootHelp/Footer";
import "./index.scss";
import img from "./../image/home-new.png";
import api from "../component/api";
import { Link, Route } from 'react-router-dom';
import prompt from "../component/prompt";
import errorImg from "./../image/moren-list.png";
const { Search } = Input;
const Option = Select.Option;
export default class SupplierMap extends React.Component {
    constructor(props) {
        const match = props.match.path;
        super(props);
        this.state = {
            match: match,
            zoomMap: 11,
            infoWindow: [],
            MarkerList: [],
            centerName: "", //百度地图中心坐标名称
            centerCoordinates: { lng: 104.081534, lat: 30.655822 }, //百度地图中心坐标
            page_number: 1,
            page_size: 5,
            type: 0,
            search_word: "",
            search_site: '',
            merchantsList: [],
            total: 0,
            isNull: false,
            retrievalAddress: [],  // 检索地点的地址数组
            result: "",
        };
        this.imgRef = React.createRef();
    };
    componentDidMount() {

        var ac = new BMap.Autocomplete({ input: "searchInput", location: '全国' }); //建立一个自动完成的对象

        ac.addEventListener("onhighlight", this.handleHighlight);

        ac.addEventListener("onconfirm", this.handleConform);
    }
    //地图中心点
    mapCenter = (centerName) => {
        let myGeo = new BMap.Geocoder();
        myGeo.getPoint(centerName, (point) => {
            if (point) {
                this.setState({
                    centerCoordinates: point
                })
            } else {
                message.error("输入的地址百度地图不能解析");
            }
        }, "中国");
    };

    //值改变
    selectChange = (type, value) => {
        //console.log(type,value);
        
        this.setState({
            [type]: value
        })
    };
    infoWindow = (item) => {
        const infoWindow = [item]
        this.setState({
            infoWindow
        })
    };
    //点击搜索
    searchMerchantsForMap = (page) => {
        const { page_number, page_size, type, search_word } = this.state;
        if (!page) {
            this.setState({ page_number: 1 })
        }
        const data = { page_number: page ? page : 1, page_size, type, search_word };
        if (!search_word) { message.error("请输入搜索内容"); return false };
        api.axiosPost("search_merchants_for_map", data).then((res) => {
            if (res.data.code == 1) {
                this.setState({
                    merchantsList: res.data.data.list,
                    total: res.data.data.total_row,
                    isNull: true
                });
                if (res.data.data.list.length > 0) {
                    const address = res.data.data.list[0];
                    const addName = `${address.address_1}${address.address_2}${address.address_3}${address.license_address_info}`;
                    this.mapCenter(addName);
                }
            } else {
                message.error(res.data.msg)
            }
        })
    };
    // 搜索目的地
    searchSite = (e, ) => {
        const { search_site } = this.state;
        if (!search_site) { message.error("请输入搜索内容"); return false }
        let onSearchComplete = (result) => {
            this.setState({
                retrievalAddress: result.Ar,
                centerCoordinates: result.Ar[0].point,
                zoomMap: 18
            })
        }

        let myLocalSearch = new BMap.LocalSearch(new BMap.Point(104.081534, 30.655822), { onSearchComplete: onSearchComplete })
        myLocalSearch.search(search_site);

    }
    errorImg = () => {
        if (this.imgRef.current) {
            this.imgRef.current.src = errorImg;
        }
    };

    handleConform = e => {
        //鼠标点击下拉列表后的事件
        let _value = e.item.value;
        let myValue =
            _value.province +
            _value.city +
            _value.district +
            _value.street +
            _value.business;

        this.setState({
            result: (
                <div>
                    onconfirm index = {e.item.index} myValue = {myValue}
                </div>
            ),
            search_site: myValue
        });

        this.setPlace(myValue);
    };

    myFun = result => {
        var pp = result.getPoi(0).point; //获取第一个智能搜索的结果

        this.setState({
            centerCoordinates: pp,
            zoomMap: 18,
            retrievalAddress: result.Ar,
        })
    };

    setPlace(myValue) {
        // this.map.clearOverlays(); //清除地图上所有覆盖物

        let local = new BMap.LocalSearch('全国', {
            //智能搜索
            onSearchComplete: this.myFun
        });
        local.search(myValue);
    }

    handleHighlight = e => {
        //鼠标放在下拉列表上的事件
        var str = [];
        var _value = e.fromitem.value;
        var value = "";
        if (e.fromitem.index > -1) {
            value =
                _value.province +
                _value.city +
                _value.district +
                _value.street +
                _value.business;
        }
        str.push(
            <div>
                FromItem index = {e.fromitem.index} value = {value}
            </div>
        );

        value = "";
        if (e.toitem.index > -1) {
            _value = e.toitem.value;
            value =
                _value.province +
                _value.city +
                _value.district +
                _value.street +
                _value.business;
        }
        str.push(
            <div>
                ToItem index = {e.toitem.index} value = {value}
            </div>
        );

        this.setState({ result: str });
    };


    render() {
        const navData = { match: this.state.match };
        const { infoWindow, centerCoordinates, merchantsList, isNull, retrievalAddress, search_site,search_word,type } = this.state;
        const selectAfter = (
            <Select value={this.state.type} onChange={(value) => { this.selectChange("type", value) }} style={{ width: 100 }}>
                <Option value={0}>商品名称</Option>
                <Option value={2}>供 应 商</Option>
                <Option value={1}>公司地址</Option>
            </Select>
        );
        //console.log(type);
        
        return (
            <div className='supplier-map-box'>
                <Nav {...navData} />
                <div className="supplier-map" id='all'>
                    <Map
                        // ref={ref => { this.map = ref.map }}
                        enableScrollWheelZoom={true}
                        center={centerCoordinates} zoom={this.state.zoomMap}>

                        {
                            merchantsList && merchantsList.length > 0 && merchantsList.map((item, index) => {
                                const lng = item.coordinates.split(",")[0];
                                const lat = item.coordinates.split(",")[1];
                                return (
                                    <Marker key={index} position={{ lng: `${lng}`, lat: `${lat}` }} >
                                        <div onClick={() => { this.infoWindow(item) }} className='map-marker'> </div>
                                    </Marker>
                                )
                            })
                        }
                        {
                            retrievalAddress && retrievalAddress.length > 0 && retrievalAddress.map((item, index) => {
                                return (
                                    <Marker key={index} position={item.point} >
                                        {/* <div onClick={()=>{this.infoWindow(item)}} className='map-marker'> </div> */}
                                    </Marker>
                                )
                            })
                        }
                        {
                            infoWindow.length && infoWindow.map((item, index) => {
                                const lng = item.coordinates.split(",")[0];
                                const lat = item.coordinates.split(",")[1];
                                return (
                                    <InfoWindow key={item.merchant_id} position={{ lng: `${lng}`, lat: `${lat}` }} text=""
                                        title={item.merchant_name} />
                                )
                            })
                        }
                    </Map>

                    <div className="supplier-map-list-box">
                        <div className="supplier-map-list-search">
                            <Search
                                addonBefore={selectAfter}
                                placeholder="请输入搜索关键字"
                                enterButton="搜索"
                                onChange={(e) => { this.selectChange("search_word", e.target.value) }}
                                size="large"
                                maxLength={30}
                                onSearch={() => { this.searchMerchantsForMap() }} />
                        </div>

                        {
                            this.state.total == 0 && isNull &&
                            <div className="supplier-search-list-head">
                                <span>暂无搜索结果</span>
                            </div>
                        }

                        {
                            merchantsList && merchantsList.length > 0 &&
                            <div className="supplier-map-search-list">
                                <div className="supplier-search-list-head">
                                    搜索结果共计：<span>{this.state.total}条</span>
                                </div>
                                <ul>
                                    {
                                        merchantsList && merchantsList.map((item) => {
                                            let productTitle ='';
                                            let merchantTitle = '';
                                            let addressTitle = '';
                                            let address =` ${item.address_1 + item.address_2 + item.address_3 + item.license_address_info}`
                                            // 商品
                                            if(item.product_name.indexOf(search_word) > -1 && type===0){
                                                productTitle = item.product_name.replace(new RegExp(search_word,'g'), `<i style='color: #D01D00'>${search_word}</i>`)
                                            }else{
                                                productTitle = item.product_name
                                            }
                                            // 公司
                                            if(item.merchant_name.indexOf(search_word) > -1 && type===2){
                                                merchantTitle = item.merchant_name.replace(new RegExp(search_word,'g'), `<i style='color: #D01D00'>${search_word}</i>`)
                                            }else{
                                                merchantTitle = item.merchant_name
                                            }
                                            // 地址
                                            if(address.indexOf(search_word) > -1 && type===1){
                                                addressTitle = address.replace(new RegExp(search_word,'g'), `<i style='color: #D01D00'>${search_word}</i>`)
                                            }else{
                                                addressTitle = address
                                            }
                                            return (<li key={item.merchant_id}>
                                                        <img ref={this.imgRef} src={prompt.imgUrl(item.merchant_id, item.product_id)} alt="" onError={this.errorImg} />
                                                        <div className="supplier-search-goods-content">
                                                            {/* <h3><Link to={`/SupplierDetails?${item.merchant_id}`} target='_blank'>{item.merchant_name}</Link></h3> */}
                                                            <h3><Link to={`/SupplierDetails?${item.merchant_id}`} target='_blank' dangerouslySetInnerHTML={{__html:merchantTitle}}></Link></h3>
                                                            <p dangerouslySetInnerHTML={{__html:productTitle}}></p>
                                                            <p><i className='iconfont iconaddress'> </i><span dangerouslySetInnerHTML={{__html:addressTitle}}></span></p>
                                                        </div>
                                                </li>)
                                            
                                        })
                                    }
                                </ul>
                                <div className="pagination" style={{ textAlign: "right", padding: "0 15px" }}>
                                    <Pagination
                                        hideOnSinglePage={true}
                                        onChange={(page) => {
                                            this.setState({ page_number: page }, () => {
                                                this.searchMerchantsForMap(page)
                                            })
                                        }}
                                        current={this.state.page_number} total={this.state.total} pageSize={5} />
                                </div>
                            </div>
                        }

                    </div>
                    <div className="supplier-map-site-box">
                        <div>
                            <Search
                                //addonBefore={selectAfter}
                                placeholder="请输入收货目的地"
                                enterButton="搜索"
                                onChange={(e) => { this.selectChange("search_site", e.target.value) }}
                                size="large"
                                maxLength={30}
                                id='searchInput'
                                value={search_site}
                                onSearch={() => { this.searchSite() }} />
                                
                            <div
                                id="searchResultPanel"
                                style={{
                                    border: "1px solid #C0C0C0",
                                    height: "100px",
                                    marginBottom: " 20px",
                                    display: 'none'
                                }}
                            >
                                {this.state.result}
                            </div>
                            <div
                                className="mapContainer"
                                id="mapContainer"
                                style={{ height: "500px", width: "100%" }}
                            />
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        )
    }
}