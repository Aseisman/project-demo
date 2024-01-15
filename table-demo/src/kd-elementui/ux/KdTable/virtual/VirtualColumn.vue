<template>
    <el-table-column v-bind="column" v-on="$listeners" :label="column.label" :class-name="getClassName">
        <!-- 列头部 -->
        <template slot="header" slot-scope="scope">
            <!-- 多选类型-全选 -->
            <el-checkbox v-if="column.type == 'v-selection'" v-model="isCheckedAll" :indeterminate="isCheckedImn"
                @change="onCheckAllRows">
            </el-checkbox>
            <div class="cell-container" v-else>
                <free-render v-if="column._renderHeader" :scope="scope" :render="column._renderHeader" />
                <span class="cell-container-text" v-else>{{ scope.column.label }}</span>
                <el-popover placement="bottom" trigger="click" class="search-cmp-container" popper-class="popper-container"
                    @after-leave="alwaysShowSearchCmp = false" v-if="column.searchable">
                    <head-render :scope="scope" :render="column.searchCmp" />
                    <div slot="reference"
                        :class="['search-container', alwaysShowSearchCmp ? 'search-container-active' : '']"
                        @click="alwaysShowSearchCmp = true">
                        <span></span>
                    </div>
                </el-popover>
            </div>
        </template>

        <template v-if="column.children">
            <free-column v-for="col in column.children" :key="col.prop" :column="col" />
        </template>
        <template slot-scope="scope">
            <!-- 多选类型 -->
            <el-checkbox @click.native.stop v-if="column.type === 'v-selection'"
                :value="scope.row.$v_checked || false" :disabled="getDisabled(scope)"
                @change="onCheckRow(scope, !scope.row.$v_checked)">
            </el-checkbox>
            <component v-else-if="column.component" v-bind="getCptBind(scope, column)" v-on="column.listeners"
                :is="column.component" />
            <free-render v-else :scope="scope" :render="column.render" />
        </template>

    </el-table-column>
</template>
  
