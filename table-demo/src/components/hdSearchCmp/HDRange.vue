<template>
  <div class="kd-range-filter">
    <div class="btn-panel">
      <el-button size="small" icon="el-icon-top" @click="onSort(0)">升序</el-button>
      <el-button size="small" icon="el-icon-bottom" @click="onSort(1)">降序</el-button>
    </div>
    <el-form :model="ruleForm" status-icon ref="ruleForm" label-width="90px" class="form-panel">
      <el-form-item :label="labelWord" class="priceFormItem" prop="prodBegin">
        <el-input
          v-model="ruleForm.prodBegin"
          @input="(val) => checkNumberValue(val, 'prodBegin')"
          class="priceInput"
          style="margin-right: 10px"
          placeholder="最低"
        />-<el-input
          v-model="ruleForm.prodEnd"
          @input="(val) => checkNumberValue(val, 'prodEnd')"
          class="priceInput"
          ref="prodEnd"
          style="margin-left: 10px"
          placeholder="最高"
        />
      </el-form-item>
    </el-form>
    <div class="bbar-panel">
      <el-button type="primary" size="small" @click="onSubmit">确定</el-button>
      <el-button size="small" @click="doClose">取消</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ruleForm: {
        prodBegin: '',
        prodEnd: ''
      }
    };
  },
  props: {
    lowest: {
      type: [Number, String]
    },
    highest: {
      type: [Number, String]
    },
    labelWord: {
      type: String,
      default: '销量区间'
    }
  },
  watch: {
    lowest: {
      handler: function (val) {
        this.ruleForm.prodBegin = val;
      },
      immediate: true
    },
    highest: {
      handler: function (val) {
        this.ruleForm.prodEnd = val;
      }
    }
  },
  methods: {
    onSubmit() {
      if (
        this.ruleForm.prodBegin != undefined &&
        this.ruleForm.prodEnd &&
        Number(this.ruleForm.prodBegin) > Number(this.ruleForm.prodEnd)
      ) {
        this.$message('最低数不能大于最高数');
        this.ruleForm.prodBegin = '';
        this.ruleForm.prodEnd = '';
        return;
      }
      let res = [];
      if (this.ruleForm.prodBegin || this.ruleForm.prodBegin === 0) {
        res[0] = Number(this.ruleForm.prodBegin);
      }
      if (this.ruleForm.prodEnd || this.ruleForm.prodEnd === 0) {
        res[1] = Number(this.ruleForm.prodEnd);
      }
      this.$emit('save', res);
      this.doClose();
    },
    doClose() {
      this.$parent.doClose();
    },
    isNumber(obj) {
      return typeof obj === 'number' && !isNaN(obj);
    },
    checkNumberValue(val, key) {
      if (!this.isNumber(Number(val))) {
        return (this.ruleForm[key] = '');
      }
      if (val < 0) {
        return (this.ruleForm[key] = '');
      }
      if (val > 9999999999) {
        return (this.ruleForm[key] = 9999999999);
      }
      this.ruleForm[key] = (val + '').split('.')[0];
    },
    onSort(arg) {
      this.$emit('sort', arg);
      this.doClose();
    }
  }
};
</script>
<style lang="less" scoped>
.kd-range-filter {
  padding: 6px;
}
.btn-panel {
  padding-bottom: 16px;
  border-bottom: 1px solid #f1f1f5;
}
.form-panel {
  color: #92929d;
  margin-top: 16px;
  .priceInput {
    width: 100px;
  }
}
.bbar-panel {
  margin: 8px -18px -18px;
  text-align: left;
  background: #fafafa;
  padding: 8px 0 8px 16px;
  border-radius: 10px;
  border-top-right-radius: 0px;
  border-top-left-radius: 0px;
}

// .el-button--small {
//   padding: 9px 11px 9px 8px;
// }
</style>
