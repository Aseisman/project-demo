import Vue from "vue";

require("./override/utils/popup/popup-manager")
require("./override/theme-chalk/date-picker.css")
require("./override/theme-chalk/form.css")
require("./override/theme-chalk/table.css")

import WinPanel from './ux/WinPanel.vue';
import KdForm from './ux/KdForm.vue';
import KdTable from './ux/KdTable';
import CardPanel from './ux/CardPanel.vue';
import RightPanel from './ux/RightPanel.vue';
import MainPanel from './ux/MainPanel.vue';
import PicUploader from './ux/PicUploader.vue';
import FileUploader from './ux/FileUploader.vue';

Vue.component('win-panel',WinPanel);
Vue.component('kd-form',KdForm);
Vue.component('kd-table',KdTable);
Vue.component('card-panel',CardPanel);
Vue.component('right-panel',RightPanel);
Vue.component('main-panel',MainPanel);
Vue.component('pic-uploader',PicUploader);
Vue.component('file-uploader',FileUploader);
