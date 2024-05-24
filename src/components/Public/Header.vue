<template>
  <div id="nav">

    <div v-show="isMobileView" style="background: #092581" class="p-2">
      <button class="toggle-button" @click="toggleSidebar()" v-show="isMobileView">
        <span :class="className"></span>
        <span :class="className"></span>
        <span :class="className"></span>
      </button>
    </div>

    <div v-if="!isMobileView" id="mySidebar" :class="{ sidebar: true, 'sidebar-open': sidebarOpen }"
      v-show="!isMobileView || sidebarOpen" @mouseover="toggleSidebar()" @mouseleave="toggleOut()" style="z-index: 1000">

      <ul>
        <li class="centered-image">
          <img v-if="$app_title == 'WEATHER-VUE'" :src="logoBT" class="mobile-icon" style="max-width: 50px" />
          <img v-else :src="logoPU" class="mobile-icon" style="max-width: 50px" />

        </li>

        <li class="my-1 mt-3">
          <router-link :to="{ name: 'Home', params: { balai_id: balai } }" style="display: flex; flex-direction: row"
            class="active" aria-current="page">
            <img :src="dash_i" class="mr-4" /><span>Dashboard</span>
          </router-link>
        </li>

        <li v-if="accessToken"></li>

        <div v-else>


          <li class="my-1">
            <hr style="color: white" />
            <router-link :to="{ name: 'Login', params: { balai_id: balai } }"
              style="display: flex; flex-direction: row; z-index: 100;">
              <img :src="login_i" class="mr-4" /><span>Sign In</span>
            </router-link>
          </li>
        </div>

        <li class="accordion my-1" v-if="accessToken && role == 'is_superuser'">
          <a href="#collapseTwo" data-bs-toggle="collapse" data-target="#collapseTwo" aria-expanded="false"
            aria-controls="collapseTwo" class="collapsible" style="display: flex; flex-direction: row">
            <img :src="data_i" class="mr-4" /><span>Data</span>
          </a>
          <div id="collapseTwo" class="collapse" aria-labelledby="headingOne">
            <div style="margin-left: 50px">
              <ul>
                <li class="my-1">
                  <router-link :to="{ name: 'Balai' }">Balai</router-link>
                </li>
                <li class="my-1">
                  <router-link :to="{ name: 'Provinsi' }">Provinsi</router-link>
                </li>
                <li class="my-1">
                  <router-link :to="{ name: 'Sensor' }">Sensor</router-link>
                </li>
                <li class="my-1">
                  <router-link :to="{ name: 'Logger' }">Logger</router-link>
                </li>
                <li class="my-1">
                  <router-link :to="{ name: 'Modem' }">Modem</router-link>
                </li>
                <li class="my-1">
                  <router-link :to="{ name: 'Icon' }">Icon</router-link>
                </li>
                <li class="my-1">
                  <router-link :to="{ name: 'Backup' }">Dummy</router-link>
                </li>
                <li class="my-1">
                  <router-link :to="{ name: 'SensorMod' }">SensorMod</router-link>
                </li>
              </ul>
            </div>
          </div>
        </li>
        <li v-if="accessToken" class="nav-item my-1">
          <router-link :to="{
            name: 'Station',
            params: { balai_id: balai, user_id: user_id },
          }" style="display: flex; flex-direction: row">
            <img :src="stat_i" class="mr-4" /><span>Station</span>
          </router-link>
        </li>
        <li v-if="accessToken" class="nav-item my-1">
          <router-link :to="{
            name: 'User',
            params: { balai_id: balai },
          }" style="display: flex; flex-direction: row" v-if="role == 'is_staff' || role == 'is_superuser'">
            <img :src="user_i" class="mr-4" /><span>User</span>
          </router-link>
        </li>
        <li v-if="accessToken" class="my-1">
          <hr style="color: white" />
          <router-link :to="{ name: 'Logout', params: { balai_id: balai } }" style="display: flex; flex-direction: row">
            <img :src="login_i" class="mr-4" /><span>Sign Out</span>
          </router-link>
        </li>
      </ul>
    </div>

    <div v-else id="mySidebar" :class="{ sidebar: true, 'sidebar-open': sidebarOpen }"
      v-show="!isMobileView || sidebarOpen" style="z-index: 1000">

      <ul>
        <li class="centered-image">
          <img v-if="$app_title == 'WEATHER-VUE'" :src="logoBT" class="mobile-icon" style="max-width: 50px" />
          <img v-else :src="logoPU" class="mobile-icon" style="max-width: 50px" />

        </li>

        <li class="my-1 mt-3">
          <router-link :to="{ name: 'Home', params: { balai_id: balai } }" style="display: flex; flex-direction: row"
            class="active" aria-current="page">
            <img :src="dash_i" class="mr-4" /><span>Dashboard</span>
          </router-link>
        </li>

        <li v-if="accessToken"></li>

        <div v-else>


          <li class="my-1">
            <hr style="color: white" />
            <router-link :to="{ name: 'Login', params: { balai_id: balai } }"
              style="display: flex; flex-direction: row; z-index: 100;">
              <img :src="login_i" class="mr-4" /><span>Sign In</span>
            </router-link>
          </li>
        </div>

        <li class="accordion my-1" v-if="accessToken && role == 'is_superuser'">
          <a href="#collapseTwo" data-bs-toggle="collapse" data-target="#collapseTwo" aria-expanded="false"
            aria-controls="collapseTwo" class="collapsible" style="display: flex; flex-direction: row">
            <img :src="data_i" class="mr-4" /><span>Data</span>
          </a>
          <div id="collapseTwo" class="collapse" aria-labelledby="headingOne">
            <div style="margin-left: 50px">
              <ul>
                <li class="my-1">
                  <router-link :to="{ name: 'Balai' }">Balai</router-link>
                </li>
                <li class="my-1">
                  <router-link :to="{ name: 'Provinsi' }">Provinsi</router-link>
                </li>
                <li class="my-1">
                  <router-link :to="{ name: 'Sensor' }">Sensor</router-link>
                </li>
                <li class="my-1">
                  <router-link :to="{ name: 'Logger' }">Logger</router-link>
                </li>
                <li class="my-1">
                  <router-link :to="{ name: 'Modem' }">Modem</router-link>
                </li>
                <li class="my-1">
                  <router-link :to="{ name: 'Icon' }">Icon</router-link>
                </li>
                <li class="my-1">
                  <router-link :to="{ name: 'Backup' }">Dummy</router-link>
                </li>
                <li class="my-1">
                  <router-link :to="{ name: 'SensorMod' }">SensorMod</router-link>
                </li>
              </ul>
            </div>
          </div>
        </li>
        <li v-if="accessToken" class="nav-item my-1">
          <router-link :to="{
            name: 'Station',
            params: { balai_id: balai, user_id: user_id },
          }" style="display: flex; flex-direction: row">
            <img :src="stat_i" class="mr-4" /><span>Station</span>
          </router-link>
        </li>
        <li v-if="accessToken" class="nav-item my-1">
          <router-link :to="{
            name: 'User',
            params: { balai_id: balai },
          }" style="display: flex; flex-direction: row" v-if="role == 'is_staff' || role == 'is_superuser'">
            <img :src="user_i" class="mr-4" /><span>User</span>
          </router-link>
        </li>
        <li v-if="accessToken" class="my-1">
          <hr style="color: white" />
          <router-link :to="{ name: 'Logout', params: { balai_id: balai } }" style="display: flex; flex-direction: row">
            <img :src="login_i" class="mr-4" /><span>Sign Out</span>
          </router-link>
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";
// import $ from "jquery";
import logoPU from "@/assets/icons/pupr.svg";
import logoBT from "@/assets/icons/logo-bt.svg";

