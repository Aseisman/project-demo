import { defineComponent, onMounted, reactive, ref } from "vue";
import "./Loading.less";
type LoadProps = {
  loading: Boolean
}
export default defineComponent({
  name: "Loading",
  props: {
    loading: Boolean,
  },
  setup(props: LoadProps, { attrs, emit, slots }) {
    return () => {        
      return (
        <div style={"position:relative;min-height:300px;"}>
          {props.loading ? <div class="loading">加载中</div> : ""}
          <div>{slots.default ? slots.default() : ""}</div>
        </div>
      );
    };
  },
});
