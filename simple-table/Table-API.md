# Table 设计文档

Table

| 参数       | 说明                       | 类型                                                                                         | 默认值 |
| ---------- | -------------------------- | -------------------------------------------------------------------------------------------- | ------ |
| bordered   | 是否展示外边框和列边框     | boolean                                                                                      | false  |
| columns    | 表格列的配置描述           | ColumnsType[]                                                                                | -      |
| data       | 数据数组                   | Object[]                                                                                     |
| loading    | 页面是否加载               | boolean/Spin props                                                                           | false  |
| pagination | 分页器                     | object                                                                                       |
| rowkey     | 表格行 key 值              | string/function(record):string                                                               | key    |
| showHeader | 是否显示表头               | boolean                                                                                      | true   |
| onChange   | 分页、排序、筛选变化时触发 | function(pagination,filters,sorter,extra:{currentDataSource:[],action:paginate/sort/filter}) | -      |

Column
| 参数 | 说明 | 类型 | 默认值 |
| ------ | ------ | ---- | ------ |
| align | 设置列的对齐方式 | left/right/center | left |
| className | 列样式类名 | string | - |
| dataIndex | 列数据在数据项中对应的路径 | string | - |
| key | vue for循环依赖的key值，如果dataIndex是唯一值，则可以忽略 | string | - |
| ellipsis | 超过宽度自动省略 | boolean | false |
| filtered | 是否开启过滤 | boolean | false |
| filterIcon | 自定义 filter 图标 | VueNode | false |
| filterSearch | 筛选菜单开启搜索 | boolean | false|
| render | 自定义渲染函数 | function(text,record,index){} | - |
| sortDirections | 支持的排序方式 | [ascend descend] | - |
| sorter | 排序函数 本地使用 Array.sort | function/boolean | - |
| sortOrder | 排序状态 可设置为 ascend descend false | string/boolean/undefined | - |
| width | 列宽度 | string ｜ number | - |

Pagination（单独另一个组件）
| 参数 | 说明 | 类型 | 默认值 |
| ------ | ------ | ---- | ------ |
| current | 当前页数 | number | - |
| pageSize | 每页数量的大小 | number | 10 |
| total | 总数量 | number | - |

事件
| 参数 | 说明 | 类型 | 默认值 |
| ------ | ------ | ---- | ------ |
| onChange | 分页、排序、筛选变化时触发 | function(pagination,filters,sorter,extra:{currentDataSource:[],action:paginate/sort/filter}) | - |
| onBeforeClick | 点击表格前触发 | function(row,col,value,index) | - |
| onClick | 点击表格后触发 | function(row,col,value,index) | - |
| onSelectAll | 全选后触发 | function(values[]) | - |
| onBeforeLoad | 数据加载前触发 | function() | - |
| onLoad | 数据加载后触发 | function() | - |

# demo

```TypeScript
// 渲染函数 对齐方式 className...
const columns:ColumnProp[] = [
    {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    align:'center',
    className："testName",
    ellipsis:true,
    render: text => <a>{text}</a>,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
  },
  {
    title: 'Action',
    key: 'action',
  }]

const data=[{
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  }]

<SimpleTable columns={columns},data={data}></SimpleTable>
```

```TypeScript
// 排序 筛选 宽度...
const columns:ColumnProp[] = [
    {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width:200,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
    filtered:true,
    filterSearch:true,
    width:200,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
    sorterDirections:["ascend","descend"],
    sorderOrder:undefined,
    width:200,
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    sorter:function(a,b){return a-b;},
    sorderOrder:undefined,
    width:200,
  },
  {
    title: 'Action',
    key: 'action',
    width:200,
  }]

const data=[{
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  }]

<SimpleTable columns={columns},data={data}></SimpleTable>
```

```TypeScript
// 分页...
const columns:ColumnProp[] = [
    {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width:200,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
    filtered:true,
    filterSearch:true,
    width:200,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
    sorterDirections:["ascend","descend"],
    sorderOrder:undefined,
    width:200,
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    sorter:function(a,b){return a-b;},
    sorderOrder:undefined,
    width:200,
  },
  {
    title: 'Action',
    key: 'action',
    width:200,
  }]

const data=[{
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  }]
  const pagination = {
      current:1,
      pageSize:10,
      total:4,
  }

<SimpleTable columns={columns},data={data} pagination={pagination}></SimpleTable>
```

```TypeScript
// 本地过滤...
const columns:ColumnProp[] = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width:200,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
    filtered:true,
    filterSearch:true,
    width:200,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
    sorterDirections:["ascend","descend"],
    sorderOrder:undefined,
    width:200,
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    sorter:function(a,b){return a-b;},
    sorderOrder:undefined,
    width:200,
  },
  {
    title: 'Action',
    key: 'action',
    width:200,
  }]

const data=[{
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  }]

<SimpleTable columns={columns},data={data}></SimpleTable>
```

```TypeScript
// onchange监听 过滤 排序 分页
const columns:ColumnProp[] = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width:200,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
    filtered:true,
    filterSearch:true,
    width:200,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
    sorterDirections:["ascend","descend"],
    sorderOrder:undefined,
    width:200,
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    sorter:function(a,b){return a-b;},
    sorderOrder:undefined,
    width:200,
  },
  {
    title: 'Action',
    key: 'action',
    width:200,
  }]

const data=[{
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  }]

const changeTest = ()=>const changeTest = (
  type: string,
  index?: number,
  state?: string,
  key?: string
) => {
  console.log("模拟change事件");
  loading.value = true;
  switch(type){
    case 'pageChange':
      console.log("模拟翻页事件");
      // do sth...
      break;
    case 'sort':
      console.log("模拟排序事件");
      // do sth...
      break;
    case 'filter':
      console.log("模拟过滤事件");
      // do sth...
      break;
  }
};

<SimpleTable columns={columns},data={data} onChange={changeTest}></SimpleTable>
```

```TypeScript
// onBeforeClick onClick onSelectAll onBeforeLoad onLoad
const columns:ColumnProp[] = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width:200,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
    filtered:true,
    filterSearch:true,
    width:200,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
    sorterDirections:["ascend","descend"],
    sorderOrder:undefined,
    width:200,
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    sorter:function(a,b){return a-b;},
    sorderOrder:undefined,
    width:200,
  },
  {
    title: 'Action',
    key: 'action',
    width:200,
  }]

const data=[{
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  }]
const beforeClick = ()=>{ console.log("beforeClick") };
const clicked = ()=>{ console.log("clicked") };
const selectAll = ()=>{ console.log("selectAll") };
const beforeLoad = ()=>{ console.log("beforeLoad") };
const onLoad = ()=>{ console.log("onLoad") };

<SimpleTable columns={columns},data={data} onBeforeClick={beforeClick} onClick={clicked} onSelectAll={selectAll} onBeforeLoad={beforeLoad} onLoad={onLoad}></SimpleTable>
```