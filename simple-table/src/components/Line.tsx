import { defineComponent, onMounted, reactive, ref ,PropType} from "vue";
import { type TableProps, tableProps } from "./types";
import { type ColumnsProps } from "./types";

type lineProps = {
  line: any;
  columns: ColumnsProps[];
  index?: number|string;
};

export default defineComponent({
  name: "Line",
  props: {
    line: {
      type: Object as PropType<any>,
      // default: () => ({}),
    },
    columns: {
      type: Array as PropType<ColumnsProps[]>,
      // default: () => [],
    },
    index: {
      type: [Number, String],
    },
  },
  //@ts-ignore
  setup(props: lineProps) {
    const columns = () => {
      let tds = props.columns.map((column: ColumnsProps) => {
        let field: string = column.field;
        let formatter: Function| null = column.formatter;
        let render: Function | null = column.render;
        if (render) {
          return <td>{render(props.line[field], props.line, props.index)}</td>;
        }
        return (
          <td>
            <div>
              <div>
                {formatter ? formatter(props.line[field]) : props.line[field]||''}
              </div>
            </div>
          </td>
        );
      });
      return <tr>{tds}</tr>;
      // return <tr>{
      //   [1,2,3,4].map(item=><td>{item}</td>)
      //   }</tr>
    };
    return () => columns();
  },
});
