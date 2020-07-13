<template>
    <div class="app-container">
        <div style="margin-left: 10px">
            <span>个数：</span>
            <el-input-number v-model="itemNum" size="mini" :min="1" :max="4" label="一行展示内容" />
            <el-button style="margin: 10px" type="primary" size="mini" @click="generateCode">
                生成代码
            </el-button>
        </div>
        <!-- Note that row-key is necessary to get a correct row order. -->
        <el-table ref="dragTable" v-loading="listLoading" :data="list" row-key="id" border fit highlight-current-row
                  style="width: 100%"
        >
            <el-table-column
                    label="#"
                    type="index"
                    align="center"
                    width="50"
            />
            <el-table-column align="center" label="字段名/value">
                <template slot-scope="{row}">
                    <el-input v-model="row.value" size="mini" placeholder="请输入内容" />
                </template>
            </el-table-column>

            <el-table-column align="center" label="标题/lable">
                <template slot-scope="{row}">
                    <el-input v-model="row.label" size="mini" placeholder="请输入内容" />
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
                    <i style="font-size: 16px;color: #303133;cursor: pointer" class="el-icon-rank" />
                    <i
                            style="font-size: 16px;color: #F56C6C;margin-left: 20px;cursor: pointer"
                            class="el-icon-delete" @click="deleteItem(scope)"
                    />
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import Sortable from 'sortablejs'
import { copyText } from '@/utils'
import { code } from './code.js'

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
            apiJson: '{"email":{"type":"string","description":"邮箱"},"groupId":{"type":"integer","format":"int64","description":"所属组ID"},"isResponsible":{"type":"boolean","description":"是否为责任人：true-是，false-不是"},"isSystemUser":{"type":"boolean","description":"是否系统用户：true-是，false-不是"},"name":{"type":"string","description":"姓名"},"password":{"type":"string","description":"登录密码"},"phone":{"type":"string","description":"联系电话"},"positionId":{"type":"integer","format":"int64","description":"职位"},"roles":{"type":"array","description":"角色列表","items":{"type":"integer","format":"int64"}},"username":{"type":"string","description":"登录用户名"}}',
            tableData: [],
            typeOptions: [
                {
                    label: 'input',
                    value: 'input'
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
        console.log(666666666666666)
    },
    methods: {
        // 代码生成
        generateCode() {
            copyText('', code)
        },
        // 删除某一项
        deleteItem(scope) {
            this.list.splice(scope.$index, 1)
        },
        fromDatByJson() {
            const fromData = JSON.parse(this.apiJson)
            const fieldList = Object.keys(fromData)
            fieldList.forEach(item => {
                this.tableData.push({
                    value: item,
                    label: fromData[item].description.slice(0, 6),
                    isParams: false, // 是否是参数
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
.app-container{
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
