import ElCheckbox from '@moa/element-ui/packages/checkbox';
export default {
  name: 'ElTableRow',
  props: [
    'columns',
    'row',
    'index',
    'isSelected',
    'isExpanded',
    'store',
    'context',
    'firstDefaultColumnIndex',
    'treeRowData',
    'treeIndent',
    'columnsHidden',
    'getSpan',
    'getColspanRealWidth',
    'getCellStyle',
    'getCellClass',
    'handleCellMouseLeave',
    'handleCellMouseEnter',
    'fixed'
  ],
  components: {
    ElCheckbox
  },
  render() {
    const {
      columns,
      row,
      index: $index,
      store,
      context,
      firstDefaultColumnIndex,
      treeRowData,
      treeIndent,
      columnsHidden = [],
      isSelected,
      isExpanded
    } = this;
    let originleft = 0;
    let originright = this.computedRealRightWidth(columns);
    return (
      <tr>
        {
          columns.map((column, cellIndex) => {
            const { rowspan, colspan } = this.getSpan(row, column, $index, cellIndex);
            if (!rowspan || !colspan) {
              return null;
            }
            const columnData = { ...column };
            columnData.realWidth = this.getColspanRealWidth(columns, colspan, cellIndex);
            const data = {
              store,
              isSelected,
              isExpanded,
              _self: context,
              column: columnData,
              row,
              $index
            };
            if (cellIndex === firstDefaultColumnIndex && treeRowData) {
              data.treeNode = {
                indent: treeRowData.level * treeIndent,
                level: treeRowData.level
              };
              if (typeof treeRowData.expanded === 'boolean') {
                data.treeNode.expanded = treeRowData.expanded;
                // 表明是懒加载
                if ('loading' in treeRowData) {
                  data.treeNode.loading = treeRowData.loading;
                }
                if ('noLazyChildren' in treeRowData) {
                  data.treeNode.noLazyChildren = treeRowData.noLazyChildren;
                }
              }
            }
            let style = this.getCellStyle($index, cellIndex, row, column);
            let cls = this.getCellClass($index, cellIndex, row, column);
            if (column.newFixed) {
              // format style  default value ('left' or true) to 'left'
              if (column.newFixed === 'right') {
                originright -= column.realWidth;
                style = this.getRightFixedStyle(style, originright);
                cls += ' kd-table-cell-fix-right';
                if (this.isTheFirstRightItem(cellIndex, columns)) {
                  cls += ' kd-table-cell-fix-right-first';
                }
              } else {
                style = this.getLeftFixedStyle(style, originleft);
                originleft += column.realWidth;
                cls += ' kd-table-cell-fix-left';
                if (this.isTheLastLeftItem(cellIndex, columns)) {
                  cls += ' kd-table-cell-fix-left-last';
                }
              }
            }
            return (
              <td
                style={style}
                class={cls}
                rowspan={rowspan}
                colspan={colspan}
                on-mouseenter={($event) => this.handleCellMouseEnter($event, row)}
                on-mouseleave={this.handleCellMouseLeave}
              >
                {
                  column.renderCell.call(
                    this._renderProxy,
                    this.$createElement,
                    data,
                    columnsHidden[cellIndex]
                  )
                }
              </td>
            );
          })
        }
      </tr>
    );
  },
  methods: {
    getLeftFixedStyle(style, originleft) {
      if (typeof style === 'string') {
        style += `position: sticky; left: ${originleft}px; background: white; z-index: 3;`;
      }
      if (typeof style === 'undefined') {
        style = `position: sticky; left: ${originleft}px; background: white; z-index: 3;`;
      }
      if (typeof style === 'object') {
        let res = {
          ...style,
          'position': 'sticky',
          'left': originleft + 'px',
          'zIndex': '3',
          'background': 'white'
        };
        return res;
      }
      return style;
    },
    getRightFixedStyle(style, originright) {
      switch (typeof style) {
        case 'string':
          style += `position: sticky; right: ${originright}px; background: white; z-index: 2;`;
          break;
        case 'undefined':
          style = `position: sticky; right: ${originright}px; background: white; z-index: 2;`;
          break;
        case 'object':
          let res = {
            ...style,
            'position': 'sticky',
            'right': originright + 'px',
            'zIndex': '2'
          };
          return res;
      }
      return style;
    },
    isTheFirstRightItem(index, columns) {
      for (let i = 0; i < index; i++) {
        if (columns[i].newFixed === 'right') {
          return false;
        };
      }
      return true;
    },
    isTheLastLeftItem(index, columns) {
      for (let i = index + 1; i < columns.length; i++) {
        if (columns[i].newFixed === 'left' || columns[i].newFixed === true) {
          return false;
        };
      }
      return true;
    },
    computedRealRightWidth(columns) {
      let width = 0;
      for (let i = 0; i < columns.length; i++) {
        if (columns[i].newFixed === 'right') {
          width += columns[i].realWidth;
        };
      }
      return width;
    }
  }
};
