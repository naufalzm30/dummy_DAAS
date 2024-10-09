import Vue from "vue";
import Vuex from "vuex";
import { getAPI } from "./axios-api";
import router from "./router";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    accessToken: localStorage.getItem("access") || "",
    status: "",
    isLoggedIn: false,
    loginTime: null,

    userStationList: [],
  },
  mutations: {
    updateStorage(state, { access }) {
      state.accessToken = access;
    },
    destroyToken(state) {
      state.accessToken = null;
    },
    setUserStationList(state, stations) {
      state.userStationList = stations;
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.accessToken,
    authStatus: (state) => state.status,
    loggedIn(state) {
      return state.accessToken != null;
    },
    getUserStationList: (state) => state.userStationList,
  },
  actions: {
    updateUserStationList({ commit }, stations) {
      commit("setUserStationList", stations);
    },
    userLogin(context, usercredentials) {
      return new Promise((resolve, reject) => {
        getAPI
          .post("/signin/", {
            username: usercredentials.username,
            password: usercredentials.password,
          })
          .then((response) => {
            localStorage.setItem("access", response.data.tokens.access);
            localStorage.setItem("userRole", response.data.role.role_name);
            localStorage.setItem("produksi", response.data.balai.balai_name);
            localStorage.setItem("user-daas", JSON.stringify(response.data));
            context.commit("updateStorage", { access: response.data.tokens });
            context.state.loginTime = new Date().getTime();
            context.state.isLoggedIn = true;
            resolve();
          })
          .catch((err) => {
            localStorage.removeItem("access");
            reject(err);
          });
      });
    },
    userLogout(context) {
        context.state.isLoggedIn = false;
        context.commit('destroyToken');
        localStorage.removeItem('access');
        localStorage.removeItem('user-daas');
        localStorage.removeItem('userRole');
        localStorage.removeItem('produksi');

        router.push({ name: 'Home' })
        location.reload();
    },

  },
});
