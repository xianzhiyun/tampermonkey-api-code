/**
 * @author 🌈先知云 <公众号：先知云，微信：zhl632231327>
 * @date ⌚2020-09-29
 * @description 📝 生成表格组件
 */

export default class TableCode {

    constructor() {
        this.config = {
            // 搜索条件
            filterInfo: {
                // 传递数据
                data: {
                    name: null,
                    category: null
                },
                // 字段类型设计
                fieldList: [
                    {label: '模板名称', type: 'slot', value: 'name'},
                    {label: '质检类别', type: 'select', value: 'category', list: 'typeList'}
                ],
                // select中的数据
                listTypeInfo: {
                    typeList: [
                        {id: 1, name: '成品检'},
                        {id: 2, name: '首件检'},
                        {id: 3, name: '工序检'},
                    ]
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
        this.template = ''
        this.script = ''
        this.styles = ''
    }

    // 获取template代码片段
    getTemplate() {
        let html =
            `
                <vt-table-ez
                    ref="bsTable"
                    :table-config="tableConfig">
                    <!---->
                    <!--<template #filter-name></template>-->
        
                    <!-- 操作区域插槽 -->
                    <!--<template #deploy-option></template>-->
        
                    <!-- 表格插槽 -->
                    <!--<template #table-status="{scope}"></template>-->
        
                </vt-table-ez>
            `




        // let template =
        //     `
        //     <template>
        //         <div class="full-content">
        //         </div>
        //      </template>
        //     `
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
