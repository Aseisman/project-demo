import {
  defineComponent,
  onMounted,
  reactive,
  ref,
  watch,
  computed,
  toRef,
  ComputedRef,
} from "vue";
import {
  type TableProps,
  type ColumnsProps,
  tableProps,
  paginationProps,
} from "./types";
import THeaders from "./Headers";
import TBody from "./Body";
import TPagination from "./Pagination/Pagination";
import Loading from "./Loading/Loading";
import "./SimpleTable.less";

import usePagination from "./hooks/usePaginations";
import useColumns from "./hooks/useColumns";
import getPagTableData from "./hooks/usePagTableData";
import getSortTableData from "./hooks/useSortTableData";
import { useVModel } from "@vueuse/core";

export default defineComponent({
  name: "SimpleTable",
  props: tableProps,
  emits: ["change"],
  setup(props: TableProps, { attrs, emit, slots }) {
    // ==============loading=============
    const loading = ref(false);
    watch(
      () => props.loading,
      (val) => {
        loading.value = props.loading;
      },
      {
        immediate: true,
      }
    );

    // ==============pagination=============
    const rawPagination = computed(() => {
      return props.pagination;
    });
    const [updatedPagination, updatePaginationFun] = usePagination(rawPagination);

    // ==============columns=============
    const rawColumns = computed(() => {
      return props.columns;
    });
    const [updatedColumns, updateColumnsFun] = useColumns(rawColumns);
    const mergedColumns = computed(()=>updatedColumns.value);

    // ==============data=============
    
    const rawData = computed(() => props.data);
    const sortedData = computed(() => {
      return getSortTableData(
        rawData,
        mergedColumns
      ).value;
    });
    const updatedData = computed(()=>{
      return getPagTableData(sortedData,updatedPagination);
    }) 

    // ==============triggerChange=============
    const triggerChange = (
      type: string,
      index?: number,
      state?: string,
      key?: string
    ) => {
      switch (type) {
        case "pageChange":
          pageChangeFun(type, index);
          break;
        case "sort":
          //@ts-ignore
          sortFun(type,index, state, key);
          break;
      }
    };
    const pageChangeFun = (type: string, index: number | undefined) => {
      if (props.onChange) {
        props.onChange(type, index);
      } else {
        updatePaginationFun({
          current: index,
        });
      }
    };
    const sortFun = (
      type: string,
      index:number,
      state: string | undefined,
      key: string | undefined
    ) => {
      if(props.onChange){
        props.onChange(type,index,state,key)
      }else{
        updateColumnsFun({
          sortOrder:state,
        },index);
      }
    };
    
    return () => {
      return (
        <>
          <table style="100%">
            <Loading loading={loading.value}>
              <thead>
                <THeaders
                  columns={mergedColumns.value}
                  onChange={triggerChange}
                ></THeaders>
              </thead>
              <tbody class='tbody-test'>
                <TBody
                  columns={mergedColumns.value}
                  data={updatedData.value}
                ></TBody>
              </tbody>
              <td colspan={mergedColumns.value.length} style="border: none;">
                {typeof updatedPagination.value == "object" ? (
                  <TPagination
                    pagination={updatedPagination.value}
                    onChange={triggerChange}
                  />
                ) : (
                  ""
                )}
              </td>
            </Loading>
          </table>
        </>
      );
    };
  },
});



// export default defineComponent({
//   name: "SimpleTable",
//   props: tableProps,
//   emits: ["change", "update:pagination", "update:columns"],
//   setup(props: TableProps, { attrs, emit, slots }) {
//     const pagination = useVModel(props, "pagination", emit, {
//       deep: true,
//       passive: true,
//     });
//     const columns = useVModel(props, "columns", emit, {
//       passive: true,
//       deep: true,
//     });
//     const loading = ref(false);
//     watch(
//       () => props.loading,
//       (val) => {
//         loading.value = props.loading;
//       },
//       {
//         immediate: true,
//       }
//     );
//     const multipleSort = computed(() => {
//       let flag = false;
//       columns.value.forEach((column: ColumnsProps | any) => {
//         let sorter: object | Function = column.sorter;
//         //@ts-ignore
//         if (typeof sorter == "object" && sorter.multiple) {
//           flag = true;
//         }
//       });
//       return flag;
//     });
//     const rawData = computed(() => props.data || []);
//     const updatedData = computed(() => getUpdateData());
//     const getUpdateData = () => {
//       let pageSize = 10;
//       let currentData;
//       // 分为请求数据 and 本地的

