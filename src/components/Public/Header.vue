<template>
  <div id="nav">

    <div v-show="isMobileView" style="background: #68C0FF" class="p-2">
      <button class="toggle-button" @click="toggleSidebar()" v-show="isMobileView">
        <span :class="className"></span>
        <span :class="className"></span>
        <span :class="className"></span>
      </button>
    </div>

    <div v-if="!isMobileView" id="mySidebar" :class="{ sidebar: true, 'sidebar-open': sidebarOpen }"
      v-show="!isMobileView || sidebarOpen" @mouseover="toggleSidebar()" @mouseleave="toggleOut()"
      style="z-index: 91000">

      <ul>
        <li class="centered-image">
          <img :src="logoPDAM" class="mobile-icon" style="max-width: 50px" />
        </li>

        <li v-if="this.user.role.role_name == 'SuperAdmin'" class="centered-image pt-2"
          style="font-size: 0.7rem; color: #092581;">SADM </li>
        <li v-else-if="this.user.role.role_name == 'Admin'" class="centered-image pt-2"
          style="font-size: 0.7rem; color: #092581;">ADM</li>
        <li v-else-if="this.user.role.role_name == 'Guest'" class="centered-image pt-2"
          style="font-size: 0.7rem; color: #092581;">TAMU</li>
        <li v-else-if="this.user.role.role_name == 'QA'" class="centered-image pt-2"
          style="font-size: 0.7rem; color: #092581;">QA</li>
        <li v-else-if="this.user.role.role_name == 'Direksi'" class="centered-image pt-2"
          style="font-size: 0.7rem; color: #092581;">Direksi</li>
        <li v-else class="centered-image" style="font-size: 0.7rem; color: #092581;">{{ this.user.username }}</li>
        <li v-if="this.user.role.role_name == 'Admin'" class="centered-image pt-2"
          style="font-size: 0.7rem; color: #092581;">{{ this.user.balai.balai_name }}</li>
        <li class="my-1 mt-3">
          <router-link :to="{ name: 'Home', params: { balai_id: this.balai } }"
            style="display: flex; flex-direction: row" class="active" aria-current="page">
            <img :src="dash_i" class="mr-4" /><span>Dashboard</span>
          </router-link>
        </li>

        <!-- <li v-if="accessToken"></li>
        <div v-else>
          <li class="my-1">
            <hr style="color: white" />
            <router-link :to="{ name: 'Login', params: { balai_id: this.balai } }"
              style="display: flex; flex-direction: row; z-index: 100;">
              <img :src="login_i" class="mr-4" /><span>Sign In</span>
            </router-link>
          </li>
        </div> -->


        <li v-if="accessToken" class="nav-item my-1">
          <router-link :to="{
            name: 'Station',
            params: { balai_id: this.balai, user_id: user_id },
          }" style="display: flex; flex-direction: row">
            <img :src="stat_i" class="mr-4" /><span>Stasiun</span>
          </router-link>
        </li>
        
        <li v-if="accessToken" class="nav-item my-1">
          <router-link :to="{
            name: 'User',
            params: { balai_id: this.balai },
          }" style="display: flex; flex-direction: row" v-if="this.user.role.role_name == 'SuperAdmin'">
            <img :src="user_i" class="mr-4" /><span>User</span>
          </router-link>
        </li>
        <!-- <li v-if="accessToken" class="nav-item my-1">
          <router-link :to="{
            name: 'Produksi',
            params: { balai_id: this.balai },
          }" style="display: flex; flex-direction: row" v-if="this.user.role.role_name == 'SuperAdmin'">
            <img :src="stat_i" class="mr-4" /><span>Produksi</span>
          </router-link>
        </li> -->
        <hr style="color: white" />
        <li v-if="accessToken" class="nav-item my-1">
          <router-link v-if="this.user.role.role_name == 'SuperAdmin'" :to="{
            name: 'Notification',
          }" style="display: flex; flex-direction: row">
            <img :src="notif_i" class="mr-4" /><span>Notifikasi</span>
          </router-link>
        </li>
        <li v-if="accessToken" class="my-1">
          
          <router-link :to="{ name: 'Logout', params: { balai_id: this.balai } }"
            style="display: flex; flex-direction: row">
            <img :src="login_i" class="mr-4" /><span>Sign Out</span>
          </router-link>
        </li>

      </ul>
    </div>

    <div v-else id="mySidebar" :class="{ sidebar: true, 'sidebar-open': sidebarOpen }"
      v-show="!isMobileView || sidebarOpen" style="z-index: 1000">

      <ul>
        <li class="centered-image">
          <!-- <img v-if="$app_title == 'WEATHER-VUE'" :src="logoBT" class="mobile-icon" style="max-width: 50px" /> -->
          <img :src="logoPDAM" class="mobile-icon" style="max-width: 50px" />

        </li>
        <li v-if="this.user.role.role_name == 'SuperAdmin'" class="centered-image pt-2"
          style="font-size: 0.7rem; color: #092581;">SADM</li>
        <li v-else-if="this.user.role.role_name == 'Admin'" class="centered-image pt-2"
          style="font-size: 0.7rem; color: #092581;">ADM</li>
        <li v-else-if="this.user.role.role_name == 'Guest'" class="centered-image pt-2"
          style="font-size: 0.7rem; color: #092581;">TAMU</li>
        <li v-else-if="this.user.role.role_name == 'QA'" class="centered-image pt-2"
          style="font-size: 0.7rem; color: #092581;">QA</li>
        <!-- <li class="centered-image" style="font-size: 0.7rem; color: #092581;">{{ this.user.username }}</li> -->
        <li v-if="this.user.role.role_name == 'Admin'" class="centered-image pt-2"
        style="font-size: 0.7rem; color: #092581;">{{ this.user.balai.balai_name }}</li>
        <li class="my-1 mt-3">
          <router-link :to="{ name: 'Home', params: { balai_id: this.balai } }"
            style="display: flex; flex-direction: row" class="active" aria-current="page">
            <img :src="dash_i" class="mr-4" /><span>Dashboard</span>
          </router-link>
        </li>

        <li v-if="accessToken"></li>
        <div v-else>
          <li class="my-1">
            <hr style="color: white" />
            <router-link :to="{ name: 'Login', params: { balai_id: this.balai } }"
              style="display: flex; flex-direction: row; z-index: 100;">
              <img :src="login_i" class="mr-4" /><span>Sign In</span>
            </router-link>
          </li>
        </div>
        <li v-if="accessToken" class="nav-item my-1">
          <router-link :to="{
            name: 'Station',
            params: { balai_id: this.balai, user_id: user_id },
          }" style="display: flex; flex-direction: row">
            <img :src="stat_i" class="mr-4" /><span>Stasiun</span>
          </router-link>
        </li>
        
        <li v-if="accessToken" class="nav-item my-1">
          <router-link :to="{
            name: 'User',
          }" style="display: flex; flex-direction: row" v-if="this.user.role.role_name == 'SuperAdmin'">
            <img :src="user_i" class="mr-4" /><span>User</span>
          </router-link>
        </li>
        <!-- <li v-if="accessToken" class="nav-item my-1">
          <router-link :to="{
            name: 'Produksi',
          }" style="display: flex; flex-direction: row" v-if="this.user.role.role_name == 'SuperAdmin'">
            <img :src="stat_i" class="mr-4" /><span>Produksi</span>
          </router-link>
        </li> -->
        <hr style="color: white" />
        <li v-if="accessToken" class="nav-item my-1">
          <router-link v-if="this.user.role.role_name == 'SuperAdmin'" :to="{
            name: 'Notification',
          }" style="display: flex; flex-direction: row">
            <img :src="notif_i" class="mr-4" /><span>Notifikasi</span>
          </router-link>
        </li>
        <li v-if="accessToken" class="my-1">
          <router-link :to="{ name: 'Logout' }" style="display: flex; flex-direction: row">
            <img :src="login_i" class="mr-4" /><span>Sign Out</span>
          </router-link>
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
import { mapState } from "vuex";
import logoBT from "@/assets/icons/logo-pdam.png";
import logoPDAM from "@/assets/icons/logo-pdam.png";

