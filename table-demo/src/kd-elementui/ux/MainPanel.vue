<template>
  <div class="main-panel-container">
      <div class="header draggable-title">
        <span class="title">{{title}}
        <span v-if="showReturn"  @click="back">
        <i class="el-icon-arrow-left"></i>
        返回
        </span>
        </span>
        <div class="right">
          <slot name="headerRight"></slot>
        </div>
      </div>
      <div class="body" :class="this.flexCls"  >
        <slot></slot>
      </div>
  </div>
</template>

<script>
let {Emitter} = window.ElUI.utils;

export default {
  mixins:[Emitter],
  props: {
    title: String,
    showReturn:Boolean,
    flexType:String,
  },
  computed: {
    flexCls(){
      if(this.flexType){
          return this.flexType+"-flex"
      }
      return "";
    }
  },
  methods:{
    back(){
      this.dispatch("cardPanel","back")
    }
  }
};
</script>

<style  lang="less">
  .main-panel-container{
    height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: #f1f1f5;

    .header{
      border-width: 0 0 1px;
      border-style: solid;
      height: 52px;
      line-height: 52px;
      padding: 0 20px;
      border-color: #e6e6e6 ;
      background: #f7f7f7 ;
      display: flex;
      .title{
        font-weight: bold;
        font-size: 14px;
        color: #666;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex: 1;
      }
      .right{
          text-align: right;
      }
    }
    .body{
      margin:16px;
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      background: #fff;
      border-radius: 4px;
    }
    .column-flex{
      display: flex;
      flex-direction: column;
    }
    .row-flex{
      display: flex;
      flex-direction:row;
    }
  }
</style>
