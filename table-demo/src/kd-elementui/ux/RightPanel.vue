<template>
  <div class="right-panel-container">
    <div class="header">
      <span class="title">{{ title }}</span>
      <div class="right">
        <slot name="headerRight"></slot>
        <div class="icon-close" @click="hide()"></div>
      </div>
    </div>
    <div class="body">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import comm from "../mixins/comm";
export default {
  mixins: [comm],
  props: {
    title: String,
  },
  methods: {
    hide() {
      let ct = this.getExtCt();
      ct.hideRightItem();
    },
  },
};
</script>

<style lang="less">
.right-panel-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;

  .header {
    height: 48px;
    line-height: 48px;
    padding: 0 20px;
    display: flex;
    .title {
      font-weight: bold;
      font-size: 16px;
      color: #000000;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      flex: 1;
    }
    .right {
      display: flex;
      align-items: center;
      text-align: right;
      .icon-close {
        width: 20px;
        height: 20px;
        // background-image: url("~@/images/icon-20px/guanbi.png");
        cursor: pointer;
      }
    }
  }
  .body {
    flex: 1;
    overflow-y: auto;
    padding: 0 20px;
  }
}
</style>
