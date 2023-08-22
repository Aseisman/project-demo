<template>
  <main-panel
    :title="title"
    class="sale-panel"
    flexType="column"
    v-loading="loading"
  >
    <template #headerRight>
      <el-button
        v-if="type == 1"
        type="primary"
        size="small"
        icon="el-icon-plus"
        @click="addSales"
        >新建商机</el-button
      >
      <el-button
        v-if="exportPermit"
        :type="exportPermit == 2 ? 'info' : 'primary'"
        size="small"
        @click="exportSales"
        >导出商机</el-button
      >
    </template>
    <CommonGrid
      ref="commongrid"
      :total="total"
      :tableData="tableData"
      :rowToolBtns="rowToolBtns"
      :allToolBtns="allToolBtns"
      :hasPermitShow="true"
      :columns="columns"
      :filter="hdFilter"
      :pagination.sync="pagination"
      @header-dragend="handleHeaderDragend"
      @deleteFilter="
        (key) => {
          deletehdFilter(key);
          this.updateGrid();
        }
      "
    >
      <template #toolRight>
        <el-button type="small" @click="openFilterColumnsWin()">列表</el-button>
      </template>
    </CommonGrid>
    <el-dialog
      title="自定义列表显示"
      :visible.sync="dialogVisible"
      width="450px"
      top="0"
    >
      <FilterColumnWin :originData="displaySetting" @save="onFliterSave" />
    </el-dialog>
  </main-panel>
</template>
<script>
/* eslint-disable */
import comm from "@/kd-elementui/mixins/comm";

import CommonGrid from "@/components/vue/grid/cmp/CommonGrid.vue";
import FilterColumnWin from "@/components/vue/grid/cmp/FilterColumnWin.vue";
import hdmixin from "@/components/hdSearchCmp/hdmixin";

