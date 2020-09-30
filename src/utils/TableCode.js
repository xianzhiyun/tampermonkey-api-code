/**
 * @author 🌈先知云 <公众号：先知云，微信：zhl632231327>
 * @date ⌚2020-09-29
 * @description 📝 生成表格组件
 */

export default class TableCode {

    constructor() {
        this.template = ''
        this.slot = []
        this.slot_filter = []
        this.slot_table = []
        this.script = ''
        this.data = ''
        this.methods = []
        this.mounted = ''
        this.styles = ''
        this.tableList = []
        this.tableConfig = {}
    }

    // 获取template代码片段
    getTemplate(tableConfig) {
        let slot_code_table_up = ''
        let slot_code_table_in = ''
        this.tableConfig = tableConfig
        // 技术实现
        // otherConfig 配置项

        console.log(`%c getTemplate`, 'font-size: 16px; font-weight: bold;color:green', tableConfig);

        // 1. 生成搜索按钮代码片段

        // 2. 表格顶部的插槽
        slot_code_table_up = this.generatorSlotCodeTableUp(tableConfig.operateType_up)
        this.slot.push(slot_code_table_up)

        // 3. 表格内部的插槽
        slot_code_table_in = this.generatorSlotCodeTableIn(tableConfig.operateType_in)
        this.slot.push(slot_code_table_in)

        // 4. 生成js代码片段
        let scriptCode =  this.getScriptCode(tableConfig.tableList)

        let html =
            `
                <vt-table-ez
                    ref="bsTable"
                    :table-config="tableConfig">
                    <!---->
                    <!--<template #filter-name></template>-->
                     ${this.slot_filter.join('')}
                    <!-- 操作区域插槽 -->
                    <!--<template #deploy-option></template>-->
                     ${slot_code_table_up}
                    <!-- 表格插槽 -->
                    <!--<template #table-status="{scope}"></template>-->
                    ${this.slot_table.join('')}

                </vt-table-ez>
            `


        console.log(`%c getTemplate`, 'font-size: 16px; font-weight: bold;color: green', html);

        // let template =
        //     `
        //     <template>
        //         <div class="full-content">
        //         </div>
        //      </template>
        //     `
    }

    // 获取 script相关代码
    getScriptCode(tableList) {
        let config = {
            // 搜索条件
            filterInfo: {
                // 传递数据
                data: {
                    name: null,
                    category: null
                },
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
                loading: false,
                data: [],
                columns: [
                    {label: "模板名称", prop: "name"},
                    {label: "编号", prop: "code", width: 180, sortable: true},
                    {label: "质检类别", prop: "typeName"},
                    {label: "版本号", prop: "versionNo"},
                    {label: "状态", prop: "status", type: "slot", align: 'center', width: 100},
                ]
            }
        }
        tableList.forEach((item) => {
            // data 添加内容
            if (item.paramsType) {
                // data
                config.filterInfo.data[item.value] = null
                // 获取fieldList数组
                this.getFieldList(item, config.filterInfo.fieldList)
                // 获取 listTypeInfo
                this.getListTypeInfo(item, config.filterInfo.listTypeInfo)
                // columns数据生成
                this.getColumns(item, config.tableInfo.columns)
            }

        })
        return config
    }

    // 获取表格列数据
    getColumns(item, columns) {
        // 1.生成数据
        let column = {}
        column.label = item.label
        column.prop = item.prop
        if (item.showType !== '默认'){
            // TODO，插槽内容，例如时间、状态、类型; 可以直接添加到组件内部使用
            column.type = 'slot'
            // 生成表格中插槽代码
            let _slot =
                `
                <template #table-${item.value}="{scope}">
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
        if (operateType_up.length === 0) return false
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

    // 表格内容操作列表
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
                            type="primary"
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
                            type="primary"
                            @click="handleAdd"
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
                            type="primary"
                            @click="handleDelete"
                        >删除</el-button>
                    `
                this.methods.push(
                    `
                        // 操作: 删除
                        handleAdd() {}
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

    //
//     // 对数据遍历，处理结果
//     data.forEach((item) => {
//     // config.formInfo.data[item] = null
//     let fieldItem = {
//         label: item.label,
//         value: item.value,
//         type: item.type,
//         required: item.required,
//     }
//     // 传递数据data
//     if (item.isParams){
//     config.formInfo.data[item.value] = null
// }
//
// // 判断是否需要插槽
// switch (item.type) {
//     case 'slot':
//         // 需要在html生成代码片段
//         //? 帮我插进去一个插槽吧
//         config.slotHtml.push(`<template #form-${item.value}></template>`)
//         break
//     case 'select':
//         // 设置option内容
//         let field = item[`${item.value}Option`]
//         config.listTypeInfo[field] = []
//         break
//     // 图片... 上传统一
// }
// config.formInfo.fieldList.push(fieldItem)
//
// // 添加rules
// if (item.required) {
//     config.formInfo.rules[item.value] = [
//         {
//             required: true,
//             message: `请${item.type === 'input' ? '输入' : '选择'}${item.label}`,
//             trigger: ['blur', 'change']
//         }
//     ]
// }
//
// })
// // html 代码片段
// let html = `<template>
//                 <vt-form
//                 ref="vtForm"
//                 :ref-obj.sync="formInfo.ref"
//                 :data="formInfo.data"
//                 :field-list="formInfo.fieldList"
//                 :rules="formInfo.rules"
//                 :count="formInfo.count"
//                 label-position="top"
//                 >${config.slotHtml.join('\n')}</vt-form>
//             </template>`
// // js代码
// const script =
//     `<script>
//             export default {
//               data () {
//                 return {
//                   formInfo: ${JSON.stringify(config.formInfo)},
//                   listTypeInfo: ${JSON.stringify(config.listTypeInfo)}
//                 }
//               },
//               computed: {},
//               watch: {},
//               created () {},
//               mounted () {},
//             }
//         </script>`
// const css = `<style scoped lang="scss"></style>`
// return html + script + css
}
