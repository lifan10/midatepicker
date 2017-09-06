import Vue from 'vue';
import Router from 'vue-router';
import Hello from '../components/Hello.vue';
import MiDatepicker from '../components/date-picker/index';

Vue.use(Router);

export default new Router({
    routes: [
      {
          path: '/',
          name: 'Hello',
          component: Hello
      },
      {
          path: '/datepicker',
          name: 'datepicker',
          component: MiDatepicker
      }
    ]
});
