<template>
  <el-table ref="elTable" :data="data" v-bind="$attrs" v-on="$listeners">
      <template v-for="item in tbColumns">
        <el-table-column
          v-if="item.slotScope"
          v-bind="item"
          :key="item.prop"
          v-on="$listeners"
          :newFixed="item.newFixed"
        >
          <template slot-scope="scope">
            <slot :name="item.prop" v-bind="scope"></slot>
          </template>
        </el-table-column>

        <free-column v-else v-bind="$attrs" :key="item.prop" :column="item" />
      </template>
    </el-table>
</template>

<script>
import FreeColumn from './column'

export default {
  components: {
    FreeColumn
  },
  props: {
    data: Array,
    columns: Array,
    columnsProps: Object
  },
  computed: {
    tbColumns() {
      const { columns, columnsProps: props } = this

      return columns.map(col => {
        const it = Object.assign({}, props, col)
        return it
      })
    }
  }
}
</script>
