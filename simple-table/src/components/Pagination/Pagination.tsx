import { defineComponent, onMounted, PropType, reactive, Ref, ref, watch } from "vue";
import { PaginationProps } from "../types";
import { debounce } from "../../utils";
import "./Pagination.less";

type PagProps = {
  pagination: PaginationProps,
}

export default defineComponent({
  name: "Pagination",
  props: {
    pagination: {
      type: Object as PropType<PaginationProps>,
      // default: () => ({}),
    },
  },
  emits: ["change"],
  //@ts-ignore
  setup(props: PagProps, { attrs, emit, slots }) {
    const change = (index: number) => {
      emit("change", "pageChange", index);
    };
    const inputChange = debounce((v: HTMLInputElement | any, nums: number) => {
      let value = v?.target?.value;
      if(value ==''){
        return change(0);
      }      
      if (value <= nums && value > 0) {
        change(value - 1);
      }else{
        console.error('输入的页数有问题');
      }
    }, 800);
    const templ = () => {
      let current = props.pagination.current || 0;
      let total = props.pagination.total;
      let pageSize = props.pagination.pageSize;
      let nums = Math.ceil(total / pageSize);
      let tpl = [];
      tpl.push(<div style={"margin-right:8px;"}>共：{total}条数据</div>);
      tpl.push(
        <div
          class={current <= 0 ? "pagination-pre-disabled" : "pagination-pre"}
          onClick={() => {
            if (current > 0) change(current - 1);
          }}
          id='pre-btn'
        >
          后退
        </div>
      );
      for (let i = 1; i <= nums; i++) {
        tpl.push(
          <div
            class={
              current + 1 == i
                ? "pagination-number-active"
                : "pagination-number"
            }
            onClick={() => change(i - 1)}
          >
            {i}
          </div>
        );
      }
      tpl.push(
        <div
          class={
            current + 1 >= nums ? "pagination-aft-disabled" : "pagination-aft"
          }
          onClick={() => {
            if (current < nums - 1) change(current + 1);
          }}
          id='next-btn'
        >
          前进
        </div>
      );
      tpl.push(
        <div>
          跳至{" "}
          <input
            type="text"
            // @ts-ignore
            oninput={(v) => inputChange(v, nums)}
          />
          页
        </div>
      );
      return tpl;
    };
    return () => {
      return <div class="pagination-box">{templ()}</div>;
    };
  },
});
// export default defineComponent({
//     name: "Pagination",
//     props: {
//       pagination: {
//         type: [Object, Boolean],
//         default: () => ({}),
//       },
//     },
//     emits: ["change", "update:pagination"],
//     setup(props, { attrs, emit, slots }) {
//       const pagination = useVModel(props, "pagination", emit, {
//         passive: true,
//         deep: true,
//       });
//       const change = (index: number) => {
//         pagination.value.current = index;
//         emit("change", "pageChange", index);
//       };
//       const templ = () => {
//         let current = pagination.value.current || 0;
//         let total = pagination.value.total;
//         let pageSize = pagination.value.pageSize;
//         let nums = Math.ceil(total / pageSize);
//         let tpl = [];
//         tpl.push(<div style={"margin-right:8px;"}>共：{total}条数据</div>);
//         tpl.push(
//           <div
//             class={current <= 0 ? "pagination-pre-disabled" : "pagination-pre"}
//           >
//             后退
//           </div>
//         );
//         for (let i = 1; i <= nums; i++) {
//           tpl.push(
//             <div
//               class={
//                 current + 1 == i
//                   ? "pagination-number-active"
//                   : "pagination-number"
//               }
//               onClick={() => change(i - 1)}
//             >
//               {i}
//             </div>
//           );
//         }
//         tpl.push(
//           <div
//             class={
//               current + 1 >= nums ? "pagination-aft-disabled" : "pagination-aft"
//             }
//           >
//             前进
//           </div>
//         );
//         tpl.push(
//           <div>
//             跳至 <input type="text" />页
//           </div>
//         );
//         return tpl;
//       };
//       return () => {
//         return <div class="pagination-box">{templ()}</div>;
//       };
//     },
//   });
