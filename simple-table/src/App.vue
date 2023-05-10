<script setup lang="tsx">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import SimpleTable from "./components/SimpleTable";
import { getData } from "./components/api";
import { ref, watch, watchEffect } from "vue";
import { timeFormat } from "./utils";
import Line from "./components/Line";
import { ColumnsProps } from "./components/types";

const data: any = ref([]);
const total: any = ref(0);
const current: any = ref(0);
defineEmits(["change"]);
const priceSortOrder: any = ref(undefined);
const numSortOrder = ref('ascend');
const loading = ref(true);

const columns:ColumnsProps[] = [
  {
    title: "名字",
    field: "name",
    key: "name",
    width: 200,
  },
  {
    title: "价格",
    field: "price",
    key: "price",
    width: 200,
    // sorter: {
    //   compare: (a: any, b: any) => {
    //     return a - b;
    //   },
    //   multiple: 1,
    // },
    sorter: (a: any, b: any) => {
      return a - b;
    },
  },
  {
    title: "数量",
    field: "nums",
    key: "nums",
    width: 200,
    render: (text: any, record: any, index: number) => {
      return <div style="background:grey;color:white;">{text}</div>;
    },
    // sortOrder: numSortOrder.value,
    sorter: (a: any, b: any) => {
      return a - b;
    },
    // sorter: {
    //   compare: (a: any, b: any) => {
    //     return a - b;
    //   },
    //   multiple: 2,
    // },
  },
  {
    title: "年份",
    field: "year",
    key: "year",
    width: 200,
    formatter: (value: Date) => {
      let time = value.getDate();
      return timeFormat("YYYY-mm-dd HH:MM", time);
    },
  },
];

const columns2 = [
  {
    title: "名字",
    field: "name",
    key: "name",
    width: 200,
  },
  {
    title: "价格",
    field: "price",
    key: "price",
    width: 200,
  },
  {
    title: "数量",
    field: "nums",
    key: "nums",
    width: 200,
    render: (text: any, record: any, index: number) => {
      return <div style="background:grey;color:white;">{text}</div>;
    },
  },
  {
    title: "年份",
    field: "year",
    key: "year",
    width: 200,
    formatter: (value: Date) => {
      let time = value.getDate();
      return timeFormat("YYYY-mm-dd HH:MM", time);
    },
  },
];
const new_columns = columns.map(v=>{
  let col= {
    ...v,
    sortOrder:'ascend'
  }
  return col;
});

getData().then((res: any) => {
  console.log("请求完数据");
  data.value = res.data || [];
  total.value = res.total;
  loading.value = false;
});

const changeTest = (
  type: string,
  index?: number,
  state?: string,
  key?: string
) => {
  console.log("模拟change事件");
  loading.value = true;
  if (type == "pageChange") {
    setTimeout(() => {
      current.value = index;
      if (index == 0) {
        data.value = [
          {
            name: "测试1",
            year: new Date(),
            price: 567,
            nums: 20,
          },
          {
            name: "测试2",
            year: new Date(),
            price: 334,
            nums: 20,
          },
          {
            name: "测试3",
            year: new Date(),
            price: 755,
            nums: 20,
          },
          {
            name: "测试4",
            year: new Date(),
            price: 234,
            nums: 20,
          },
          {
            name: "测试5",
            year: new Date(),
            price: 123,
            nums: 20,
          },
          {
            name: "测试6",
            year: new Date(),
            price: 200,
            nums: 20,
          },
          {
            name: "测试7",
            year: new Date(),
            price: 200,
            nums: 20,
          },
          {
            name: "测试8",
            year: new Date(),
            price: 200,
            nums: 20,
          },
          {
            name: "测试9",
            year: new Date(),
            price: 198,
            nums: 20,
          },
          {
            name: "测试10",
            year: new Date(),
            price: 197,
            nums: 20,
          },
          {
            name: "测试11",
            year: new Date(),
            price: 134,
            nums: 20,
          },
        ];
      } else {
        data.value = [
          {
            name: "测试12",
            year: new Date(),
            price: 144,
            nums: 20,
          },
          {
            name: "测试13",
            year: new Date(),
            price: 155,
            nums: 20,
          },
          {
            name: "测试14",
            year: new Date(),
            price: 166,
            nums: 20,
          },
          {
            name: "测试15",
            year: new Date(),
            price: 177,
            nums: 20,
          },
          {
            name: "测试16",
            year: new Date(),
            price: 188,
            nums: 20,
          },
          {
            name: "测试17",
            year: new Date(),
            price: 199,
            nums: 20,
          },
          {
            name: "测试18",
            year: new Date(),
            price: 211,
            nums: 20,
          },
          {
            name: "测试19",
            year: new Date(),
            price: 200,
            nums: 20,
          },
          {
            name: "测试20",
            year: new Date(),
            price: 200,
            nums: 20,
          },
          {
            name: "测试21",
            year: new Date(),
            price: 200,
            nums: 20,
          },
        ];
      }
      loading.value = false;
    }, 1000);
  } else {
    console.log("模拟sort事件");
    alert("模拟触发sort事件");
    loading.value = false;
  }
};
</script>

<!-- :pagination="false" -->
<template>
  <h1>单排</h1>
  <SimpleTable
    :columns="columns"
    :data="data"
    :loading="loading"
    :pagination="{
      total: total,
      // current: current,
      pageSize: 10,
    }"
  />
  <!-- <h1>多排</h1>
  <SimpleTable
    :columns="columns2"
    :data="data"
    :loading="loading"
    :pagination="{
      total: total,
      pageSize: 10,
    }"
  /> -->
  <!-- :pagination="{
      total: total,
      current: current,
      pageSize: 10,
    }" -->
  <!-- :onChange="changeTest" -->
  <!-- @change= 'changeTest' -->

</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 60px;
}
</style>
