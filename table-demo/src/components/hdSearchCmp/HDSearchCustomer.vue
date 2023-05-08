<template>
  <div></div>
</template>
<script>
/**
 * 选择用户组件，复用原extjs做的组件，做了些vue组件相关的适配，有兴趣的同学也可以用vue的方式实现一遍
 */
import SearchCustomer from './SearchCustomer.js';
export default {
  name:'HDSearchCustomer',
  props: {
    value: Object,
    disabled: Boolean,
    option: Object
  },
  watch: {
    value(object) {
      console.log(object);
      if (!object) {
        return this.cmp.setJsonValue();
      }
      if (object.key == 'filter') {
        this.cmp.setJsonValue({
          value: object.value.label.clbls || [],
          type: 2
        });
      } else {
        this.cmp.setJsonValue({
          value: object.value,
          type: 1
        });
      }
    }
  },
  mounted() {
    // this.cmp = new SearchCustomer({
    //   renderTo: this.$el,
    //   selectBoxHidden: true,
    //   emptyText: '搜索客户',
    //   labelText: '客户',
    //   listeners: {
    //     submit: (res) => {
    //       this.$emit('save', res);
    //     }
    //   }
    // });
  },
  destroyed() {
    if (this.cmp) {
      this.cmp.destroy();
    }
  }
};
</script>
