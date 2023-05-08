<template>
  <div class="date-panel">
    <el-date-panel ref="datePanel" @pick="pick"></el-date-panel>
  </div>
</template>
<script>
export default {
  props: {
    date: {
      default: () => new Date(),
      type: Date
    },
    showTime: {
      default: false,
      type: Boolean
    }
  },
  model: {
    prop: 'date',
    event: 'change'
  },
  mounted() {
    this.$refs.datePanel.value = this.date;
    this.$refs.datePanel.showTime = this.showTime;
    this.$refs.datePanel.visible = true;
  },
  methods: {
    pick(date) {
      console.log('pick');
      console.log(date);
      this.$refs.datePanel.value = date;
      this.$refs.datePanel.resetView && this.$refs.datePanel.resetView();
      this.$emit('change', date);
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
