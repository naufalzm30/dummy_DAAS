<template>
  <div class="row">
    <div class="col-6">
      <div class="row">
        <div class="col-12">
          <StationMap :stations="stations" :status="status" :loading_i="loading_i" class="mx-auto mt-2 shadow-sm border"
            style="border-radius: 15px" />
        </div>
        <div class="col-12">
          <Stations :stations="stations" :loading_i="loading_i" class="shadow-sm border mt-2 bg-white"
            style="border-radius: 15px" @station-selected="handleStationSelected"/>
        </div>
      </div>

    </div>
    <div class="col-6">
      <StationData :station="selectedStation"/>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import StationMap from "@/components/Map/StationMap";
import Stations from "@/components/Map/Stations";
import StationData from "./StationData.vue";

export default {
  name: "Map",

  components: {
    StationMap,
    Stations,
    StationData
  },
  data() {
    return {
      role: null,
      balai: null,
      stations: [],
      normalIcon: [18, 18],
      largeIcon: [25, 25],
      marker: null,
      loading_i: true,
      status: [], selectedStation: null // the selected station
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
    }},
  methods: {
    handleStationSelected(station) {
      this.selectedStation = station;
    },
    mouseOverstation: function (e) {
      this.stations[e][0].iconSize = this.largeIcon;
    },
    mouseLeftstation: function (e) {
      this.stations[e][0].iconSize = this.normalIcon;
    },
    async loadData() {
      await axios
        // .get(`${this.$baseURL}/home-data/non-auth/${this.balai}`)
        .get(`${this.$baseURL}/home-data/`)
        .then((r) => {
          this.stations = r.data.map((r) => {
            r[0].iconSize = this.normalIcon;
            return r;
          });
          if (r.status == 200) {
            this.loading_i = false;
          }
        });

      await axios
        // .get(`${this.$baseURL}/home-data/non-auth/${this.balai}`)
        .get(`${this.$baseURL}/home-data/`)
        .then((r) => {
          this.status = r.data;
          // console.log(this.status);
        })
        .catch(function (e) {
          console.log(e);
        });
    },
  },
  created() {
    let user = localStorage.getItem("user-info") || {};
    if (typeof user == "object") {
      this.balai = this.$fixedBalai;
    } else if (typeof user == "string") {
      this.role = JSON.parse(user).profile.role;
      this.user_id = JSON.parse(user).profile.user.id;
      this.balai = JSON.parse(user).profile.balai.id;
      if (this.role == "is_superuser") {
        this.balai = 0;
      }
    }
  },
  mounted() {
    this.loadData();
  },
};
</script>
