import Home from "./home";
import Error from "./error/404";
import SupplierMap from "./supplierMap";
import ClassList from "./classList/index";
import ClassJDList from "./classJDList/index";
import GoodsDetails from "./goodsDetails";
import JDgoodsDetails from "./JDgoodsDetails";
import AdminJDdetails from "./adminJDdetails";
import Admindetails from "./adminDetails";
import ShoppingCart from "./shoppingCart";
import Order from "./order";
import PayOrder from "./order/payOrder";
import AuditOrder from "./order/auditOrder";
import SearchList from "./searchList";
import BusinessAccount from "./businessAccount";//企业总账户
import BusPersonal from "./businessAccount/busPersonal";
import BusSecuritySet from "./businessAccount/busSecuritySet";
import BusDepartment from "./businessAccount/busDepartment";
import BusUser from "./businessAccount/busUser";
import BusProject from "./businessAccount/busProject";
import BusApproval from "./businessAccount/busApproval";
import BusOrder from "./businessAccount/busOrder";
import BusBill from "./businessAccount/busBill";
import BusStatistics from "./businessAccount/busStatistics";
import BusGoods from "./businessAccount/busGoods";
import BusConsume from "./businessAccount/busConsume";

import SupplierDetails from "./supplierDetails";
import HelpCenter from "./helpCenter";
import CommonProblems from "./helpCenter/commonProblems";
import ThatTemplate from "./helpCenter/thatTemplate";
import Invoicefaqs from "./helpCenter/invoicefaqs";
import ClientIntroduce from "./helpCenter/clientIntroduce";
import SalesService from "./helpCenter/salesService";
import DeliveryAcceptance from "./helpCenter/deliveryAcceptance";
import BusinessCooperation from "./helpCenter/businessCooperation";
import AboutUs from "./helpCenter/aboutUs";
import Registered from "./registered";
import GoodSupplier from "./goodSupplier/index";
import BuyerUserCenter from "./buyerCenter/userCenter";
import BuyerMessageCenter from "./buyerCenter/messageCenter";
import BuyerSecuritySet from "./buyerCenter/securitySet";
import BuyerAddressManagement from "./buyerCenter/addressManagement";
import BuyerInvoiceManagement from "./buyerCenter/invoiceManagement";
import PriceComparison from "./buyerCenter/priceComparison";
import MyOrder from "./buyerCenter/myOrder";
import CollectionGoods from "./buyerCenter/collectionGoods";
import CollectionMerchants from "./buyerCenter/collectionMerchants";
import FatherOrdersDetails from "./buyerCenter/fatherOrdersDetails";
import ChildOrderDetails from "./buyerCenter/childOrderDetails";

import AddbusApproval from "./businessAccount/addbusApproval";
import EditbusApproval from "./businessAccount/editbusApproval";
import ParentOrder from "./businessAccount/busOrder/parentOrder";
import SonOrder from "./businessAccount/busOrder/sonOrder";

import AdminAccount from "./adminAccount/index"; //管理员账户
import AdminBusPersonal from "./adminAccount/busPersonal"; 
import AdminBusSecuritySet from "./adminAccount/busSecuritySet"; 
import AdminBusDepartment from "./adminAccount/busDepartment"; 
import AdminBusUser from "./adminAccount/busUser"; 
import AdminBusProject from "./adminAccount/busProject"; 
import AdminBusApproval from "./adminAccount/busApproval"; 
import AdminAddbusApproval from "./adminAccount/addbusApproval"; 
import AdminEditbusApproval from "./adminAccount/editbusApproval"; 

import ApproverAccount from "./approverAccount/index"; //审批员账户
import AppBusPersonal from "./approverAccount/busPersonal"; 
import AppBusSecuritySet from "./approverAccount/busSecuritySet"; 
import AppBusWhySet from "./approverAccount/busWhySet"; 
import AppMessageCenter from "./approverAccount/messageCenter"; 
import MyApp from "./approverAccount/myApp"; 
import MyAppParentOrder from "./approverAccount/myApp/parentOrder"; 


