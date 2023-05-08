<template>
  <div class="body-cls">
    <!-- filter -->
    <div class="filter-container filter-label" ref="filterRef">
      <div class="item" v-for="item in filter" :key="item.key">
        <label>{{ item.label + ':' }}</label>
        <span class="value">{{ item.valueText ? item.valueText : item.value }}</span>
        <span class="close" @click="deleteFilter(item.key)"></span>
        <!-- <i class="el-icon-close"></i> -->
      </div>
    </div>
    <!-- tbar -->
    <div class="gridToolbar">
      <template v-if="hasPermitShow">
        <!-- 左边部分 -->
        <div class="rowChecked" v-if="rowChecked && !allChecked">
          <div>已选择 {{ rowChecked }} 条</div>
          <div class="toolBtn">
            <div class="x-btn" v-for="item in rowToolBtns" :key="item.action" @click="handleBtnEmit(item.action)">
              <div :style="`background-image:url(${item.icon})`"></div>
              <div>{{ item.name }}</div>
            </div>
          </div>
        </div>
        <div class="totalChecked" v-else>
          <div>
            <span>{{ allChecked ? '已选' : '共' }} {{ total }} 条数据</span>
            <span v-if="showAllChecked">|</span>
            <span class="all" v-if="showAllChecked" @click="handleCheckAll">{{
              allChecked ? '取消全选' : '全选列表'
            }}</span>
          </div>
          <div v-if="allChecked" class="toolBtn">
            <div class="x-btn" v-for="item in allToolBtns" :key="item.action" @click="handleBtnEmit(item.action)">
              <div :style="`background-image:url(${item.icon})`"></div>
              <div>{{ item.name }}</div>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div></div>
      </template>
      <!-- 右边部分 -->
      <div class="toolRight">
        <slot name="toolRight"></slot>
      </div>
    </div>
    <!-- grid -->
    <div class="flex-grid-panel">
      <kd-table
        :class="isChrome ? 'kdTable isChrome' : 'kdTable'"
        border
        :header-cell-style="headerStyle"
        :header-cell-class-name="headCellClassName"
        :cell-class-name="cellClassName"
        :data="tableData"
        :columns="columns"
        v-bind="$attrs"
        v-on="$listeners"
        @select-all="AutoCheckAll"
        @select="handleCheckOne"
        height="100%"
        ref="kdTable"
      />
    </div>
    <!-- 分页 -->
    <el-pagination
      class="kdPagination"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="spagination.start"
      :page-sizes="[20, 50, 100, 200]"
      :page-size.sync="spagination.limit"
      layout="total,->,sizes, prev, pager, next"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script type="text/jsx">
import { debounce } from "lodash";

