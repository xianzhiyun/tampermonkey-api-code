<template>
    <div class="app-container">
        <div style="margin-left: 10px;">
            <el-button style="margin: 10px" type="primary" size="mini" @click="generateCode">
                生成代码
            </el-button>
            <!--   -->
            <section style="margin-bottom: 10px;margin-left:15px;">
                <!-- 表格顶部操作区域 -->
                <span style="font-size:12px;font-weight: bold">列表上方：</span>
                <el-select
                        clearable
                        size="small"
                        style="min-width: 400px"
                        v-model="operateType_up"
                        multiple
                        filterable
                        allow-create
                        default-first-option
                        placeholder="请选择">
                    <el-option
                            v-for="item in options_up"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <!-- 表格内操作区域 -->
                <span style="font-size:12px;font-weight: bold;margin-left: 10px">列表内部：</span>
                <el-select
                        clearable
                        size="small"
                        style="min-width: 400px"
                        v-model="operateType_in"
                        multiple
                        filterable
                        allow-create
                        default-first-option
                        placeholder="请选择">
                    <el-option
                            v-for="item in options_in"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </section>
        </div>
        <!-- Note that row-key is necessary to get a correct row order. -->
        <div class="table-box">
            <el-table
                    ref="dragTable"
                    v-loading="listLoading"
                    style="flex: 1"
                    max-height="3500"
                    :data="tableList"
                    row-key="id"
                    height="0"
                    border
                    fit
                    highlight-current-row
            >
                <el-table-column
                        label="#"
                        type="index"
                        align="center"
                        width="50"
                />
                <el-table-column align="center" label="字段名/value">
                    <template slot-scope="{row}">
                        <el-input v-model="row.value" size="mini" placeholder="请输入内容"/>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="标题/lable">
                    <template slot-scope="{row}">
                        <el-input v-model="row.label" size="mini" placeholder="请输入内容"/>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="搜索参数" width="90">
                    <template slot-scope="{row}">
                        <el-switch
                                v-model="row.isParams"
                        />
                    </template>
                </el-table-column>
                <el-table-column align="center" label="类型">
                    <template slot-scope="{row}">
                        <el-select v-model="row.showType" size="mini" placeholder="请选择">
                            <el-option
                                    v-for="item in showTypeList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                            />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="Drag" width="80">
                    <template slot-scope="scope">
                        <i style="font-size: 16px;color: #303133;cursor: pointer" class="el-icon-rank"/>
                        <i
                                style="font-size: 16px;color: #F56C6C;margin-left: 20px;cursor: pointer"
                                class="el-icon-delete" @click.stop="deleteItem(scope)"
                        />
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import Sortable from 'sortablejs'
import {copyText} from '@/utils'
import {formCode} from "@/utils/form-code";
import axios from 'axios';

export default {
    name: 'FormCode',
    props: {
        // api 字段配置内容
        apiTableList: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            listLoading: false,
            listQuery: {
                page: 1,
                limit: 10
            },
            sortable: null,
            oldList: [],
            newList: [],
            tableList: [],
            // 展示类型
            showTypeList: [
                {
                    label: '默认',
                    value: '默认'
                },
                {
                    label: '普通插槽',
                    value: '普通插槽'
                },
                {
                    label: '切换开关',
                    value: '切换开关'
                },
                {
                    label: '状态类型',
                    value: '状态类型'
                },
                {
                    label: '时间插槽:YYYY-MM-DD',
                    value: '时间插槽:YYYY-MM-DD'
                },
                {
                    label: '时间插槽:YYYY-MM-DD HH:mm:ss',
                    value: '时间插槽:YYYY-MM-DD HH:mm:ss'
                },
            ],
            itemNum: 0,
            operateType_up: [],  // 操作
            operateType_in: [],  // 操作
            options_up: [
                {
                    value: '新增',
                    label: '新增'
                },
                {
                    value: '编辑',
                    label: '编辑'
                },
                {
                    value: '删除',
                    label: '删除'
                },
                {
                    value: '自定义',
                    label: '自定义'
                },
            ],
            options_in: [
                {
                    value: '编辑',
                    label: '编辑'
                },
                {
                    value: '删除',
                    label: '删除'
                },
                {
                    value: '查看',
                    label: '查看'
                },
                {
                    value: '自定义',
                    label: '自定义'
                },
            ],
        }
    },
    watch: {
        apiTableList: {
            handler(val) {
                if (Array.isArray(val) && val.length) {
                    this.tableList = val
                    this.copyData()
                }
            },
            deep: true,
            immediate: true
        }
    },
    mounted() {
    },
    methods: {
        // 根据显示列表内容，生成对应 表单代码
        generateCode() {
            let code = formCode(this.tableList)
            copyText('', code)
            this.$message({
                message: '代码copy成功',
                type: 'success'
            });
        },
        // 删除某一项
        deleteItem(scope) {
            this.tableList.splice(scope.$index, 1)
        },
        // copy数据
        async copyData() {
            this.listLoading = false
            this.oldList = this.tableList.map(v => v.id)
            this.newList = this.oldList.slice()
            this.$nextTick(() => {
                this.setSort()
            })
        },
        // 对数据实现排序
        setSort() {
            const el = this.$refs.dragTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
            this.sortable = Sortable.create(el, {
                ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
                setData(dataTransfer) {
                    // to avoid Firefox bug
                    // Detail see : https://github.com/RubaXa/Sortable/issues/1012
                    dataTransfer.setData('Text', '')
                },
                onEnd: evt => {
                    const targetRow = this.tableList.splice(evt.oldIndex, 1)[0]
                    this.tableList.splice(evt.newIndex, 0, targetRow)

                    // for show the changes, you can delete in you code
                    const tempIndex = this.newList.splice(evt.oldIndex, 1)[0]
                    this.newList.splice(evt.newIndex, 0, tempIndex)
                }
            })
        },
    }
}
</script>

<style>
.app-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 10px 5px 10px 10px;
    /*background: #999999;*/
}

.sortable-ghost {
    opacity: .8;
    color: #fff !important;
    background: #42b983 !important;
}
</style>

<style scoped lang="scss">
/deep/ .el-table__body-wrapper {
    scrollbar-arrow-color: #000; /*顶部/底部图标颜色*/
    scrollbar-face-color: #333; /*滚动条颜色*/
    scrollbar-shadow-color: #999; /*滚动条阴影颜色*/
}

/deep/ .el-table__body-wrapper::-webkit-scrollbar {
    width: 6px; // 横向滚动条
    height: 6px; // 纵向滚动条 必写
    background-color: #F5F5F5;
}

// 滚动条的滑块
/deep/ .el-table__body-wrapper::-webkit-scrollbar-track {
    /*background-color: #f8f8f8;*/
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    background-color: #F5F5F5;
}

// 滚动条的滑块
/deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb {
    /*background-color: #f8f8f8;*/
    border-radius: 3px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
    background-color: #1890ff;
}

.table-box {
    flex: 1;
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #fff;
    overflow: hidden;
}

.icon-star {
    margin-right: 2px;
}

.drag-handler {
    width: 20px;
    height: 20px;
    cursor: pointer;
}

.show-d {
    margin-top: 15px;
}
</style>
