import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "bootstrap/dist/css/bootstrap.css";
import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import moment from "moment";
import "material-design-iconic-font/dist/css/material-design-iconic-font.css";
import store from "@/store";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";

Vue.component("DatePicker", DatePicker);

Vue.config.productionTip = false;
Vue.prototype.$imageURL = process.env.VUE_APP_IMAGE_API_URL;
Vue.prototype.$baseURL = process.env.VUE_APP_API_URL;
Vue.prototype.$app_title = document.title;


Vue.mixin({
  methods: {
    extractUserInfo() {
      let user = localStorage.getItem("user-info") || "{}";
      this.user = JSON.parse(user);
        this.balai =  this.user.balai.id
        this.detBalai =  this.user.balai.balai_name
        this.username = this.user.username
        this.role = this.user.role.role_name
        this.token = this.user.tokens.access
    },
   
    logoutUser() {
      localStorage.clear();
      localStorage.removeItem("access");
      localStorage.removeItem("user-info");
      this.$router.push({ name: "Home" });
      window.location.reload();
      window.location.reload();
    },
  },
});

Vue.config.productionTip = false;
Vue.prototype.moment = moment;
Vue.use(VueSweetalert2);

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");

import "bootstrap/dist/js/bootstrap.js";
