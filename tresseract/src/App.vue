<template>
  <el-upload ref="uploadRef" v-model:file-list="fileList" action="http://localhost:3000/upload" list-type="picture-card"
    :on-preview="handlePictureCardPreview" :before-upload="handleUpload">
    <el-icon>
      <Plus />
    </el-icon>
  </el-upload>
  <!-- <el-image-viewer
    :hide-on-click-modal="true"
    v-if="dialogVisible"
    :url-list="dialogImageUrl"
    @close="() => (dialogVisible = false)"
  /> -->
  <el-dialog v-model="dialogVisible">
    <div id="reg" class="img-text"></div>
    <img w-full class="img-cls" :src="dialogImageUrl[0]" alt="Preview Image" />
  </el-dialog>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref, Ref } from "vue";
import { Plus } from "@element-plus/icons-vue";
import { createWorker, PSM, OEM } from "tesseract.js";
import type { UploadProps, UploadUserFile } from "element-plus";

import png1 from "@/assets/cor扫描测试1.png";
import png2 from "@/assets/扫描件2.png";
import png3 from "@/assets/扫描件3.png";
import png4 from "@/assets/扫描4.png";
import png5 from "@/assets/扫描5.png";

const fileList = ref<UploadUserFile[]>([
  {
    name: "food.jpeg",
    url: png1,
  },
  {
    name: "food.jpeg",
    url: png2,
  },
  {
    name: "food.jpeg",
    url: png3,
  },
  {
    name: "food.jpeg",
    url: png4,
  },
  {
    name: "food.jpeg",
    url: png5,
  },
  {
    name: "food.jpeg",
    url: "http://200.200.169.235/uploads/1689064376171-cor扫描测试1.png",
  },
  {
    name: "food.jpeg",
    url: "http://200.200.169.235/uploads/1689076773242-扫描件2.png",
  },
  {
    name: "food.jpeg",
    url: "http://200.200.169.235/uploads/1689077005455-扫描件3.png",
  },
  {
    name: "food.jpeg",
    url: "http://200.200.169.235/uploads/1689077529868-扫描4.png",
  },
  {
    name: "food.jpeg",
    url: "http://200.200.169.235/uploads/1689078466731-扫描5.png",
  },
  {
    name: "food.jpeg",
    url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
  },
]);

const dialogImageUrl: Ref<any[]> = ref([]);
const dialogVisible = ref(false);
let worker: any;

onMounted(async () => {
  // ocr begin
  worker = await createWorker({
    logger: (m) => console.log(m),
  });
  await worker.loadLanguage("chi_sim");
  await worker.initialize("chi_sim", OEM.DEFAULT);
  await worker.setParameters({
    tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
  });
});
onUnmounted(async () => {
  await worker.terminate();
});
function drawRectangle(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  text: string,
  font_size: number
) {
  if (x0 == x1 || y0 == y1) return;
  //dashed
  return `<div style='position:absolute; top:${y0}px; left:${x0}px; width:${x1 - x0
    }px; height:${y1 - y0}px; line-height:${y1 - y0
    }px; font-size:${font_size}px; overflow:hidden;white-space: nowrap;'>${text}</div>`;
}
const handlePictureCardPreview: UploadProps["onPreview"] = async (
  uploadFile
) => {
  if (!uploadFile.url) return;
  // console.log(uploadFile);
  const { data } = await worker.recognize(uploadFile.url);
  console.log(data);
  let str = data.lines
    .map((line: any) => {
      const { x0, y0, x1, y1 } = line.bbox;
      const font_size = line.words[0].font_size;
      return drawRectangle(x0, y0, x1, y1, line.text, font_size);
    })
    .join("");
  console.log(str);
  setTimeout(() => {
    let div1: any = document.getElementById("reg");
    div1.innerHTML = str;
  }, 2000);
  // ocr end
  dialogImageUrl.value = [];
  dialogImageUrl.value.push(uploadFile.url as string);
  dialogVisible.value = true;
};
const handleUpload: UploadProps["beforeUpload"] = async (uploadFile) => {
  const formData = new FormData();
  formData.append("file", uploadFile);
  const url = "http://200.200.169.235:8080/upload";
  return fetch(url, {
    method: "POST",
    body: formData, //自动修改请求头,formdata的默认请求头的格式是 multipart/form-data
  })
    .then((res) => {
      return res.json();
    })
    .then((data: any) => {
      fileList.value.push({
        url: "http://200.200.169.235/" + data.data,
        name: "xxx",
      });
      return Promise.reject();
    });
};

/**
 * 计算字体大小的函数
 *
 * @param text 需要计算的文本内容
 * @param targetWidth 目标宽度
 * @param targetHeight 目标高度
 * @param minFontSize 最小字体大小，默认为 10
 * @param maxFontSize 最大字体大小，默认为 100
 * @param threshold 阈值，用于控制计算精度，默认为 1
 */
const calculateFontSize = (
  text: string,
  targetWidth: number,
  targetHeight: number,
  minFontSize = 10,
  maxFontSize = 100,
  threshold = 1
): number => {
  // 创建一个 div 元素作为容器，用于计算实际字体大小
  const container = document.createElement('div');
  container.style.display = 'inline-block';
  container.style.width = `${targetWidth}px`;
  container.style.height = `${targetHeight}px`;
  // 创建一个临时的 span 元素，并添加到容器内，用于显示需要计算的文本内容
  const tempElement = document.createElement('span');
  tempElement.style.display = 'inline-block';
  tempElement.style.whiteSpace = 'pre-wrap';
  tempElement.style.fontFamily = 'Arial, sans-serif';
  tempElement.innerText = text;
  container.appendChild(tempElement);
  document.body.appendChild(container);
  // 初始化字体大小的取值范围
  let fontSize = maxFontSize;
  let lowerBound = minFontSize;
  let upperBound = maxFontSize;
  // 使用二分法计算最适合的字体大小
  while (lowerBound <= upperBound) {
    fontSize = Math.floor((lowerBound + upperBound) / 2);
    tempElement.style.fontSize = `${fontSize}px`;
    // 当计算出的实际宽度或高度大于指定的目标宽度和高度时，缩小字体大小并继续计算
    if (tempElement.offsetWidth > targetWidth + threshold || tempElement.offsetHeight > targetHeight + threshold) {
      upperBound = fontSize - 1;
    } else {
      // 当计算出的实际宽度和高度小于等于指定的目标宽度和高度时，增大字体大小并继续计算
      lowerBound = fontSize + 1;
    }
  }
  // 从文档中移除容器及其子元素，并返回计算出的最适合的字体大小
  document.body.removeChild(container);
  return fontSize;
}
// calculateFontSize("s", 10, 10)


// const submitUpload = async () => {
//   upload.value!.submit();
//   const worker = await createWorker({
//     logger: (m) => console.log(m),
//   });
//   // console.log(worker);
//   await worker.loadLanguage("eng");
//   await worker.initialize("eng", OEM.LSTM_ONLY);
//   await worker.setParameters({
//     tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
//   });
//   try {
//     // const {
//     //   data: { text },
//     // } = await worker.recognize(
//     //   "https://tesseract.projectnaptha.com/img/eng_bw.png"
//     // );
//     // console.log(text);
//   } catch (error) {
//     console.log(error);
//   }
// };
</script>

<style scoped>
.img-cls {
  /* width: 600px; */
  /* height: 1000px; */
  /* object-fit: contain; */
}

.img-text {
  position: relative;
}
</style>
