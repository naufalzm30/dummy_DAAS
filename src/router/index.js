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
import User from "@/views/User/List.vue";
import AddUser from "@/views/User/Add.vue";
import Notification from "@/views/Notification/List.vue";

// import Produksi from "@/views/Produksi/List.vue";
// import AddProduksi from "@/views/Produksi/Add.vue";
// import UpdateUser from "@/views/User/Update.vue";


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
  next("/app/login");
};

// New role-based guard
const ifAuthorized = (role) => (to, from, next) => {
  const userRole = store.getters.userRole || localStorage.getItem('userRole'); // Get role from Vuex or localStorage
  if (store.getters.isAuthenticated && userRole === role) {
    next();
  } else {
    next("/"); // Redirect to home or an unauthorized page if role check fails
  }
};

let routes = [];

  routes.push({
    path: "/",
    component: Home,
    name: "Home",
    beforeEnter: ifAuthenticated,
  });


routes.push(
  {
    path: "/app/login",
    component: Login,
    name: "Login",
    beforeEnter: ifNotAuthenticated,
  },
  {
    path: "/app/logout",
    component: Logout,
    name: "Logout",
    beforeEnter: ifAuthenticated,
  },
  {
    path: "/app/station",
    component: Station,
    name: "Station",
    beforeEnter: ifAuthenticated,
  },
  {
    path: "/app/station/add",
    component: AddStation,
    name: "AddStation",
    beforeEnter: ifAuthorized("SuperAdmin"),
  },
  {
    path: "/app/station/update/:id",
    name: "UpdateStation",
    component: UpdateStation,
    beforeEnter: ifAuthorized("SuperAdmin"),
  },
  {
    path: "/app/station/data/:id",
    name: "DataStation",
    component: DataStation,
    beforeEnter: ifAuthenticated,
  },
  {
    path: "/app/user",
    component: User,
    name: "User",
    beforeEnter: ifAuthorized("SuperAdmin"),
  },
  {
    path: "/app/user/add",
    component: AddUser,
    name: "AddUser",
    beforeEnter: ifAuthorized("SuperAdmin"),
  },
  {
    path: "/app/notification",
    component: Notification,
    name: "Notification",
    beforeEnter: ifAuthorized("SuperAdmin"),
  },
  {
    path: "/app/:pathMatch(.*)*",
    component: E_404,
  }
);

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  // base: process.env.VUE_APP_API_URL,
  routes,
});

export default router;
