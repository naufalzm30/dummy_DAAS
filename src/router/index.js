import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store";
import Home from "@/views/Home.vue";
import Login from "@/views/Login.vue";
import E_404 from "@/views/E_404.vue";
import Logout from "@/views/Logout";
import Station from "@/views/Station/List.vue";
import AddStation from "@/views/Station/Add.vue";
import UpdateStation from "@/views/Station/Update.vue";
import DataStation from "@/views/Station/Data.vue";
import Balai from "@/views/Balai/List.vue";
import AddBalai from "@/views/Balai/Add.vue";
import UpdateBalai from "@/views/Balai/Update.vue";
import User from "@/views/User/List.vue";
import AddUser from "@/views/User/Add.vue";
import UpdateUser from "@/views/User/Update.vue";
import Sensor from "@/views/Sensor/List.vue";
import AddSensor from "@/views/Sensor/Add.vue";
import UpdateSensor from "@/views/Sensor/Update.vue";
import Provinsi from "@/views/Provinsi/List.vue";
import AddProvinsi from "@/views/Provinsi/Add.vue";
import UpdateProvinsi from "@/views/Provinsi/Update.vue";
import Logger from "@/views/Logger/List.vue";
import AddLogger from "@/views/Logger/Add.vue";
import UpdateLogger from "@/views/Logger/Update.vue";
import Modem from "@/views/Modem/List.vue";
import AddModem from "@/views/Modem/Add.vue";
import UpdateModem from "@/views/Modem/Update.vue";
import Icon from "@/views/Icon/List.vue";
import AddIcon from "@/views/Icon/Add.vue";
import UpdateIcon from "@/views/Icon/Update.vue";
import Backup from "@/views/B_ackup/List.vue";
import AddBackup from "@/views/B_ackup/Add.vue";
import UpdateBackup from "@/views/B_ackup/Update.vue";
import SensorMod from "@/views/SensorMod/List.vue";

Vue.use(VueRouter);

const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters.isAuthenticated) {
    next();
    return;
  }
  next("/");
};

const ifAuthenticated = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    next();
    return;
  }
  next("/login");
};

let routes = [];

// if (document.title == "WEATHER-VUE") {
  routes.push({
    path: "/",
    component: Home,
    name: "Home",
    // beforeEnter: ifAuthenticated,
  });
// } else {
//   routes.push({
//     path: "/",
//     component: Home,
//     name: "Home",
//   });
// }

routes.push(
  {
    path: "/login",
    component: Login,
    name: "Login",
    beforeEnter: ifNotAuthenticated,
  },
  {
    path: "/logout",
    component: Logout,
    name: "Logout",
    beforeEnter: ifAuthenticated,
  },
  {
    path: "/station/:balai_id",
    component: Station,
    name: "Station",
    beforeEnter: ifAuthenticated,
  },
  {
    path: "/station/:balai_id/add",
    component: AddStation,
    name: "AddStation",
    beforeEnter: ifAuthenticated,
  },
  {
    path: "/station/update/:balai_id/:id",
    name: "UpdateStation",
    component: UpdateStation,
    beforeEnter: ifAuthenticated,
  },
  {
    path: "/station/data/:id/:user_id",
    name: "DataStation",
    component: DataStation,
    beforeEnter: ifAuthenticated,
  },

  {
    path: "/user/:balai_id",
    component: User,
    name: "User",
    beforeEnter: ifAuthenticated,
  },
  {
    path: "/user/:balai_id/add",
    component: AddUser,
    name: "AddUser",
    beforeEnter: ifAuthenticated,
  },
  {
    path: "/user/update/:balai_id/:id",
    name: "UpdateUser",
    component: UpdateUser,
    beforeEnter: ifAuthenticated,
  },
  {
    path: "/sensor",
    component: Sensor,
    name: "Sensor",
    beforeEnter: ifAuthenticated,
  },
  {
    path: "/sensor/add",
    component: AddSensor,
    name: "AddSensor",
    beforeEnter: ifAuthenticated,
  },
  {
    path: "/sensor/update/:id",
    name: "UpdateSensor",
    component: UpdateSensor,
    beforeEnter: ifAuthenticated,
  },
  {
    path: "/balai",
    component: Balai,
    name: "Balai",
    beforeEnter: ifAuthenticated,
  },
  {
    path: "/balai/add",
    component: AddBalai,
    name: "AddBalai",
    beforeEnter: ifAuthenticated,
  },
  {
    path: "/balai/update/:id",
    name: "UpdateBalai",
    component: UpdateBalai,
    beforeEnter: ifAuthenticated,
  },
  {
    path: "/provinsi",
    component: Provinsi,
    name: "Provinsi",
    beforeEnter: ifAuthenticated,
  },
  {
    path: "/provinsi/add",
    component: AddProvinsi,
    name: "AddProvinsi",
    beforeEnter: ifAuthenticated,
  },
  {
    path: "/provinsi/update/:id",
    name: "UpdateProvinsi",
    component: UpdateProvinsi,
    beforeEnter: ifAuthenticated,
  },
  {
    path: "/logger",
    component: Logger,
    name: "Logger",
    beforeEnter: ifAuthenticated,
  },
  {
    path: "/logger/add",
    component: AddLogger,
    name: "AddLogger",
    beforeEnter: ifAuthenticated,
  },
  {
    path: "/logger/update/:id",
    name: "UpdateLogger",
    component: UpdateLogger,
    beforeEnter: ifAuthenticated,
  },
  {
    path: "/modem",
    component: Modem,
    name: "Modem",
    beforeEnter: ifAuthenticated,
  },
  {
    path: "/modem/add",
    component: AddModem,
    name: "AddModem",
    beforeEnter: ifAuthenticated,
  },
  {
    path: "/modem/update/:id",
    name: "UpdateModem",
    component: UpdateModem,
    beforeEnter: ifAuthenticated,
  },
  {
    path: "/icon",
    component: Icon,
    name: "Icon",
    beforeEnter: ifAuthenticated,
  },
  {
    path: "/icon/add",
    component: AddIcon,
    name: "AddIcon",
    beforeEnter: ifAuthenticated,
  },
  {
    path: "/icon/update/:id",
    name: "UpdateIcon",
    component: UpdateIcon,
    beforeEnter: ifAuthenticated,
  },
  {
    path: "/backup",
    component: Backup,
    name: "Backup",
    beforeEnter: ifAuthenticated,
  },
  {
    path: "/backup/add",
    component: AddBackup,
    name: "AddBackup",
    beforeEnter: ifAuthenticated,
  },
  {
    path: "/backup/update/:id",
    name: "UpdateBackup",
    component: UpdateBackup,
    beforeEnter: ifAuthenticated,
  },
  {
    path: "/sensormod",
    component: SensorMod,
    name: "SensorMod",
    beforeEnter: ifAuthenticated,
  },
  // {
  //     path: '/:pathMatch(.*)*',
  //     component: Login
  // },
  {
    path: "/:pathMatch(.*)*",
    component: E_404,
  }
);

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
