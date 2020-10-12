/**
 * @author 🌈先知云 <公众号：先知云，微信：zhl632231327>
 * @date ⌚2020-09-29
 * @description 📝 生成表格组件
 * 遍历传递数组，生成对应
 * 1、template
 * 2、script/data
 * 3、script/methods
 * 4、script/mounted
 */
export default class TableCode {

    constructor(apiConfig) {
        this.template = ''
        this.slot = []              //未知暂未使用
        this.slot_filter = []
        this.slot_table = []
        this.script = ''
        this.data = ''
        this.methods = []
        this.mounted = ''
        this.styles = ''
        this.tableList = []
        this.tableConfig = {}
        this.apiConfig = apiConfig
    }

    // 获取template代码片段
    getTemplate(tableConfig) {
        let slot_code_table_up = ''
        let slot_code_table_in = ''
        this.tableConfig = tableConfig
        // 技术实现
        // otherConfig 配置项


        // 1. 生成搜索按钮代码片段

        // 2. 表格顶部操作区域的插槽;
        slot_code_table_up = this.generatorSlotCodeTableUp(tableConfig.operateType_up)
        slot_code_table_up && this.slot.push(slot_code_table_up)

        slot_code_table_in = this.generatorSlotCodeTableIn(tableConfig.operateType_in)
        slot_code_table_in && this.slot.push(slot_code_table_in)

        // 4. 生成js代码片段
        let scriptCode = this.getScriptCode(tableConfig.tableList)

        // 3. 表格内部的插槽
        if (tableConfig.operateType_in.length > 0) {
            scriptCode.tableInfo.columns.push({label: '操作', prop: 'operate', type: 'slot', align: 'center'})
        }

        let html =
            `
                <vt-table-ez
                    ref="bsTable"
                    :table-config="tableConfig">
                    <!--<template #filter-name></template>-->
                     ${this.slot_filter.join('')}
                    <!-- 操作区域插槽 -->
                    <!--<template #deploy-option></template>-->
                     ${slot_code_table_up}
                    <!-- 表格插槽 -->
                    <!--<template #table-status="{scope}"></template>-->
                    ${this.slot_table.join('')}
                    ${slot_code_table_in}
                </vt-table-ez>
            `


        // 脚本文件内容
        const script =
            `<script>
                export default {
                  data () {
                    return {
                      tableConfig: {
                          filterInfo: {
                              data: {
                                 ${scriptCode.filterInfo.data.join(',\n')}
                              },
                              fieldList: [
                                  ${this.getFieldListCode(scriptCode)}
                              ]
                          },
                          filterData: ${JSON.stringify(scriptCode.filterData)},
                          tableInfo: {
                                request: {
                                    ${scriptCode.tableInfo.request.join(',\n')}
                                },
                                loading: false,
                                data: [],
                                columns: [
                                    ${this.getColumnsCode(scriptCode)}
                                ]
                            
                          }
                      }
                    }
                  },
                  computed: {},
                  watch: {},
                  created () {},
                  mounted () {},
                  methods:{
                      ${this.methods.join(',\n')}
                  }
                }
            </script>`


        let template =
            `
            <template>
                <div class="full-content">
                   ${html}
                </div>
             </template>
            `

        // 样式文件内容
        const css = `<style scoped lang="scss"></style>`
        return template + script + css
    }

    // 获取 script相关代码
    getScriptCode(tableList) {
        let config = {
            // 搜索条件
            filterInfo: {
                // 传递数据
                data: [],
                // 字段类型设计
                fieldList: [
                    // {label: '名称', type: 'slot', value: 'name'},
                    // {label: '类别', type: 'select', value: 'category', list: 'typeList'}
                ],
                // select中的数据
                listTypeInfo: {
                    // typeList: []
                }
            },
            // 搜索条件内容
            filterData: {},
            // 表格字段
            tableInfo: {
                request: ['isInit: true'],
                loading: false,
                data: [],
                columns: [
                    // {label: "模板名称", prop: "name"},
                    // {label: "状态", prop: "status", type: "slot", align: 'center', width: 100},
                ]
            }
        }

        let basePath = ''
        // TODO 使用枚举？
        switch (this.apiConfig.basePath) {
            case "/system":
                basePath = `this.$global.sys`
                break;
            default :
                basePath = `this.$global.bus`
        }
        config.tableInfo.request.push(`url:${basePath} + '${this.apiConfig.url}'`)


        tableList.forEach((item) => {
            // 搜索参数数据处理
            if (item.paramsType) {
                // data
                config.filterInfo.data.push(`${item.value}: null`)
                // 搜索条件: 获取fieldList数组
                this.getFieldList(item, config.filterInfo.fieldList)
                // 获取 listTypeInfo
                this.getListTypeInfo(item, config.filterInfo.listTypeInfo)
            }
            // 类型数据处理
            if (item.showType) {
                // columns数据生成
                this.getColumns(item, config.tableInfo.columns)
            }
        })
        return config
    }

