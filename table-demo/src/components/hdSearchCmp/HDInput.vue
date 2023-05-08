<template>
  <div>
    <div class="btn-panel" v-if="sort">
      <el-button size="small" icon="el-icon-top" @click="onSort(0)">升序</el-button>
      <el-button size="small" icon="el-icon-bottom" @click="onSort(1)">降序</el-button>
    </div>
    <el-input class="global-element-input" type="text" :placeholder="placeholder" v-model="textValue">
      <el-button slot="append" class="btn" @click="onSubmit(textValue)">确定</el-button>
    </el-input>
    <el-button v-if="showEmptyCheckbox" size="small" style="margin-top: 14px" @click="onSubmit(-1)">筛选空值</el-button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      textValue: ''
    };
  },
  props: {
    value: {
      type: String | Number,
    },
    placeholder: {
      type: String,
      default: '请输入'
    },
    showEmptyCheckbox: {
      type: Boolean,
      default: false
    },
    sort: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value: {
      handler: function (val) {
        this.textValue = val;
      },
      immediate: true
    }
  },
  methods: {
    doClose() {
      this.$parent.doClose();
    },
    onSubmit(val) {
      this.$emit('save', val);
      this.doClose();
    },
    onSort(arg) {
      this.$emit('sort', arg);
      this.doClose();
    }
  }
};
</script>

<style lang="less" scoped>
.global-element-input {
  /deep/.el-input__inner {
    height: 32px !important;
  }
  /deep/.el-input-group__append {
    background: #5383ed;
    color: white;
    border: 1px solid #5383ed;
  }
}
.btn {
  height: 32px;
}
.btn-panel {
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}
</style>
