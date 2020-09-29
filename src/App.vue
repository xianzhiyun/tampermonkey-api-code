<template>
    <div id="app">
        <right-panel @change="panelChange">
            <form-code v-if="componentIs === 'form'" :api-table-list="apiTableList"></form-code>
            <table-code v-else :api-table-list="apiTableList"></table-code>
        </right-panel>
    </div>
</template>
<script>

import RightPanel from './components/RightPanel/index.vue'
import FormCode from '@/views/form-code/index.vue'
import TableCode from '@/views/table-code/index.vue'
import axios from "axios";

export default {
    name: 'App',
    components: {
        RightPanel,
        FormCode,
        TableCode
    },
    data() {
        return {
            all_service: [],
            // api 接口字段列表
            apiTableList: [],
            componentIs: '',
        }
    },
    mounted() {
        this.getAllService()
    },
    methods: {
        // 获取当前所有应用
        async getAllService() {
            let res = await axios.get('http://10.100.172.6:9123/swagger-resources')
            this.all_service = res.data
        },
        panelChange(isShow) {
            if (isShow) {
                // 获取所有API
                this.getCurrentApiInfo()
            }
        },
        // 获取当前URL信息
        async getCurrentApiInfo() {
            let path_url = decodeURIComponent(location.hash)
            let path_params = path_url.split('/')
            if (path_params.length !== 4) return false
            let current_service_name = path_params[1]
            let operationId = path_params[3]
            let current_service = this.all_service.filter(item => item.name === current_service_name)
            let current_api_docs = await axios.get(`http://10.100.172.6:9123/${current_service[0].url}`)
            if (current_api_docs.data) {
                let _api_tableData = this.getFieldListByDocs(current_api_docs.data, operationId)
                this.apiTableList = JSON.parse(JSON.stringify(_api_tableData))
            }
        },
        // 将对应信息转化成 table数据, api-docs 内容结构，http://10.100.172.6:9123/system/v2/api-docs
        getFieldListByDocs(apiJson, operationId) {
            let _tableData = []
            let originalRef = ''
            let paths = apiJson.paths
            let definitions = apiJson.definitions
            let apiInfo = ''   // api请求相关配置
            // 1. 获取api相关信息内容
            Object.keys(paths).some((item) => {
                let methods = paths[item]
                let flag = Object.keys(methods).some((methodsItem) => {
                    let methodsConfig = methods[methodsItem]
                    if (methodsConfig.operationId === operationId) {
                        methodsConfig.methods = methodsItem
                        apiInfo = methodsConfig
                        return true
                    }
                })
                return flag
            })

            // 2.判断当前请求是get请求还是post请求
            if (apiInfo.methods === 'post') {
                // 生成表单数据
                return this.handleFormToList(apiInfo, originalRef, definitions)
            } else {
                // 生成表格数据
                return this.handleTableToList(apiInfo, definitions)
            }
        },
        // 处理表单
        handleFormToList(apiInfo, originalRef, definitions) {
            let _tableData = []
            this.componentIs = 'form'
            originalRef = apiInfo.parameters[0].schema.originalRef
            let params = definitions[originalRef].properties
            const fieldList = Object.keys(originalRef)
            // 整理代码结构
            fieldList.forEach((item, index) => {
                _tableData.push({
                    id: index,
                    value: item,
                    label: params[item].description.slice(0, 20),
                    isParams: true, // 是否是参数
                    type: 'input'
                })
            })
            return _tableData
        },
        // 处理表格
        handleTableToList(apiInfo, definitions) {
            let _tableData = []
            this.componentIs = 'table'
            // get请求是生成 生成表格代码
            let properties = []
            let originalRef = apiInfo.responses[200].schema.originalRef
            let originalRef_01 = definitions[originalRef].properties.data.originalRef
            let originalRef_02 = definitions[originalRef_01].properties.list.items.originalRef
            properties = definitions[originalRef_02].properties
            // 整理代码结构
            Object.keys(properties).forEach((item, index) => {
                let _current = {
                    id: index,
                    value: item,
                    label: properties[item].description.slice(0, 20),
                    isParams: this.setSearchParams(item.toLocaleLowerCase()),  // 是否作为搜索参数
                    showType: this.getShowTypeValue(item, properties[item])
                }
                if (item !== 'id') {
                    _tableData.push(_current)
                }
            })
            // 按照指定规则实现排序
            this.sortable(_tableData)
            return _tableData
        },
        // 搜索参数-类型,
        setSearchParams(field) {
            // 默认搜索配置项
            let arr = ['name', 'status', 'time']
            let flag = arr.some((i) => {
                return field.includes(i)
            })
            return flag
        },
        // 插槽-类型
        getShowTypeValue(item, property) {
            let _item = item.toLocaleLowerCase()
            // 判断当前是否是时间
            if (property.format && property.format === 'date-time') {
                return "时间插槽:YYYY-MM-DD HH:mm:ss"
            }
            // 状态切换
            if (_item.includes('status')) {
                return "切换开关"
            } else if (property.type === "boolean") {
                return "普通插槽"
            }
            return "默认"
        },

        // 排序-显示字段排序
        sortable(objs) {
            let start = ['name','code']
            let end = ['time', 'status']
            this.sortByArr(objs, start,'start')
            this.sortByArr(objs, end,'end')
        },
        // 根据数组内容实现排序
        sortByArr(objs, order, rule) {
            objs.sort((a, b) => {
                // order是规则bai  objs是需要排序的数du组
                if (rule === 'start'){
                    return this.getIndex(order, b.value.toLocaleLowerCase()) - this.getIndex(order, a.value.toLocaleLowerCase())
                }else{
                    return this.getIndex(order, a.value.toLocaleLowerCase()) - this.getIndex(order, b.value.toLocaleLowerCase())
                }
            });
        },
        // 获取索引
        getIndex(order, value) {
            return order.findIndex((item) => {
                return value.includes(item)
            })
        }
    },

}
</script>

<style scoped lang="scss">
</style>