<script>
import FreeRender from '../render';
import HeadRender from '../headRender';
import CellForced from '../forced';
export default {
    name: 'el-table-virtual-column',
    components: {
        FreeRender,
        HeadRender
    },
    inject: ['virtualScroll'],
    props: {
        load: {
            type: Function
        },
        indent: {
            type: Number,
            default: 16
        },
        selectable: {
            type: Function
        },
        column: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            isCheckedAll: false, // 全选
            isCheckedImn: false, // 控制半选样式
            isTree: false, // 树结构
            isNested: false, // 是否列嵌套
            showSearchCmp: false,
            alwaysShowSearchCmp: false
        }
    },
    watch: {
        column: {
            handler: 'renderColumn',
            immediate: true
        }
    },
    computed: {
        getClassName() {
            const classnames = []
            const classname = this.$attrs['class-name'] || this.$attrs.className
            classname && classnames.push(classname)
            this.isTree && classnames.push('el-table__row--level')
            let vfixed = this.$attrs.vfixed
            if (vfixed === true || vfixed === '') vfixed = 'left'
            if (vfixed) classnames.push('virtual-column__fixed-' + vfixed)
            return classnames.join(' ')
        }
    },
    methods: {
        // 获取多选禁用状态
        getDisabled(scope) {
            if (this.selectable) {
                const index = this.getIndex(scope, false)
                return !this.selectable(scope.row, index)
            }
            return false
        },
        // 选择表格所有行
        onCheckAllRows(val) {
            val = this.isCheckedImn ? true : val
            if (this.selectable) {
                const list = this.virtualScroll.getData()
                // 筛选出可选的行
                const selectableList = []
                let hasUnselectableChecked = false // 是否不可选择的行已经勾选了
                list.forEach((row, index) => {
                    const isSelectable = this.selectable(row, index)
                    if (isSelectable) {
                        selectableList.push(row)
                    } else {
                        if (row.$v_checked) hasUnselectableChecked = true
                    }
                })
                this.virtualScroll.checkAll(val, selectableList)
                this.isCheckedAll = val
                // 如果有不可选择的行已经勾选了，此时取消全选，选择框需要设置为半选状态
                if (hasUnselectableChecked && !val) {
                    this.isCheckedImn = true
                } else {
                    this.isCheckedImn = false
                }
                return
            }

            this.virtualScroll.checkAll(val)
            this.isCheckedAll = val
            this.isCheckedImn = false
        },
        // 选择表格某行
        onCheckRow(scope, val) {
            const index = this.getIndex(scope, false)
            if (this.selectable) {
                const isSelectable = this.selectable(scope.row, index)
                if (!isSelectable) return
            }

            this.virtualScroll.checkRow(scope.row, val)
            this.syncCheckStatus()
        },
        // 是否自定义多选
        isSelection() {
            return this.$attrs.type !== 'v-selection'
        },
        // 同步全选、半选框状态
        syncCheckStatus() {
            const list = this.virtualScroll.getData()
            const checkedLen = list.filter(row => row.$v_checked === true).length

            // 计算可选行的长度
            let selectableLen
            let selectableCheckedLen
            if (this.selectable) {
                const selectableList = list.filter((row, index) => this.selectable(row, index))
                selectableCheckedLen = selectableList.filter(row => row.$v_checked === true).length
                selectableLen = selectableList.length
            }

            if (checkedLen === 0) {
                this.isCheckedAll = false
                this.isCheckedImn = false
            } else if (this.selectable && selectableCheckedLen === selectableLen) {
                this.isCheckedAll = true
                this.isCheckedImn = false
            } else if (checkedLen === list.length) {
                this.isCheckedAll = true
                this.isCheckedImn = false
            } else {
                this.isCheckedAll = false
                this.isCheckedImn = true
            }
        },
        // 单选
        onRadioChange(row) {
            this.virtualScroll.setCurrentRow(row)
        },
        // 获取索引值; add1 - 是否加1
        getIndex(scope, add1 = true) {
            const index = this.virtualScroll.start + scope.$index
            if (typeof this.$attrs.index === 'function') {
                return this.$attrs.index(index)
            }
            return index + (add1 ? 1 : 0)
        },


        // 展开收起事件，返回子节点
        async onTreeNodeExpand(row, expanded = !row.$v_expanded, doLoad = true) {
            if (row.$v_expanded === expanded) return []

            if (expanded) {
                // 如果已经加载，则显示隐藏的字节点
                if (row.$v_loaded) {
                    return this.loadOldChildNodes(row)
                } else if (doLoad) {
                    return this.loadChildNodes(row)
                }
            } else {
                return this.hideChildNodes(row)
            }
        },
        // 加载子节点
        loadChildNodes(row) {
            return new Promise((resolve) => {
                // 获取子节点数据并显示
                this.$set(row, '$v_loading', true)
                this.load && this.load(row, resolveFn.bind(this))

                function resolveFn(data) {
                    if (!Array.isArray(data)) {
                        this.$set(row, '$v_loading', false)
                        resolve()
                        return
                    }

                    this.$set(row, '$v_loading', false)
                    this.$set(row, '$v_expanded', true)
                    this.$set(row, '$v_loaded', true)
                    this.$set(row, '$v_hasChildren', !!data.length)
                    data.forEach(item => {
                        item.$v_level = typeof row.$v_level === 'number' ? row.$v_level + 1 : 2
                    })
                    // 所有子节点插入到当前同级节点下
                    const list = this.virtualScroll.getData()
                    const index = list.findIndex(item => item === row)
                    if (index > -1) {
                        this.virtualScroll.updateData([
                            ...list.slice(0, index + 1),
                            ...data,
                            ...list.slice(index + 1)
                        ])
                    }
                    resolve(data)
                }
            })
        },
        // 加载已经加载的子节点
        loadOldChildNodes(row) {
            this.$set(row, '$v_expanded', true)
            const list = this.virtualScroll.getData()
            const index = list.findIndex(item => item === row)
            if (index > -1) {
                this.virtualScroll.updateData([
                    ...list.slice(0, index + 1),
                    ...(row.$v_hideNodes || []),
                    ...list.slice(index + 1)
                ])
                return row.$v_hideNodes
            }
            return []
        },
        // 隐藏子节点
        hideChildNodes(row) {
            this.$set(row, '$v_expanded', false)
            const list = this.virtualScroll.getData()
            const index = list.findIndex(item => item === row)
            if (index === -1) return

            // 查找当前节点的所有子孙节点
            const hideNodes = []
            for (let i = index + 1; i < list.length; i++) {
                const curRow = list[i]
                if ((curRow.$v_level || 1) <= (row.$v_level || 1)) break
                hideNodes.push(curRow)
            }
            this.$set(row, '$v_hideNodes', hideNodes)
            // 隐藏所有子孙节点
            const newList = list.filter(item => !hideNodes.includes(item))
            this.virtualScroll.updateData(newList)
            this.virtualScroll.update()
            return []
        },
        // 展开节点
        // expandKeys - 展开节点的keys值
        // expanded - 展开/收起
        // doLoad - 未加载子节点则执行load函数去加载，已加载则展开
        expand(expandKeys, expanded = true, doLoad = true) {
            if (!Array.isArray(expandKeys)) return

            const { getData, keyProp } = this.virtualScroll
            const data = getData()
            const plist = []
            data.forEach((row) => {
                if (row[keyProp] && expandKeys.includes(row[keyProp])) {
                    plist.push(this.onTreeNodeExpand(row, expanded, doLoad))
                }
            })
            return Promise.all(plist)
        },
        // 展开路径
        expandPath(keyPath) {
            if (!Array.isArray(keyPath)) return

            // 递归路径，逐层展开节点
            const expand = async (rows, n) => {
                if (n === keyPath.length) return keyPath[n - 1]
                if (!Array.isArray(rows) || !rows.length) return keyPath[n - 1]
                const targetRow = rows.find(row => row[keyProp] === keyPath[n])
                if (targetRow) {
                    if (!targetRow.$v_expanded) {
                        rows = await this.onTreeNodeExpand(targetRow, true)
                    }
                    return expand(rows, n + 1)
                } else {
                    console.warn(`[expandPath] 没有找到 ${keyPath[n]} key值对应的行`)
                    return keyPath[n - 1] // 返回上一个key值
                }
            }
            const { getData, keyProp } = this.virtualScroll
            const data = getData()
            return expand(data, 0)
        },
        // 展开所有存在的节点
        expandAll() {
            // 展开节点（递归）
            const expandRows = (data) => {
                if (Array.isArray(data) && data.length) {
                    data.forEach((row) => {
                        this.onTreeNodeExpand(row, true, false)
                        expandRows(row.$v_hideNodes)
                    })
                }
            }

            const { getData } = this.virtualScroll
            const data = getData()
            expandRows(data)
        },
        // 收起所有节点
        unexpandAll() {
            const { getData } = this.virtualScroll
            const data = getData()
            const levelMap = []
            data.forEach(row => {
                const level = row.$v_level || 1
                !levelMap[level] && (levelMap[level] = [])
                levelMap[level].push(row)
            })
            for (let i = levelMap.length - 1; i >= 0; i--) {
                if (!levelMap[i]) continue
                levelMap[i].forEach(row => {
                    this.onTreeNodeExpand(row, false)
                })
            }
        },


        renderColumn() {
            const { column } = this;
            // 多选：selection / 索引：index / 展开的按钮：expand
            if (column.type && column.type !=="v-selection") {
                column._renderHeader = CellForced[column.type]._renderHeader;
                column.render = column.render || CellForced[column.type].renderCell;
            }
            // 格式化内容
            if (column.formatter) {
                column.render = (h, scope) => {
                    return (
                        <span>
                            {scope.column.formatter(scope.row, scope.column, scope.row[scope.column.property], scope.$index)}
                        </span>
                    );
                };
            }
            // 渲染成text
            if (!column.render) {
                column.render = (h, scope) => {
                    return <span>{scope.row[scope.column.property]}</span>;
                };
            }
            return column;
        },

        getColBind(col) {
            const bind = Object.assign({}, this.$attrs, col);
            delete bind.component;
            delete bind.listeners;
            delete bind.propsHandler;
            return bind;
        },

        getCptBind({ row, column }, col) {
            const props = { row, col, column };
            const handler = col.propsHandler;
            return (handler && handler(props)) || props;
        }
    },
    beforeCreate() {
        const { type } = this.$attrs
        if (['index', 'selection', 'radio', 'tree'].includes(type)) {
            this.$attrs.type = 'v-' + type
        }
    },
    created() {
        this.isNested = !!this.$slots.default // 是否列嵌套
        this.virtualScroll.addColumn(this)

        const { type } = this.$attrs
        if (type === 'expand') {
            this.virtualScroll.isExpandType = true
        } else if (type === 'v-tree') {
            this.isTree = true
        }
    },
    beforeDestroy() {
        this.virtualScroll.removeColumn(this)
    }
}
</script>
  
