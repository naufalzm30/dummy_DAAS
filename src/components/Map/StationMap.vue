<template>
  <div class="row map" v-if="center && zoom">
    <div v-if="loading_i" class="d-flex flex-column justify-content-center align-items-center">
      <i class="zmdi zmdi-spinner zmdi-hc-spin" style="font-size: 2rem; margin-right: 20px"></i>
    </div>

    <v-map :zoom="zoom" :center="center" :options="{ attributionControl: false, zoomControl: false }"
      @update:zoom="zoomUpdated" @update:center="centerUpdated"
      style="border-radius: 5px; z-index: 2; position: relative" class="box" v-if="!loading_i">
      <v-icondefault></v-icondefault>
      <v-tilelayer :url="url" :attribution="attribution"></v-tilelayer>

      <v-control class="example-custom-control m-2" style="border-radius: 5px; opacity: 75%" :position="'bottomright'">
        <div class="py-1 px-1" style="font-weight: bold">

          <div><img :src="st_im" class="px-1 py-0" />Stasiun</div>

        </div>
      </v-control>


      <span v-for="station in stations" :key="station.station_serial_id">

        <span>
          <!-- -1.8022155427550486, 124.5651456642051 -->
          <!-- <v-marker v-if="station.latitude" :lat-lng="latLng(station.latitude, station.longitude)"> -->
          <v-marker v-if="station.latitude" :lat-lng="latLng(-1.8022155427550486, 124.5651456642051)">


            <v-icon :icon-url="icon_st" :icon-size="dynamicSize">
            </v-icon>


            <v-popup>
              <div class="text-center">
                <img :src="st_i" class="imgSZ" />
                <div class="my-1" style="font-weight: 600">
                  <!-- {{ station.station_name }} <br /> -->
                  Water Station {{ station.id }}

                </div>

                <div style="display: flex; flex-direction: column; align-items: center;">
                  <div v-if="station.station_status == 'OK'" style="display: flex; align-items: center;">
                    <span class="dotOK mx-1"></span> <span style="color: #219653;">{{ station.station_status }}</span>
                  </div>
                  <div v-else-if="station.station_status == 'maintenance'" style="display: flex; align-items: center;">
                    <span class="dotMTC mx-1"></span> <span style="color: black;">MTC</span>
                  </div>
                  <div v-else-if="station.station_status == 'Min Threshold'" style="display: flex; align-items: center;">
                    <span class="dotMin mx-1"></span> <span style="color: #00B2FF;">{{ station.station_status }}</span>
                  </div>
                  <div v-else-if="station.station_status == 'Max Threshold'" style="display: flex; align-items: center;">
                    <span class="dotMax mx-1"></span> <span style="color: #D34053;">{{ station.station_status }}</span>
                  </div>
                  <div v-else>{{ station.station_status }}</div>
                  <div class="my-1 text-muted" style="font-size: 0.7rem">
                    {{ formatDate(station.last_time)  }}
                  </div>
                </div>

                <div class="d-flex row">
                  <div class="col-md-6 px-0" v-if="role == 'SuperAdmin' || role == 'Admin'">
                    <router-link type="button" class="btn btn-primary d-flex flex-row justify-content-center py-0"
                      style="margin-right: 2.5px" :to="`/station/data/${station.station_serial_id}`">
                      <img :src="detail_i" class="mx-1" />
                      <span style="font-size: 0.8rem" class="text-white">Data</span>
                    </router-link>
                  </div>
                  <div class="col-md-12 px-0" v-if="role == 'Guest'">
                    <router-link type="button" class="btn btn-primary d-flex flex-row justify-content-center py-0"
                      style="margin-right: 2.5px" :to="`/station/data/${station.station_serial_id}`">
                      <img :src="detail_i" class="mx-1" />
                      <span style="font-size: 0.8rem" class="text-white">Data</span>
                    </router-link>
                  </div>
                  <div class="col-md-6 px-0" v-if="role == 'SuperAdmin' || role == 'Admin'">
                    <router-link type="button" class="btn btn-success d-flex flex-row justify-content-center py-0"
                      style="margin-left: 2.5px" :to="`/station/update/${station.station_serial_id}`">
                      <img :src="edit_i" class="mx-1" />
                      <span style="font-size: 0.8rem" class="text-white">Edit</span>
                    </router-link>
                  </div>
                </div>
              </div>
            </v-popup>
          </v-marker>
        </span>
      </span>

      <v-control-scale position="topright" :imperial="false" :metric="true"></v-control-scale>
    </v-map>

  </div>
