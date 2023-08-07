<script setup lang="ts">
import { Ref, ref, onMounted } from "vue";
import { showLoadingToast, showNotify, showDialog } from "vant";
// import DPlayer from "dplayer";
// import DPlayer from 'vue-dplayer'
// import 'vue-dplayer/dist/vue-dplayer.css'
// import * as bodySegmentation from "@tensorflow-models/body-segmentation";
// import "@tensorflow/tfjs-core";
// import "@tensorflow/tfjs-backend-webgl";
// import "@mediapipe/selfie_segmentation";

interface ActionVideo {
  name?: string;
  subname?: string;
  url?: string;
  barrage?: Array<string>;
  color?: string;
  videoUrl?: string;
}

// loading 配置
const loading = ref(true);
const maskOpen = ref(true);
const maskImageUrl = ref("");

// video 配置
const actionViedo: Ref<ActionVideo> = ref({});
const viedoActionShow = ref(false);
const viedoList: Ref<ActionVideo[]> = ref([
  {
    name: "只因你太美（鸡你太美）",
    subname: "蔡徐坤",
    url: "https://dcdn.it120.cc/2022/11/04/87b7b5af-476c-4d2b-ae90-36724d66a407.mp4",
    barrage: [
      "时 隔 四 年 依 然 经 典",
      "小小房间竟然人才辈出，实在是恐怖如斯",
      "《有生之年看到原版》",
      "以前的鲲鲲充满了自信和笑容",
      "梦开始的地方",
      "1.自我介绍",
      "这短暂的一分钟养活了多少up主（doge）",
      "万 恶 之 源",
      "《开 始 吟 唱》",
      "《名场面》",
      "《music》",
      "《经典咏流传》",
      "非物质文化遗产",
      "《文艺复兴》",
      "《白 带 异 常》",
      "梦开始的地方，我的梦回来了",
      "每一帧都是经典",
      "每一帧都是表情包诶",
      "《梦开始的地方》",
      "5.优雅转身",
      "前 方 高 能",
      "准备铁山靠",
      "《铁山靠》",
      "招式3:《铁 山 靠》",
      "坤法第一式：铁山靠",
      "小秘密：随便一帧都是经典画面",
      "《白鹤亮翅》",
      "跳水00:40",
      "《 老 肩 巨 滑 》",
      "《每天一遍，精神百倍》",
      "优雅，真的是优雅",
      "《经典永流传》",
      "《垂直握把》",
      "《起舞弄清影》",
      "每时每刻打开都有人在看系列",
      "《护裆派》",
      "《让我蠢蠢欲动》",
      "᭙ᦔꪀꪑᦔ，​",
      "这种感觉我从未有Cause I Got A Cush On You Who You",
      "武当（档）派",
      "爷不知道就他笑死了多少无辜的生命",
      "《国家宝藏》之家禽",
      "《无效定语从句》",
      "卧槽，每一帧都是万恶之源",
      "“鳖”",
      "每日一遍",
      "嘎子偷狗时代考察",
      "《亡之音》",
      "看见这个头型我就想笑",
      "最后亿遍",
      "期待的话，请多多为我投票吧！",
      "《作词作曲》",
      "你干嘛∽哈哈～哎呦",
      "糖果超甜",
      "笑死我了哈哈哈哈",
      "你是我的我是你的谁",
      "原版都这么滑稽哈哈哈",
      "你不要过来！！！",
      "《啥时候都有人》",
      "我的口头禅",
    ],
  },
  {
    name: "蓝色战衣1",
    subname: "一栗小莎子",
    url: "https://dcdn.it120.cc/2022/11/07/2cfeb9cd-84ff-4981-8ac1-ffa421c82ff1.mp4",
    barrage: [
      "蓝色这个无法超越啊，但是到底哪里不一样嘞",
      "让我看看谁22年七月份还在看",
      "看来粉色战衣后回来看看蓝色的，果然还是蓝色更好",
      "这就是传说中的。蓝衣战神。",
      "曹操只有一个，但曹贼不是",
      "S21版本T0英雄莎子相较上版本T0英雄电气鼠 英雄强度差别不大 主打身材流 扭捏颤抖流 但新版本蓝色战袍加身的莎子完美契合男人审美而电气鼠出装一成不变略有逊色，可谓名副其实版本T0",
      "蓝色战衣：起源（考古）",
      "她其实什么都懂",
      "好厉害",
      "36度会忍不住脱衣服，41度就大脑缺氧了",
      "有些人我不想点破",
      "林志玲？",
      "作者通过穿黑丝，露大腿，形象生动的表达了自己对夏天的喜爱和热情深刻的反应了当代劳动人民夏天特别热的社会现状，表达了对这个大自然的不满之情，以及作者豁达桀骜不驯的内心",
      "我们班男生天天喊的蓝色战衣是这个吗！？",
      "有人现在还在看吗",
      "考古",
      "@雷电将军 ",
      "22年10月了",
      "你的体温",
      "蓝衣战神",
      "@哎哟。 小莎子",
      "啊 这……",
      "@叭叭叭 久久不能入怀",
      "@qyJLJ& 好会",
      "每天看十遍",
      "@玖 这个",
      "@小鲨鱼 喜欢",
      "考古来了",
      "蓝衣战神",
      "不行了",
      "没人能超越我！",
      "看来粉色战衣后回来看看蓝色的，果然还是蓝色更好",
      "@黎夏 真的好看",
      "@Miss Lu 是有点像",
      "让我看看谁22年10月份还在看",
      "我还在看@Jͮoͮkͮeͮrͮ ",
      "@李知恩- @阿彩 @M⁵ 一波抖音回忆，这首歌我老喜欢了",
      "@一生要强汤姆猫 再艾特艾特你，怕你忘了",
      "我王贺兵就爱看这个",
      "女上",
      "考古",
    ],
  },
  {
    name: "蓝色战衣2",
    subname: "一栗小莎子",
    url: "https://dcdn.it120.cc/2022/11/07/23a4e8ae-5a2f-4801-a557-cb5214d0d648.mp4",
    barrage: [
      "蓝色这个无法超越啊，但是到底哪里不一样嘞",
      "让我看看谁22年七月份还在看",
      "看来粉色战衣后回来看看蓝色的，果然还是蓝色更好",
      "这就是传说中的。蓝衣战神。",
      "曹操只有一个，但曹贼不是",
      "S21版本T0英雄莎子相较上版本T0英雄电气鼠 英雄强度差别不大 主打身材流 扭捏颤抖流 但新版本蓝色战袍加身的莎子完美契合男人审美而电气鼠出装一成不变略有逊色，可谓名副其实版本T0",
      "蓝色战衣：起源（考古）",
      "她其实什么都懂",
      "好厉害",
      "36度会忍不住脱衣服，41度就大脑缺氧了",
      "有些人我不想点破",
      "林志玲？",
      "作者通过穿黑丝，露大腿，形象生动的表达了自己对夏天的喜爱和热情深刻的反应了当代劳动人民夏天特别热的社会现状，表达了对这个大自然的不满之情，以及作者豁达桀骜不驯的内心",
      "我们班男生天天喊的蓝色战衣是这个吗！？",
      "有人现在还在看吗",
      "考古",
      "@雷电将军 ",
      "22年10月了",
      "你的体温",
      "蓝衣战神",
      "@哎哟。 小莎子",
      "啊 这……",
      "@叭叭叭 久久不能入怀",
      "@qyJLJ& 好会",
      "每天看十遍",
      "@玖 这个",
      "@小鲨鱼 喜欢",
      "考古来了",
      "蓝衣战神",
      "不行了",
      "没人能超越我！",
      "看来粉色战衣后回来看看蓝色的，果然还是蓝色更好",
      "@黎夏 真的好看",
      "@Miss Lu 是有点像",
      "让我看看谁22年10月份还在看",
      "我还在看@Jͮoͮkͮeͮrͮ ",
      "@李知恩- @阿彩 @M⁵ 一波抖音回忆，这首歌我老喜欢了",
      "@一生要强汤姆猫 再艾特艾特你，怕你忘了",
      "我王贺兵就爱看这个",
      "女上",
      "考古",
    ],
  },
]);

