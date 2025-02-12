<template>
  <div>

    <div v-if="loading_i" class="d-flex flex-column justify-content-center align-items-center pb-3"
      style="height: 90vh; width: 93vw;">
      <div class="content-container">
        <div class="icon-container">
          <i class="zmdi zmdi-spinner zmdi-hc-spin" style="font-size: 2rem"></i>
        </div>
        <p class="mt-3">{{ msg }}</p>
      </div>
    </div>
    <div v-else>

      <!-- <div class="d-flex flex-row" v-if="ava_width > 768 && role !== 'QA' && role !== 'APPROVAL'"> -->
      <div class="d-flex flex-row" v-if="ava_width > 768 && !['QA', 'APPROVAL'].includes(role)">
        <marquee-text :repeat="text_repeat" :duration="custom_duration" :paused="isPaused" class=""
          @mouseenter="isPaused = !isPaused" @mouseleave="isPaused = false">
          <span v-for="station in stations" :key="station.id" style="font-size: 1.1rem">
            <span style="color: #00B2FF; font-weight: 500">
              {{ station.station_name }} &bull;
            </span>
            <span>
              <span v-for="(card, index) in [station]" :key="index" class="flex mt-2">
                <span v-for="(label, labelIndex) in card.last_data" :key="labelIndex" style="color: #00B2FF">
                  {{ label.sensor_name }} : {{ label.value }} {{ label.notation }}
                  <span v-if="labelIndex < card.last_data.length - 1"> | </span>
                </span>
              </span>
            </span>
            <img :src="logoPDAM" style="width: 20px" class="mx-1 mb-1" />
          </span>
        </marquee-text>
      </div>
      <div class="row">

        <div class="col" :class="{ 'col-6 pr-0': ava_width > 768, 'col-4': role === 'APPROVAL' }">
          <div class="row">
            <div class="col-12" v-if="!['QA', 'APPROVAL'].includes(role)">
              <StationMap :stations="stations" :loading_i="loading_i" class="mx-auto mt-2 shadow-sm border"
                style="border-radius: 10px" />
            </div>
            <div class="col-12">

              <div v-if="role === 'APPROVAL'" class="col-md d-flex justify-content-center" style="margin-top: 1rem;">
                <div>
                  <i v-if="loading_data" class="zmdi zmdi-spinner zmdi-hc-spin mx-2" style="font-size: 1.2rem"></i>
                  <DatePicker name="from" v-model="startDate" @change="searchApproval" type="datetime"
                    format="YYYY-MM-DD" :default-value="new Date().setHours(0, 0, 0, 0)"
                    placeholder="Select first date" :minute-step="5">
                  </DatePicker>
                  <label for="to" class="px-2" style="font-size: 0.8rem; font-weight: normal">-</label>
                  <DatePicker name="to" v-model="endDate" @change="searchApproval" type="datetime"
                    format="YYYY-MM-DD" :default-value="new Date().setHours(23, 55, 0, 0)"
                    placeholder="Select last date" :minute-step="5">
                  </DatePicker>
                </div>
              </div>

              <Stations :stations.sync="stations" :stationsQA="stationsQA" :stationsApproval="stationsApproval"
                :loading_i="loading_i" class="shadow-sm border mt-2 bg-white" style="border-radius: 10px"
                @station-selected="handleStationSelected" @stationqa-selected="handleStationSelectedQA"
                @stationapproval-selected="handleStationSelectedApproval" @update:stations="handleStationsUpdate" />
            </div>
          </div>
        </div>
        <div class="col px-0" :class="{ 'col-6 px-0': ava_width > 768, 'col px-0': role === 'APPROVAL' }">
          <StationData :station="selectedStation" :stationQA="selectedStationQA"
            :stationApproval="selectedStationApproval" />
        </div>
      </div>
    </div>
  </div>


</template>

<script>
import axios from "axios";
import StationMap from "@/components/Map/StationMap";
import Stations from "@/components/Map/Stations";
import StationData from "./StationData.vue";
import MarqueeText from "@/components/MarqueeText.vue";
import logoPDAM from "@/assets/icons/logo-pdam.png";
import moment from 'moment';

