<template>
  <div>
    <div style="max-height: 70vh; overflow: auto">
      <!-- 表头 -->
      <div class="grid-header">
        <div>是否显示</div>
        <div>列名称</div>
        <div>拖动排序</div>
      </div>
      <!-- 不可以排序的（默认第一个不可以排序） -->
      <div class="grid-body fix-grid-body undraggable">
        <div>
          <div class="ct-checkbox-box ct-checkbox-checked-disabled"></div>
        </div>
        <div>
          <span>{{ columnData[0] ? columnData[0].name : "" }}</span>
          <span class="tip-text">{{ "(固定在列表左侧)" }}</span>
        </div>
        <div></div>
      </div>
      <!-- 可以排序的 -->
      <draggable v-model="columnData" filter=".undraggable">
        <template v-for="(element, index) in columnData">
          <div
            :key="element.id"
            v-if="index >= 1"
            @click="checkItem(index, element)"
            class="grid-body"
          >
            <div>
              <div :class="getCheckBoxCls(element)"></div>
            </div>
            <div>
              <span>{{ element.name }}</span>
              <span class="tip-text">{{
                index >= fixColumn ? "" : "(固定在列表左侧)"
              }}</span>
            </div>
            <div :class="index >= 1 ? 'opt-list-line-icon' : ''"></div>
          </div>
        </template>
      </draggable>
    </div>
    <div style="margin-top: 20px">
      <el-button>取 消</el-button>
      <el-button type="primary" @click="saveOptions">确 定</el-button>
    </div>
  </div>
</template>
<script>
/**
 * columnData: {[
 *      name:'xxx',
 *      check:true,
 *      id:'xxx',
 *      disable: true,可不可以操作
 * ]}
 */
import draggable from "vuedraggable";
export default {
  components: {
    draggable,
  },
  props: {
    originData: {
      type: Array,
      default: () => [],
    },
    fixCount: {
      type: Number,
      default: 2,
    },
  },
  data() {
    return {
      columnData: [],
      fixColumn: 2,
    };
  },
  watch: {
    originData: {
      handler(val) {
        console.log(val);
        this.columnData = [...val];
      },
      immediate: true,
    },
    fixCount(val) {
      this.fixColumn = val;
    },
  },
  methods: {
    saveOptions() {
      this.$emit("save", this.columnData);
    },
    checkItem(index, element) {
      if (element.disable) return;
      this.columnData[index].check = !this.columnData[index].check;
    },
    getCheckBoxCls(element) {
      let cls = ["ct-checkbox-box"];
      if (element.disable && element.check) {
        cls.push("ct-checkbox-checked-disabled");
      } else if (element.disable && !element.check) {
        cls.push("ct-checkbox-disabled");
      } else if (!element.disable && element.check) {
        cls.push("ct-checkbox-checked");
      }
      return cls;
    },
  },
};
</script>
<style scoped lang="less">
.grid-header {
  position: sticky;
  top: 0;
  display: flex;
  width: 100%;
  align-items: center;
  color: #696974;
  background-color: rgb(247, 247, 250);
  height: 30px;
  z-index: 1;
  & > div {
    width: 80px;
    text-align: center;
  }

  & > :nth-child(2) {
    width: 256px;
    text-align: left;
  }
}
.grid-body {
  display: flex;
  width: 100%;
  align-items: center;
  height: 48px;
  border-bottom: 1px solid #f1f1f5;
  cursor: n-resize;
  & > div {
    width: 80px;
    text-align: center;
  }

  & > :nth-child(2) {
    width: 256px;
    text-align: left;
  }
  .ct-checkbox-box {
    width: 20px;
    height: 20px;
    margin: 0 auto;
    background-image: url("~@/images/icon-20px/duoxuan_weixuan.png");
    background-size: cover;
    cursor: pointer;
  }
  .ct-checkbox-checked {
    background-image: url("~@/images/icon-20px/duoxuan_yixuan.png");
  }
  .ct-checkbox-disabled {
    background-image: url("~@/images/icon-20px/duoxuan_weixuan_jinzhi.png");
    cursor: none;
  }
  .ct-checkbox-checked-disabled {
    background-image: url("~@/images/icon-20px/duoxuan_yixuan_jinzhi.png");
    cursor: none;
  }
  .tip-text {
    font-size: 12px;
    color: #92929d;
    margin-left: 8px;
  }
  .opt-list-line-icon {
    background: url("~@/images/icon-24px/caidan.png") no-repeat center;
    opacity: 0.8;
    width: 44px;
    height: 44px;
    margin: 0 auto;
  }
}
/deep/.body-cls {
  padding: 0px 20px !important;
  margin: 20px 0px;
}
.fix-grid-body {
  background-color: rgba(245, 245, 250, 0.3);
  cursor: not-allowed;
}
</style>