//       if (props.onChange) {
//         // 分页
//         if (typeof pagination.value == "object") {
//           pageSize = pagination.value.pageSize || 10;
//           currentData = rawData.value.slice(0, pageSize);
//         } else {
//           currentData = props.data;
//         }
//       } else {
//         // 分页
//         if (typeof pagination.value == "object") {
//           pageSize = pagination.value.pageSize || 10;
//           currentData = rawData.value.slice(
//             pagination.value.current * pageSize,
//             (pagination.value.current + 1) * pageSize
//           );
//         } else {
//           currentData = props.data;
//         }
//         // 排序
//         getSortData(currentData);
//       }
//       return currentData;
//     };
//     const multipleSortData = (arr: Array<ColumnsProps>, orderMap: any) => {
//       //@ts-ignore
//       arr.sort((a, b) => {
//         let index = 0;
//         for (let i = 0; i < orderMap.length; i++) {
//           let key = orderMap[i].key;
//           if (a[key] !== b[key]) {
//             index = i;
//             break;
//           } else if (a[key] == b[key] && i == orderMap.length - 1) {
//             index = -1;
//           }
//         }
//         if (~index) {
//           let item = orderMap[index];
//           let key = item.key;
//           switch (item.sortOrder) {
//             case "ascend":
//               return a[key] - b[key];
//             case "descend":
//               return b[key] - a[key];
//             default:
//               break;
//           }
//         }
//         return 0;
//       });
//     };
//     const getSortData = (arr: Array<any>) => {
//       // 排序
//       if (multipleSort.value) {
//         let orderMap = columns.value
//           .map((column: ColumnsProps | any) => {
//             if (column.sorter?.multiple) {
//               return column;
//             }
//             return undefined;
//           })
//           .filter((v) => v !== undefined && v.sortOrder !== undefined)
//           .sort((a, b) => a.sorter.multiple - b.sorter.multiple);
//         if (!orderMap.length) return;
//         return multipleSortData(arr, orderMap);
//       }
//       let item: ColumnsProps | undefined | any = columns.value.find(
//         (column: ColumnsProps | any) => {
//           return column.sortOrder && column.sortOrder !== false;
//         }
//       );
//       if (item) {
//         let key = item.key;
//         switch (item.sortOrder) {
//           case "ascend":
//             arr.sort((a: ColumnsProps, b: ColumnsProps) => a[key] - b[key]);
//             break;
//           case "descend":
//             arr.sort((a: ColumnsProps, b: ColumnsProps) => b[key] - a[key]);
//             break;
//           default:
//             break;
//         }
//       }
//     };
//     const triggerChange = (
//       type: string,
//       index?: number,
//       state?: string,
//       key?: string
//     ) => {
//       switch (type) {
//         case "pageChange":
//           if (props.onChange) {
//             props.onChange(type, index);
//           } else {
//             if (typeof pagination.value == "object") {
//               pagination.value.current = index;
//             }
//           }
//           // emit("change", type, index);
//           break;
//         case "sort":
//           debugger;
//           if (props.onChange) {
//             props.onChange(type, null, state, key);
//           } else {
//             let i = columns.value.findIndex((column: ColumnsProps | any) => {
//               return column.key == key;
//             });
//             if (~i) {
//               // 分可以多排 or 单排
//               if (!multipleSort.value) {
//                 columns.value.forEach((column: ColumnsProps | any) => {
//                   column.sortOrder = undefined;
//                 });
//               }
//               let column: ColumnsProps | any = columns.value[i];
//               column.sortOrder = state;
//             }
//           }
//           break;
//         default:
//           break;
//       }
//     };
//     return () => {
//       return (
//         <>
//           <table style="100%">
//             <Loading loading={loading.value}>
//               <thead>
//                 <THeaders
//                   columns={columns.value}
//                   onChange={triggerChange}
//                 ></THeaders>
//               </thead>
//               <tbody>
//                 <TBody columns={props.columns} data={updatedData.value}></TBody>
//               </tbody>
//               <td colspan={columns.value.length} style="border: none;">
//                 {typeof pagination.value == "object" ? (
//                   <TPagination
//                     pagination={pagination.value}
//                     onChange={triggerChange}
//                   />
//                 ) : (
//                   ""
//                 )}
//               </td>
//             </Loading>
//             {/* <tbody>{lines()}</tbody> */}
//           </table>
//         </>
//       );
//     };
//   },
// });