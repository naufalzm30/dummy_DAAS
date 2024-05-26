<template>
  <div class="row map">
    <div
      v-if="loading_i"
      class="d-flex flex-column justify-content-center align-items-center"
    >
      <i
        class="zmdi zmdi-spinner zmdi-hc-spin"
        style="font-size: 2rem; margin-right: 20px"
      ></i>
    </div>
    <v-map
      :zoom="zoom"
      :center="center"
      :options="{ attributionControl: false, zoomControl: false }"
      @update:zoom="zoomUpdated"
      @update:center="centerUpdated"
      style="border-radius: 15px; z-index: 2; position: relative"
      class="box"
      v-if="!loading_i"
    >
      <v-icondefault></v-icondefault>
      <v-tilelayer :url="url" :attribution="attribution"></v-tilelayer>
      <v-control
        class="example-custom-control m-2"
        style="border-radius: 5px; opacity: 75%"
        :position="'bottomright'"
      >
        <div class="py-1 px-1" style="font-weight: bold">
          <!-- <div class="px-1 pb-1">Legenda</div> -->
          <!-- <div><img :src="awlr_im" class="px-1 pb-1" />AWLR</div> -->
          <div><img :src="arr_im" class="px-1 py-0" />Stasiun</div>
          <!-- <div><img :src="aws_im" class="px-1 pt-1" />AWS</div> -->
        </div>
      </v-control>
      <!-- <v-marker-cluster @clusterclick="click()" @ready="ready"> -->
      <span v-for="station in stations" :key="station.id">
        <span
          ><v-marker
            :lat-lng="latLng(station[0].latitude, station[0].longitude)"
          >
            <span v-if="station[0].station_type == 1">
              <v-icon :icon-size="station[0].iconSize" :icon-url="icon_arr">
              </v-icon>
            </span>
            <span v-if="station[0].station_type == 2">
              <v-icon :icon-size="station[0].iconSize" :icon-url="icon_awlr">
              </v-icon>
            </span>
            <span v-if="station[0].station_type == 3">
              <v-icon :icon-size="station[0].iconSize" :icon-url="icon_aws">
              </v-icon>
            </span>

            <v-popup>
              <div class="text-center">
                <div v-if="station[0].station_type == 1">
                  <img :src="arr_i" class="imgSZ" />
                </div>
                <div v-if="station[0].station_type == 2">
                  <img :src="awlr_i" class="imgSZ" />
                </div>
                <div v-if="station[0].station_type == 3">
                  <img :src="aws_i" class="imgSZ" />
                </div>

                <div class="my-1" style="font-weight: 600">
                  {{ station[0].station_name }} <br />
                </div>
                <div v-for="(detail, index) in status" :key="index">
                  <div v-if="detail[0].id == station[0].id">
                    <span v-if="detail[1].table.siaga == []"> </span>
                    <span v-else-if="detail[1].table.siaga == 'MAINTENANCE'">
                      <img :src="mtc_i" class="statSZ" />
                    </span>
                    <span v-else-if="detail[1].table.siaga == 'SIAGA 1'">
                      <img :src="s1_i" class="statSZ" />
                    </span>
                    <span v-else-if="detail[1].table.siaga == 'SIAGA 2'">
                      <img :src="s2_i" class="statSZ" />
                    </span>
                    <span v-else-if="detail[1].table.siaga == 'SIAGA 3'">
                      <img :src="s3_i" class="statSZ" />
                    </span>
                    <span v-else-if="detail[1].table.siaga == 'OK'">
                      <img :src="ok_i" class="statSZ" />
                    </span>

                    <div class="my-1 text-muted" style="font-size: 0.7rem">
                      {{ formatDate(detail[1].table.date) }},
                      {{ formatTime(detail[1].table.date) }}
                    </div>
                  </div>
                </div>
                <div class="d-flex row">
                  <div
                    class="col-md-6 px-0"
                    v-if="role == 'is_superuser' || role == 'is_staff'"
                  >
                    <router-link
                      type="button"
                      class="btn btn-primary d-flex flex-row justify-content-center py-0"
                      style="margin-right: 2.5px"
                      :to="`/station/data/${station[0].id}/${balai}`"
                    >
                      <img :src="detail_i" class="mx-1" />
                      <span style="font-size: 0.8rem" class="text-white"
                        >Data</span
                      >
                    </router-link>
                  </div>
                  <div class="col-md-12 px-0" v-if="role == 'is_guess'">
                    <router-link
                      type="button"
                      class="btn btn-primary d-flex flex-row justify-content-center py-0"
                      style="margin-right: 2.5px"
                      :to="`/station/data/${station[0].id}/${balai}`"
                    >
                      <img :src="detail_i" class="mx-1" />
                      <span style="font-size: 0.8rem" class="text-white"
                        >Data</span
                      >
                    </router-link>
                  </div>
                  <div
                    class="col-md-6 px-0"
                    v-if="role == 'is_superuser' || role == 'is_staff'"
                  >
                    <router-link
                      type="button"
                      class="btn btn-success d-flex flex-row justify-content-center py-0"
                      style="margin-left: 2.5px"
                      :to="`/station/update/${balai}/${station[0].id}`"
                    >
                      <img :src="edit_i" class="mx-1" />
                      <span style="font-size: 0.8rem" class="text-white"
                        >Edit</span
                      >
                    </router-link>
                  </div>
                </div>
              </div>
            </v-popup>
          </v-marker>
        </span>
      </span>
      <!-- </v-marker-cluster> -->
      <v-control-scale
        position="topright"
        :imperial="false"
        :metric="true"
      ></v-control-scale>
    </v-map>
  </div>
