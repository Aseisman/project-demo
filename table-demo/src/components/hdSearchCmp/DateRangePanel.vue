<template>
  <div class="date-panel">
    <date-range-panel ref="datePanel" @pick="pick"></date-range-panel>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      default: () => [],
      type: Array
    },
    showTime: {
      default: false,
      type: Boolean
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  mounted() {
    this.$refs.datePanel.value = this.value;
    this.$refs.datePanel.showTime = this.showTime;
    this.$refs.datePanel.visible = true;
  },
  methods: {
    pick(date) {
      this.$refs.datePanel.value = date;
      this.$refs.datePanel.resetView && this.$refs.datePanel.resetView();
      this.$emit('change', date);
    }
  },
  watch:{
    value:{
      handler(val){
        if(this.$refs.datePanel){
          this.$refs.datePanel.value = val;
        }
      },
      immediate: true
    }
  }
};
</script>
<style scoped>
.date-panel >>> .el-picker-panel__footer {
  display: none !important;
}
.date-panel >>> .el-picker-panel {
  box-shadow: none;
  border: 0;
}
</style>
