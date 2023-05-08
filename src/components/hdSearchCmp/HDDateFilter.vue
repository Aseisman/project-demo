<template>
  <div style="padding: 6px">
    <div class="btn-panel">
      <el-button size="small" icon="el-icon-top" @click="onSort(0)">升序</el-button>
      <el-button size="small" icon="el-icon-bottom" @click="onSort(1)">降序</el-button>
    </div>
    <div class="date-panel-cls">
      <div class="date-box">
        <span
          >开始时间：<span class="date-value">{{ dateBegin ? dateBegin.format('Y-m-d') : '' }}</span></span
        >
      </div>
      <div class="date-box">
        <span
          >结束时间：<span class="date-value">{{ dateEnd ? dateEnd.format('Y-m-d') : '' }}</span></span
        >
      </div>
    </div>
    <div class="date-panel-cls">
      <DatePanel v-model="dateBegin" />
      <DatePanel v-model="dateEnd" />
    </div>
    <div v-if="showEmptyCheckbox" style="padding-top: 14px; border-top: 1px solid #eee">
      <el-button size="small" @click="$emit('save', -1)">筛选空值</el-button>
    </div>
    <div class="bbar-panel">
      <el-button type="primary" size="small" @click="onSubmit">确定</el-button>
      <el-button size="small" @click="doClose">取消</el-button>
    </div>
  </div>
</template>
<script>
import DatePanel from './DatePanel.vue';
export default {
  data() {
    return {
      dateBegin: null,
      dateEnd: null
    };
  },
  components: { DatePanel },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    showEmptyCheckbox: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value(val) {
      const dateBegin = val[0] || undefined;
      const dateEnd = val[1] || undefined;
      if (dateBegin && dateBegin instanceof Date) {
        this.dateBegin = dateBegin;
      } else if (dateBegin) {
        this.dateBegin = new Date(dateBegin);
      }
      if (dateEnd && dateEnd instanceof Date) {
        this.dateEnd = dateEnd;
      } else if (dateEnd) {
        this.dateEnd = new Date(dateEnd);
      }
    }
  },
  methods: {
    onSubmit() {
      if (!this.dateBegin) return this.$message('请选择开始时间');
      if (!this.dateEnd) return this.$message('请选择结束时间');
      if (this.dateBegin > this.dateEnd) {
        return this.$message('开始时间不能晚于结束时间');
      }
      var endDate = new Date(this.dateEnd);
      endDate.setDate(endDate.getDate() + 1);
      this.$emit('save', {
        value: {
          start_time: this.dateBegin.getTime(),
          end_time: endDate.getTime()
        },
        valueText: this.getValueText(this.dateBegin.format('Y-m-d'), this.dateEnd.format('Y-m-d'))
      });
      this.doClose();
    },
    getValueText(minValue, maxValue) {
      if (minValue && !maxValue) {
        return minValue + ' 以上';
      } else if (!minValue && maxValue) {
        return maxValue + ' 以下';
      } else if (minValue && maxValue) {
        return minValue + ' 至 ' + maxValue;
      } else {
        return undefined;
      }
    },
    onSort(arg) {
      this.$emit('sort', arg);
      this.doClose();
    },
    doClose() {
      this.$parent.doClose();
    },
  }
};
</script>
<style lang="less" scoped>
.btn-panel {
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
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
.date-panel-cls {
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
  .date-box {
    width: 50%;
    margin-top: 16px;
    margin-left: 20px;
  }
  .date-value {
    color: #5384ee;
    font-weight: 700;
  }
}
</style>
