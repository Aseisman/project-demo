<template>
  <div>
    <div class="radio-panel">
      <el-radio-group v-model="radio" class="hd-radio">
        <el-radio v-for="r in data" :label="r.id" :key="r.id">{{ r.name }}</el-radio>
        <el-checkbox v-if="showEmptyCheckbox" :label="-1">空值</el-checkbox>
      </el-radio-group>
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
      radio: ''
    };
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    value: {
      type: Number
    },
    showEmptyCheckbox: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onSubmit() {
      if (!this.radio && this.radio !== 0) return;
      this.$emit('save', this.radio);
      this.doClose();
    },
    doClose() {
      this.$parent.doClose();
    }
  },
  watch: {
    value: {
      handler: function (val) {
        this.radio = val;
      },
      immediate: true
    }
  }
};
</script>

<style lang="less" scoped>
.radio-panel {
  max-height: 300px;
  overflow: scroll;
}

.hd-radio {
  display: flex;
  flex-direction: column;

  label {
    margin: 6px 0;
  }
}

.bbar-panel {
  margin: 8px -12px -18px;
  text-align: left;
  background: #fafafa;
  padding: 8px 0 8px 16px;
  border-radius: 10px;
  border-top-right-radius: 0px;
  border-top-left-radius: 0px;
}
</style>
