<template>
  <div class="right-panel-container">
      <div class="header">
        <span class="title">{{title}}</span>
        <div class="right">
          <slot name="headerRight"></slot>
          <i class="el-icon-close" @click="hide()"></i>
        </div>
      </div>
      <div class="body" >
        <slot></slot>
      </div>
  </div>
</template>

<script>
import comm from '../mixins/comm';
export default {
  mixins:[comm],
  props: {
    title: String,
  },
  methods:{
    hide(){
       let ct = this.getExtCt();
       ct.hideRightItem();
    }
  }
};
</script>

<style  lang="less">
  .right-panel-container{
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #fff;

    .header{
      border-width: 0 0 1px;
      border-style: solid;
      height: 48px;
      line-height: 48px;
      padding: 0 20px;
      border-color: #e6e6e6;
      background: #f7f7f7;
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
          .el-icon-close{
            font-size: 24px;
            line-height: 44px;
            cursor: pointer;
          }
      }
    }
    .body{
      flex: 1;
      overflow-y: auto;
      padding: 20px;
    }

  }
</style>
