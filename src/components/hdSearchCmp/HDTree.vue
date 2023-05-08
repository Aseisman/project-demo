<template>
  <div class="kd-tree-filter">
    <div class="checkgroup-list">
      <el-tree
        :data="data"
        node-key="id"
        :default-expanded-keys="['0']"
        :expand-on-click-node="false"
        @current-change="currentChange"
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span :title="data.label">{{ data.label }}</span>
          <span :class="checked == data.id ? 'el-icon-check icon-cls' : ''"></span>
        </span>
      </el-tree>
    </div>
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
      checked: ''
    };
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    value: {
      type: Number | String
    }
  },
  methods: {
    onSubmit() {
      this.$emit('save', this.deepGetObj(this.checked, this.data));
      this.doClose();
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
      return false;
    },
    currentChange(obj) {
      this.checked = obj.id;
    },
    doClose() {
      this.$parent.doClose();
    }
  },
  watch: {
    value: {
      handler: function (val) {
        this.checked = val;
      },
      immediate: true
    }
  }
};
</script>

<style lang="less" scoped>
.kd-tree-filter {
  width: 280px;
  max-width: 380px;
  min-width: 160px;
  max-height: 340px;
  .checkgroup-list {
    overflow: scroll;
    max-height: 260px;
  }
  /deep/ .el-tree-node__content {
    height: 32px;
  }
  /deep/ .el-tree-node__content:hover {
    border-radius: 2px;
  }
}
.el-tree-node__content {
  height: 28px;
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
.bbar-panel {
  margin: 8px -12px -18px;
  text-align: left;
  background: #fafafa;
  padding: 8px 0 8px 16px;
  border-radius: 10px;
  border-top-right-radius: 0px;
  border-top-left-radius: 0px;
}
.icon-cls {
  color: #5383ed;
  font-size: 16px;
  font-weight: 600;
}
</style>