// dplayer
const dplayer = ref();

// action
const dp: any = ref(null);
const viedoActionSelect = (e: any) => {
  playVideo(e);
};
const playVideo = async (item: ActionVideo) => {
  const toast = showLoadingToast({
    duration: 0,
    forbidClick: true,
    message: "loading",
  });
  // ==========loading begin==========
  dp.value
    ? (dp.value.pause(), dp.value.danmaku.clear())
    : (toast.close(), (loading.value = true));

  // transfer data
  item.videoUrl = item.url;
  actionViedo.value = item;
  viedoList.value = viedoList.value.map((e) => {
    e.color = e.name == item.name ? "#1989fa" : "#323233";
    return e;
  });
  // action to load video
  dp.value ? dp.value.switchVideo({ url: item.videoUrl }) : dpInit();
  loading.value = false;
  // ==========load end ==========

  // ==========模型初始化 begin==========
  (await segmenter) && segmenter.dispose();
  toast.close();
  await bodySegmentationInit();
  // ==========模型初始化 end==========
};
const changeModelType = async () => {
  dp.value && dp.value.pause();
  (await segmenter) && segmenter.dispose();
  segmenter = null;
  await bodySegmentationInit();
};
const uploaderViedo = async (file: any) => {
  maskImageUrl.value = "";
  dp.value && dp.value.danmaku.clear();
  dp.value && dp.value.pause();
  const toast = showLoadingToast({
    duration: 0, // 持续展示 toast
    forbidClick: true,
    message: "上传图片中",
  });
  const url = window.URL && window.URL.createObjectURL(file);
  dp.value.switchVideo({
    url,
  });
  toast.close();
  (await segmenter.value) && segmenter.value.dispose();
  segmenter.value = null;
  await bodySegmentationInit();
  return false;
};

