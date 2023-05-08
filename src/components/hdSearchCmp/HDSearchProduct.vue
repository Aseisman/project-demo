<template>
  <div class="kd-tree-filter">
    <el-input v-model="keyword" class="search-input" placeholder="请输入关键字" @input="search"></el-input>
    <div class="product-select-panel" @scroll="handleScroll" ref="product-panel">
      <div v-for="item in data" :key="item.pdid" class="product-item" @click="handleClick(item)">
        <span class="pdname">{{ item.pdname }}</span>
        <span class="snumber">{{ item.snumber }}</span>
        <span :class="checked && checked.pdid == item.pdid ? 'el-icon-check icon-cls' : ''"></span>
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
      data: [],
      count: 30,
      skip: 0,
      keyword: '',
      end: false,
      checked: {}
    };
  },
  props: {
    value: {
      type: Number | String
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData(reset = false) {
      if (this.end) return;
      const { keyword, skip, count } = this;
      let param = {
        keyword: keyword === '' ? null : keyword,
        skip,
        count,
        search_type: 4
      };
      this.goAjax({
        srvop: 'SRVOP_PRODUCT_SEARCH_ALL_REQ',
        param,
        success: (res) => {
          if (!res.data.infos?.length) return (this.end = true);
          if (reset) {
            this.data = res.data.infos;
          } else {
            this.data.push(...res.data.infos);
          }
        }
      });
    },
    search: debounce(function () {
      this.end = false;
      this.skip = 0;
      this.getData(true);
    }, 500),
    onSubmit() {
      this.keyword = '';
      this.end = false;
      this.skip = 0;
      this.getData(true);
      this.$emit('save', this.checked);
      this.doClose();
    },
    doClose() {
      this.$parent.doClose();
    },
    handleClick(item) {
      this.checked = item;
    },
    handleScroll: debounce(function () {
      let dom = this.$refs['product-panel'];
      const { scrollTop, scrollHeight, clientHeight } = dom;
      if (scrollTop + clientHeight == scrollHeight) {
        this.skip += this.count;
        this.getData();
      }
    }, 200)
  },
  watch: {
    value: {
      handler: function (val) {
        this.checked = val;
        console.log(this.checked);
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
  .search-input {
    padding: 3px 9px;
    box-sizing: border-box;
  }
  .product-select-panel {
    max-height: 300px;
    overflow: auto;
    padding: 0px 4px 0 10px;
    line-height: 32px;
  }
  .product-item {
    display: flex;
    align-items: center;
    border-radius: 4px;
    cursor: pointer;
    padding-right: 4px;
    .pdname {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 50%;
      margin-left: 5px;
    }
    .snumber {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 40%;
    }
  }
  .product-item:hover {
    background-color: #f1f1f5;
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
}
.icon-cls {
  color: #5383ed;
  font-size: 16px;
  font-weight: 600;
}
</style>
