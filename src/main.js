import Vue from "vue";
import App from "./App.vue";

import ElementUI from "@moa/element-ui";
import {
  addResizeListener,
  removeResizeListener,
} from "@moa/element-ui/src/utils/resize-event";
import Emitter from "@moa/element-ui/src/mixins/emitter";
import { PopupManager } from "@moa/element-ui/lib/utils/popup";
window.ElUI = {
  ui: ElementUI,
  utils: { addResizeListener, removeResizeListener, PopupManager, Emitter },
};

require("./kd-elementui/all.js");
import "./kd-elementui/theme/override.css"; //自己项目重写的element部分样式
import "./kd-elementui/theme/index.css";
import "@/assets/global.css";

Vue.config.productionTip = false;

Vue.use(ElementUI);

new Vue({
  render: (h) => h(App),
}).$mount("#app");
