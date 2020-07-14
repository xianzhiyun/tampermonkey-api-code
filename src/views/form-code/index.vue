<template>
    <div class="app-container">
        <div style="margin-left: 10px;height: 48px">
            <span>一行显示数量：</span>
            <el-input-number v-model="itemNum" size="mini" :min="1" :max="4" label="一行展示内容"/>
            <el-button style="margin: 10px" type="primary" size="mini" @click="generateCode">
                生成代码
            </el-button>
        </div>
        <!-- Note that row-key is necessary to get a correct row order. -->
        <div style="flex: 1;border: 2px solid red;">
            <el-table ref="dragTable" v-loading="listLoading" :data="list" row-key="id" border fit highlight-current-row>
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
                <el-table-column align="center" label="参数">
                    <template slot-scope="{row}">
                        <el-switch
                                v-model="row.isParams"
                        />
                    </template>
                </el-table-column>

                <el-table-column align="center" label="表单类型/type">
                    <template slot-scope="{row}">
                        <el-select v-model="row.type" size="mini" placeholder="请选择">
                            <el-option
                                    v-for="item in typeOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                            />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="验证">
                    <template slot-scope="{row}">
                        <el-switch
                                v-model="row.required"
                        />
                    </template>
                </el-table-column>
                <el-table-column align="center" label="rules">
                    <template slot-scope="{row}">
                        <el-select v-model="row.rules" size="mini" placeholder="请选择">
                            <el-option
                                    v-for="item in rulesList"
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
                                class="el-icon-delete" @click="deleteItem(scope)"
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
import {formCode} from "@/utils/generate-code";
import apiJson from './demo.json'

export default {
    name: '',
    data() {
        return {
            list: [],
            listLoading: true,
            listQuery: {
                page: 1,
                limit: 10
            },
            sortable: null,
            oldList: [],
            newList: [],
            tableData: [],
            typeOptions: [
                {
                    label: 'Input',
                    value: 'input'
                },
                {
                    label: '插槽',
                    value: 'slot'
                },
                {
                    label: 'select',
                    value: 'select'
                },
                {
                    label: 'radio',
                    value: 'radio'
                },
                {
                    label: 'img',
                    value: 'img'
                }
            ],
            rulesList: [
                {
                    label: '验证为空',
                    value: '验证为空'
                },
                {
                    label: '验证数字',
                    value: '验证数字'
                },
                {
                    label: '验证IP',
                    value: '验证IP'
                },
                {
                    label: '验证host',
                    value: '验证host'
                }
            ],
            itemNum: 0
        }
    },
    created() {
        this.fromDatByJson()
        this.getList()
    },
    mounted() {
    },
    methods: {
        // 代码生成
        generateCode() {
            console.log(formCode(this.tableData))
            copyText('', code)
        },
        // 删除某一项
        deleteItem(scope) {
            this.list.splice(scope.$index, 1)
        },
        fromDatByJson() {
            let schema = ''
            console.log(apiJson)
            let path = 'saveUsingPOST_1'
            let paths = apiJson.paths
            let definitions = apiJson.definitions
            Object.keys(paths).forEach((item) => {
                let methods = paths[item]
                Object.keys(methods).forEach((methodsItem) => {
                    let methodsConfig = methods[methodsItem]
                    if (methodsConfig.operationId === path) {
                        if (Array.isArray(methodsConfig.parameters) && methodsConfig.parameters.length > 0) {
                            schema =  methodsConfig.parameters[0].schema.originalRef
                        }
                    }
                })
            })
            let params = definitions[schema].properties
            console.log(params)
            const fieldList = Object.keys(params)
            fieldList.forEach(item => {
                this.tableData.push({
                    value: item,
                    label: params[item].description.slice(0, 6),
                    isParams: true, // 是否是参数
                    type: 'input'
                })
            })
        },
        async getList() {
            this.listLoading = true
            this.list = this.tableData
            this.listLoading = false
            this.oldList = this.list.map(v => v.id)
            this.newList = this.oldList.slice()
            this.$nextTick(() => {
                this.setSort()
            })
        },
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
                    const targetRow = this.list.splice(evt.oldIndex, 1)[0]
                    this.list.splice(evt.newIndex, 0, targetRow)

                    // for show the changes, you can delete in you code
                    const tempIndex = this.newList.splice(evt.oldIndex, 1)[0]
                    this.newList.splice(evt.newIndex, 0, tempIndex)
                }
            })
        }
    }
}
</script>

<style>
.app-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    /*padding: 10px;*/
    background: #999999;
}

.sortable-ghost {
    opacity: .8;
    color: #fff !important;
    background: #42b983 !important;
}
</style>

<style scoped>
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
