
// import 'babel-polyfill';
// import 'raf/polyfill';
// import 'babel-core';
import '@babel/polyfill'
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'core-js/es/map';
import 'core-js/es/set';

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import RouterList from "./router";
import {Provider} from "mobx-react";
import storesMobx from "./storesMobx";
import { LocaleProvider, message } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import 'antd/dist/antd.css';
import 'es6-symbol/implement';
const store = new storesMobx();

message.config({
    maxCount: 1,
 });

ReactDOM.render(
    <Provider store={store}>
        <LocaleProvider locale={zh_CN}>
            <RouterList />
        </LocaleProvider>
    </Provider>, document.getElementById('root'));

serviceWorker.unregister();
