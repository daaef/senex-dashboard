import Vue from 'vue'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
import VueCountryCode from "vue-country-code-select";

Vue.use(VueCountryCode);
Vue.component('v-select', vSelect)
