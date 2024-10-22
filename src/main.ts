import './assets/base.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
//import Toast, { POSITION } from "vue-toastification";
//import "vue-toastification/dist/index.css";

/// Import Bootstrap and BootstrapVue 3 CSS files
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';

// Import BootstrapVue 3 plugin
import BootstrapVue3 from 'bootstrap-vue-3';
import App from './App.vue'
import router from './router'

// const options = {
//     position: POSITION.BOTTOM_RIGHT,
//     timeout: 5000,
//     closeOnClick: true,
//     pauseOnHover: true,
//     draggable: true,
// };

// Import Bootstrap Icons globally
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.css';


import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'


const app = createApp(App)

app.use(createPinia())
/*app.use(Toast, {
    // Setting the global default position
    position: POSITION.BOTTOM_RIGHT,
    maxToasts: 2
});*/
// Use BootstrapVue 3 plugin
app.use(BootstrapVue3);
app.use(router)
//app.use(Toast, options)

app.mount('#app')
