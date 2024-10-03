<template>
  <div class="mobile-width">
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
          <router-link :to="{ name: 'Station' }" type="button" class="btn btn-light border mt-1 bg-white">
            Back
          </router-link>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6 px-1">
          <TableData :station="station" :loading_i="loading_i" class="mx-auto mt-2" style="border-radius: 15px"
            @update-filtered-data="updateFilteredData" @update-filtered-dataQA="updateFilteredDataQA"
            :profile="profile" />
        </div>
        <div class="col-md-6 px-1">
          <ChartData :station="station" :ava_width="ava_width" :debitData="debitData" :totalData="totalData"
            :label="label" :stationQA="stationQA" :percentDataQA="percentDataQA" :sumDataQA="sumDataQA"
            :mtcDataQA="mtcDataQA" :labelQA="labelQA" :taksasiData="taksasiData" :profile="profile" />
        </div>
      </div>
      <Footer />
    </div>
  </div>
</template>

<script>
import Header from "@/components/Public/Header.vue";
import Footer from "@/components/Public/Footer";
import TableData from "@/components/Station/Data/TableData.vue";
import ChartData from "@/components/Station/Data/ChartData.vue";
import axios from "axios";

export default {
  name: "DataStation",
  components: {
    Header,
    Footer,
    TableData,
    ChartData,
  },
  data() {
    return {
      station: [],
      stationQA: [],
      filteredData: [],
      filteredDataQA: [],
      loading_i: true,
      status: [],
      ava_width: null,
      msg: "Fetching data, please wait...",
      e_code: null,
      user_balai: null,
      station_balai: null,
      profile: null

    };
  },
  computed: {
    debitData() {
      return this.filteredData.map(item => item.sensor_data[0].value).reverse();
    },
    totalData() {
      return this.filteredData.map(item => item.sensor_data[1].value).reverse();
    },
    taksasiData() {
      return this.filteredData.map(item => item.sensor_data[2].value).reverse();
    },
    label() {
      return this.filteredData.map(item => item.time).reverse();
    },
    percentDataQA() {
      return this.filteredDataQA.map(item => item.percentage).reverse()
    },
    sumDataQA() {
      return this.filteredDataQA.map(item => item.sum).reverse()
    },
    mtcDataQA() {
      return this.filteredDataQA.map(item => item.maintenance).reverse()
    },
    labelQA() {
      return this.filteredDataQA.map(item => item.date).reverse()
    },
  },

  methods: {
    updateFilteredData(data) {
      this.filteredData = data;
    },
    updateFilteredDataQA(dataQA) {
      this.filteredDataQA = dataQA;
    },
    async loadData() {
      await axios
        .get(`${this.$baseURL}/pdam/station_data/${this.$route.params.id}/`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        })
        .then((r) => {
          this.station = r.data.data[0];
          // console.log('station', this.station);
          if (r.status == 200) {
            this.loading_i = false;
          }
        })
        .catch((error) => {
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            this.logoutUser();
          } else if (error.response.data.message == 'No sensor data found.') {
            this.station = []
            // console.log('station', this.station);

          } else {
            console.error('Error msg: ', error.response.data.message);
          }
        });
    },
    async loadDataQA() {
      await axios
        .get(`${this.$baseURL}/pdam/QA/${this.$route.params.id}/`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        })
        .then((r) => {
          // console.log(r.data[0].data);

          this.stationQA = r.data[0].data;

          if (r.status == 200) {
            this.loading_i = false;
          }
        })
        .catch((error) => {
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            this.logoutUser();
          } else {
            console.error('Error msg: ', error);
          }
        });

    },
    async loadProfile() {
      await axios
        .get(`${this.$baseURL}/pdam/station/${this.$route.params.id}/`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        })
        .then((r) => {
          this.profile = r.data.data;
          if (r.status == 200) {
            this.loading_i = false;
          }
        })
        .catch(function (e) {
          this.e_code = e.response.status;
          this.msg = "An error occurred on the server. Please try again later.";
        });
    },

  },
  mounted() {
    this.ava_width = screen.availWidth;

  },
  created() {
    this.extractUserInfo()
    this.loadProfile()
    if (this.role !== 'QA') {
      this.loadData();
    } else {
      this.loadDataQA()
    }
  },

};
</script>
<style>
.comShadow {
  box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px,
    rgba(17, 17, 26, 0.05) 0px 8px 32px;
}
</style>