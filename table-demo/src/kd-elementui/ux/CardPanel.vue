<template>
  <div class="card-panel-container">
    <slot></slot>
  </div>
</template>

<script>
export default {
  componentName:"cardPanel",
  props: {
    activeName: String,
    value: {},
  },
  data() {
      return {
        currentName: this.value || this.activeName,
        preName: null
      };
  },
  watch: {
    activeName(value) {
      this.setCurrentName(value);
    },
    value(value) {
      this.setCurrentName(value);
    },
    currentName(value,old) {
      this.preName = old;
    }
  },
  mounted() {
   this.$on('back', this.back);
  },
  methods:{
    back(){
      if(this.preName){
        this.setCurrentName(this.preName);
      }
    },
    setCurrentName(value){
        this.currentName = value;
        this.$emit('input', value);
    },
  }
};
</script>

<style  lang="less">
  .card-panel-container{
    height: 100%;
    >.el-tab-pane{
      height: 100%;
    }
  }

</style>