export default {
/**
 * 参数
 * rowToolBtns: 单选展示的参数
 * {
     name: '修改跟进人',
    action: 'MODIFY_FOLLOWER',
    icon: require('@/images/gridToolbar/bianji.png')
    },
* total 全部数量
* allToolBtns:全选展示的按钮
* [{
*    name: '删除',
*    action: 'DELETE_ALL',
*    icon: require('@/images/gridToolbar/shanchu1.png')
* }]
*
*
* columns 表格列
* [{
*    label: "商品名字",
*    minWidth:"200",
*    prop:"name",
*    fixed:true,
* }]
*
* tableData
*
*/
  props: {
    hasPermitShow:{
        type:Boolean,
        default:true,
    },
    total: {
      type: Number,
      default: 0
    },
    allToolBtns: {
      type: Array,
      default: () => []
    },
    rowToolBtns: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    },
    tableData: {
      type: Array,
      default: () => []
    },
    filter:{
      type:Array,
      default:()=>[]
    },
    pagination:{
      type:Object,
      default:()=>({
        start:0,
        limit:50,
      }),
    },
    showAllChecked:{
      type:Boolean,
      default:true,
    }
  },
  data() {
    return {
      rowChecked: 0,
      allChecked: false,
      headerStyle:{
        background: '#F7F7FA',
        color:'92929D',
        padding:"8px 0px",
        borderColor:'#E2E2EA',
      },
      spagination:{
        start:0,
        limit:50,
      },
      isChrome:true,
    };
  },
  watch: {
    total(val) {
      if (val == 0) {
        this.allChecked = false;
      }
      return val;
    },
    columns:{
        handler:function(){
            console.log('watch columns');
            let len = this.columns.length;
            let offsetWidth = this.$refs.kdTable.$el.offsetWidth;
            if(!len)return ;
            // 处理hasPermitShow 的情况下,展示多选框
            if(this.hasPermitShow && !this.columns[0].type){
              this.columns.unshift({
                type:"selection",
                // fixed:true,
                newLeftFixed:true,
                width:40,
                selectable:this.selectableFn
              })
              return ;
            }
            if(this.hasPermitShow){
              len = len - 1;
              offsetWidth -= 40;
            }
            //处理列数太少的情况下，每一行自动铺满列表
            const allWidth = this.columns.reduce((all,pre,index)=>{
                if(this.hasPermitShow && index == 0) return all;
                return all+Number(pre.width);
            },0) + 1;
            if(allWidth < offsetWidth){
              const average = Math.floor((offsetWidth - allWidth)/len);
              const remainder = offsetWidth - allWidth - average*len;
              this.columns.forEach((item,index)=>{
                if(this.hasPermitShow && index == 0)return;
                item.width+=average;
                index==1 && (item.width+=remainder);
              })
            }
            // 只有固定列的时候需要优化视图
            // if(len<=3 && this.columns[0].type && allWidth > offsetWidth){
            //   this.columns.forEach((item,index)=>{
            //     if(index!==0){
            //       item.width-= 48/(len-1);
            //     }
            //   })
            // }
            this.resizeTable();
        },
    },
    hasPermitShow(val){
      console.log('watch hasPermitShow');
      if(val && !this.columns[0]?.type){
        this.columns.unshift({
          type:"selection",
          fixed:true,
          width:"40",
          selectable:this.selectableFn
        });
      }
    },
    pagination(val){
      this.spagination = val;
    },
  },
  mounted(){
    this.isChrome = window.navigator.userAgent.indexOf("Chrome")>=0;
    window.addEventListener('resize',this.resizeColumn)
  },
  methods: {
    // 点击列表选中
    AutoCheckAll(selection){
      this.rowChecked = selection.length;
    },
    // 选中单个
    handleCheckOne(selection){
      this.rowChecked = selection.length;
    },
    // 点击全选列表选中
    handleCheckAll() {
      if(this.total==0)return;
      this.allChecked = !this.allChecked;
      if(this.allChecked){
        this.$refs.kdTable.$refs.elTable.toggleAllSelection();
      }else{
        this.$refs.kdTable.$refs.elTable.clearSelection();
        this.rowChecked = 0;
      }
      this.$emit('CHECK_ALL', this.allChecked);
    },
    handleCurrentChange(){
      this.$refs.kdTable.$refs.elTable.bodyWrapper.scrollTop = 0;
      this.$emit('update:pagination', this.spagination);
    },
    handleSizeChange(){
      this.spagination.start = 0;
      this.$emit('update:pagination', this.spagination);
    },
    // 按钮触发emit
    handleBtnEmit(action){
      // 传参：是否全选，选中了那几行
      this.$emit(action,this.allChecked,this.$refs.kdTable.$refs.elTable.selection)
    },
    resizeTable:debounce(function(){
      this.$refs.kdTable.$refs.elTable.doLayout();
    },600),
    deleteFilter(key){
      this.$emit('deleteFilter',key);
    },
    selectableFn(){
      return this.allChecked? false : true;
    },
    resetCheck(){
      this.rowChecked=0;
      this.allChecked=false;
    },
    resizeColumn:debounce(function(){
        //处理列数太少的情况下，每一行自动铺满列表
        const offsetWidth = this.$refs.kdTable.$el.offsetWidth;
        const columns = this.$refs.kdTable.$children[0].columns;
        const len = columns.length;
        if(!len)return ;
        const allWidth = columns.reduce((all,pre)=>{
            return all+Number(pre.width);
        },0) + 1;
        if(allWidth < offsetWidth){
          const average = Math.floor((offsetWidth - allWidth)/len);
          const remainder = offsetWidth - allWidth - average*len;
          this.columns.forEach((item,index)=>{
            if(index==0 &&item.type){
              this.columns[len-1].width += average;
            }else{
              item.width=Number(item.width)+average;
              index==1 && (item.width+=remainder);
            }
          })
        }
        // else if(allWidth > offsetWidth){
        //   this.columns.forEach((item,index)=>{
        //     if(index<3){
        //       if(!(index==0&&item.type)){
        //         item.width=item.minWidth || 100;
        //       }
        //     }
        //   })
        // }
        console.log('onresize columns');
        this.resizeTable();
    },200)
  },
  computed:{
    headCellClassName(){
      return this.allChecked ? 'disableSelection' : '';
    },
    cellClassName(){
      return this.allChecked ? 'celldisableSelection' : 'cellClassName';
    }
  },
  destroyed(){
    window.removeEventListener('resize',this.resizeColumn);
  }
};
</script>