import dash_i from "@/assets/icons/menu/dashboard.svg";
import login_i from "@/assets/icons/menu/log-in.svg";
import notif_i from "@/assets/icons/menu/notification.svg";

import data_i from "@/assets/icons/menu/pie-chart.svg";
import stat_i from "@/assets/icons/menu/box 1.svg";
import user_i from "@/assets/icons/menu/user.svg";

export default {
  name: "Header",
  data() {
    return {
      detBalai: [],
      role: null,
      user_id: null,
      logoBT,
      logoPDAM,
      dash_i,
      notif_i,
      login_i,

      data_i,
      stat_i,
      user_i,
      sidebarOpen: false,
      isMobileView: false,
      className: "bar",
    };
  },
  computed: mapState(["accessToken"]),
  mounted() {
    this.isMobileView = window.innerWidth <= 768;
    window.addEventListener("resize", this.handleResize);
  },
  methods: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
      var mini = true;

      if (mini) {
        document.getElementById("mySidebar").style.width = "250px";
        if (document.getElementById("main") != null) {
          document.getElementById("main").style.marginLeft = "250px";
          this.mini = false;
        }
      }
      if (this.className === "bar") {
        this.className = "bar-white";
      } else {
        this.className = "bar";
      }
    },
    toggleOut() {
      if (document.getElementById("main") != null) {
        document.getElementById("main").style.marginLeft = "80px";
      }
      document.getElementById("mySidebar").style.width = "80px";

      this.mini = true;
    },
    handleResize() {
      this.isMobileView = window.innerWidth <= 768;
    },
  },
  created() {
    this.extractUserInfo();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
  },
};
</script>

