<template>
  <el-table-column v-bind="column" v-on="$listeners" :label="column.label">
    <template slot="header" slot-scope="scope">
      <div class="cell-container">
        <free-render v-if="column._renderHeader" :scope="scope" :render="column._renderHeader" />
        <span class="cell-container-text" v-else>{{ scope.column.label }}</span>
        <el-popover
          placement="bottom"
          trigger="click"
          class="search-cmp-container"
          popper-class="popper-container"
          @after-leave="alwaysShowSearchCmp = false"
          v-if="column.searchable"
        >
          <head-render :scope="scope" :render="column.searchCmp" />
          <div
            slot="reference"
            :class="['search-container', alwaysShowSearchCmp ? 'search-container-active' : '']"
            @click="alwaysShowSearchCmp = true"
          >
            <span></span>
          </div>
        </el-popover>
      </div>
    </template>
    <template v-if="column.children">
      <free-column v-for="col in column.children" :key="col.prop" :column="col" />
    </template>
    <template slot-scope="scope">
      <component
        v-if="column.component"
        v-bind="getCptBind(scope, column)"
        v-on="column.listeners"
        :is="column.component"
      />

      <!-- 嵌套表格 -->
      <!-- <template v-else-if="column.children">
        <free-column v-for="col in column.children" :key="col.prop" :column="col" />
      </template> -->

      <free-render v-else :scope="scope" :render="column.render" />
    </template>
  </el-table-column>
</template>

<script>
import FreeRender from './render';
import HeadRender from './headRender';
import CellForced from './forced';

export default {
  name: 'FreeColumn',
  props: {
    column: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      showSearchCmp: false,
      alwaysShowSearchCmp: false
    };
  },
  components: {
    FreeRender,
    HeadRender
  },
  watch: {
    column: {
      handler: 'renderColumn',
      immediate: true
    }
  },
  methods: {
    renderColumn() {
      const { column } = this;
      // 多选：selection / 索引：index / 展开的按钮：expand
      if (column.type) {
        column._renderHeader = CellForced[column.type]._renderHeader;
        column.render = column.render || CellForced[column.type].renderCell;
      }
      // 格式化内容
      if (column.formatter) {
        column.render = (h, scope) => {
          return (
            <span>
              {scope.column.formatter(scope.row, scope.column, scope.row[scope.column.property], scope.$index)}
            </span>
          );
        };
      }
      // 渲染成text
      if (!column.render) {
        column.render = (h, scope) => {
          return <span>{scope.row[scope.column.property]}</span>;
        };
      }
      return column;
    },

    getColBind(col) {
      const bind = Object.assign({}, this.$attrs, col);
      delete bind.component;
      delete bind.listeners;
      delete bind.propsHandler;
      return bind;
    },

    getCptBind({ row, column }, col) {
      const props = { row, col, column };
      const handler = col.propsHandler;
      return (handler && handler(props)) || props;
    }
  }
};
</script>
<style lang="less" scoped>
.search-container {
  width: 22px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 0;
  top: -5px;
  cursor: pointer;
  margin-right: 10px;
  span {
    // background-image: url('~@/images/moa/grid/table-jiantou.svg');
    background-repeat: no-repeat;
    width: 20px;
    height: 20px;
  }
}
.cell-container:hover {
  .search-container {
    span {
      background-image: url('~@/images/moa/grid/table-jiantou.svg');
      background-color: #f7f7fa;
    }
  }
}
.search-container-active {
  span {
    background-image: url('~@/images/moa/grid/table-jiantou备份 5.svg') !important;
    background-color: #f7f7fa;
  }
}
.cell-container {
  display: flex;
  align-items: center;
  .cell-container-text {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    width: 95%;
  }
}
</style>
<style>
.popper-container {
  border-radius: 10px;
}
</style>
