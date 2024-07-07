<template>
  <div style="background-color: #f8f8ff" class="mobile-width">
    <Header />
    <div v-if="loading_i" class="d-flex flex-column justify-content-center align-items-center pb-3"
      style="height: 100vh">
      <div class="content-container">
        <div v-if="e_code == null" class="icon-container">
          <i class="zmdi zmdi-spinner zmdi-hc-spin" style="font-size: 2rem"></i>
        </div>
        <div v-else class="icon-container">
          <i class="zmdi zmdi-alert-triangle" style="font-size: 2rem"></i>
        </div>
        <p class="mt-3">{{ msg }}</p>
      </div>
    </div>
    <div v-else>
      <div class="d-flex justify-content-between align-items-center">
        <div class="bwsTitle mobile-top">
          {{ $app_title }}
        </div>
        <div>
          <router-link :to="{
      name: 'Station',
      params: { balai_id: balai, user_id: user_id },
    }" type="button" class="btn btn-light border mt-1 bg-white">
            Back
          </router-link>
        </div>
      </div>

      <div class="row">

        <div class="col-md-6">
          <TableData :stations="stations" :status="status" :loading_i="loading_i" class="mx-auto mt-2"
            style="border-radius: 15px" @update-filtered-data="updateFilteredData" />
        </div>
        <div class="col-md-6">
          <ChartData v-if="stations.length > 0" :stations="stations" :status="status" :ava_width="ava_width"
            :debitData="debitData" :totalData="totalData" :debitLabel="debitLabel" :batteryData="batteryData" />
        </div>
      </div>
      <Footer />
    </div>
  </div>
</template>

<script>
import Header from "@/components/Public/Header.vue";
import Footer from "@/components/Public/Footer";
// import MapData from "@/components/Station/Data/MapData.vue";
import TableData from "@/components/Station/Data/TableData.vue";
import ChartData from "@/components/Station/Data/ChartData.vue";
import axios from "axios";
import { mapGetters } from 'vuex';

export default {
  name: "DataStation",
  // inject: ['userStationList'],
  components: {
    Header,
    Footer,
    // MapData,
    TableData,
    ChartData,
  },
  data() {
    return {
      stations: [],
      loading_i: true,
      status: [],
      ava_width: null,
      msg: "Fetching data, please wait...",
      e_code: null,
      filteredData: [],
      user_balai: null,
      station_balai: null
    };
  },
  computed: {
    debitData() {
      // console.log(this.filteredData);
      return this.filteredData.map(item => item.weather_data[0]).reverse();
    },
    totalData() {
      return this.filteredData.map(item => item.weather_data[1]).reverse();
    },
    batteryData() {
      return this.filteredData.map(item => item.bat).reverse();
    },
    debitLabel() {
      return this.filteredData.map(item => item.waktu).reverse();
    },
    ...mapGetters(['getUserStationList']),
  },

  methods: {
    parseNoteString(note) {
      const keyValuePairs = note.slice(1, -1).split(', ');
      const parsedObject = keyValuePairs.reduce((obj, pair) => {
        const index = pair.indexOf(':');
        if (index > -1) {
          const key = pair.slice(0, index).trim();
          const value = pair.slice(index + 1).trim();
          obj[key] = value;
        }
        return obj;
      }, {});

      return parsedObject;
    },
    getBalai(note) {
      const parsedNote = this.parseNoteString(note);
      return parsedNote['balai'];
    },
    updateFilteredData(filteredData) {
      this.filteredData = filteredData;
    },
    async loadData() {
      // console.log(this.profile.station.id);
      // console.log(this.$route.params.id);
      // console.log(this.userStationList);
      await axios
        .get(`${this.$baseURL}/data/${this.$route.params.id}/${this.user_id}`, {
          headers: {
            Authorization: `Token ${this.token}`,
          },
        })
        .then((r) => {
          this.stations = r.data;
          // console.log(this.stations);
          // console.log('balai_station:', this.getBalai(this.station[0].note));
          // console.log(this.getBalai(this.stations[0].note));
          this.station_balai = this.getBalai(this.stations[0].note)

          if (r.status == 200) {
            this.loading_i = false;
          }
        })
        .catch(function (e) {
          console.log(e.response.status);
          this.e_code = e.response.status;
          this.msg = "An error occurred on the server. Please try again later.";
        });

      if (this.profile.station == null) {
        await axios
          .get(`${this.$baseURL}/home-data/`)
          .then((r) => {
            this.status = r.data;
          })
          .catch(function (e) {
            console.log(e);
          });
      } else if (this.profile.station != null) {
        await axios
          .get(`${this.$baseURL}/home-data/${this.profile.station.id}`)
          .then((r) => {
            this.status = r.data;
          })
          .catch(function (e) {
            console.log(e);
          });

          // console.log(this.user_balai, this.station_balai);
        this.user_balai = this.profile.role_balai

          if (this.user_balai != this.station_balai) {
            this.logoutUser()
            console.log('user_balai', this.user_balai);
            console.log('station_balai', this.station_balai);
          }
      }
    },
    checkStationInList() {
      if (this.profile.station != null) {
        const isInList = this.getUserStationList.includes(this.profile.station.id);

        // console.log('role_profile: ', this.profile.role_balai);
        // console.log('balai_station', this.stations);
        this.user_balai = this.profile.role_balai
        if (this.profile.role == "is_staff") {
          // if (!isInList) {
          //   this.logoutUser()
          // }
          // console.log(this.user_balai, this.station_balai);

        }
        return isInList;
      }

    },
  },
  // watch: {
  //   getUserStationList(newValue) {
  //     console.log('vuex updated', newValue);
  //   },
  // },
  mounted() {
    this.ava_width = screen.availWidth;
    // console.log('vuex Data.vue', this.getUserStationList);
    // console.log(this.profile.station.id);
    // this.checkStationInList();

  },
  created() {
    this.extractUserInfo()
    this.gAuthStation();

    this.loadData();
  },
  beforeUnmount() {

  }
};
</script>
<style>
.comShadow {
  box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px,
    rgba(17, 17, 26, 0.05) 0px 8px 32px;
}
</style>