import Vue from "vue";

export default {
  methods: {
    //获取弹窗组件和模块组件的extjs容器，这个对象建议做只读处理
    getExtCt() {
      var parent = this.$parent || this.$root;

      while (parent) {
        if (parent.$extCt) {
          return parent.$extCt
        }
        parent = parent.$parent;
      }
      return null;
    },
    createWin(name, winCfg, vueCfg, useh = false) {
      name, winCfg, vueCfg, useh;
      // var wins = this._wins
      // if (!wins) {
      //   this._wins = wins = {}
      // }
      // if (wins[name]) {
      //   SF.showErr("创建窗口失败：名称为【" + name + "】的窗口已经存在")
      //   return;
      // }
      // if(winCfg instanceof Ext.Component){
      //   wins[name] = winCfg;
      // }else{
      //   if(useh){
      //     wins[name] = new SFX.VueWindow(Ext.applyIf({
      //       view: new Vue({
      //         render:h=>h(vueCfg),
      //       })
      //     },winCfg))
      //   }else{
      //     wins[name] = new SFX.VueWindow(Ext.applyIf({
      //       view: new Vue(vueCfg)
      //     },winCfg))
      //   }
      // }
      // wins[name].on("destroy",()=>{
      //   delete wins[name];
      // })
      // return wins[name];
    },
    // createWin中，使用h函数new vue实例时，需要用到此函数进行设值
    setVueData(name, data) {
      const wins = this._wins
      const view = wins[name].view;
      Vue.nextTick(() => {
        const children = view.$children;
        if (!children.length) {
          return console.error("vue实例没有$children");
        }
        if (children.length == 1) {
          Object.keys(data).forEach(key => {
            children[0][key] = data[key];
          })
        } else if (children.length > 1) {
          console.warn("$children有多个实例,默认传入第一个");
          Object.keys(data).forEach(key => {
            children[0][key] = data[key];
          })
        }
      })
    },
    // createWin中，使用h函数new vue实例时，需要用到此函数进行设定emit
    setVueEmits(name, data) {
      const wins = this._wins
      const view = wins[name].view;
      Vue.nextTick(() => {
        const children = view.$children;
        if (!children.length) {
          return console.error("vue实例没有$children");
        }
        Object.keys(data).forEach(key => {
          children[0].$on(key, data[key]);
        })
      })
    },
    getWin(name) {
      if (!this._wins?.[name]) {
        this.showErr("获取窗口失败：名称为【" + name + "】的窗口不存在")
        return;
      }
      return this._wins[name]
    },
    showWin(name) {
      var win = this.getWin(name);
      win.show();
      return win;
    },
    createRightItem(name, cfg, vueCfg) {
      name, cfg, vueCfg
      // var rightItems = this._rightItems
      // if (!rightItems) {
      //   this._rightItems = rightItems = {}
      // }
      // if (rightItems[name]) {
      //   SF.showErr("创建侧滑窗口失败：名称为【" + name + "】的窗口已经存在")
      //   return;
      // }
      // if(cfg instanceof Ext.Component){
      //   rightItems[name] = cfg;
      // }else{
      //   rightItems[name] = new SFX.VueRightPanel(Ext.applyIf({
      //     view: new Vue(vueCfg)
      //   },cfg))
      // }

      // rightItems[name].on("destroy",()=>{
      //   delete rightItems[name];
      // })
      // let card = this.getExtCt();
      // if(!card.initialRightItem){
      //   SF.showErr("弹窗和侧滑窗口里面不能创建侧滑窗口，请通过事件抛出由主界面处理")
      //   return;
      // }
      // card.rightItem = card.rightItem || [];
      // card.rightItem.push(rightItems[name]);
      // card.initialRightItem();
    },
    getRightItem(name) {
      if (!this._rightItems?.[name]) {
        this.showErr("获取窗口失败：名称为【" + name + "】的窗口不存在")
        return;
      }
      return this._rightItems[name]
    },
    showRightItem(name) {
      var item = this.getRightItem(name);
      item.showRightItem();
      return item;
    },
    hideRightItem(name) {
      var item = this.getRightItem(name);
      item.hideRightItem();
      return item;
    }
  },
  destroyed() {
    Object.keys(this._wins).forEach((key) => {
      let cmp = this._wins[key];
      cmp.destroy();
    });
    this._wins = null;
    this._rightItems = null;//rightItems的组件在容器组会自己管理销毁
  }
};
