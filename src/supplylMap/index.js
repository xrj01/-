import React from "react";
import {Map,Marker,InfoWindow,Geocoder} from "react-amap";
// import AMap from "AMap";
import {Input,Button,message} from 'antd';
import './index.scss';


class supplierMap extends React.Component{
  constructor (props) {
    super(props)
    this.state = {
      centerCoordinates:{longitude: 104.081534, latitude: 30.655822}, //中心显示坐标
      zoom: 11,  //默认缩放级别
      screenWindow: [],
      // 坐标点
      MarkerPosition: [
        { longitude:"104.055608", latitude:"30.557603"},
        { longitude:"104.053608", latitude:"30.566594"},
        { longitude:"104.052938", latitude:"30.552952"},
        { longitude:"104.063832", latitude:"30.54855"},
        { longitude:"104.06963", latitude:"30.544089"},
        { longitude:"104.054736", latitude:"30.604189"},
      ],
      visible: false,
      centerName: '', // 供应商地址
      goodName: '',   //商品名称
    }
    this.markerEvents = {
      click: (e) => {
        const screenWindow = [{longitude:e.lnglat.lng,latitude:e.lnglat.lat}]
        this.setState({screenWindow,visible:true})
      }
    }
    const _this = this;
    this.mapEvents = {
      /* 对于高德尚未提供的组件，需要在mao组件的created事件中进行手动创建 */
      created(map){
      	_this.map = map;
        window.AMap.plugin('AMap.Geocoder',() => {
          _this.geocoder = new window.AMap.Geocoder({
              city: '全国'//城市，默认：“全国”
          });
         })
      }
    }
    this.mapCenter = this.mapCenter.bind(this);
  }
  /* 获取输入框的值，赋值状态 */
  inputChange = (type, value) => {
    this.setState({
      [type]:value
    })
  }
  /* 地址>坐标 */
  mapCenter = () => {
    const {centerName} = this.state;
    const _that = this;
    /* 使用高德地图地理编码 地址>坐标   方法 getLocation */
    this.geocoder.getLocation(centerName, function(status, result) {
      if (status === 'complete' && result.info === 'OK') {
        // result中对应详细地理坐标信息
        let {lng,lat} = result.geocodes[0].location
        _that.setState({
          centerCoordinates:{longitude:lng,latitude:lat}
        })
      }else {
        message.error("输入的地址高德地图不能解析");
      }
    })
  }

  render () {
    /* 
      高德开放平台的key  「 Web 端 ( JSAPI ) 」
    */
   
    const amapkey = 'c7b5a7da689a5480d645582173843a1f';
    const {centerCoordinates, MarkerPosition, screenWindow} = this.state;
    return (
      <div className="supplierMapBox">
        <Map 
          amapkey={amapkey}
          plugins={['ToolBar']}
          center = {centerCoordinates}
          zoom = {this.state.zoom}
          events = {this.mapEvents}
        >
          {
            MarkerPosition && MarkerPosition.length && MarkerPosition.map((item, index) => (
              <Marker 
                key={index} 
                position= {item} 
                animation= {"AMAP_ANIMATION_DROP"}
                events = {this.markerEvents}
              >
      
              </Marker>
            ))
          }
          {
            screenWindow && screenWindow.length && screenWindow.map((item, index) => (
                <InfoWindow
                  key = {index}
                  position = {item}
                  visible = {this.state.visible}
                />
              ))
          }
        </Map>

        <div className="supplierSearchWhole">
          <div className="supplierSearchBox">
            {/* <label htmlFor=""></label> */}
            <div>
              <p><span>收货地址：</span><Input size="default" 
                                              onChange={(e)=>{this.inputChange("centerName",e.target.value)}} 
                                              onBlur={this.mapCenter}
                                              placeholder="收货地址" className="inputCss"></Input>
              </p>
              <p><span>商品名称：</span><Input size="default" 
                                              onChange={(e)=>{this.inputChange("goodName",e.target.value)}} 
                                              placeholder="商品名称" className="inputCss"></Input>
              </p>
            </div>
            <div>
            <Button type='primary' className="buttonCss">搜索</Button>
            </div>
          </div>
          <div className="supplierResult">
            暂无搜索结果！
          </div>
        </div>
      </div>
    )
  }
}

export default supplierMap;