<style scoped>
ul,
li {
  list-style-type: none;
  padding: 0;
  margin: 0;
  
}

.sidebar {
  height: 100vh;
  width: 80px;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  background: #68C0FF;
  transition: 0.5s;
  overflow-x: hidden;
  padding-top: 60px;
  white-space: nowrap;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  padding: 15px;
}

.sidebar a {
  display: block;
  padding: 6px 10px;
  color: #092341;
  position: relative;
  -webkit-transition: 0.3s padding-left ease;
  -o-transition: 0.3s padding-left ease;
  transition: 0.3s padding-left ease;
  opacity: 0.8;
  font-weight: 400;
}

.sidebar a:hover {
  background: rgba(9, 37, 129, 0.11);
  color: #fff;
  opacity: 1;
  border-radius: 5px;
}

#nav a.router-link-exact-active {
  background: rgba(9, 37, 129, 0.11);
  color: #fff;
  opacity: 1;
  border-radius: 5px;
}

main .sidebar {
  position: absolute;
  top: 0;
  right: 25px;
  font-size: 36px;
  margin-left: 50px;
}

.material-icons,
.icon-text {
  vertical-align: middle;
}

.material-icons {
  padding-bottom: 3px;
  margin-right: 30px;
}

#main {
  margin-left: 85px;
  transition: margin-left 0.5s;
}

@media screen and (max-height: 450px) {
  .sidebar {
    padding-top: 15px;
  }

  .sidebar a {
    font-size: 18px;
  }
}

.toggle-button {
  position: sticky;
  z-index: 9999;
  top: 20px;
  left: 10px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 20px;
  transform: translateZ(0);
}

.bar {
  width: 100%;
  height: 3px;
  /* background-color: #092581; */
  background-color: #fff;
  transition: transform 0.3s;
}

.bar-white {
  background-color: #68C0FF;
}

.sidebar-open .toggle-button .bar:first-child {
  transform: rotate(45deg) translate(3px, 5px);
}

.sidebar-open .toggle-button .bar:nth-child(2) {
  opacity: 0;
}

.sidebar-open .toggle-button .bar:last-child {
  transform: rotate(-45deg) translate(3px, -5px);
}

.mobile-icon {
  margin-top: 0px;
}

@media (max-width: 768px) {
  .mobile-icon {
    margin-top: 0px;
  }
}

.centered-image {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

<style scoped src="./style.css"></style>

<style scoped src="./css/style.css"></style>

<style scoped src="./css/bootstrap.min.css"></style>