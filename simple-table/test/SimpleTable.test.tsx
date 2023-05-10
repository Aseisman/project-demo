import { mount, shallowMount } from "@vue/test-utils";
import { describe, expect, test } from "vitest";
import { type ColumnsProps } from "../src/components/types";
import SimpleTable from "../src/components/SimpleTable";
import { timeFormat } from "../src/utils";
import Header from "../src/components/Headers";
import Body from "../src/components/Body";
import Line from "../src/components/Line";
import Pagination from "../src/components/Pagination/Pagination";
import Loading from "../src/components/Loading/Loading";

// 列表数据
const res = {
  data: [
    {
      name: "测试1",
      year: new Date().toString(),
      price: 567,
      nums: 32,
    },
    {
      name: "测试2",
      year: new Date().toString(),
      price: 334,
      nums: 12,
    },
    {
      name: "测试3",
      year: new Date().toString(),
      price: 755,
      nums: 34,
    },
    {
      name: "测试4",
      year: new Date().toString(),
      price: 234,
      nums: 77,
    },
    {
      name: "测试5",
      year: new Date().toString(),
      price: 123,
      nums: 1,
    },
    {
      name: "测试6",
      year: new Date().toString(),
      price: 200,
      nums: 21,
    },
    {
      name: "测试7",
      year: new Date().toString(),
      price: 200,
      nums: 11,
    },
    {
      name: "测试8",
      year: new Date().toString(),
      price: 200,
      nums: 20,
    },
    {
      name: "测试9",
      year: new Date().toString(),
      price: 198,
      nums: 20,
    },
    {
      name: "测试10",
      year: new Date().toString(),
      price: 197,
      nums: 20,
    },
    {
      name: "测试11",
      year: new Date().toString(),
      price: 134,
      nums: 20,
    },
    {
      name: "测试12",
      year: new Date().toString(),
      price: 144,
      nums: 20,
    },
    {
      name: "测试13",
      year: new Date().toString(),
      price: 155,
      nums: 20,
    },
    {
      name: "测试14",
      year: new Date().toString(),
      price: 166,
      nums: 20,
    },
    {
      name: "测试15",
      year: new Date().toString(),
      price: 177,
      nums: 20,
    },
    {
      name: "测试16",
      year: new Date().toString(),
      price: 188,
      nums: 20,
    },
    {
      name: "测试17",
      year: new Date().toString(),
      price: 199,
      nums: 20,
    },
    {
      name: "测试18",
      year: new Date().toString(),
      price: 211,
      nums: 20,
    },
    {
      name: "测试19",
      year: new Date().toString(),
      price: 200,
      nums: 20,
    },
    {
      name: "测试20",
      year: new Date().toString(),
      price: 200,
      nums: 20,
    },
    {
      name: "测试21",
      year: new Date().toString(),
      price: 200,
      nums: 20,
    },
    {
      name: "测试12",
      year: new Date().toString(),
      price: 144,
      nums: 20,
    },
    {
      name: "测试13",
      year: new Date().toString(),
      price: 155,
      nums: 20,
    },
    {
      name: "测试14",
      year: new Date().toString(),
      price: 166,
      nums: 20,
    },
    {
      name: "测试15",
      year: new Date().toString(),
      price: 177,
      nums: 20,
    },
    {
      name: "测试16",
      year: new Date().toString(),
      price: 188,
      nums: 20,
    },
    {
      name: "测试17",
      year: new Date().toString(),
      price: 199,
      nums: 20,
    },
    {
      name: "测试18",
      year: new Date().toString(),
      price: 211,
      nums: 20,
    },
    {
      name: "测试19",
      year: new Date().toString(),
      price: 200,
      nums: 20,
    },
    {
      name: "测试20",
      year: new Date().toString(),
      price: 200,
      nums: 20,
    },
    {
      name: "测试21",
      year: new Date().toString(),
      price: 200,
      nums: 20,
    },
  ],
  total: 21,
};

const getColumns=(type=1)=>{
  switch (type) {
    case 1:
      return  [
        {
          title: "名字",
          field: "name",
          key: "name",
          width: 100,
        },
        {
          title: "价格",
          field: "price",
          key: "price",
          width: 200,
        },
        {
          title: "数量",
          field: "nums",
          key: "nums",
          width: 300,
        },
        {
          title: "年份",
          field: "year",
          key: "year",
        },
      ];

    case 2:
      return [
        {
          title: "名字",
          field: "name",
          key: "name",
          width: 100,
        },
        {
          title: "价格",
          field: "price",
          key: "price",
          width: 200,
          sortOrder: "ascend",
        },
        {
          title: "数量",
          field: "nums",
          key: "nums",
          width: 300,
          render: (text: any, record: any, index: number) => {
            return <div style="background:grey;color:white;">{text}</div>;
          },
        },
        {
          title: "年份",
          field: "year",
          key: "year",
          formatter: (value: Date) => {
            let time = new Date(value).getDate();
            return timeFormat("YYYY-mm-dd HH:MM", time);
          },
        },
      ];

    default:
      return []
  }
  
}

