let { addResizeListener, removeResizeListener } = window.ElUI.utils;
/**
 * 解决表格高度自适应，混入后在模板里面根据需要确定ref是tbFooter,tbHeader,tbPanel都是选填
 *
 * 效果：会自动根据tbPanel元素的高度计算出el-table的最大高度应该是多少
 * 注意：tbHeader，tbHeaderde 内部的区域高度发生变化，需要手动调用doAutoHeight校正
 *
 * demo
 *
 * <div ref="tbPanel">
 *    <div ref="tbHeader"></div>
 *      <el-table :maxHeight="tbMaxHeight" ....>....</el-table>
 *     <div ref="tbFooter"></div>
 * </div>
 *
 */
export default {
  data() {
    return {
      tbMaxHeight:300,
    }
  },
  mounted() {
    this.$nextTick(()=>{
      this.doAutoHeight();
   })
   addResizeListener(this.$el, this.handleResize);
  },
  beforeDestroy() {
    if (this.$el && this.handleResize) removeResizeListener(this.$el, this.handleResize);
  },
  methods:{
    handleResize(){
      this.doAutoHeight();
    },
    doAutoHeight(){
      let oh = 0,cth=0;
      const {tbFooter,tbHeader,tbPanel} = this.$refs;
       if(tbFooter){
        oh+=tbFooter.offsetHeight
       }
       if(tbHeader){
        oh+=tbHeader.offsetHeight
       }
       if(tbPanel){
        cth = tbPanel.offsetHeight
       }else{
        cth = this.$el.offsetHeight
       }
       if(cth===0)return;
       this.tbMaxHeight = cth-oh;
      }
    }
  }
