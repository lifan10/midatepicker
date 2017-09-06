<template>
  <div id="app">
    <mi-datepicker v-model="date" type="date" placement="bottom-end" placeholder="选择日期" style="width: 200px"></mi-datepicker>
    <!--<router-view></router-view>-->
  </div>
</template>

<script>
    import MiDatepicker from '../src/components/date-picker/index';

export default {
        name: 'app',
        components: {
            'mi-datepicker': MiDatepicker
        },
        data () {
            return {
                date: '2017-02-01'
            };
        }
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