// task
const task = ref();

const dpInit = () => {
  dp.value = new DPlayer({
    element: dplayer.value,
    container: dplayer.value,
    loop: true,
    volume: 0,
    video: {
      url: actionViedo.value.videoUrl,
    },
    danmaku: {
      id: "9E2E3368B56CDBB4",
      api: "/dplayer/",
      bottom: "10%",
      unlimited: false,
    },
  });
  // 解决跨域
  dp.value.video.setAttribute("crossorigin", "anonymous");
  dp.value.on("play", () => {
    task.value = window.requestAnimationFrame(recognition);
  });
  dp.value.on("pause", () => {
    if (task.value) {
      window.cancelAnimationFrame(task.value);
      task.value = null;
    }
  });
  dp.value.on("danmaku_send", (e: any) => {
    console.log(e);
  });
  dp.value.on("error", (error: any) => {
    console.error("error", error);
    showDialog({
      message: "视频加载失败2-" + error,
    });
  });
};

// tenserflow
let segmenter: any = null; // 这里不能用ref or reactive；会报错；'get' on proxy: property 'constants' is a read-only and non-configurable data property on the proxy target but the proxy did not return its actual value
const modelType = "landscape";
const foregroundThresholdProbability = ref(0.3);
const randomDanmaku = () => {
  const danmaku = actionViedo.value.barrage || [
    new Date().toLocaleString(),
    "测试测试测试测试测试测试",
  ]; //弹幕文字
  const colors = [
    "#ffffff",
    "#ffffff",
    "#ffffff",
    "#ffffff",
    "#e54256",
    "#ffe133",
    "#64DD17",
    "#D500F9",
  ];
  const types = [0, 1, 2];

  const randomItem = (arr: any[]) => arr[(Math.random() * arr.length) | 0];
  dp.value.danmaku.draw({
    text: randomItem(danmaku),
    color: randomItem(colors),
    type: randomItem(types), //滚动
  });
};
//压缩
const compressionImage = (el: any) => {
  return new Promise(async (resolve) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;

    // 原始尺寸
    const elRect = el.getBoundingClientRect();
    const originWidth = elRect.width;
    const originHeight = elRect.height;

    // 最大尺寸限制
    const maxWidth = 350;
    const maxHeight = 350;

    // 目标尺寸
    var targetWidth = originWidth,
      targetHeight = originHeight;
    if (originWidth > maxWidth || originHeight > maxHeight) {
      if (originWidth / originHeight > maxWidth / maxHeight) {
        // 更宽，按照宽度限定尺寸
        targetWidth = maxWidth;
        targetHeight = Math.round(maxWidth * (originHeight / originWidth));
      } else {
        targetHeight = maxHeight;
        targetWidth = Math.round(maxHeight * (originWidth / originHeight));
      }
    }
    // canvas对图片进行缩放
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    // 清除画布
    context.clearRect(0, 0, targetWidth, targetHeight);
    // 压缩
    context.drawImage(el, 0, 0, targetWidth, targetHeight);

    // context.drawImage(el, 0, 0, targetWidth, targetHeight);
    const imageData = context.getImageData(0, 0, targetWidth, targetHeight);
    resolve(imageData);
  });
};
const recognition = async () => {
  const danmaku =
    dplayer.value && dplayer.value.querySelector(".dplayer-danmaku");
  try {
    randomDanmaku();
    if (segmenter && maskOpen.value && danmaku) {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      //压缩视频尺寸
      const imageData = await compressionImage(dp.value.video);
      const segmentationConfig = {
        flipHorizontal: false,
        multiSegmentation: false,
        segmentBodyParts: true,
        segmentationThreshold: 1,
      };

      const people = await segmenter.segmentPeople(
        imageData,
        segmentationConfig
      );

      const foregroundColor = { r: 0, g: 0, b: 0, a: 0 }; //用于可视化属于人的像素的前景色 (r,g,b,a)。
      const backgroundColor = { r: 0, g: 0, b: 0, a: 255 }; //用于可视化不属于人的像素的背景颜色 (r,g,b,a)。
      const drawContour = false; //是否在每个人的分割蒙版周围绘制轮廓。
      const backgroundDarkeningMask = await bodySegmentation.toBinaryMask(
        people,
        foregroundColor,
        backgroundColor,
        drawContour,
        foregroundThresholdProbability.value
      );
      // console.log('[backgroundDarkeningMask]',backgroundDarkeningMask);
      canvas.width = backgroundDarkeningMask.width;
      canvas.height = backgroundDarkeningMask.height;
      context && context.putImageData(backgroundDarkeningMask, 0, 0);
      const Base64 = canvas.toDataURL("image/png");
      maskImageUrl.value = Base64;
      const { width, height } = dp.value.video.getBoundingClientRect();
      //加载图片到缓存中（如果不加载到缓存中，会导致mask-image失效，因为图片还没有加载到页面上，新的图片已经添加上去了，会导致图片一直是个空白）
      await imgLoad(Base64);
      danmaku.style = `-webkit-mask-image: url(${Base64});-webkit-mask-size: ${width}px ${height}px;`;
      task.value = window.requestAnimationFrame(recognition);
    } else {
      danmaku.style = "";
      task.value = window.requestAnimationFrame(recognition);
    }
  } catch (err) {
    danmaku.style = "";
    task.value = window.requestAnimationFrame(recognition);
  }
};
const bodySegmentationInit = async () => {
  try {
    const toast = showLoadingToast({
      duration: 0, // 持续展示 toast
      forbidClick: true,
      message: "模型加载中",
    });
    // https://unpkg.com/@mediapipe/selfie_segmentation
    // https://unpkg.com/@tensorflow-models/body-segmentation
    const model = bodySegmentation.SupportedModels.MediaPipeSelfieSegmentation;
    const segmenterConfig = {
      runtime: "mediapipe", // or 'tfjs'
      // modelType: modelType, //general  landscape
      modelType: "landscape", //landscape or general
      // solutionPath: "https://unpkg.com/@mediapipe/selfie_segmentation",
      solutionPath:
        "https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation",
    };
    segmenter = await bodySegmentation.createSegmenter(model, segmenterConfig);
    console.log(segmenter);

    toast.close();
    dp.value && dp.value.notice("模型加载完成");
    dp.value && dp.value.play();
  } catch (error) {
    console.log(error);
    showDialog({
      message: "模型加载失败" + error,
    });
  }
};