</template>

<script>
import * as Vue2Leaflet from "vue2-leaflet";
import st_im from "@/assets/icons/map/marr.svg";
import st_i from "@/assets/icons/map/arr.svg";
import edit_i from "@/assets/icons/map/edit.svg";
import detail_i from "@/assets/icons/map/detail.svg";

import mtc_i from "@/assets/icons/map/mtc.svg";
import ok_i from "@/assets/icons/map/ok.svg";
import s1_i from "@/assets/icons/map/s1.svg";
import s2_i from "@/assets/icons/map/s2.svg";
import s3_i from "@/assets/icons/map/s3.svg";

export default {
  name: "StationMap",
  props: ["stations", "loading_i"],
  components: {
    "v-map": Vue2Leaflet.LMap,
    "v-tilelayer": Vue2Leaflet.LTileLayer,
    "v-icondefault": Vue2Leaflet.LIconDefault,
    "v-marker": Vue2Leaflet.LMarker,
    "v-popup": Vue2Leaflet.LPopup,
    "v-control-scale": Vue2Leaflet.LControlScale,
    "v-icon": Vue2Leaflet.LIcon,
    "v-control": Vue2Leaflet.LControl,

  },
  data() {
    return {
      // url: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
      url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",


      attribution: "",
      zoom: 11,
      // center: [-7.277016214, 112.708518708],
      center: [-1.8022155427550486, 124.5651456642051],

      
      iconSize: [20],
      icon_st: st_im,
      st_im,
      st_i,
      edit_i,
      detail_i,
      mtc_i,
      ok_i,
      s1_i,
      s2_i,
      s3_i,
      role: "",
    };
  },
  computed: {
    dynamicSize () {
      return [this.iconSize, this.iconSize * 1.15];
    },
  },
  methods: {
    latLng: function (lat, lng) {
      return [lat, lng];
    },
    centerUpdated(center) {
      this.center = center;
    },
    zoomUpdated(zoom) {
      this.zoom = zoom;
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const dateOptions = { day: '2-digit', month: 'short', year: 'numeric' };
      const timeOptions = { hour: '2-digit', minute: '2-digit' };
      const formattedDate = date.toLocaleDateString('en-GB', dateOptions);
      const formattedTime = date.toLocaleTimeString('en-GB', timeOptions);
      return `${formattedDate}, ${formattedTime}`;
    }
  },
  async created() {
    this.extractUserInfo()
  },
};
</script>

<style scoped>
.map {
  height: 46vh;
}

.example-custom-control {
  background: #fff;
}

.example-custom-control {
  background: #fff;
}

.imgSZ {
  height: 38px;
}

.iconSZ {
  height: 24px;
}

.statSZ {
  height: 22px;
}

@import "~leaflet.markercluster/dist/MarkerCluster.css";
@import "~leaflet.markercluster/dist/MarkerCluster.Default.css";
</style>

<style scoped src="@/assets/css/figma.css"></style>
<style>
.dotOK {
  height: 5px;
  width: 5px;
  background-color: #219653;
  border-radius: 50%;
  display: inline-block;
}

.dotMTC {
  height: 5px;
  width: 5px;
  background-color: black;
  border-radius: 50%;
  display: inline-block;
}

.dotMin {
  height: 5px;
  width: 5px;
  background-color: #00B2FF;
  border-radius: 50%;
  display: inline-block;
}

.dotMax {
  height: 5px;
  width: 5px;
  background-color: #D34053;
  border-radius: 50%;
  display: inline-block;
}

.statusText {
  display: flex;
  align-items: center;
  padding: 0 2px;
}
</style>