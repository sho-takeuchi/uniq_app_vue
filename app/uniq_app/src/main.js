import Vue from 'vue'
import App from './App.vue'
import router from './router'
import firebase from 'firebase/app'
import 'firebase/firestore'
import "firebase/auth";
import axios from 'axios'
import VueAxios from 'vue-axios'

import vuetify from './plugins/vuetify';

Vue.config.productionTip = false
// Vue.prototype.$axios = axios
// axios.defaults.withCredentials = true; // global に設定してしまう場合

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: "AIzaSyDLklKnRc5oCoIlklBzWDPkfAe9RAa7Ia0",
  authDomain: "unic-app-7f6c2.firebaseapp.com",
  projectId: "unic-app-7f6c2",
  storageBucket: "unic-app-7f6c2.appspot.com",
  messagingSenderId: "1090298877063",
  appId: "1:1090298877063:web:93f6a36618ba05d83b1422",
  measurementId: "G-ZESJ3W80SD"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.functions();
firebase.analytics();

Vue.use(VueAxios, axios)

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
