// /**
//  * @author 🌈先知云 <公众号：先知云，微信：zhl632231327>
//  * @date ⌚2020-09-29
//  * @description 📝 生成表格组件
//  */
//
// export default class TableCode{
//     // let apiJson = {
//     //     "email": {"type": "string", "description": "邮箱"},
//     //     "groupId": {"type": "integer", "format": "int64", "description": "所属组ID"},
//     //     "isResponsible": {"type": "boolean", "description": "是否为责任人：true-是，false-不是"},
//     //     "isSystemUser": {"type": "boolean", "description": "是否系统用户：true-是，false-不是"},
//     //     "name": {"type": "string", "description": "姓名"},
//     //     "password": {"type": "string", "description": "登录密码"},
//     //     "phone": {"type": "string", "description": "联系电话"},
//     //     "positionId": {"type": "integer", "format": "int64", "description": "职位"},
//     //     "roles": {"type": "array", "description": "角色列表", "items": {"type": "integer", "format": "int64"}},
//     //     "username": {"type": "string", "description": "登录用户名"}
//     // }
//
//     constructor(){
//
//         this.config =
//     }
//     // 生成代码的配置项
//     let config = {
//         formInfo: {
//             ref: null,
//             count: 2,
//             data: {
//                 name: null,                // 设备名称
//             },
//             fieldList: [
//                 // {label: '所属项目', value: 'projectId', type: 'slot'},
//                 // {label: '功能定义', value: 'featureIsCustomized', type: 'radio', list: 'featureIsCustomizedList'},
//             ],
//             rules: {
//                 // projectId: [{required: true, message: '请选择项目名称', trigger: ['blur', 'change']}],
//             }
//         },
//         listTypeInfo: {},
//         slotHtml: []
//     }
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
// }
