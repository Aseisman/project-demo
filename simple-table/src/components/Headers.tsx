import { defineComponent, onMounted, reactive, ref, watch,PropType } from "vue";
import { type ColumnsProps } from "./types";

type HeaderProps = {
  columns: ColumnsProps[];
};

export default defineComponent({
  name: "Header",
  props: {
    columns: {
      type: Array as PropType<ColumnsProps[]>,
      default: () => [],
    },
  },
  emits: ["change"],
  setup(props: HeaderProps, { attrs, emit }) {
    //   保存每一行的排序状态
    const sortStates = ref({});
    const triggerOnChange = (
      type: string,
      index:number,
      state: string | undefined,
      key: string
    ) => {
      if (type === "sort") {
        emit("change", "sort", index, state, key);
      }
    };
    const getNextState = (state: string) => {
      let res = undefined;
      switch (state) {
        case "ascend":
          res = "descend";
          break;
        case "descend":
          res = undefined;
          break;
        default:
          res = "ascend";
          break;
      }
      return res;
    };
    const sortIcon = (state: string, index:number, key: string) => (
      <div
      class='sort-icon'
        onClick={() => {
          triggerOnChange("sort", index, getNextState(state), key);
        }}
      >
        <div
          class={state === "ascend" ? "triangle-up-blue" : "triangle-up"}
        ></div>
        <div style="height:2px;width:2px;"></div>
        <div
          class={state === "descend" ? "triangle-down-blue" : "triangle-down"}
        ></div>
      </div>
    );
    const columns = () =>
      props.columns.map((column: ColumnsProps, index: number) => {
        let sortOrder = column.sortOrder;
        let sorter = column.sorter;
        let key = column.key;

        // 保存每行的排序状态
        sortStates.value[key] = sortOrder;

        return (
          <td>
            <div
            class = "header-item"
              style={
                "display:flex;align-items: center;position: relative;padding:0 8px;" +
                (column.width ? "width:" + column.width + "px;" : "")
              }
            >
              {/* 标题 */}
              <div>{column.title}</div>
              {/* 扩展功能按钮 排序等 */}
              <div style={"position:absolute;right:8px;"}>
                {sortOrder!==false && sorter
                  ? sortIcon(sortStates.value[key],index, key)
                  : ""}
              </div>
            </div>
          </td>
        );
      });
    return () => {
      return columns();
    };
  },
});
