import Axios from "./axios";

const ports={
    //port167:"http://192.168.2.167:85",
    port167:"http://192.168.2.167:10085",
    // port167:"http://192.168.2.116:805",
    // port167:"http://192.168.2.139:85",
    // port167:"https://qnc.api.anmro.cn"
    // port108:"http://192.168.2.108:8088/mock/27/"
};
class api{
    urlApi = {
        getProductSign:ports.port167 + "/getProductSign",  //获取上传图片的签名
        getProductSignDelete:ports.port167 + "/delete",  //删除图片

        login:ports.port167+ "/index/login",  //登录

        gitMap_:ports.port167+ "/merchant/get_merchant_Lat_Long",  // ← 获取发货地区

        gitgoodsMap:ports.port167+ "/merchant/get_area", // ← 获取地图选项

        getSearchListData:ports.port167+ "/merchant/product/search_product", // ← 商品查询功能

        gitHomeNAV_Class_data:ports.port167+"/qiniu/getCategoryList", // ← 获取首页分类列表

        gitGoodsDetails:ports.port167+"/merchant/product/product_info", // ← 获取首页分类列表

        qiniuProductList:ports.port167+"/qiniu/productList", // ← 首页楼层商品

        jdProductList:ports.port167+"/qiniu/jdProductList", // ← 首页JD楼层商品

        getProductSKUList:ports.port167+"/merchant/product/get_product_sku_list", // ← 获取商品sku

 		addShoppingCart:ports.port167+"/buyer/product/add_shopping_cart", // ← 加入购物车

        shoppingCartList:ports.port167+"/buyer/product/shopping_cart_list", // ← 获取购物车列表

        getShoppingCartCount:ports.port167+"/buyer/product/get_shopping_cart_count", // ← 获取购物车数量

        shoppingDelete:ports.port167+"/buyer/product/delete", // ← 购物车删除

        shoppingUpdateCount:ports.port167+"/buyer/product/update_count", // ← 修改购物车数量

        saveCompareInfo:ports.port167+"/merchant/product/saveCompareInfo", // ← 保存比价

        getCompareInfo:ports.port167+"/merchant/product/getCompareInfo", //

        getSupplierDetails_data:ports.port167+"/merchant/get_merchants_info", // ← 获取供应商详情数据

        getSupplierDetails_goodData:ports.port167+"/merchant/merchants_product_list",// ← 获取供应商商品详情

        getGoodSupplier:ports.port167+"/merchant/quality_merchants", // ← 获取优质供应商

        getsameCommodity:ports.port167+"/merchant/product/similar_product", // ← 获取同类商品接口

        addShoppingCartData:ports.port167+"/buyer/product/add_shopping_cart", // ← 添加购物车

        gitClassList_selectorData:ports.port167+"/merchant/product/get_param", // ← 分类详情页面分类属性

        getClass_goods_data:ports.port167+"/merchant/product/search_by_param",

        excelWriteWithHead:ports.port167+"/excel/writeWithHead", //比价表格导出

        jd_product_list:ports.port167+"/jd/product_list", // 京东商品搜索

        jd_product_info:ports.port167+"/jd/product_info", // 获取京东商品详情

        department_list:ports.port167+"/buyer/department_list", // 获取部门列表

        get_department:ports.port167+"/buyer/get_department_for_dict", // 根据id获取下级部门（下拉框选择部门）

        add_department:ports.port167+"/buyer/add_department", // 新增部门

        update_department:ports.port167+"/buyer/update_department", // 修改部门

        get_department_info:ports.port167+"/buyer/get_department_info", // 编辑部门时，获取上级部门信息(级联回填)
        
        delete_department:ports.port167+"/buyer/delete_department", // 部门删除

        buyer_list:ports.port167+"/buyer/buyer_list", // 获取账户列表

        add_buyer:ports.port167+"/buyer/add_buyer", // 新增账户

        get_buyer:ports.port167+"/buyer/get_buyer", // 编辑时获取账户信息

        update_buyer:ports.port167+"/buyer/update_buyer", // 编辑账户

        buyer_switch:ports.port167+"/buyer/buyer_switch", // 账户开启关闭

        product_class:ports.port167+"/buyer/product_class", // 安层级获取分类信息

        modifyPassWord:ports.port167+"/buyer/manager/modifyPassWord", // 修改密码

        get_area:ports.port167+"/buyer/manager/get_area", // 获取省市区

        addAddress:ports.port167+"/buyer/manager/addAddress", // 添加收货地址

        addressList:ports.port167+"/buyer/manager/addressList", // 地址列表

        editAddress:ports.port167+"/buyer/manager/editAddress", // 修改地址列表

        delAddress:ports.port167+"/buyer/manager/delAddress", // 删除收货地址

        getAddressById:ports.port167+"/buyer/manager/getAddressById", // 收货地址详情

        setDefaultAddress:ports.port167+"/buyer/manager/setDefaultAddress", // 设置默认地址

        addInvoice:ports.port167+"/buyer/manager/addInvoice", // 添加发票

        invoiceList:ports.port167+"/buyer/manager/invoiceList", // 发票列表

        delInvoice:ports.port167+"/buyer/manager/delInvoice", // 删除发票

        editInvoice:ports.port167+"/buyer/manager/editInvoice", // 编辑发票

        getMessageList:ports.port167+"/buyer/message_list", // 获取消息通知

        read_message:ports.port167+"/buyer/order/read_message", // 获取消息通知

        compareRecord:ports.port167+"/buyer/manager/compareRecord", // 获取比价记录

        collection_product:ports.port167+"/buyer/product/collection_product", // 商品收藏

        collection_merchant:ports.port167+"/buyer/product/collection_merchant", // 商家收藏


        projectList:ports.port167+"/buyer/manager/projectList", // 项目列表
        
        projectAll:ports.port167+"/buyer/manager/projectAll", // 项目列表(下拉框数据)

        editProject:ports.port167+"/buyer/manager/editProject", // 编辑项目

        createProject:ports.port167+"/buyer/manager/createProject", // 新建项目

        delProject:ports.port167+"/buyer/manager/delProject", // 删除项目

        approvalBuyer:ports.port167+"/buyer/manager/approvalBuyer", // 审批员列表

        createApproval:ports.port167+"/buyer/manager/createApproval", // 创建审批流

        approvalList:ports.port167+"/buyer/manager/approvalList", // 审批流列表

        getApprovalById:ports.port167+"/buyer/manager/getApprovalById", // 根据id获取审批流详情

        editApproval:ports.port167+"/buyer/manager/editApproval", // 编辑审批流

        delApproval:ports.port167+"/buyer/manager/delApproval", // 删除审批流

        orderManage:ports.port167+"/buyer/generalAccount/orderManage", // 订单管理1

        parentOrderDetails:ports.port167+"/buyer/generalAccount/parentOrderDetails", // 父订单详情1

        subOrderDetails:ports.port167+"/buyer/generalAccount/subOrderDetails", // 子订单详情1

        approval_order_list:ports.port167+"/buyer/order/approval_order_list", // 审批人员获取订单列表

        approvaler_get_order_info:ports.port167+"/buyer/order/approvaler_get_order_info", // 审批员获取父订单详情

        get_product_list_to_dicts:ports.port167+"/buyer/order/get_approval_haven_product", // 审批员获取项目数据

        approval_order:ports.port167+"/buyer/order/approval_order", // 订单审批

        check_inventory:ports.port167+"/buyer/order/check_inventory", // 结算检查库存

        get_default_address:ports.port167+"/buyer/order/get_default_address", // 结算页获取默认地址

        submitOrder:ports.port167+"/buyer/order/submit_order", // 提交订单

        orderApprovalList:ports.port167+"/buyer/order/order_approval_list", // 审批流列表

        order_file:ports.port167+"/buyer/order/order_file", // 订单附件

        submit_audit:ports.port167+"/buyer/order/submit_audit", // 提交审核

        collection_merchant_list:ports.port167+"/buyer/collection_merchant_list", // 商家列表

        order_approval_process:ports.port167+"/buyer/order/order_approval_process", // 获取订单审批情况

        collection_product_list:ports.port167+"/buyer/collection_product_list", // 获取收藏商品

        getOrderList:ports.port167+"/buyer/order/order_list", // 采购员获取父订单

        cancel_order:ports.port167+"/buyer/order/cancel_order", // 采购员取消订单

        get_order_file:ports.port167+"/buyer/order/get_order_file", // 获取订单附件

        buy_again:ports.port167+"/buyer/order/buy_again", // 在次购买

        order_sub_list:ports.port167+"/buyer/order/order_sub_list", // 子订单列表

        order_info:ports.port167+"/buyer/order/order_info", // 父订单详情

        sub_order_info:ports.port167+"/buyer/order/sub_order_info", // 父订单详情

        remind_delivery:ports.port167+"/buyer/order/remind_delivery", // 提醒发货

        reset_password:ports.port167+"/buyer/reset_password", // 重置密码


        confirm_goods:ports.port167+"/buyer/order/confirm_goods", // 确认收货

        collection_product_jd:ports.port167+"/buyer/product/collection_product_jd", // jd商品收藏

        get_scan_product_log:ports.port167+"/buyer/get_scan_product_log", // 浏览过的商品

        search_merchants_for_map:ports.port167+"/merchant/search_merchants_for_map", // 搜索优质供应商

        calculate_freight:ports.port167+"/buyer/order/calculate_freight", // 获取JD订单运费


        orderStatistics:ports.port167+"/buyer/generalAccount/orderStatistics", // 订单统计

        productStatistics:ports.port167+"/buyer/generalAccount/productStatistics", // 商品统计

        getOrderGoodsClass:ports.port167+"/buyer/generalAccount/getOrderGoodsClass", // 商品统计所属分类

        consumeStatistics:ports.port167+"/buyer/generalAccount/consumeStatistics", // 消费统计

        billStatistics:ports.port167+"/buyer/generalAccount/billStatistics", // 账单统计

        buyer_info:ports.port167+"/buyer/buyer_info", // 个人中心

        get_department_count:ports.port167+"/buyer/get_department_count", // 部门总数

        getProductLookSign:ports.port167+"/getProductLookSign", // 获取附件签名


        approval_reason_model_list:ports.port167+"/buyer/order/approval_reason_model_list", // 审批员获取审批驳回模板

        add_reason_model:ports.port167+"/buyer/order/add_reason_model", // 新增模板

        delete_reason_model:ports.port167+"/buyer/order/delete_reason_model", // 删除模板

        update_reason_model:ports.port167+"/buyer/order/update_reason_model", // 编辑模板


        buyIimmediately:ports.port167+"/buyer/product/add_shopping_cart", // 立即购买

        getLoginVertiCode: ports.port167+"/index/sendCode", // 获取登录验证码

        getProjectInfo: ports.port167+"/buyer/order/get_product_list_to_dicts",  // 获取项目信息


    };
    axiosPost(url,data,form){
        const add = this.urlApi[url] ? this.urlApi[url] : url;
        return Axios(add,data,"post",form);
    };
    axiosGet(url,data){
        const add = this.urlApi[url];
        return Axios(add,data,"get");
    };
    imgUrl="http://img.anmro.cn/";
}

export default new api();