const wait = (time) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

describe("SimpleTable", () => {
  // columns
  test("check orderSort as 'ascend' in some item", async () => {
    const columns: ColumnsProps[] = getColumns();
    columns[1].sortOrder='ascend';

    const wrapper = mount(SimpleTable, {
      props: {
        columns,
        data: res.data,
      },
    });
    const items = wrapper.findComponent({ name: "Body" });
    const data = items.props().data;
    let flag = true;
    data.reduce((a, c) => {
      if (a.price > c.price) {
        flag = false;
      }
      return c;
    }, 0);
    expect(flag).toBe(true);
  });
  test("check orderSort as 'descend' in some item", async () => {
    const columns: ColumnsProps[] = getColumns();
    columns[1].sortOrder='descend';

    const wrapper = mount(SimpleTable, {
      props: {
        columns,
        data: res.data,
      },
    });
    const items = wrapper.findComponent({ name: "Body" });
    const data = items.props().data;
    let flag = true;
    data.reduce((a, c) => {
      if (a.price < c.price) {
        flag = false;
      }
      return c;
    }, 0);
    expect(flag).toBe(true);
  });
  test("check orderSort as undefined in some item", async () => {
    const columns: ColumnsProps[] = getColumns();
    columns[1].sortOrder=undefined;
    const wrapper = mount(SimpleTable, {
      props: {
        columns,
        data: res.data,
      },
    });
    const items = wrapper.findComponent({ name: "Body" });
    const data = items.props().data;
    let flag = true;
    data.map((item,index)=>{
      if(item.price!=res.data[index].price){
        flag = false;
      }
    })
    expect(flag).toBe(true);
  });
  test("sort by sb", async () => {
    const columns: ColumnsProps[] = getColumns();
    columns[1].sorter=(a, b) => a - b;
    const wrapper = mount(SimpleTable, {
      props: {
        columns,
        data: res.data,
      },
    });
    const priceIcon = wrapper.find(".sort-icon");

    priceIcon.trigger("click");

    await wait(500);

    let items = wrapper.findComponent({ name: "Body" });
    let data = items.props().data;
    let flag = true;
    data.reduce((a, c) => {
      if (a.price > c.price) {
        flag = false;
      }
      return c;
    }, 0);
    expect(flag).toBe(true);

    priceIcon.trigger("click");

    await wait(500);
    items = wrapper.findComponent({ name: "Body" });
    data = items.props().data;
    flag = true;
    data.reduce((a, c) => {
      if (a.price < c.price) {
        flag = false;
      }
      return c;
    }, 0);
    expect(flag).toBe(true);

    priceIcon.trigger("click");
    await wait(500);
    items = wrapper.findComponent({ name: "Body" });
    data = items.props().data;
    flag = true;
    data.map((item,index)=>{
      if(item.price!=res.data[index].price){
        flag = false;
      }
    })
    expect(flag).toBe(true);

  });
  test("multiSort and sort by sb", async () => {
    const columns: ColumnsProps[] = getColumns();
    columns[1].sorter=(a, b) => a - b;
    columns[2].sorter=(a, b) => a - b;
    
    const wrapper = mount(SimpleTable, {
      props: {
        columns,
        data: res.data,
      },
    });
    const HeaderWrapper = wrapper.findComponent(Header).findAll(".sort-icon");

    HeaderWrapper[0].trigger("click");
    await wait(500);
    let items = wrapper.findComponent({ name: "Body" });
    let data = items.props().data;
    let flag = true;
    data.reduce((a, c) => {
      if (a.price > c.price) {
        flag = false;
      }
      return c;
    }, 0);
    expect(flag).toBe(true);

    HeaderWrapper[1].trigger("click");
    await wait(500);
    items = wrapper.findComponent({ name: "Body" });
    data = items.props().data;
    flag = true;
    data.reduce((a, c) => {
      if (a.nums > c.nums) {
        flag = false;
      }
      return c;
    }, 0);
    expect(flag).toBe(true);
  });
  test("check render, formatter and width in some item", () => {
    const columns: ColumnsProps[] = getColumns();
    columns[1].sortOrder='ascend';
    columns[2].render=(text: any, record: any, index: number) => {
      return <div class='test-cls' style="background:grey;color:white;">{text}</div>;
    };
    columns[3].formatter=(value: Date) => {
      let time = new Date(value).getDate();
      return timeFormat("YYYY-mm-dd HH:MM", time);
    };
    const wrapper = mount(SimpleTable, {
      props: {
        columns,
        data: res.data,
      },
    });
    expect(wrapper.findAll('.test-cls').length!==0).toBe(true);

    const items = wrapper.findComponent({ name: "Header" });
    let flag = true;
    items.props().columns.forEach((column, index) => {
      if (column.width != columns[index].width) {
        flag = false;
      }
    });
    expect(flag).toBe(true);
  });
  // pagination
  test("check pagination in table", async () => {
    const columns: ColumnsProps[] = getColumns(2);
    const wrapper = mount(SimpleTable, {
      props: {
        columns,
        data: res.data,
        pagination: {
          total: 10,
          pageSize: 4,
        },
      },
    });
    let items = wrapper.findComponent({ name: "Body" });
    let data = items.props().data;
    expect(data.length==4).toBe(true);
    await wrapper.setProps({
      pagination: {
        total: 10,
        pageSize: 5,
      },
    });

    items = wrapper.findComponent({ name: "Body" });
    data = items.props().data;
    expect(data.length==5).toBe(true);

    
    await wrapper.setProps({
      pagination: {
        total: 10,
        current: 1,
        pageSize: 5,
      },
    });

    items = wrapper.findComponent({ name: "Pagination" });
    data = items.props().pagination.current;
    expect(data==1).toBe(true);

    await wrapper.setProps({
      pagination: {
        total: 10,
        current: 2,
        pageSize: 5,
      },
    });

    items = wrapper.findComponent({ name: "Pagination" });
    data = items.props().pagination.current;
    expect(data==2).toBe(true);


    const preButton = wrapper.find("#pre-btn");
    preButton.trigger("click");

    items = wrapper.findComponent({ name: "Pagination" });
    data = items.props().pagination.current;
    expect(data==2).toBe(true);


    const nextButton = wrapper.find("#next-btn");
    nextButton.trigger("click");

    items = wrapper.findComponent({ name: "Pagination" });
    data = items.props().pagination.current;
    expect(data==2).toBe(true);

  });
  test("check pagination as false in table", async () => {
    const columns: ColumnsProps[] = getColumns(2);
    const wrapper = mount(SimpleTable, {
      props: {
        columns,
        data: res.data,
        pagination: false,
      },
    });
    let items = wrapper.findComponent({ name: "Body" });
    let data = items.props().data;
    expect(data.length==res.data.length).toBe(true);
  });
  test("set num in paginations' input", async () => {
    const columns: ColumnsProps[] = getColumns(2);
    const wrapper = mount(SimpleTable, {
      props: {
        columns,
        data: res.data,
        pagination: {
          total: 10,
          pageSize: 4,
        },
      },
    });
    const inputDom = wrapper.find("input");

    await inputDom.setValue(2);
    await inputDom.setValue(1);
    await wait(1000);

    expect(inputDom.element.value).toBe("1");

    await inputDom.setValue("");
    await wait(1000);

    expect(wrapper.findComponent(Pagination).vm.pagination.current).toBe(0);

    await inputDom.setValue("-1");
    await wait(1000);

    expect(wrapper).toThrowErrorMatchingSnapshot();
  });

  // body
  test("nodata in body", () => {
    const columns: ColumnsProps[] = getColumns();
    const wrapper = mount(SimpleTable, {
      props: {
        columns,
      },
    });
    let items = wrapper.findComponent({ name: "Body" });
    let data = items.props().data;
    expect(data.length==0).toBe(true);
  });
  // onchange
  test("emit onchange for simpleTable", () => {
    const columns: ColumnsProps[] = getColumns();
    const onChange = vi.fn();
    const wrapper = mount(SimpleTable, {
      props: {
        columns,
        data: res.data,
        pagination: {
          total: 10,
          pageSize: 4,
        },
        onChange: (...arg) => {
          console.log(arg);
          console.log("onchange");
          onChange();
        },
      },
    });
    const preButton = wrapper.find("#next-btn");
    preButton.trigger("click");
    expect(onChange).toHaveBeenCalled();
  });
  // mount
  test("mount component", () => {
    const wrapper = shallowMount(SimpleTable, {
      props: {},
    });

    expect(wrapper.html()).toMatchSnapshot();
  });
  test("mount component with columns", () => {
    const columns: ColumnsProps[] = getColumns();
    const wrapper = shallowMount(SimpleTable, {
      props: {
        columns,
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
  test("mount component with data", () => {
    const columns: ColumnsProps[] = getColumns();
    const wrapper = shallowMount(SimpleTable, {
      props: {
        columns,
        data: res.data,
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
  test("mount Loading", async () => {
    const columns: ColumnsProps[] = getColumns();
    const wrapper = shallowMount(SimpleTable, {
      props: {
        columns,
        data: res.data,
        loading: true,
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
    const LoadingWrapper = shallowMount(Loading, {
      props: {
        loading: true,
      },
    });
    expect(LoadingWrapper.html()).toMatchSnapshot();
  });
});