<style lang='less'>
.el-table-virtual-scroll {

    .virtual-column__fixed-left,
    .virtual-column__fixed-right {
        position: sticky !important;
        z-index: 2 !important;
        background: #fff;
    }

    &.is-scrolling-left {
        .is-last-column {
            &:before {
                box-shadow: none;
            }
        }
    }

    &.is-scrolling-right,
    &.is-scrolling-middle {
        .is-last-column {
            border-right: none;
        }
    }

    &.is-scrolling-right {
        .is-first-column {
            &:before {
                box-shadow: none;
            }
        }
    }

    &.is-scrolling-left,
    &.is-scrolling-middle {
        .is-first-column {
            border-left: none;
        }
    }

    .is-last-column,
    .is-first-column {
        overflow: visible !important;

        &:before {
            content: "";
            position: absolute;
            top: 0px;
            width: 10px;
            bottom: -1px;
            overflow-x: hidden;
            overflow-y: hidden;
            touch-action: none;
            pointer-events: none;
        }
    }

    .is-last-column {
        &:before {
            right: -10px;
            box-shadow: inset 10px 0 10px -10px rgba(0, 0, 0, .12);
        }
    }

    .is-first-column {
        &:before {
            left: -10px;
            box-shadow: inset -10px 0 10px -10px rgba(0, 0, 0, .12);
        }
    }
}
</style>

<style lang="less" scoped>
.search-container {
    width: 22px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    right: 0;
    top: -5px;
    cursor: pointer;
    margin-right: 10px;

    span {
        // background-image: url('~@/images/moa/grid/table-jiantou.svg');
        background-repeat: no-repeat;
        width: 20px;
        height: 20px;
    }
}

.cell-container:hover {
    .search-container {
        span {
            background-image: url('~@/images/moa/grid/table-jiantou.svg');
            background-color: #f7f7fa;
        }
    }
}

.search-container-active {
    span {
        background-image: url('~@/images/moa/grid/table-jiantou备份 5.svg') !important;
        background-color: #f7f7fa;
    }
}

.cell-container {
    display: flex;
    align-items: center;

    .cell-container-text {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        width: 95%;
    }
}
</style>
<style>
.popper-container {
    border-radius: 10px;
}
</style>