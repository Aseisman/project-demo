<template>
  <div class="title">瀑布流：根据不同的窗口大小，动态调整每一列的状态</div>
  <div class="container" ref="container" @scroll="onscroll">
    <div class="column" v-for="(column, index) in columns" :key="index">
      <div
        class="item"
        v-for="(item, i) in column"
        :key="i"
        :style="{ height: item.height + 'px', background: item.background }"
      >
        {{ item.text }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import json from "./data.json";
const contentArr = ref([]); // 数据源
const columns = ref([]); //每一列的数据 二维数组
const arrIndex = ref([]); //暂存每一行高度和top
const loading = ref(false);
const container = ref();

const getMinHeight = (arr) => {
  let a = [];
  for (let i = 0; i < arr.length; i++) {
    a.push(parseInt(arr[i].height) + parseInt(arr[i].top));
  }
  return Math.min(...a);
};

const getMinIndex = (val) => {
  for (let i = 0; i < columns.value.length; i++) {
    let height = columns.value[i][columns.value[i].length - 1].height;
    let top = columns.value[i][columns.value[i].length - 1].top;
    if (parseInt(height) + parseInt(top) == val) {
      arrIndex.value.push(i);
    }
  }
};

const init = () => {
  columns.value = [];
  let len = contentArr.value.length;
  let cWidth = container.value.clientWidth;
  // 图片宽度120px;计算时留10当padding
  let cLen = Math.floor(cWidth / 130);

  // 先push进第一行
  for (let i = 0; i < cLen; i++) {
    contentArr.value[i].top = 0;
    columns.value.push([contentArr.value[i]]);
  }

  // 逐个添加
  everyAdd(cLen);
};
const everyAdd = (start) => {
  // 逐个添加
  for (let index = start; index < contentArr.value.length; index++) {
    arrIndex.value = [];
    let arr = [];
    let minHeight = 0;
    let pushIndex = 0;

    for (let i = 0; i < columns.value.length; i++) {
      arr.push({
        height: columns.value[i][columns.value[i].length - 1].height,
        top: columns.value[i][columns.value[i].length - 1].top,
      });
    }

    minHeight = getMinHeight(arr);
    pushIndex = getMinIndex(minHeight);

    if (arrIndex.value.length > 0) {
      pushIndex = Math.min(...arrIndex.value); //出现高度一样的，去索引最小的
    }

    contentArr.value[index].top = minHeight + 20; // 给对象里面标记top,方便下次计算
    columns.value[pushIndex].push(contentArr.value[index]);
  }
};

// let clientH = document.documentElement.clientHeight || document.body.clientHeight;
// document.onscroll = (e) => {
const onscroll = (e) => {
  let top = e.target.scrollTop;
  let height = e.target.scrollHeight;
  if (top + container.value.clientHeight == height) {
    setTimeout(() => {
      const res = json.arr;
      const start = contentArr.value.length;
      contentArr.value.push(...res);
      everyAdd(start);
    });
    // this.pushElement().then(() => {
    //   //  从接口最新获取的元素push到目前高度最小的一列
    //   for (var index = 0; index < this.contentArr2.length; index++) {
    //     this.arrIndex = [];
    //     let arr = []; //找到高度最小的一列，可能有多个
    //     let minHeight = 0; //高度最小的一列的高度
    //     let pushIndex = 0; //高度最小的一列所在位置的索引
    //     for (let i = 0; i < this.columns.length; i++) {
    //       arr.push({
    //         height:
    //           this.columns[i].columnArr[
    //             this.columns[i].columnArr.length - 1
    //           ].height,
    //         top: this.columns[i].columnArr[
    //           this.columns[i].columnArr.length - 1
    //         ].top,
    //       });
    //     }
    //     minHeight = this.getMinHeight(arr);
    //     this.getMinIndex(minHeight);
    //     if (this.arrIndex.length > 0) {
    //       pushIndex = Math.min.apply(null, this.arrIndex); //出现高度一样的，去索引最小的
    //     }
    //     this.contentArr[index].top = minHeight + 20;
    //     this.columns[pushIndex].columnArr.push(this.contentArr[index]);
    //     this.loading = false;
    //   }
    // });
  }
};
onMounted(() => {
  setTimeout(() => {
    contentArr.value = json.arr.slice(30);
    init();
    window.onresize = () => {
      init();
    };
  });
});
</script>

<style scoped>
div,
p {
  margin: 0;
  padding: 0;
}
.title {
  text-align: center;
  color: #595959;
  line-height: 40px;
}
.container {
  margin: 0 auto;
  height: 89.3vh;
  overflow: auto;
  padding-bottom: 20px;
  display: flex;
  justify-content: space-around;
  background: rgb(188, 237, 252);
  transition: all 0.5s ease-in-out;
}
.item {
  width: 120px;
  color: #000;
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.5s ease-in-out;
}
.loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
<style>
/* 由于大多数人是 PC 端用户，PC 是 webkit 的，可以修改全局滚动条提高体验*/
body ::-webkit-scrollbar {
  width: 15px;
  height: 7px;
}

body ::-webkit-scrollbar-thumb:vertical {
  border-radius: 10px;
  border: 4px solid rgba(0, 0, 0, 0);
  box-shadow: 7px 0 0 #c3c3c3 inset;
  transition: background-color 0.3s;
}

body ::-webkit-scrollbar-thumb:horizontal {
  border-radius: 6px;
  background-color: #c3c3c3;
  transition: background-color 0.3s;
}

body ::-webkit-scrollbar-thumb:hover {
  box-shadow: 7px 0 0 #bbb inset;
}
</style>
