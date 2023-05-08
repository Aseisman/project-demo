<template>
  <div class="kd-tree-filter">
    <el-input
      v-model="searchText"
      class="search-input"
      placeholder="请输入关键字"
      @input="search"
    ></el-input>
    <div class="checkgroup-list" v-show="!searchText">
      <el-tree
        :data="data"
        node-key="id"
        :default-expanded-keys="['0']"
        :expand-on-click-node="false"
        @current-change="currentChange"
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span :title="data.label"
            ><i v-if="/^group/.test(data.id)" class="el-icon-folder-opened"></i>
            {{ data.label }}</span
          >
          <span
            :class="checked == data.id ? 'el-icon-check icon-cls' : ''"
          ></span>
        </span>
      </el-tree>
    </div>
    <div v-show="searchText">
      <div class="kd-search-panel" v-loading="loading">
        <div
          v-for="item in searchResult"
          :key="item.id"
          class="search-result-item"
          @click="currentChange(item)"
        >
          <div class="result-item-box">
            <span class="label-name">{{ item.label }}</span>
            <span class="group-name">{{ item.groupName }}</span>
          </div>
          <span
            :class="checked == item.id ? 'el-icon-check icon-cls' : ''"
          ></span>
        </div>
      </div>
    </div>
    <div class="bbar-panel">
      <el-button type="primary" size="small" @click="onSubmit">确定</el-button>
      <el-button size="small" @click="doClose">取消</el-button>
    </div>
  </div>
</template>
<script>
import { debounce } from "lodash";
export default {
  data() {
    return {
      checked: "",
      searchText: "",
      loading: true,
      searchResult: [],
      data: [],
    };
  },
  props: {
    // data: {
    //   type: Array,
    //   default: () => []
    // },
    value: {
      type: Number | String,
    },
  },
  mounted() {
    setTimeout(() => {
      let data = [
        {
          id: 25,
          text: "158****0001",
          type: 0,
          pingyin: "158****0001",
          hasPermit: true,
        },
        {
          id: 26,
          text: "15800000002",
          type: 0,
          pingyin: "15800000002",
          hasPermit: true,
        },
        {
          id: 27,
          text: "15800000003",
          type: 0,
          pingyin: "15800000003",
          hasPermit: true,
        },
        {
          id: 28,
          text: "15800000004",
          type: 0,
          pingyin: "15800000004",
          hasPermit: true,
        },
        {
          id: 29,
          text: "15800000005",
          type: 0,
          pingyin: "15800000005",
          hasPermit: true,
        },
        {
          id: 30,
          text: "15800000006",
          type: 0,
          pingyin: "15800000006",
          hasPermit: true,
        },
        {
          id: 31,
          text: "15800000007",
          type: 0,
          pingyin: "15800000007",
          hasPermit: true,
        },
        {
          id: 32,
          text: "15800000008",
          type: 0,
          pingyin: "15800000008",
          hasPermit: true,
        },
        {
          id: 33,
          text: "15800000009",
          type: 0,
          pingyin: "15800000009",
          hasPermit: true,
        },
        {
          id: 34,
          text: "15800000010",
          type: 0,
          pingyin: "15800000010",
          hasPermit: true,
        },
        {
          id: 35,
          text: "15800000011",
          type: 0,
          pingyin: "15800000011",
          hasPermit: true,
        },
        {
          id: 36,
          text: "15800000012",
          type: 0,
          pingyin: "15800000012",
          hasPermit: true,
        },
        {
          id: 37,
          text: "15800000013",
          type: 0,
          pingyin: "15800000013",
          hasPermit: true,
        },
        {
          id: 38,
          text: "15800000014",
          type: 0,
          pingyin: "15800000014",
          hasPermit: true,
        },
        {
          id: 39,
          text: "15800000015",
          type: 0,
          pingyin: "15800000015",
          hasPermit: true,
        },
        {
          id: 40,
          text: "15800000016",
          type: 0,
          pingyin: "15800000016",
          hasPermit: true,
        },
        {
          id: 41,
          text: "15800000017",
          type: 0,
          pingyin: "15800000017",
          hasPermit: true,
        },
        {
          id: 42,
          text: "15800000018",
          type: 0,
          pingyin: "15800000018",
          hasPermit: true,
        },
        {
          id: 43,
          text: "15800000019",
          type: 0,
          pingyin: "15800000019",
          hasPermit: true,
        },
        {
          id: 44,
          text: "15800000020",
          type: 0,
          pingyin: "15800000020",
          hasPermit: true,
        },
        {
          id: 45,
          text: "15800000021",
          type: 0,
          pingyin: "15800000021",
          hasPermit: true,
        },
      ];
      const deepFormat = (tree) => {
          return tree.map((item) => ({
            label: item.text,
            id: item.id,
            children: item.children?.length
              ? deepFormat(item.children)
              : undefined,
          }));
        };
        this.data = deepFormat(data);
    }, 2000);
  },
  methods: {
    onSubmit() {
      this.searchText = "";
      this.searchResult = [];
      this.$emit("save", this.deepGetObj(this.checked, this.data));
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
    search: debounce(function () {
      this.loading = true;
      if (!this.searchText) {
        this.searchResult = [];
        return;
      }
      let reg = new RegExp(this.searchText);
      const deepSearch = (tree, groupName) => {
        let res = [];
        tree.forEach((item) => {
          if (!/^group/.test(item.id) && item.label.match(reg)) {
            res.push({ ...item, groupName });
          }
          if (item.children?.length) {
            const sub_res = deepSearch(item.children, item.label);
            if (sub_res.length) res.push(...sub_res);
          }
        });
        return res;
      };
      this.searchResult = deepSearch(this.data, "");
      this.loading = false;
    }, 400),
    doClose() {
      this.$parent.doClose();
    },
  },
  watch: {
    value: {
      handler: function (val) {
        this.checked = val;
      },
      immediate: true,
    },
  },
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
  .search-input {
    padding: 3px 9px;
    box-sizing: border-box;
  }
  .kd-search-panel {
    padding-top: 3px;
    padding-left: 9px;
    max-height: 260px;
    max-width: 380px;
    min-height: 150px;
    overflow: auto;
  }
  .search-result-item {
    padding: 0px 9px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    line-height: 28px;
    cursor: pointer;
    border-radius: 2px;
    .result-item-box {
      display: flex;
      align-items: center;
    }
    .label-name {
      max-width: 110px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-right: 10px;
    }
    .group-name {
      max-width: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .search-result-item:hover {
    background-color: #f1f1f5;
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
