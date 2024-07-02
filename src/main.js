import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "bootstrap/dist/css/bootstrap.css";
import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import Vue2LeafletMarkerCluster from "vue2-leaflet-markercluster";
import VueCarousel from "vue-carousel";
import moment from "moment";
import "material-design-iconic-font/dist/css/material-design-iconic-font.css";
import axios from "axios";
import store from "@/store";
import HighchartsVue from "highcharts-vue";
import inactivityDirective from "./inactivityDirective.js";
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';

Vue.component('DatePicker', DatePicker);


Vue.config.productionTip = false;
Vue.directive("inactivity", inactivityDirective);
Vue.use(HighchartsVue);
// Vue.prototype.$baseURL = 'http://127.0.0.1:8000'
Vue.prototype.$baseURL = "https://pdamsby.blitztechnology.tech/api";
Vue.prototype.$imageURL = "https://pdamsby.blitztechnology.tech";
// Vue.prototype.$baseURL = "https://weatherapi.blitztechnology.tech";

//PROXY
// Vue.prototype.$proxyBaseUrl = "https://weatherapi.blitztechnology.tech"
Vue.prototype.$proxyFixedBalai = 6
//

Vue.prototype.$app_title = document.title;

if (document.title == "PDAM SURYA SEMBADA") {
  Vue.prototype.$fixedBalai = 6;
}

Vue.mixin({
  methods: {
    gAuthCheck() {
      this.extractUserInfo();
      if (typeof this.user === "object" && this.role !== "is_superuser") {
        localStorage.clear();
        this.$router.push({ name: "Login" });
      }
    },
    gAuthUser() {
      this.extractUserInfo();

      this.user_id =
        this.user &&
        this.user.profile &&
        this.user.profile.user &&
        this.user.profile.user.id;
      if (typeof this.user !== "object") {
        localStorage.clear();
        this.$router.push({ name: "Login" });
      }
      if (this.role === "is_superuser") {
        this.balai = 0;
      }
    },
    gAuthStation() {
      this.extractUserInfo();
      this.user_id =
        this.user &&
        this.user.profile &&
        this.user.profile.user &&
        this.user.profile.user.id;
      if (typeof this.user !== "object") {
        localStorage.clear();
        this.$router.push({ name: "Login" });
      }
      if (this.role === "is_superuser") {
        this.balai = 0;
      }
    },
    extractUserInfo() {
      let user = localStorage.getItem("user-info") || "{}"; 
      this.user = JSON.parse(user);
      if (typeof this.user !== "object") {
        this.user = ""; 
      }
      this.balai =
        this.user &&
        this.user.profile &&
        this.user.profile.balai &&
        this.user.profile.balai.id;
      this.detBalai = this.user && this.user.profile && this.user.profile.balai;
      this.created_by =
        this.user && this.user.profile && this.user.profile.created_by;
      this.role = this.user && this.user.profile && this.user.profile.role;
      this.token = this.user && this.user.token;
      this.profile = this.user && this.user.profile
    },
 
    async gIcons() {
      this.icons = await this.fetchData(`${this.$baseURL}/icon/`);
    },
  
    async fetchData(url) {
      try {
        if (!this.token) {
          this.logoutUser();
          return null;
        }

        const response = await axios.get(url, {
          headers: {
            Authorization: `Token ${this.token}`,
          },
        });

        return response.data;
      } catch (error) {
        if (error.response) {
          const status = error.response.status;

      
          if (status === 401 || status === 403) {
            this.logoutUser();
          }

          console.error(error.response);
        } else {
          console.error(error);
        }

        return null;
      }
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
Vue.component("v-marker-cluster", Vue2LeafletMarkerCluster);
Vue.use(VueSweetalert2);
Vue.use(VueCarousel);

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
