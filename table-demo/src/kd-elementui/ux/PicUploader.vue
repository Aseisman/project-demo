<template>
  <div></div>
</template>

<script>
/**
 * 上传图片组件，复用原extjs做的组件，做了些vue组件相关的适配，有兴趣的同学也可以用vue的方式实现一遍
 */
let { Emitter } = window.ElUI.utils;
export default {
  props: {
    maxNum: { type: Number, default: 9 },
    value: Array,
    disabled: Boolean,
  },
  mixins: [Emitter],
  watch: {
    value(value) {
      this.dispatch("ElFormItem", "el.form.change", value);
    },
  },
  mounted() {
    // this.cmp = new SFX.upload.PicUploader({
    //   renderTo: this.$el,
    //   maxNum: this.maxNum,
    // });
    // this.cmp.setJsonValue(this.value);
  },
  destroyed() {
    if (this.cmp) {
      this.cmp.destroy();
    }
  },
};
</script>
