<template>
  <div class="checkgroup-panel">
    <div class="checkgroup-list">
      <el-checkbox-group v-model="groupValues" class="hd-checkgroup">
        <el-checkbox @change="clearEmptySelect" v-for="d in data" :label="d.id" :key="d.id">{{ d.name }}</el-checkbox>
        <el-checkbox @change="clearOtherSelect" v-if="showEmptyCheckbox" :label="-1" :key="-1">空值</el-checkbox>
      </el-checkbox-group>
    </div>
    <div class="bbar-panel">
      <el-button type="primary" size="small" @click="onSubmit">确定</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      groupValues: []
    };
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    value: {
      type: Array,
      default: () => []
    },
    showEmptyCheckbox: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onSubmit() {
      this.$emit('save', this.groupValues);
      this.doClose();
    },
    doClose() {
      this.$parent.doClose();
    },
    clearOtherSelect(val) {
      if (val) {
        this.groupValues = [-1];
      }
    },
    clearEmptySelect() {
      let index = this.groupValues.findIndex((item) => item == -1);
      if (~index) {
        this.groupValues.splice(index, 1);
      }
    }
  },
  watch: {
    value: {
      handler: function (val) {
        this.groupValues = val;
      },
      immediate: true
    }
  }
};
</script>

<style lang="less" scoped>
.checkgroup-panel {
  max-width: 380px;
  min-width: 160px;
  max-height: 340px;

  .checkgroup-list {
    overflow: scroll;
    max-height: 240px;
  }
}
.hd-checkgroup {
  display: flex;
  flex-direction: column;
  label {
    margin: 6px 0;
  }
}

.bbar-panel {
  margin: 16px -12px -18px;
  text-align: left;
  background: #fafafa;
  padding: 8px 0 8px 16px;
  border-radius: 10px;
  border-top-right-radius: 0px;
  border-top-left-radius: 0px;
}
</style>