import dash_i from "@/assets/icons/menu/dashboard.svg";
import login_i from "@/assets/icons/menu/log-in.svg";
import data_i from "@/assets/icons/menu/pie-chart.svg";
import stat_i from "@/assets/icons/menu/box 1.svg";
import user_i from "@/assets/icons/menu/user.svg";

export default {
  name: "HeaderPub",
  data() {
    return {
      detBalai: [],
      role: "is_guess",
      user_id: null,
      logoPU,
      logoBT,
      dash_i,
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
  async created() {
    let user = localStorage.getItem("user-info") || {};
    if (typeof user == "object") {
      this.balai = this.$fixedBalai;
      await axios
        .get(`${this.$baseURL}/balai/non-auth/${this.balai}`)
        .then((r) => {
          this.detBalai = r.data[0];
        })
        .catch((e) => {
          console.log(e.response.status);
          if (e.response.status == 401) {
            console.log("test 401 string");
            localStorage.clear();
            this.$router.push({ name: "Login" });
          }
        });
    } else if (typeof user == "string") {
      this.role = JSON.parse(user).profile.role;
      this.user_id = JSON.parse(user).profile.user.id;
      this.balai = JSON.parse(user).profile.balai.id;
      this.token = JSON.parse(user).token;

      await axios
        .get(`${this.$baseURL}/balai/${this.balai}`, {
          headers: {
            Authorization: `Token ${this.token}`,
          },
        })
        .then((r) => {
          this.detBalai = r.data;
        })
        .catch((e) => {
          console.log(e.response.status);
          if (e.response.status == 401) {
            console.log("test 401 string");
            localStorage.clear();
            this.$router.push({ name: "Login" });
          }
        });
    }
  },
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
  background: #092581;
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
  color: #fff;
  position: relative;
  -webkit-transition: 0.3s padding-left ease;
  -o-transition: 0.3s padding-left ease;
  transition: 0.3s padding-left ease;
  opacity: 0.5;
}

.sidebar a:hover {
  background: rgba(255, 255, 255, 0.11);
  color: #fff;
  opacity: 1;
  border-radius: 5px;
}

#nav a.router-link-exact-active {
  background: rgba(255, 255, 255, 0.11);
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
  background-color: #092581;
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