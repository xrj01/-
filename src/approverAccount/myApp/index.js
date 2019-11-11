import React from "react";
import { Route, Switch ,Link} from 'react-router-dom';
import {Tabs,Button,Table,Pagination,Modal,Input,Select,DatePicker} from "antd";
import {inject, observer} from "mobx-react";
import MyAppHome from './myAppHome'
import "./index.scss"
@inject("store")
@observer
class MyApp extends React.PureComponent{
    constructor(props) {
        super(props);
        this.state={
            
            activeKey:'0', // tab切换

        }
        
    

    }
   
    render(){
        const { TabPane } = Tabs;
        const {store} = this.props;
        const tabsKey = store.searchApp.tabsKey;
        //console.log(666,tabsKey);
        return(
            <div className='myApp-box'>
                <div className='myApp-container'>
                    <Tabs defaultActiveKey={tabsKey}  onChange={this.callback}>
                        <TabPane tab="待审批" key="0">
                            {
                                tabsKey === '0' ? <MyAppHome tabskey={tabsKey}/> : <div></div>
                            }
                        </TabPane>
                        <TabPane tab="已审批" key="1">
                            {
                                tabsKey === '1' ? <MyAppHome tabskey={tabsKey}/> : <div></div>
                            }
                            
                        </TabPane>
                        
                    </Tabs>
                </div>

            </div>
        )
    }
    // tabs切换
    callback =(key)=> {
        //console.log(key);
        /* if(key == '0'){
            sessionStorage.setItem('key',0)
        }else{
            sessionStorage.setItem('key',1)
        } */
        
        const {store} = this.props;
        store.searchApp.tabsChange(key)

        this.setState({
            activeKey : key
        })
        

    }
    /* componentDidMount(){
        this.setState({
            activeKey : sessionStorage.getItem('key') ? sessionStorage.getItem('key') : '0'
        })
    } */
    
}

export default MyApp