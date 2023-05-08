<template>
  <div class="win-container">
      <div :class="bodyCls+' body'">
        <slot></slot>
      </div>
      <div class="footer" >
        <template v-if="$slots.footer">
            <slot name="footer"></slot>
        </template>
        <template v-else>
          <el-button size="small" @click="cancel()">取 消</el-button>
          <el-button size="small" type="primary" @click="$emit('submit')">确 定</el-button>
        </template>
      </div>
  </div>
</template>

<script>
import comm from '../mixins/comm';
export default {
  mixins:[comm],
  methods: {
    cancel() {
      let ct = this.getExtCt();
      ct[ct.closeAction]();
    }
  },
  props:{
    bodyCls:{
      type:String,
      default:''
    }
  }
};
</script>

<style>
  .win-container .body{
    flex: 1;
    overflow-y: auto;
    padding: 20px 40px;
  }
  .win-container .footer{
    height: 72px;
    text-align: right;
    padding: 0 20px;
    line-height: 72px;
  }
</style>
