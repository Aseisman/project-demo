import { defineComponent, onMounted, reactive, ref,PropType} from "vue";
import { type TableProps, type ColumnsProps, tableProps } from "./types";
import TLine from "./Line";

type BodyProps = {
  columns: ColumnsProps[];
  data: any[];
};

export default defineComponent({
  name: "Body",
  props: {
    columns: {
      type: Array as PropType<ColumnsProps[]>,
    },
    data: {
      type: Array as PropType<any[]>,
    },
  },
  //@ts-ignore
  setup(props: BodyProps) {
    const columns = () => {
      if (props.data?.length > 0) {
        return props.data.map((line: any, index: string | number) => {
          return <TLine line={line} columns={props.columns}></TLine>;
        });
      } else {
        return (
          <td style="min-height:300px" colspan={props.columns.length}>
            {"没有数据哦"}
          </td>
        );
      }
    };
    return () => columns();
  },
});