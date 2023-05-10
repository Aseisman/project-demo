import { type Ref, ref, watchEffect, computed } from "vue";
import { PaginationProps } from "../types";
import {
  type TableProps,
  type ColumnsProps,
  tableProps,
  paginationProps,
} from "../types";

const defalutSorter = (a: any, b: any) => {
  return a - b;
};

export default function useSortTableData(
  rawData: Ref<any[]>,
  updatedColumns: Ref<ColumnsProps[]>
): Ref<any[]>{
  let sortedData = computed(()=>{
      return rawData.value.map(v=>{
          return {...v}
      })
  })
  let column = updatedColumns.value.find((column: ColumnsProps) => column.sortOrder);
  if (column) {
    let sorter = column.sorter||defalutSorter;
    if(sorter === true) sorter=defalutSorter;
    if(sorter === false )return sortedData;
    const key = column.key;
    const sortOrder = column.sortOrder;
    switch (sortOrder) {
      case "ascend":
          sortedData.value.sort((a,b)=>{
              return (sorter as Function)(a[key],b[key]);
          })
        break;
      case "descend":
        sortedData.value.sort((a,b)=>{
            return  (sorter as Function)(b[key],a[key]);
        })
        break;
    }
  }
  
  return sortedData;
}
