<template>
  <el-popover placement="bottom" :width="popoverWidth" trigger="click" @show="handleClick" @hide="handleClick">
    <el-tree
      :data="options"
      node-key="id"
      :default-expanded-keys="['0']"
      :expand-on-click-node="expandOnClickNode"
      @current-change="currentChange"
    />
    <div slot="reference">
      <el-input
        class="el-tree-select-reference"
        placeholder="请选择商品分类"
        :disabled="true"
        :value="checked ? checked.label : ''"
      />
      <i class="icon-style" :class="isSelecting ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
    </div>
  </el-popover>
</template>
<script>
export default {
  props: {
    options: {
      type: Array,
      default: () => []
    },
    popoverWidth: {
      type: Number,
      default: 400
    },
    value: {
      type: Number | String
    },
    expandOnClickNode:{
      type:Boolean,
      default:false,
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  data() {
    return {
      checked: null,
      isSelecting: false
    };
  },
  mounted() {},
  methods: {
    currentChange(node) {
      if(node.children?.length && this.expandOnClickNode)return;
      this.$emit('change', node.id);
      document.body.click(); //关闭事件
    },
    deepGetObj(id, list) {
      for (let item of list) {
        if (item.id == id) {
          return item;
        }
        if (item.children?.length) {
          const sub_item = this.deepGetObj(id, item.children);
          if (sub_item) return sub_item;
        }
      }
      return null;
    },
    handleClick() {
      this.isSelecting = !this.isSelecting;
    }
  },
  watch: {
    value(val) {
      if (val == undefined || val == null) {
        return (this.checked = null);
      }
      setTimeout(() => {
        const checked = this.deepGetObj(val, this.options);
        this.checked = checked;
      }, 200);
    }
  }
};
</script>
<style scoped lang="less">
/deep/.el-tree-select-reference.el-input.is-disabled .el-input__inner {
  background-color: initial;
  cursor: pointer;
  border-color: #cccccc;
  color: #333;
}

.custom-tree-node {
  min-width: 110px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.selected {
  background-color: #f4f4f4;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAAWdEVYdENyZWF0aW9uIFRpbWUAMDMvMDEvMTZn8Q7sAAAA6ElEQVRIie2UMQ6CMBSGP407HsEbwNDVhBvoDdSpqzfwCjp2Ek/gDQzuHfQmkrjjQIlQWokBB6P/QtKXfF/fa+kgz3M+meFH6X/BbwhGvVCkWAJ74IrSUbXUvQMp1gYOENrlbh1IkQCLysqqH4EUYyABZjW40km7QIo5EAFblL554CnPcWRAjNIX115cZ3AENkBqYFV49A7cJ8jMN6xJmvArMHkF9wliS7I1Y0uBwKyfzc6bI7QycD7Xz90GzSIHlF62gcu4/4Oi7Ri4W5XdO3DwdVBGiilworhtzmvYTdBDvv81/Qta8wCxV0TgJxCSZAAAAABJRU5ErkJggg==);
  background-repeat: no-repeat;
  background-position: 98% 5px;
}
.icon-cls {
  color: #5383ed;
  font-size: 16px;
  font-weight: 600;
}
.icon-style {
  position: absolute;
  right: 3%;
  top: 32%;
  color: #b5b5be;
  transition: all 0.3s;
}
</style>