import BuyerCenter from "./buyerCenter";
//路由配置 需要优化
const routes = [
    {  path: "/Home", component: Home , name:"首页"},
    { path:"/supplierMap",component:SupplierMap, name:"供应商地图" },
    // { path:"/Amap",component:Amap, name:"高德地图" },
    { path:"/classList",component:ClassList, name:"商品分类列表" },
    { path:"/ClassJDList",component:ClassJDList, name:"京东商品分类列表" },
    { path:"/GoodsDetails",component:GoodsDetails, name:"商品详情页面" },
    { path:"/JDgoodsDetails",component:JDgoodsDetails, name:"京东商品详情页面" },
    { path:"/AdminJDdetails",component:AdminJDdetails, name:"账户京东商品详情页面" },
    { path:"/Admindetails",component:Admindetails, name:"账户商品详情页面" },
    { path:"/SupplierDetails",component:SupplierDetails, name:"供应商详情" },
    { path:"/GoodSupplier",component:GoodSupplier, name:"优质供应商列表" },
    { path:"/ShoppingCart",component:ShoppingCart, name:"购物车" },
    { path:"/Order",component:Order, name:"填写订单" },
    { path:"/payOrder",component:PayOrder, name:"支付订单" },
    { path:"/AuditOrder",component:AuditOrder, name:"审核订单" },
    { path:"/SearchList",component:SearchList, name:"搜索列表" },
    { path:"/HelpCenter",component:HelpCenter, name:"帮助中心" },
    { path:"/Registered",component:Registered, name:"注册用户" },
    { path:"/CommonProblems",component:CommonProblems, name:"常见问题",
        routes:[
            { path: "/CommonProblems/ThatTemplate", component: ThatTemplate ,name:"购物常见问题", meta: '常见问题'},
            { path: "/CommonProblems/Invoicefaqs", component: Invoicefaqs ,name:"发票常见问题", meta: '常见问题'},
            { path: "/CommonProblems/ClientIntroduce", component: ClientIntroduce ,name:"企牛采客户介绍", meta: '常见问题'},
            { path: "/CommonProblems/SalesService", component: SalesService ,name:"售后服务", meta: '常见问题'},
            { path: "/CommonProblems/DeliveryAcceptance", component: DeliveryAcceptance ,name:"配送与验收", meta: '常见问题'},
            { path: "/CommonProblems/BusinessCooperation", component: BusinessCooperation ,name:"商务合作", meta: '关于我们'},
            { path: "/CommonProblems/AboutUs", component: AboutUs ,name:"关于我们", meta: '关于我们'},
        ]
    },

    { path:"/BuyerCenter",component:BuyerCenter,name:"采购员账户",
        routes: [
            { path: "/BuyerCenter", component: BuyerUserCenter ,name:"个人中心",meta: '我的账户',exact:true},
            { path: "/BuyerCenter/messageCenter", component: BuyerMessageCenter ,name:"消息通知",meta: '我的账户'},
            { path: "/BuyerCenter/securitySet", component: BuyerSecuritySet ,name:"安全设置",meta: '我的账户'},
            { path: "/BuyerCenter/addressManagement", component: BuyerAddressManagement ,name:"地址管理",meta: '我的账户'},
            { path: "/BuyerCenter/InvoiceManagement", component: BuyerInvoiceManagement ,name:"发票管理",meta: '我的账户'},
            { path: "/BuyerCenter/PriceComparison", component: PriceComparison ,name:"比价记录",meta: '交易管理'},
            { path: "/BuyerCenter/MyOrder", component: MyOrder ,name:"我的订单",meta: '交易管理'},
            { path: "/BuyerCenter/CollectionGoods", component: CollectionGoods ,name:"收藏的商品",meta: '我的收藏'},
            { path: "/BuyerCenter/CollectionMerchants", component: CollectionMerchants ,name:"收藏的店铺",meta: '我的收藏'},
            { path: "/BuyerCenter/FatherOrdersDetails", component: FatherOrdersDetails ,name:"父订单详情",meta: '父订单详情'},
            { path: "/BuyerCenter/ChildOrderDetails", component: ChildOrderDetails ,name:"子订单详情",meta: '子订单详情'},
        ]
    },
    { path:"/BusinessAccount",component:BusinessAccount,name:"企业总账户",
        routes: [
            { path: "/BusinessAccount/BusDepartment", component: BusDepartment ,name:"部门管理",meta: '管理中心',title:'部门管理'},
            { path: "/BusinessAccount/BusUser", component: BusUser ,name:"账户管理",meta: '管理中心',title:'账户管理'},
            { path: "/BusinessAccount/BusProject", component: BusProject ,name:"项目管理",meta: '管理中心',title:'项目管理'},
            { path: "/BusinessAccount/BusApproval", component: BusApproval ,name:"审批流管理",meta: '管理中心',title:'审批流管理'
                /* routes: [
                    { path: "/BusinessAccount/BusApproval/add", component: AddbusApproval ,name:"新增审批流"},
                ] */
            },
            { path: "/BusinessAccount/add", component: AddbusApproval ,name:"新增审批流",title:'新增审批流'},
            { path: "/BusinessAccount/edit", component: EditbusApproval ,name:"编辑审批流",title:'编辑审批流'},
            { path: "/BusinessAccount/BusOrder", component: BusOrder ,name:"订单管理",meta: '管理中心',title:'订单管理'},

            { path: "/BusinessAccount/ParentOrder", component: ParentOrder ,name:"父订单详情",meta: '父订单详情',title:'父订单详情'},
            { path: "/BusinessAccount/SonOrder", component: SonOrder ,name:"子订单详情",meta: '子订单详情',title:'子订单详情'},
            { path: "/BusinessAccount/BusBill", component: BusBill ,name:"账单管理",meta: '管理中心',title:'账单管理'},
            { path: "/BusinessAccount/BusStatistics", component: BusStatistics ,name:"订单统计",meta: '统计中心',title:'订单统计'},
            { path: "/BusinessAccount/BusGoods", component: BusGoods ,name:"商品统计",meta: '统计中心',title:'商品统计'},
            { path: "/BusinessAccount/BusConsume", component: BusConsume ,name:"消费统计",meta: '统计中心',title:'消费统计'},
            { path: "/BusinessAccount", component: BusPersonal,name:"个人中心",meta: '账户中心', exact:true, title:'个人中心'},
            { path: "/BusinessAccount/BusSecuritySet", component: BusSecuritySet ,name:"安全设置",meta: '账户中心',title:'安全设置'},
            
        ]
    },
    { path:"/AdminAccount",component:AdminAccount,name:"管理员账户",
        routes: [
            { path: "/AdminAccount/AdminBusDepartment", component: AdminBusDepartment ,name:"部门管理",meta: '账号中心',title:'部门管理'},
            { path: "/AdminAccount/AdminBusUser", component: AdminBusUser ,name:"账户管理",meta: '账号中心',title:'账户管理'},
            { path: "/AdminAccount/AdminBusProject", component: AdminBusProject ,name:"项目管理",meta: '账号中心',title:'项目管理'},
            { path: "/AdminAccount/AdminBusApproval", component: AdminBusApproval ,name:"审批流管理",meta: '账号中心',title:'审批流管理'
                /* routes: [
                    { path: "/BusinessAccount/BusApproval/add", component: AddbusApproval ,name:"新增审批流"},
                ] */
            },
            { path: "/AdminAccount/AdminAdd", component: AdminAddbusApproval ,name:"新增审批流",title:'新增审批流'},
            { path: "/AdminAccount/AdminEdit", component: AdminEditbusApproval ,name:"编辑审批流",title:'编辑审批流'},
            
            { path: "/AdminAccount", component: AdminBusPersonal,name:"个人中心",meta: '我的账户',exact:true,title:'个人中心'},
            { path: "/AdminAccount/AdminBusSecuritySet", component: AdminBusSecuritySet ,name:"安全设置",meta: '我的账户',title:'安全设置'},
        ]
    },
    { path:"/ApproverAccount",component:ApproverAccount,name:"审批员账户",
        routes: [
            { path: "/ApproverAccount/MyApp", component: MyApp ,name:"我的审批",meta: '审批管理',title:'我的审批'},
            { path: "/ApproverAccount/ParentOrder", component: MyAppParentOrder ,name:"订单详情",title:'订单详情'},
            { path: "/ApproverAccount", component: AppBusPersonal,name:"个人中心",meta: '我的账户',exact:true,title:'个人中心'},
            { path: "/ApproverAccount/AppMessageCenter", component: AppMessageCenter ,name:"消息通知",meta: '我的账户',title:'消息通知'},
            { path: "/ApproverAccount/AppBusSecuritySet", component: AppBusSecuritySet ,name:"安全设置",meta: '我的账户',title:'安全设置'},
            { path: "/ApproverAccount/AppBusWhySet", component: AppBusWhySet ,name:"原因设置",meta: '我的账户',title:'原因设置'},
            
        ]
    },
    
    { path: "/404", component: Error , name:"404"}
];

export default routes;