onMounted(() => {
  showNotify({
    type: "primary",
    message: "首次模型加载模型可能需要1-2分钟，请耐心等待",
    duration: 2000,
  });
  playVideo(viedoList.value[0]);
});

// utils
// const isObjEmpty = (obj: any) => {
//   return (
//     obj === undefined ||
//     obj === "undefined" ||
//     obj == null ||
//     obj === "" ||
//     obj.length === 0 ||
//     (typeof obj === "object" && Object.keys(obj).length === 0)
//   );
// };
const imgLoad = (src: string) => {
  return new Promise(async (resolve) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      resolve(img);
    };
    img.onerror = () => {
      resolve(img);
    };
  });
};
</script>

<template>
  <!-- <div id="app" v-cloak> -->
  <div class="barrageAI">
    <div v-if="loading" style="padding: 20px 0">
      <van-loading color="#0094ff" size="24px" vertical>加载中</van-loading>
    </div>
    <div :style="{ opacity: loading ? 0 : 1 }">
      <h1>防挡弹幕</h1>
      <div style="width: 100%" ref="dplayer"></div>
      <br />
      <van-cell-group inset>
        <van-field
          label="视频"
          :value="actionViedo.name"
          @click="viedoActionShow = true"
          readonly
          is-link
        ></van-field>
        <van-action-sheet
          v-model="viedoActionShow"
          :actions="viedoList"
          description="请选择视频"
          @select="viedoActionSelect"
          cancel-text="取消"
          close-on-click-action
        >
        </van-action-sheet>
        <van-field label="智能防挡弹幕">
          <template #input>
            <van-switch v-model="maskOpen" size="20" />
          </template>
        </van-field>
        <van-field label="模型分类">
          <template #label>
            <span>模型分类</span>
            <van-icon
              name="question-o"
              @click="
                showDialog({
                  message: '尺寸越大，识别越准确，同时性能也更差',
                })
              "
              style="padding: 0 3px"
            />
          </template>
          <template #input>
            <van-radio-group
              :disabled="!maskOpen"
              @change="changeModelType"
              v-model="modelType"
            >
              <van-radio name="landscape">144x256 x3</van-radio>
              <van-radio name="general">256x256 x3</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field>
          <template #label>
            <span>阈值概率</span>
            <van-icon
              name="question-o"
              @click="
                showDialog({
                  message: '前景阈值概率(越小物体越清晰，同时噪点也比较多)',
                })
              "
              style="padding: 0 3px"
            />
          </template>
          <template #input>
            <van-slider
              :disabled="!maskOpen"
              v-model="foregroundThresholdProbability"
              min="0.1"
              max="1"
              step="0.1"
            />
          </template>
        </van-field>
        <van-field>
          <template #label>
            <span>上传视频</span>
            <van-icon
              name="question-o"
              @click="showDialog({ message: '视频背景不要太乱' })"
              style="padding: 0 3px"
            />
          </template>
          <template #input>
            <van-uploader
              :before-read="(file:any)=>{
              uploaderViedo(file);
              return false;
            }"
              accept="video/*"
            />
          </template>
        </van-field>
      </van-cell-group>
      <br />
      <img v-if="maskOpen && maskImageUrl" :src="maskImageUrl" style="width:100%;" />
    </div>
  </div>
</template>

<style scoped>
/* [v-cloak] {
    opacity: 0 !important;
} */
.barrageAI {
  max-width: 550px;
  margin: 0 auto;
  padding: 15px;
  .dplayer-controller .dplayer-icons .dplayer-full {
    display: none;
  }
  .dplayer-danmaku {
    font-size: 13px !important;
  }
  .van-radio:not(:last-child) {
    margin-bottom: 8px;
  }
}
</style>
