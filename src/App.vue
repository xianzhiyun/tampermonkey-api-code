<template>
    <div id="app">
        <right-panel @change="panelChange">
            <form-code :api-table-list="apiTableList"></form-code>
        </right-panel>
    </div>
</template>

<script>

import RightPanel from './components/RightPanel/index.vue'
import FormCode from '@/views/form-code/index.vue'
import axios from "axios";

export default {
    name: 'App',
    components: {
        RightPanel,
        FormCode
    },
    data() {
        return {
            all_service: [],
            // api 接口字段列表
            apiTableList: []
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
            console.log(`%c 改变了`, 'font-size: 16px; font-weight: bold;color:green', isShow);
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
        getFieldListByDocs(apiJson, path) {
            let _tableData = []
            let schema = ''
            let paths = apiJson.paths
            let definitions = apiJson.definitions
            Object.keys(paths).forEach((item) => {
                let methods = paths[item]
                Object.keys(methods).forEach((methodsItem) => {
                    let methodsConfig = methods[methodsItem]
                    if (methodsConfig.operationId === path) {
                        if (Array.isArray(methodsConfig.parameters) && methodsConfig.parameters.length > 0) {
                            schema = methodsConfig.parameters[0].schema.originalRef
                        }
                    }
                })
            })
            let params = definitions[schema].properties
            const fieldList = Object.keys(params)
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
    },
}
</script>

<style scoped lang="scss">
</style>
