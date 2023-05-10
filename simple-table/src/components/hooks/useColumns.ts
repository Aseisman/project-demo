import { type Ref, ref, watchEffect, computed, ComputedRef } from "vue";
import { PaginationProps } from "../types";
import { type ColumnsProps } from "../types";

export default function useColumns(rawColumns: Ref<ColumnsProps[]>):[Ref<ColumnsProps[]>,Function] {
  const updatedColumns= ref<ColumnsProps[]>([]);

  rawColumns.value.map((columns) => {
      updatedColumns.value.push({ ...columns });
  });
  const clearOtherSortOrder = (key:string) => {
    let flag = false;
    rawColumns.value.map((column) => {
      if (column.sortOrder) {
        flag = true;
      }
    });
    if (flag) return false;
    updatedColumns.value.map((v) => {
        if(v.sortOrder){
            v.sortOrder=undefined;
        }
    });
    return true;
  };
  const updateColumnsFun = (props: ColumnsProps, index: number) => {
    let column = rawColumns.value[index];
    let updatedColumn = updatedColumns.value[index];
    
    Object.keys(props).map((key) => {
      if (key == "sortOrder"&&clearOtherSortOrder(key)) {
        if (updatedColumn[key] === undefined) {
            updatedColumn[key] = props[key];
          }
      }
    });
  };
  return [updatedColumns, updateColumnsFun];
}

  // const column:ColumnsProps ={
  //     sortOrder:undefined,
  //     sorter:false,
  //     title:"",
  //     field:"",
  //     key:'',
  //     width:'auto',
  //     render:null,
  //     formatter:null,
  // }