<script setup lang="ts">
import { ref } from "vue";
import useCanvas from "./compositions/useCanvas";
import Sidebar from "./components/Sidebar.vue";
const myCanvasRef = ref();
const {
  lineWidth,
  strokeColor,
  handleMousedown,
  handleTouchstart,
  revoke,
  clear,
  downloadPng,
  play,
  stack,
} = useCanvas(myCanvasRef);
</script>

<template>
  <div v-show="!stack.length" class="background-text">开始您的绘画吧！</div>
  <canvas
    id="myCanvas"
    ref="myCanvasRef"
    @mousedown="handleMousedown"
    @touchstart="handleTouchstart"
  ></canvas>
  <Sidebar
    v-model:lineWidth="lineWidth"
    v-model:strokeColor="strokeColor"
    @revoke="revoke"
    @clear="clear"
    @play="play"
    @download="downloadPng"
  />
</template>

<style>
@import "./css/reset.css";
body {
  position: relative;
  overflow: hidden;
}
#myCanvas {
  cursor: crosshair;
}
.background-text {
  position: absolute;
  top: 50%;
  left: 50%;
  color: #818181;
  user-select: none;
}
</style>
