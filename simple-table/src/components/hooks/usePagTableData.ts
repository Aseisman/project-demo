import { type Ref, ref, watchEffect, computed } from "vue";
import { PaginationProps } from "../types";
import {
  type TableProps,
  type ColumnsProps,
  tableProps,
  paginationProps,
} from "../types";

export default function useTableData(
  rawData: Ref<any[]>,
  updatedPagination: Ref<PaginationProps|boolean>
) {
  let res =rawData.value;
  if(typeof updatedPagination.value == 'object'){
    let current = updatedPagination.value.current||0;
    let pageSize = updatedPagination.value.pageSize;
    res=res.slice(current*pageSize,(current+1)*pageSize);
  }
  return res;
}
