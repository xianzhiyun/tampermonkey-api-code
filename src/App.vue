<template>
  <div id="app">
    <right-panel>
      <form-code></form-code>
    </right-panel>
    <!--<iframe id="iframe" src="http://localhost:8080/#/form-code" frameborder="0"></iframe>-->
  </div>
</template>

<script>
import RightPanel from './components/RightPanel/index.vue'
import FormCode from '@/views/form-code/index.vue'
export default {
  name: 'App',
  components:{
    RightPanel,
    FormCode
  },
  mounted() {
  }
}
</script>

<style scoped lang="scss">
#iframe{
  position: fixed;
  z-index: 1000;
  top: 0;
  width: 90%;
  height: 90%;
}

</style>
