// 处理分页数据
import { type Ref, ref, watchEffect, computed } from "vue";
import { PaginationProps } from "../types";

const defaultValue ={
  pageSize:10,
  current:0,
  total:0,
}

export default function usePagination(
  propPagination: Ref<PaginationProps | boolean>
): [Ref<PaginationProps> | Ref<boolean>, Function] {
  
  const updatePagination = ref<PaginationProps>({
    pageSize: 10,
    current: 0,
    total: 0,
  });
  watchEffect(() => {
    if (typeof propPagination.value == "object") {
      Object.keys(updatePagination.value).map(key=>{
        updatePagination.value[key]=propPagination.value[key]||defaultValue[key];
      })
    }
  });
  const updatePaginationFun = (props: PaginationProps) => {
    Object.keys(props).map((key) => {
      // 如果外部传入为空，那么内部自己维护一个pagination，外部有值，则以外部传值为准，做到受控组件；
      if(propPagination.value[key]===undefined){
        updatePagination.value[key] = props[key];
      }
    });
  };
  return propPagination.value
    ? [updatePagination, updatePaginationFun]
    : [ref(false), updatePaginationFun];
}
