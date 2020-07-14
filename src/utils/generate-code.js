/* 表单生成的代码 */
export const formCode = (data) => {
    let apiJson = {
        "email": {"type": "string", "description": "邮箱"},
        "groupId": {"type": "integer", "format": "int64", "description": "所属组ID"},
        "isResponsible": {"type": "boolean", "description": "是否为责任人：true-是，false-不是"},
        "isSystemUser": {"type": "boolean", "description": "是否系统用户：true-是，false-不是"},
        "name": {"type": "string", "description": "姓名"},
        "password": {"type": "string", "description": "登录密码"},
        "phone": {"type": "string", "description": "联系电话"},
        "positionId": {"type": "integer", "format": "int64", "description": "职位"},
        "roles": {"type": "array", "description": "角色列表", "items": {"type": "integer", "format": "int64"}},
        "username": {"type": "string", "description": "登录用户名"}
    }

    // 生成代码的配置项
    let config = {
        formInfo: {
            ref: null,
            count: 3,
            data: {
                name: null,                // 设备名称
            },
            fieldList: [
                {label: '所属项目', value: 'projectId', type: 'slot'},
                {label: '功能定义', value: 'featureIsCustomized', type: 'radio', list: 'featureIsCustomizedList'},
            ],
            rules: {
                projectId: [{required: true, message: '请选择项目名称', trigger: ['blur', 'change']}],
            }
        },
        listTypeInfo: {},
        slotHtml: []
    }
    // 对数据遍历，处理结果
    data.forEach((item) => {
        // config.formInfo.data[item] = null
        let fieldItem = {
            label: item.label,
            value: item.value,
            type: item.type,
        }
        switch (item.type) {
            case 'slot':
                // 需要在html生成代码片段
                //? 帮我插进去一个插槽吧
                config.slotHtml.push(`<template #form-${item.value}></template>`)
                break
            /*case 'select':
                let field = item[`${item.value}Option`]
                if (item[`${item.value}Option`]){
                    config.listTypeInfo.item[`${item.value}Option`]
                }*/
        }
        config.formInfo.fieldList.push(fieldItem)
    })
    // html 代码片段
    let html = `<vt-form
                  ref="vtForm"
                  :ref-obj.sync="formInfo.ref"
                  :data="formInfo.data"
                  :field-list="formInfo.fieldList"
                  :rules="formInfo.rules"
                  :count="formInfo.count"
                  label-position="left"
                >${config.slotHtml.join('\n')}</vt-form>`
    // js代码
    const js =
        `export default {
          data () {
            return {
              formInfo: ${config.formInfo},
              listTypeInfo: ${config.listTypeInfo}
            }
          },
          computed: {},
          watch: {},
          created () {},
          mounted () {},
        }`


}