export default {
  name: "Map",

  components: {
    StationMap,
    Stations,
    StationData,
    MarqueeText,

  },
  data() {
    return {
      startDate: null,
      endDate: null,
      loading_data: false,

      isPaused: false,
      text_duration: null,
      text_repeat: null,
      custom_duration: null,
      showCarousel: true,
      logoPDAM,
      msg: "Fetching data, please wait...",

      role: null,
      balai: null,
      stations: [],
      stationsQA: [],
      stationsApproval: [],
      // normalIcon: [18, 18],
      // largeIcon: [25, 25],
      marker: null,
      loading_i: true,
      status: [],
      selectedStation: null, // the selected station,
      selectedStationQA: null, // the selected station,
      selectedStationApproval: null, // the selected station,

      userStation: null,
      ava_width: null,
    };
  },
  watch: {
    stations: {
      immediate: true,
      handler(newStations) {
        if (newStations.length > 0 && !this.selectedStation) {
          this.selectedStation = newStations[0];
        }
      }
    },
    stationsApproval: {
      immediate: true,
      handler(newStationsApproval) {
        if (newStationsApproval.length > 0 && !this.selectedStationApproval) {
          this.selectedStationApproval = newStationsApproval[0];
        }
      }
    },
    stationsQA: {
      immediate: true,
      handler(newStationsQA) {
        if (newStationsQA.length > 0 && !this.selectedStationQA) {
          this.selectedStationQA = newStationsQA[0];
        }
      }
    },

  },
  methods: {
    handleStationsUpdate(newStations) {
      this.stations = newStations;
    },
    handleStationSelected(station) {
      this.selectedStation = station;
    },
    handleStationSelectedQA(stationQA) {
      this.selectedStationQA = stationQA;
    },
    handleStationSelectedApproval(stationApproval) {
      this.selectedStationApproval = stationApproval;
    },
    async loadData() {
      var st_name = [];
      var sensor = [];
      var st_name_length = null;
      var sensor_length = null;

      await axios
        .get(`${this.$baseURL}/pdam/dashboard/`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        })

        .then((r) => {
          r.data.data.forEach((e) => {
            st_name.push(e.station_name.length);
            sensor.push(
              e.last_data
                .filter(item => item.sensor_name === 'Flow Meter' || item.sensor_name === 'Totalizer')
                .reduce((acc, cur) => acc + cur.sensor_name, '')
                .length
            );
            var x =
              e.station_name.length + 1
            e.last_data
              .filter(item => item.sensor_name === 'Flow Meter' || item.sensor_name === 'Totalizer')
              .reduce((acc, cur) => acc + cur.sensor_name, '')
              .length

            e.duration = x * 510;
          });
          st_name_length = st_name.reduce((a, b) => a + b, 0);
          sensor_length = sensor.reduce((a, b) => a + b, 0);
          this.stations = r.data.data.map(station => ({
            ...station,
            last_data: station.last_data.map(data => ({
              ...data,
              value: function formatValue(val) {
                val = parseFloat(val).toFixed(2);
                if (val.endsWith('.00')) {
                  val = val.replace('.00', '');
                }
                val = val.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                return val;
              }(data.value)
            }))
          }));

          this.custom_duration = (st_name_length + sensor_length) / 2;
          this.stations.slice(-1).pop().duration + 200;
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


      let currentIndex = 0;

      const playSlide = () => {
        setTimeout(() => {
          currentIndex = (currentIndex + 1) % this.stations.length;

          if (this.$refs.carousel) {
            this.$refs.carousel.goToPage(currentIndex);
          }
          playSlide();
        }, this.stations[currentIndex].duration);
      };

      playSlide();
    },

    async loadDataQA() {
      await axios
        .get(`${this.$baseURL}/pdam/QA/`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        })
        .then((r) => {
          this.stationsQA = r.data
          if (r.status == 200) {
            this.loading_i = false;
          }
        });
    },
    async loadDataApproval(from = null, until = null) {
      
      await axios
        .get(`${this.$baseURL}/pdam/approval/`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
          params: {
            from: from,
            until: until,
          },
        })
        .then((r) => {
          this.stationsApproval = r.data
          if (r.status == 200) {
            this.loading_i = false;
          }
        });
    },
    searchApproval() {
      
      const from = this.startDate ? moment(this.startDate).format('YYYY-MM-DD HH:mm') : null;
      const until = this.endDate ? moment(this.endDate).format('YYYY-MM-DD HH:mm') : null;
      const diffDays = moment(this.endDate).diff(moment(this.startDate), 'days');

      if (diffDays > 10000) {
        if (this.role === 'APPROVAL') {
          this.loadDataApproval(null, null);
        }
      } else {
        if (this.role === 'APPROVAL') {
          this.loadDataApproval(from, until);
        }
      }


    },
  },
  created() {
    this.extractUserInfo()

    this.ava_width = screen.availWidth;

  },
  mounted() {

    if (this.role === 'QA') {
      this.loadDataQA()
    } else if (this.role === 'APPROVAL') {
      this.loadDataApproval()
    }
    else {
      this.loadData();
    }
  },
};
</script>
