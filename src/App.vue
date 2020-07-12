<template>
  <div id="app">
    <right-panel>
      <div>hello</div>
    </right-panel>
    <!--<iframe id="iframe" src="http://localhost:8080/#/form-code" frameborder="0"></iframe>-->
  </div>
</template>

<script>
import RightPanel from './components/RightPanel/index.vue'
export default {
  name: 'App',
  components:{
    RightPanel
  },
  mounted() {
  }
}
</script>

<style scoped>
#iframe{
  position: fixed;
  z-index: 1000;
  top: 0;
  width: 90%;
  height: 90%;
}

</style>