</template>

<script>
import * as Vue2Leaflet from "vue2-leaflet";
// import Vue2LeafletMarkerCluster from "vue2-leaflet-markercluster";
import axios from "axios";
import awlr_im from "@/assets/icons/map/mawlr.svg";
import arr_im from "@/assets/icons/map/marr.svg";
import aws_im from "@/assets/icons/map/maws.svg";
import awlr_i from "@/assets/icons/map/awlr.svg";
import arr_i from "@/assets/icons/map/arr.svg";
import aws_i from "@/assets/icons/map/aws.svg";
import edit_i from "@/assets/icons/map/edit.svg";
import detail_i from "@/assets/icons/map/detail.svg";

import mtc_i from "@/assets/icons/map/mtc.svg";
import ok_i from "@/assets/icons/map/ok.svg";
import s1_i from "@/assets/icons/map/s1.svg";
import s2_i from "@/assets/icons/map/s2.svg";
import s3_i from "@/assets/icons/map/s3.svg";

export default {
  name: "StationMap",
  props: ["stations", "loading_i", "status"],
  components: {
    "v-map": Vue2Leaflet.LMap,
    "v-tilelayer": Vue2Leaflet.LTileLayer,
    "v-icondefault": Vue2Leaflet.LIconDefault,
    "v-marker": Vue2Leaflet.LMarker,
    "v-popup": Vue2Leaflet.LPopup,
    // "v-marker-cluster": Vue2LeafletMarkerCluster,
    "v-control-scale": Vue2Leaflet.LControlScale,
    "v-icon": Vue2Leaflet.LIcon,
    "v-control": Vue2Leaflet.LControl,
  },
  data() {
    return {
      url: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
      attribution: "",
      zoom: 4,
      center: undefined,
      iconSize: [],
      icon_awlr: awlr_im,
      icon_arr: arr_im,
      icon_aws: aws_im,
      awlr_im,
      arr_im,
      aws_im,
      awlr_i,
      arr_i,
      aws_i,
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
  methods: {
    click: (e) => console.log("clusterclick", e),
    ready: (e) => console.log("ready", e),
    latLng: function (lat, lng) {
      return [lat, lng];
    },
    centerUpdated(center) {
      this.center = center;
    },
    zoomUpdated(zoom) {
      this.zoom = zoom;
    },
    formatDate(date) {
      var monthShortNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Mei",
        "Jun",
        "Jul",
        "Agu",
        "Sep",
        "Okt",
        "Nov",
        "Des",
      ];
      var d = new Date(date),
        year = d.getFullYear(),
        month = "" + d.getMonth(),
        day = "" + d.getDate();

      if (day.length < 2) day = "0" + day;
      return [day, monthShortNames[month], year].join(" ");
    },
    formatTime(date) {
      var d = new Date(date),
        hour = "" + d.getHours(),
        minute = "" + d.getMinutes(),
        second = d.getSeconds();

      if (hour.length < 2) hour = "0" + hour;
      if (minute.length < 2) minute = "0" + minute;
      if (second.length < 2) second = "0" + second;

      return [hour, minute].join(":");
    },
  },

  async created() {
    let user = localStorage.getItem("user-info") || {};
    if (typeof user == "object") {
      this.balai = this.$fixedBalai;

      await axios
        .get(`${this.$proxyBaseUrl}/balai/non-auth/${this.$proxyFixedBalai}`)
        .then((r) => {
          this.detBalai = r.data[0];
        });
// console.log(this.detBalai);
      this.zoom = this.detBalai.map_zoom;
      this.center = [this.detBalai.latitude, this.detBalai.longitude];
    } else if (typeof user == "string") {
      this.role = JSON.parse(user).profile.role;
      this.user_id = JSON.parse(user).profile.user.id;
      this.balai = JSON.parse(user).profile.balai.id;
      this.token = JSON.parse(user).token;

      await axios
        .get(`${this.$proxyBaseUrl}/balai/${this.$proxyFixedBalai}`, {
          headers: {
            Authorization: `Token ${this.token}`,
          },
        })
        .then((r) => {
          this.detBalai = r.data;
        });
// console.log(this.detBalai);

      this.zoom = this.detBalai.map_zoom;
      this.center = [this.detBalai.latitude, this.detBalai.longitude];
    }
  },
  async mounted() {
    // console.log(this.role);
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

<style scoped src="@/assets/css/figma.css">
</style>

