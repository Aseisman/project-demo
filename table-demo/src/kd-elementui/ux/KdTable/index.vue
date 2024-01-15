<template>
  <div style="height:100%">
    <VirtualScroll v-if="virtual" :data="data" :item-size="62" style="height:100%" :key-prop="keyProp"
      @change="(renderData) => virtualList = renderData" @selection-change="selectionChange" @clearSelection="selectionChange">
      <el-table ref="elTable" :data="virtualList" v-bind="$attrs" v-on="$listeners">
        <template v-for="item in tbColumns">
          <el-table-column v-if="item.slotScope" v-bind="item" :key="item.prop" v-on="$listeners"
            :newLeftFixed="item.newLeftFixed">
            <template slot-scope="scope">
              <slot :name="item.prop" v-bind="scope"></slot>
            </template>
          </el-table-column>

          <virtual-column v-else v-bind="$attrs" :key="item.prop" :column="item" />
        </template>
      </el-table>
    </VirtualScroll>
    <el-table ref="elTable" :data="data" v-bind="$attrs" v-on="$listeners" v-else>
      <template v-for="item in tbColumns">
        <el-table-column v-if="item.slotScope" v-bind="item" :key="item.prop" v-on="$listeners"
          :newLeftFixed="item.newLeftFixed">
          <template slot-scope="scope">
            <slot :name="item.prop" v-bind="scope"></slot>
          </template>
        </el-table-column>

        <free-column v-else v-bind="$attrs" :key="item.prop" :column="item" />
      </template>
    </el-table>
  </div>
</template>

<script>
import FreeColumn from './column';
import VirtualColumn from "./virtual/VirtualColumn.vue";
import VirtualScroll from "./virtual/VirtualScroll.vue"
export default {
  components: { 
    FreeColumn,
    VirtualScroll,
    VirtualColumn
  },
  props: {
    data: Array,
    columns: Array,
    columnsProps: Object,
    virtual: {
      type: Boolean,
      default: false,
    },
    keyProp: {
      type: String,
      default: "id"
    }
  },
  computed: {
    tbColumns() {
      const { columns, columnsProps: props } = this

      return columns.map(col => {
        const it = Object.assign({}, props, col)
        return it
      })
    }
  },
  data() {
    return {
      virtualList: [],
    }
  },
  methods:{
    selectionChange(...args){
      this.$emit('selection-change', ...args)
    },
  }
}
</script>