import HDInput from "@/components/hdSearchCmp/HDInput.vue";
import HDCheckbox from "@/components/hdSearchCmp/HDCheckbox.vue";
import HDRadio from "@/components/hdSearchCmp/HDRadio.vue";
import HDDateFilter from "@/components/hdSearchCmp/HDDateFilter.vue";
import HDUserSelectTree from "@/components/hdSearchCmp/HDUserSelectTree.vue";
import { debounce } from "lodash";
import { timeFormat } from "./util";
export default {
  components: {
    CommonGrid,
    FilterColumnWin,
  },
  mixins: [comm, hdmixin],
  data() {
    return {
      salesProp: [],
      displaySetting: [],
      steps: [],
      exportPermit: false, //导出按钮
      managePermit: false,
      loading: true,
      rowToolBtns: [
        {
          name: "编辑",
          action: "EDIT_SALES",
          icon: require("@/images/gridToolbar/piliangbianji.png"),
        },
        {
          name: "删除",
          action: "DELETE_SALE",
          icon: require("@/images/gridToolbar/shanchu1.png"),
        },
      ],
      allToolBtns: [
        {
          name: "删除",
          action: "DELETE_SALE",
          icon: require("@/images/gridToolbar/shanchu1.png"),
        },
      ],
      columns: [],
      tableData: [],
      total: 0,
      pagination: {
        limit: 50,
        start: 0,
      },
      fieldNameMap: {
        1: {
          prop: "1",
          width: 200,
          label: "商机名称",
          minWidth: 200,
          render: (h, scope) => {
            return (
              <el-button
                type="text"
                size="small"
                on-click={(e) => this.handleClickSale(scope.row, e)}
              >
                {scope.row.scname}
              </el-button>
            );
          },
          searchable: true,
          searchCmp: () => {
            return (
              <HDInput
                value={this.filter.find((item) => item.key == "scname")?.value}
                on-save={(val) => {
                  if (!val) return;
                  this.updatehdFilter({
                    key: "scname",
                    label: "商机名称",
                    value: val,
                  });
                  this.updateGrid();
                }}
              />
            );
          },
        },
        2: {
          prop: "2",
          label: "预计成交金额（元）",
          width: 200,
          render: (h, scope) => {
            return <span>{scope.row.scprice}</span>;
          },
          minWidth: 100,
          searchable: true,
          searchCmp: () => {
            return (
              <HDInput
                placeholder="请输入预计成交金额"
                value={this.filter.find((item) => item.key == "scprice")?.value}
                on-save={(val) => {
                  if (!val) return;
                  if (!~Number(val)) return this.$message("只能筛选数字");
                  this.updatehdFilter({
                    key: "scprice",
                    label: "预计成交金额（元）",
                    value: Number(val),
                  });
                  this.updateGrid();
                }}
              />
            );
          },
        },
        3: {
          prop: "3",
          width: 150,
          render: (h, scope) => {
            return (
              <el-button
                type="text"
                size="small"
                on-click={(e) => this.handleClickCustomer(scope.row.custmid, e)}
              >
                {scope.row.custm_name}
              </el-button>
            );
          },
          searchable: true,
          searchCmp: () => {
            return (
              <HDInput
                value={
                  this.filter.find((item) => item.key == "custm_name")?.value
                }
                on-save={(val) => {
                  if (!val) return;
                  this.updatehdFilter({
                    key: "custm_name",
                    label: "客户名称",
                    value: val,
                  });
                  this.updateGrid();
                }}
              />
            );
          },
        },
        4: {
          prop: "4",
          width: 150,
          render: (h, scope) => {
            if (!scope.row.step_info) return <span></span>;
            let step_info = scope.row.step_info;
            if (step_info.scstep == -99) {
              return <span>{step_info.name}</span>;
            }
            return (
              <span>
                {step_info.name} ({step_info.percentage}%)
              </span>
            );
          },
          searchable: true,
          searchCmp: () => {
            return (
              <HDCheckbox
                data={this.steps}
                value={this.filter.find((item) => item.key == "scsteps")?.value}
                on-save={(val) => {
                  if (!val.length) {
                    this.deletehdFilter("scsteps");
                    this.updateGrid();
                    return;
                  }
                  const valueText = this.steps
                    .filter((v) => val.includes(v.id))
                    .map((v) => v.name)
                    .join("、");
                  this.updatehdFilter({
                    key: "scsteps",
                    label: "销售阶段",
                    value: val,
                    valueText,
                  });
                  this.updateGrid();
                }}
              />
            );
          },
        },
        5: {
          prop: "5",
          width: 150,
          newFixed:'right',
          render: (h, scope) => {
            return (
              <span>
                {scope.row.scdeadline
                  ? timeFormat("YYYY-mm-dd HH:MM", scope.row.scdeadline)
                  : ""}
              </span>
            );
          },
          searchable: true,
          searchCmp: () => {
            return (
              <HDDateFilter
                on-sort={(val) => {
                  this.updatehdFilter({
                    key: "new_stypes",
                    label: "预计成交时间",
                    value: val == 0 ? [6] : [1],
                    valueText: val == 0 ? "升序" : "降序",
                    type: 3,
                  });
                  this.updateGrid();
                }}
                on-save={(val) => {
                  const { value, valueText } = val;
                  this.updatehdFilter({
                    key: "dtime",
                    label: "预计成交时间",
                    value: {
                      begin_time: value.start_time,
                      end_time: value.end_time,
                    },
                    valueText,
                  });
                  this.updateGrid();
                }}
              />
            );
          },
        },
        50: {
          prop: "50",
          width: 150,
          render: (h, scope) => {
            return (
              <span class="one-line-ellipsis" title={scope.row.scnote}>
                {scope.row.scnote}
              </span>
            );
          },
          searchable: true,
          searchCmp: () => {
            return (
              <HDInput
                value={this.filter.find((item) => item.key == "scnote")}
                on-save={(val) => {
                  if (!val) return;
                  this.updatehdFilter({
                    key: "scnote",
                    label: "备注",
                    value: val,
                  });
                  this.updateGrid();
                }}
              />
            );
          },
        },
        创建时间: {
          prop: "创建时间",
          width: 150,
          newFixed:'right',
          render: (h, scope) => {
            return (
              <span>
                {scope.row.create_time
                  ? timeFormat("YYYY-mm-dd HH:MM", scope.row.create_time)
                  : ""}
              </span>
            );
          },
          searchable: true,
          searchCmp: () => {
            return (
              <HDDateFilter
                on-sort={(val) => {
                  this.updatehdFilter({
                    key: "new_stypes",
                    label: "创建时间",
                    value: val == 0 ? [12] : [4],
                    valueText: val == 0 ? "升序" : "降序",
                    type: 3,
                  });
                  this.updateGrid();
                }}
                on-save={(val) => {
                  const { value, valueText } = val;
                  this.updatehdFilter({
                    key: "ctime",
                    label: "创建时间",
                    value: {
                      begin_time: value.start_time,
                      end_time: value.end_time,
                    },
                    valueText,
                  });
                  this.updateGrid();
                }}
              />
            );
          },
        },
        跟进人: {
          prop: "跟进人",
          width: 150,
          render: (h, scope) => {
            return (
              <span
                class="one-line-ellipsis"
                title={scope.row.followers.map((f) => f.name).join("、")}
              >
                {scope.row.followers.map((f) => f.name).join("、")}
              </span>
            );
          },
          searchable: true,
          searchCmp: () => {
            return (
              <HDUserSelectTree
                value={
                  this.filter.find((item) => item.key == "followers")?.value
                }
                on-close={() => close()}
                on-save={(obj) => {
                  if (!obj) return;
                  let value = [obj.id];
                  this.updatehdFilter({
                    key: "followers",
                    label: "跟进人",
                    value,
                    valueText: obj.label,
                  });
                  this.updateGrid();
                }}
              />
            );
          },
        },
        跟进记录: {
          prop: "跟进记录",
          width: 150,
          render: (h, scope) => {
            return scope.row.talk_cnt ? (
              <el-button type="text" size="small">
                {scope.row.talk_cnt} + '次'
              </el-button>
            ) : (
              <span style="color:#999">无</span>
            );
          },
          searchable: true,
          searchCmp: () => {
            const data = [
              {
                id: 1,
                name: "无",
              },
            ];
            return (
              <HDRadio
                data={data}
                value={
                  this.filter.find((item) => item.key == "no_record")?.value ||
                  undefined
                }
                on-save={(val) => {
                  const valueText = ["无"][val];
                  this.updatehdFilter({
                    key: "no_record",
                    label: "跟进记录",
                    value: val,
                    valueText,
                  });
                  this.updateGrid();
                }}
              />
            );
          },
        },
        更新时间: {
          prop: "更新时间",
          width: 150,
          render: (h, scope) => {
            return (
              <span>
                {scope.row.modify_time
                  ? timeFormat("YYYY-mm-dd HH:MM", scope.row.modify_time)
                  : ""}
              </span>
            );
          },
          searchable: true,
          searchCmp: () => {
            return (
              <HDDateFilter
                on-sort={(val) => {
                  this.updatehdFilter({
                    key: "new_stypes",
                    label: "更新时间",
                    value: val == 0 ? [13] : [2],
                    valueText: val == 0 ? "升序" : "降序",
                    type: 3,
                  });
                  this.updateGrid();
                }}
                on-save={(val) => {
                  const { value, valueText } = val;
                  this.updatehdFilter({
                    key: "mtime",
                    label: "更新时间",
                    value: {
                      begin_time: value.start_time,
                      end_time: value.end_time,
                    },
                    valueText,
                  });
                  this.updateGrid();
                }}
              />
            );
          },
        },
      },
      dialogVisible: false,
    };
  },
  props: {
    title: String,
    type: {
      type: Number,
      default: 0,
    },
  },
  mounted() {
    // 权限
    this.getIsStoreAdmin();
    this.getExportPermit();
    // 获取配置
    this.getSettingConfig().then(async () => {
      await this.getDisplayConfig();
      this.createColumns();
      this.getTableData();
    });
    // 获取步骤
    this.getScSteps();
  },
  methods: {
    // 获取数据 begin
    getSettingConfig() {
      return new Promise((resolve) => {
        setTimeout(() => {
          let data = {
            module_type: 8,
            snumber_setting: 0,
            props: [
              {
                prop_id: 1,
                prop_name: "商机名称",
                is_system: 1,
                disable: 1,
                off_on: 1,
                value_type: 0,
                sort_id: 1,
                is_required: 1,
              },
              {
                prop_id: 2,
                prop_name: "预计成交金额",
                is_system: 1,
                disable: 1,
                off_on: 1,
                value_type: 1,
                sort_id: 11,
                is_required: 1,
              },
              {
                prop_id: 3,
                prop_name: "客户名称",
                is_system: 1,
                disable: 1,
                off_on: 1,
                value_type: 0,
                sort_id: 21,
                is_required: 1,
              },
              {
                prop_id: 4,
                prop_name: "销售阶段",
                is_system: 1,
                disable: 1,
                off_on: 1,
                value_type: 0,
                sort_id: 31,
                is_required: 1,
              },
              {
                prop_id: 5,
                prop_name: "预计成交时间",
                is_system: 1,
                disable: 1,
                off_on: 1,
                value_type: 2,
                sort_id: 41,
                is_required: 1,
              },
              {
                prop_id: 50,
                prop_name: "备注",
                is_system: 1,
                disable: 0,
                off_on: 1,
                value_type: 0,
                sort_id: 999999999,
                is_required: 0,
              },
              {
                prop_id: 51,
                prop_name: "图片",
                is_system: 1,
                disable: 1,
                off_on: 1,
                value_type: 6,
                sort_id: 1000000000,
                is_required: 0,
              },
              {
                prop_id: 10001,
                prop_name: "趣味无穷",
                is_system: 0,
                disable: 0,
                off_on: 1,
                value_type: 1,
                sort_id: 10006,
                is_required: 0,
              },
            ],
            version: 3,
          };
          this.salesProp = data.props.filter((v) => v.prop_id != 51); //把图片这一选项忽略掉
          resolve();
        }, 500);
      });
    },
    getDisplayConfig() {
      return new Promise((resolve) => {
        setTimeout(async () => {
          let origin = [
            { id: 1, name: "商机名称", check: true, disable: true, width: 143 },
            {
              id: 2,
              name: "预计成交金额",
              check: true,
              disable: false,
              width: 150,
            },
            {
              id: 3,
              name: "客户名称",
              check: true,
              disable: false,
              width: 108,
            },
            { id: 4, name: "销售阶段", check: true, disable: false },
            { id: 5, name: "预计成交时间", check: true, disable: false },
            { id: 50, name: "备注", check: true, disable: false },
            {
              id: 10001,
              name: "趣味无穷",
              check: true,
              disable: false,
              width: 175,
            },
            {
              id: "创建时间",
              name: "创建时间",
              check: true,
              disable: false,
              width: 200,
            },
            {
              id: "跟进人",
              name: "跟进人",
              check: false,
              disable: false,
              width: 200,
            },
            {
              id: "跟进记录",
              name: "跟进记录",
              check: false,
              disable: false,
              width: 200,
            },
            {
              id: "更新时间",
              name: "更新时间",
              check: false,
              disable: false,
              width: 200,
            },
          ];
          let data = localStorage.getItem("salesDisplayConfig");
          if (!data) {
            localStorage.setItem("salesDisplayConfig", JSON.stringify(origin));
          } else {
            data = JSON.parse(data);
          }
          let changeFlag = false;
          try {
            // 兼容旧版本数据
            if (
              !data.length ||
              typeof data[0] == "number" ||
              typeof data[0] == "string"
            ) {
              changeFlag = true;
              data = this.initDisplayConfig();
              return;
            }
            // 开始判断是否有新增or删除的一些数据 整理数据begin
            this.salesProp.forEach(({ prop_id, prop_name }) => {
              if (!~data.findIndex((item) => item.id == prop_id)) {
                changeFlag = true;
                //新增
                data.push({
                  id: prop_id,
                  name: prop_name,
                  check: false,
                  disable: false,
                  width: 200,
                });
              }
            });
            data.forEach(({ id }, index) => {
              if (["创建时间", "跟进人", "跟进记录", "更新时间"].includes(id))
                return;
              if (!~this.salesProp.findIndex((item) => item.prop_id == id)) {
                changeFlag = true;
                data.splice(index, 1);
              }
            });
            // 整理数据 end
          } catch (error) {
            changeFlag = true;
            data = this.initDisplayConfig();
          } finally {
            changeFlag && (await this.setDisplayConfig(data));
            this.displaySetting = data;
            resolve();
          }
        }, 500);
      });
    },
    setDisplayConfig(data) {
      return new Promise((resolve) => {
        setTimeout(() => {
          localStorage.setItem("salesDisplayConfig", JSON.stringify(data));
          resolve();
        }, 200);
      });
    },
    initDisplayConfig() {
      let data = [];
      this.salesProp.forEach(({ prop_id, prop_name }) => {
        data.push({
          id: prop_id,
          name: prop_name,
          check: true,
          disable: prop_id == 1,
        });
      });
      // 创建时间 跟进人，跟进记录，更新时间
      data.push(
        {
          id: "创建时间",
          name: "创建时间",
          check: true,
          disable: false,
          width: 200,
        },
        {
          id: "跟进人",
          name: "跟进人",
          check: true,
          disable: false,
          width: 200,
        },
        {
          id: "跟进记录",
          name: "跟进记录",
          check: true,
          disable: false,
          width: 200,
        },
        {
          id: "更新时间",
          name: "更新时间",
          check: true,
          disable: false,
          width: 200,
        }
      );
      return data;
    },
    // 获取数据 end
    // 表格相关 begin
    createColumns() {
      let c = [];
      this.displaySetting.forEach((item, index) => {
        if (!item.check) return;
        if (this.fieldNameMap[item.id]) {
          c.push({
            label: item.name,
            newFixed: item.id == 1 || index < 2,
            ...this.fieldNameMap[item.id],
            width: item.width || 200,
          });
        } else {
          let prop = this.salesProp.find((_item) => _item.prop_id == item.id);
          let obj = {
            label: item.name,
            width: item.width || 200,
            newFixed: index < 2,
            prop: item.id + "",
            searchable: true,
            render: (h, scope) => {
              let sub_item = scope.row.props.find(
                (_item) => _item.prop_id == item.id
              );
              if (!sub_item) return <span></span>;
              let finval = sub_item.value
                ? JSON.parse(sub_item.value).value
                : "";
              return <span>{finval}</span>;
            },
          };
          if (prop) {
            switch (prop.value_type) {
              case 0: //文本
              case 1: //数字
                obj.searchCmp = () => {
                  return (
                    <HDInput
                      value={this.filter.find((_item) => _item.key == item.id)}
                      showEmptyCheckbox={true}
                      placeholder={"搜索" + item.name}
                      on-save={(val) => {
                        if (!val) return;
                        const key = "prop" + item.id;
                        const value = {
                          id: item.id,
                          txt: val,
                        };
                        if (val == -1) {
                          this.updatehdFilter({
                            key,
                            label: item.name,
                            valueText: "空值",
                            value: item.id,
                            type: 2,
                          });
                          this.updateGrid();
                          return;
                        }
                        this.updatehdFilter({
                          key,
                          label: item.name,
                          valueText: val,
                          value,
                        });
                        this.updateGrid();
                      }}
                    ></HDInput>
                  );
                };
                break;
              case 2: //日期
              case 3: //日期2
                obj.searchCmp = () => {
                  return (
                    <HDDateFilter
                      showEmptyCheckbox={true}
                      on-sort={(val) => {
                        const key = "prop" + item.id;
                        const value = {
                          id: item.id,
                          pttype: val == 0 ? 2 : 1,
                        };
                        this.updatehdFilter({
                          key,
                          label: item.name,
                          valueText: val == 0 ? "升序" : "降序",
                          value,
                          type: 3,
                        });
                        this.updateGrid();
                      }}
                      on-save={(val) => {
                        if (val == -1) {
                          this.updatehdFilter({
                            key,
                            label: item.name,
                            valueText: "空值",
                            value: item.id,
                            type: 2,
                          });
                          this.updateGrid();
                          return;
                        }
                        const { value, valueText } = val;
                        const key = "prop" + item.id;
                        const _value = {
                          id: item.id,
                          time: {
                            begin_time: value.start_time,
                            end_time: value.end_time,
                          },
                        };
                        this.updatehdFilter({
                          key,
                          label: item.name,
                          valueText,
                          value: _value,
                        });
                        this.updateGrid();
                      }}
                    ></HDDateFilter>
                  );
                };
                break;
              default:
                obj.searchCmp = () => {
                  return (
                    <HDInput
                      value={this.filter.find((_item) => _item.key == item.id)}
                      showEmptyCheckbox={true}
                      placeholder={"搜索" + item.name}
                      on-save={(val) => {
                        if (!val) return;
                        const key = "prop" + item.id;
                        const value = {
                          id: item.id,
                          txt: val,
                        };
                        if (val == -1) {
                          this.updatehdFilter({
                            key,
                            label: item.name,
                            valueText: "空值",
                            value: item.id,
                            type: 2,
                          });
                          this.updateGrid();
                          return;
                        }
                        this.updatehdFilter({
                          key,
                          label: item.name,
                          valueText: val,
                          value,
                        });
                        this.updateGrid();
                      }}
                    ></HDInput>
                  );
                };
                break;
            }
          }
          c.push(obj);
        }
      });
      //   this.columns = c;
      this.columns = [];
      this.$nextTick(() => {
        this.columns = c;
      });
    },
    handleHeaderDragend(newWidth, oldWidth, column, event) {
      let item = this.displaySetting.find((item) => item.id == column.property);
      if (item) {
        item.width = newWidth;
        this.setDisplayConfig(this.displaySetting);
      }
    },
    getTableData() {
      let param = {
        count: this.pagination.limit,
        skip:
          (this.pagination.start - 1 > 0 ? this.pagination.start - 1 : 0) *
          this.pagination.limit,
        new_cond: {
          new_stypes: [2],
        },
      };
      if (this.type) {
        param.pid = 1222222;
      }
      if (this.filter.length) {
        this.filter.map((item) => {
          param.new_cond[item.key] = item.value;
        });
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          let res = {
            result: 0,
            scs: [
              {
                scid: 102,
                version: 1,
                scname: "新建商机2",
                scstep: 101,
                scdeadline: 1683676800000,
                scprice: 123123,
                scnote: "",
                followers: [
                  {
                    pid: 25,
                    start_time: 1683355878508,
                    name: "158****0001",
                  },
                ],
                custmid: 1,
                props: [],
                pictures: [],
                atts: [],
                create_time: 1683355878508,
                create_pid: 25,
                modify_time: 1683355878508,
                modify_pid: 25,
                status: 0,
                del_time: 0,
                step_info: {
                  scstep: 101,
                  name: "初步沟通",
                  percentage: 10,
                },
                custm_name: "测试客户",
              },
              {
                scid: 101,
                version: 1,
                scname: "测试商机1",
                scstep: 102,
                scdeadline: 1682985600000,
                scprice: 12,
                scnote: "",
                followers: [
                  {
                    pid: 25,
                    start_time: 1683355854869,
                    name: "158****0001",
                  },
                ],
                custmid: 1,
                props: [],
                pictures: [],
                atts: [],
                create_time: 1683355854869,
                create_pid: 25,
                modify_time: 1683355854869,
                modify_pid: 25,
                status: 0,
                del_time: 0,
                step_info: {
                  scstep: 102,
                  name: "方案报价",
                  percentage: 50,
                },
                custm_name: "测试客户",
              },
            ],
            end: true,
            total: 2,
          };
          this.$refs.commongrid.resetCheck();
          this.tableData = res.scs;
          this.total = res.total || 0;
          this.loading = false;
          resolve();
        }, 500);
      });
    },
    updateGrid() {
      this.loading = true;
      this.pagination.start = 0;
      this.getTableData();
    },
    // 表格相关 end
    getScSteps() {
      this.steps = [
        {
          id: 101,
          name: "初步沟通 (10%)",
          percentage: 10,
          realName: "初步沟通",
        },
        {
          id: 102,
          name: "方案报价 (50%)",
          percentage: 50,
          realName: "方案报价",
        },
        {
          id: 103,
          name: "谈判协商 (80%)",
          percentage: 80,
          realName: "谈判协商",
        },
        {
          id: 5,
          name: "赢单 (100%)",
          percentage: 100,
          realName: "赢单",
        },
        {
          id: 6,
          name: "输单 (0%)",
          percentage: 0,
          realName: "输单",
        },
        {
          id: -99,
          name: "无效",
          percentage: 1,
          realName: "无效",
        },
      ];
    },
    getExportPermit() {
      this.exportPermit = 1;
    },
    // 判断是不是crm管理员
    getIsStoreAdmin(type = 15) {
      this.managePermit = true;
    },

    openFilterColumnsWin() {
      this.dialogVisible = true;
    },
    async onFliterSave(val) {
      this.loading = true;
      this.dialogVisible = false;
      this.displaySetting = [...val];
      await this.setDisplayConfig(this.displaySetting);
      this.createColumns();
      setTimeout(() => {
        this.loading = false;
      }, 200);
    },
    // ext弹窗相关 begin
    /**
     * 转换需要编辑的商机信息
     * @param input
     * @returns {{}}
     */
    translateData: function (input) {
      var output = {
        ...input,
        scname: input.scname,
        scid: input.scid,
        custmid: {
          name: input.custm_name,
          id: input.custmid,
        },
        scprice: input.scprice,
        scdeadline: new Date(input.scdeadline),
        scstepid: {
          id: input.step_info.scstep,
        },
        remark: input.scnote,
        followers: input.followers.map((item) => ({
          id: item.pid,
          realname: item.name,
        })),
        props: input.props,
        atts: input.atts,
        pictures: input.pictures,
      };
      return output;
    },
    createExportSales() {
      return new B.sales.win.Export({
        permission:
          SF.invoke("sysInfo", "super") || this.isAllowedExportBtn
            ? "admin"
            : null,
      });
    },
    exportSales() {
      const win = this.getWin("exportSales");
      win.show();
    },
    // ext弹窗相关 end
    getnewcond() {
      let res = {
        new_stypes: [2],
      };
      if (this.filter.length) {
        this.filter.map((item) => {
          res[item.key] = item.value;
        });
      }
      return res;
    },
    async doDeleteSales(allChecked, arr, reason) {
      console.log("删除全部");
    },
    deleSales(allChecked, arr) {
      console.log(111);
    },
    handleClickSale(data) {
      this.showSale(data, this.salesProp);
    },
    handleClickCustomer(id) {
      this.showCustomer(id);
    },
    refresh(mode) {
      //mode: sale || customer
      this.getTableData();
    },
  },
  watch: {
    pagination: {
      handler: debounce(function () {
        this.loading = true;
        this.getTableData();
      }, 200),
      deep: true,
    },
  },
};
/* eslint-disable */
</script>
<style lang="less" scoped>
.sale-panel {
  display: flex;
  flex-direction: column;
  .tbar {
    height: 30px;
  }
}
.sale-panel::after {
  content: "1. 动态排序&动态筛选：点击列表按钮，进行排序or筛选； \A 2. 动态宽度：可拖动表头进行宽度设置；\A 3. 自适应：切换到列少的情况，会自动扩充，列多的时候，会根据出现滚动条；\A 4. 自定义表头：jsx进行动态表头设计，封装满足需要的表头；并且针对接口进行统一封装；\A 5. 修改element-ui固定列，由原先的两个列表重叠，换成css的sticky，提高性能； \A";
  position: absolute;
  width: 500px;
  height: 16px;
  right: calc(50% - 250px);
  top: 50%;
  color: #8b8b8b;
  white-space: pre;
  text-align: left;
  line-height: 20px;
}
.poptip-icon {
  cursor: pointer;
  width: 16px;
  height: 16px;
  background-repeat: no-repeat;
  background-image: url("~@/images/icon-16px/bangzhu.png");
}
/deep/.one-line-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