    // 1. 获取表格列数据、
    // （2）表格中插槽代码生成
    getColumns(item, columns) {
        // 1.生成数据
        let column = {}
        column.label = item.label
        column.prop = item.value
        if (item.showType !== '默认') {
            // TODO，插槽内容，例如时间、状态、类型; 可以直接添加到组件内部使用
            column.type = 'slot'
            // 生成表格中插槽代码

            let slot_default = ''
            // a. 判断当前是时间插槽
            if (item.showType === '时间插槽:YYYY-MM-DD HH:mm:ss') {
                slot_default = `<span v-format-time="{time: scope.row.${item.value}}"></span>`
            }
            // 普通插槽，留空
            // TODO 待开发
            // b. 当前切换开关器
            // c. 当前为状态类型插槽

            let _slot =
                `
                    <template #table-${item.value}="{scope}">
                        ${slot_default}
                    </template>
                `
            this.slot_table.push(_slot)
        }
        columns.push(column)
    }

    getFieldList(item, fieldList) {

        let fieldListItem = {}
        // label
        fieldListItem.label = item.label
        // type
        if (item.paramsType === '自定义插槽') {
            fieldListItem.type = 'slot'
            // 插槽-搜索条件
            let slot_filter_item =
                `
                    <template #filter-${item.value}></template>
                `
            this.slot_filter.push(slot_filter_item)
        } else {
            fieldListItem.type = item.paramsType
        }
        if (item.type === 'select') {
            // TODO 未开发完成
            fieldListItem.list = `${item.value}List`
        }

        fieldListItem.value = item.value
        fieldList.push(fieldListItem)
    }

    getListTypeInfo(item, listTypeInfo) {
        if (item.paramsType === 'select') {
            listTypeInfo[`${item.value}List`] = []
        }
    }

    generatorSlotCodeTableUp(operateType_up) {
        if (operateType_up.length === 0) return ''
        let _slot_code = ''
        if (operateType_up && operateType_up.length) {
            operateType_up.forEach((item) => {
                // 生成按钮代码
                _slot_code += this.slotCodeButton(item)
            })
            // 最终生成代码片段
            _slot_code =
                `
                    <template #deploy-option>
                        ${_slot_code}
                    </template>
                `
        }
        return _slot_code
    }

    // 3. 表格内容操作列表
    generatorSlotCodeTableIn(operateType_in) {
        if (operateType_in.length === 0) return false
        let _slot_code = ''
        if (operateType_in && operateType_in.length) {
            operateType_in.forEach((item) => {
                // 按钮代码片段
                _slot_code += this.slotCodeButton(item)
            })
            // 最终生成代码片段
            _slot_code =
                `
                    <template #table-operate="{scope}">
                        ${_slot_code}
                    </template>
                `
        }
        return _slot_code
    }

    // 按钮代码片段
    slotCodeButton(item) {
        let slot_code = ''
        switch (item) {
            case '新增':
                slot_code =
                    `
                        <el-button
                            v-has="{role: 'add'}"
                            size="mini"
                            type="text"
                            @click="handleAdd"
                        ><i class="el-icon-plus" />新增</el-button>
                    `
                this.methods.push(
                    `
                        // 操作: 新增
                        handleAdd() {}
                    `
                )
                break;
            case '编辑':
                slot_code =
                    `
                        <el-button
                            v-has="{role: 'edit'}"
                            size="mini"
                            type="text"
                            @click="handleEdit"
                        >编辑</el-button>
                    `
                this.methods.push(
                    `
                        // 操作: 编辑
                        handleEdit() {}
                    `
                )
                break;
            case '删除':
                slot_code =
                    `
                        <el-button
                            v-has="{role: 'delete'}"
                            size="mini"
                            type="text"
                            @click="handleDelete"
                        >删除</el-button>
                    `
                this.methods.push(
                    `
                        // 操作: 删除
                        handleDelete() {}
                    `
                )
                break;

        }
        return slot_code
    }


    // 进行拼接业务代码
    getCode() {
        return this.template + this.script + this.styles
    }

    getColumnsCode(scriptCode) {
        let tmp = []
        scriptCode.tableInfo.columns.forEach((item) => {
            let _ii = []
            Object.keys(item).forEach((ii) => {
                _ii.push(`${ii}:'${item[ii]}'`)
            })
            tmp.push(`{${_ii.join(',')}}`)
        })
        return tmp.join(',\n')
    }

    getFieldListCode(scriptCode) {
        let tmp = []
        scriptCode.filterInfo.fieldList.forEach((item) => {
            let _ii = []
            Object.keys(item).forEach((ii) => {
                _ii.push(`${ii}:'${item[ii]}'`)
            })
            tmp.push(`{${_ii.join(',')}}`)
        })
        return tmp.join(',\n')
    }
}
