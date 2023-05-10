import { ExtractPropTypes,PropType } from "vue";

//  定义 Props
export const tableProps = {
  // 列
  columns: {
    type: Array as PropType<ColumnsProps[]>,
    default: () => [],
  },
  // 数据源
  data: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  // 分页器 参考ant design分页器api https://ant.design/components/pagination-cn/#API
  pagination: {
    type: [Boolean, Object] as PropType<boolean | PaginationProps>,
    default: true,
  },
  onChange: {
    type: Function,
  },
  loading: {
    type: Boolean,
    default:false,
  },
};
export type TableProps = ExtractPropTypes<typeof tableProps>;

export const columnsProps = {
  // 排序的受控属性，外界可用此控制列的排序，可设置为 ascend descend false
  sortOrder: {
    type: [String, Boolean] as PropType<String | Boolean | undefined>,
    default: null,
  },
  // 排序函数，本地排序使用一个函数(参考 Array.sort 的 compareFunction)，需要服务端排序可设为 true
  sorter: {
    type: [Function, Boolean] as PropType<Function | Boolean>,
    default: null,
  },
  title: {
    type: String,
    default: "",
  },
  field: {
    type: String,
    default: null,
  },
  key: {
    type: String,
    default: null,
  },
  width: {
    type: [String, Number],
    default: null,
  },
  render: {
    type: Function as PropType<Function | null>,
    default: null,
  },
  formatter: {
    type: Function as PropType<Function | null>,
    default: null,
  },
};
export type ColumnsProps = ExtractPropTypes<typeof columnsProps>;

export const paginationProps = {
  pageSize: {
    type: Number,
    default: 10,
  },
  // pageSizeOptions:{
  //   type:Array as PropType<any[]>
  // }, 
  total: {
    type: Number,
    default: 0,
  },
  // onChange: Function,
  current:{
    type:Number,
    default:0,
  },
};
export type PaginationProps = ExtractPropTypes<typeof paginationProps>;
