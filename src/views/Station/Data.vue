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
            :debitData="debitData" :totalData="totalData" :debitLabel="debitLabel" />
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
      filteredData: [], // This will hold the filtered data
    };
  },
  computed: {
    debitData() {
      // console.log(this.filteredData);
      return this.filteredData.map(item => item.weather_data[0]).reverse();
    },
    totalData() {
      // console.log(this.filteredData);
      return this.filteredData.map(item => item.weather_data[1]).reverse();
    },
    debitLabel() {
      return this.filteredData.map(item => item.waktu).reverse();
    },
    ...mapGetters(['getUserStationList']),
  },

  methods: {

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
          if (r.status == 200) {
            this.loading_i = false;
          }
        })
        .catch(function (e) {
          console.log(e.response.status);
          this.e_code = e.response.status;
          this.msg = "An error occurred on the server. Please try again later.";
        });

      await axios
        .get(`${this.$baseURL}/home-data/`)
        .then((r) => {
          this.status = r.data;
          // console.log(this.status);
        })
        .catch(function (e) {
          console.log(e);
        });
    },
    checkStationInList() {
      const isInList = this.getUserStationList.includes(this.profile.station.id);
      // console.log('Is station in list?', isInList);
      // console.log(isInList);
      if (this.profile.role == "is_staff") {
        if (!isInList) {
          this.logoutUser()
        }
      }
      return isInList;
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
    this.checkStationInList();

  },
  created() {
    this.extractUserInfo()
    this.gAuthStation();
 
    this.loadData();
  },
  beforeUnmount(){
    
  }
};
</script>
<style>
.comShadow {
  box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px,
    rgba(17, 17, 26, 0.05) 0px 8px 32px;
}
</style>