<style lang="less" scoped>
.body-cls {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.flex-grid-panel {
  flex: 1;
  overflow: hidden;
}
.filter-container {
  display: flex;
  align-items: center;
  max-width: 100%;
  flex-wrap: wrap;
  flex: 0 0 auto;
  padding: 0;
}
.gridToolbar {
  display: flex;
  align-items: center;
  width: 100%;
  height: 48px;
  justify-content: space-between;
  .rowChecked {
    display: flex;
    align-items: center;
    font-size: 12px;
    color: #666666;
  }
  .totalChecked {
    display: flex;
    align-items: center;
    font-size: 12px;
    color: #666666;

    span {
      margin-right: 4px;
    }

    .all {
      color: #0062ff;
      cursor: pointer;
    }
  }
  .toolBtn {
    margin-left: 20px;
    display: flex;
    & > div {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      padding: 7px 10px;
      border: 1px solid #e2e2ea;
      border-radius: 2px;
      color: #44444f;
      &:hover {
        background-color: #f7f7fa;
      }

      & > div:first-child {
        margin-right: 4px;
        width: 16px;
        height: 16px;
        background-size: cover;
      }
    }
  }
  .toolRight {
    display: flex;
    align-items: center;
  }
}
.kdTable {
  border-left: none;
  /deep/.el-table__fixed {
    // firefox 16 chrome 7
    height: calc(100% - 16px) !important;
    // box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.12);
    // height: 100% !important;
    .el-table__fixed-header-wrapper {
      height: 41px;
    }
    .el-table__fixed-body-wrapper {
      height: calc(100% - 41px) !important;
    }
  }
  /deep/.el-table__fixed::before {
    height: 0;
  }
  // =========================================================================
  // 这是每一列的选择框
  /deep/ .cellClassName {
    // border: none;
    // border-bottom: 1px solid #f1f1f5;
  }
  /deep/ .celldisableSelection .cell .el-checkbox__inner::after {
    transform: rotate(45deg) scaleY(1);
  }
  // =========================================================================
  // 下面是全选框
  /deep/ .disableSelection .cell .el-checkbox__inner::after {
    transform: rotate(45deg) scaleY(1);
    border-color: #b5b5be;
  }
  /deep/ .disableSelection .cell .el-checkbox__inner {
    background-color: #f1f1f5;
    border-color: #e2e2ea;
    color: #d3d3e0;
    cursor: not-allowed;
  }
  /deep/ .el-checkbox__input.is-disabled .el-checkbox__inner {
    background-color: #f1f1f5;
    border-color: #e2e2ea;
    color: #d3d3e0;
    cursor: not-allowed;
  }
  /deep/.el-button--small {
    padding: 0 0;
  }
  // /deep/ .disableSelection .cell:before{
  //   content: "";
  //   position: absolute;
  // }
  // =========================================================================
}
.kdTable::before {
  z-index: 3;
}
.isChrome {
  /deep/.el-table__fixed {
    // firefox 16 chrome 7
    height: calc(100% - 7px) !important;
  }
}
.kdPagination {
  margin-top: 10px;
  padding-right: 0;
  /deep/ .el-pagination__sizes .el-select .el-input input {
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 2px;
    font-size: 12px;
    color: #696974;
  }
  /deep/ .el-pagination__total {
    font-size: 12px;
    color: #696974;
  }
  /deep/ .el-pager .number {
    font-weight: 500;
    margin: 0 4px;
  }
}
</style>
