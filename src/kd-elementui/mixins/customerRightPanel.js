/**
 * 需要展示客户详情可以mixin这个
 *
 * todo ,这个createCustomerRightPanel参考B.CRMPanel 写的，正式使用的时候要把他们整起来，不要维护份类似代码
 *
 */
/* eslint-disable */
export default {
  mounted() {
    this.createCustomerRightPanel();
  },
  methods: {
    /*这个方法需要在实际业务中扩展
  refresh(){
    debugger
  },*/
    showCustomer(id) {
      this.customerDetail.load(id);
    },
    showProduct(pdid) {
      this.productDetail.load(pdid);
    },
    showSale(data, salesProp) {
      this.saleDetail.updateProps(salesProp);
      this.saleDetail.load(data.scid); //商机详情
    },
    createCustomerRightPanel() {
      let ct = this.getExtCt();
      ct.rightItem = ct.rightItem || [];
      ct.rightItem.push(
        (this.saleDetail = new B.sales.SalesView({
          listeners: {
            scope: this,
            refresh: function () {
              this.refresh("sale");
            },
          },
        })),
        (this.customerDetail = new B.customerMgr.FixedRightPanel({
          //noPermitShowCusDetail: this.noPermitShowCusDetail,
          // forceShowCusDetail: this.forceShowCusDetail,
          listeners: {
            scope: this,
            refresh: function (info) {
              this.refresh("customer", info);
            },
            showPaymentDetail: function (id) {
              this.paymentDetail.load(id);
            },
            showRefundDetail: function (id) {
              this.refundDetail.load(id);
            },
            showSaleDetail: function (id) {
              this.saleDetail.load(id);
            },
            showContractDetail: function (data) {
              this.contractDetail.load(data);
            },
            showOrderDetail: function (id) {
              this.orderDetail.load(id);
            },
            showProductDetail: function (id) {
              this.productDetail.load(id);
            },
            showTaskDetail: function (data) {
              this.taskDetail.showRightItem();
              this.taskDetail.load(data);
            },
            showConsumeDetail: function (data) {
              this.consumeDetail.showRightItem();
              this.consumeDetail.requestData(data);
            },
            showWechatCustmDetail: function (id, tagOption) {
              this.customerDetail.hideRightItem();
              this.wechatCustmDetail.showRightItem();
              this.wechatCustmDetail.getWechatTag(tagOption);
              this.wechatCustmDetail.load([id]);
            },
          },
        })),
        /*(this.wechatCustmDetail = new B.enterpriseWechat.WechatCustmDetail({
          listeners: {
            scope: this,
            showCustmDetail(id) {
              this.customerDetail.load(id);
            },
            refreshGrid() {
              this.refresh('refreshCustm');
            }
          }
        })),*/
        (this.paymentDetail = new B.payment.detail.DetailView({
          listeners: {
            scope: this,
            orderDetail: function (id) {
              this.orderDetail.load(id);
            },
            refresh: function () {
              this.refresh("payment");
            },
          },
        })),
        (this.refundDetail = new B.payment.refund.detail.Main({
          listeners: {
            scope: this,
            orderDetail: function (id) {
              this.orderDetail.load(id);
            },
            refresh: function () {
              this.refresh("refund");
            },
          },
        })),
        (this.orderDetail = new B.orders.rightPanel.OrderRightPanel({
          listeners: {
            scope: this,
            showCustomer: function (id) {
              this.customerDetail.load(id);
            },
            showPaymentDetail: function (id) {
              this.paymentDetail.load(id);
            },
            showRefundDetail: function (id) {
              this.refundDetail.load(id);
            },
            //***商机详情***//
            showSale: function (id) {
              this.saleDetail.load(id);
            },
            //******//
            refresh: function () {
              this.refresh("order");
            },
            showContract: function (data) {
              this.contractDetail.load(data);
            },
          },
        })),
        (this.contractDetail = new B.contract.myContract.ContractRightPanel({
          listeners: {
            scope: this,
            refresh: function () {
              this.refresh("contract");
            },
            orderDetail: function (id) {
              this.orderDetail.load(id);
            },
          },
        })),
        (this.productDetail = new B.product.list.ProductRightPanel({
          listeners: {
            scope: this,
            refresh: function () {
              this.refresh("product");
            },
            hideRightItem() {
              this.productDetail.hideRightItem();
              this.fireEvent("hideRightItem", "productDetail");
            },
          },
        })),
        (this.taskDetail = new B.task.RightPanel({
          listeners: {
            showCustomer: function (cid) {
              this.customerDetail.load(cid);
            },
            scope: this,
          },
        })),
        (this.consumeDetail = new B.reimbursement.PHRightPanel({
          url: B.URL["mod_reimburse"],
          hideToolbar: true,
          listeners: {
            showCustomer: function (cid) {
              this.customerDetail.load(cid);
            },
            scope: this,
          },
        }))
      );
      ct.initialRightItem();
    },
  },
};
/* eslint-disable */
