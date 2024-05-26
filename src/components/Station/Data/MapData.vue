<template>
  <div class="row map">
    <!-- <p>Center is {{ center }}, zoom is {{ zoom }}</p> -->

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
      style="border-radius: 15px"
      class="box"
      v-if="stations[0]"
    >
      <v-icondefault></v-icondefault>
      <v-tilelayer :url="url" :attribution="attribution"></v-tilelayer>
      <v-control
        class="example-custom-control m-2"
        style="border-radius: 10px; opacity: 75%"
        :position="'bottomright'"
      >
        <div class="py-2 px-2" style="font-weight: bold">
          <!-- <div class="px-1 pb-1">Legenda</div>
          <div><img :src="awlr_im" class="px-1 pb-1" />AWLR</div> -->
          <div><img :src="arr_im" class="px-1 py-1" />Stasiun</div>
          <!-- <div><img :src="aws_im" class="px-1 pt-1" />AWS</div> -->
        </div>
      </v-control>
      <v-marker-cluster
        :options="clusterOptions"
        @clusterclick="click()"
        @ready="ready"
      >
        <span>
          <span>
            <v-marker
              v-if="stations[0].station_type == 2"
              :lat-lng="latLng(stations[0].latitude, stations[0].longitude)"
            >
              <v-icon>
                <img :src="awlr_im" class="iconSZ" />
              </v-icon>
              <v-popup>
                <div class="text-center">
                  <img :src="awlr_i" class="imgSZ" />
                  <div class="my-1" style="font-weight: 600">
                    {{ stations[0].station_name }}
                  </div>
                  <div v-for="station in status" :key="station[0].id">
                    <div v-if="station[0].id == stations[0].id">
                      <span v-if="station[1].table.siaga == []"> </span>
                      <span v-else-if="station[1].table.siaga == 'MAINTENANCE'">
                        <img :src="mtc_i" class="statSZ" />
                      </span>
                      <span v-else-if="station[1].table.siaga == 'SIAGA 1'">
                        <img :src="s1_i" class="statSZ" />
                      </span>
                      <span v-else-if="station[1].table.siaga == 'SIAGA 2'">
                        <img :src="s2_i" class="statSZ" />
                      </span>
                      <span v-else-if="station[1].table.siaga == 'SIAGA 3'">
                        <img :src="s3_i" class="statSZ" />
                      </span>
                      <span v-else-if="station[1].table.siaga == 'OK'">
                        <img :src="ok_i" class="statSZ" />
                      </span>

                      <div class="my-1 text-muted">
                        {{ formatDate(station[1].table.date) }},
                        {{ formatTime(station[1].table.date) }}
                      </div>
                    </div>
                  </div>
                  <router-link
                    type="button"
                    class="btn btn-success d-flex flex-row justify-content-center p-0"
                    :to="`/station/update/${balai}/${stations[0].id}`"
                    v-if="role == 'is_superuser' || role == 'is_staff'"
                  >
                    <img :src="edit_i" class="mx-1" />
                    <span style="font-size: 0.8rem">Edit</span></router-link
                  >
                </div>
              </v-popup>
            </v-marker>
            <v-marker
              v-else-if="stations[0].station_type == 1"
              :lat-lng="latLng(stations[0].latitude, stations[0].longitude)"
            >
              <v-icon>
                <img :src="arr_im" class="iconSZ" />
              </v-icon>
              <v-popup>
                <div class="text-center">
                  <img :src="arr_i" class="imgSZ" />
                  <div class="my-1" style="font-weight: 600">
                    {{ stations[0].station_name }}
                  </div>
                  <div v-for="station in status" :key="station[0].id">
                    <div v-if="station[0].id == stations[0].id">
                      <span v-if="station[1].table.siaga == []"> </span>
                      <span v-else-if="station[1].table.siaga == 'MAINTENANCE'">
                        <img :src="mtc_i" class="statSZ" />
                      </span>
                      <span v-else-if="station[1].table.siaga == 'SIAGA 1'">
                        <img :src="s1_i" class="statSZ" />
                      </span>
                      <span v-else-if="station[1].table.siaga == 'SIAGA 2'">
                        <img :src="s2_i" class="statSZ" />
                      </span>
                      <span v-else-if="station[1].table.siaga == 'SIAGA 3'">
                        <img :src="s3_i" class="statSZ" />
                      </span>
                      <span v-else-if="station[1].table.siaga == 'OK'">
                        <img :src="ok_i" class="statSZ" />
                      </span>

                      <div class="my-1 text-muted">
                        {{ formatDate(station[1].table.date) }},
                        {{ formatTime(station[1].table.date) }}
                      </div>
                    </div>
                  </div>
                  <router-link
                    type="button"
                    class="btn btn-success d-flex flex-row justify-content-center p-0"
                    :to="`/station/update/${balai}/${stations[0].id}`"
                    v-if="role == 'is_superuser' || role == 'is_staff'"
                  >
                    <img :src="edit_i" class="mx-1" />
                    <span style="font-size: 0.8rem">Edit</span></router-link
                  >
                </div>
              </v-popup>
            </v-marker>
            <v-marker
              v-else-if="stations[0].station_type == 3"
              :lat-lng="latLng(stations[0].latitude, stations[0].longitude)"
            >
              <v-icon>
                <img :src="aws_im" class="iconSZ" />
              </v-icon>
              <v-popup>
                <div class="text-center">
                  <img :src="aws_i" class="imgSZ" />
                  <div class="my-1" style="font-weight: 600">
                    {{ stations[0].station_name }}
                  </div>
                  <div v-for="station in status" :key="station[0].id">
                    <div v-if="station[0].id == stations[0].id">
                      <span v-if="station[1].table.siaga == []"> </span>
                      <span v-else-if="station[1].table.siaga == 'MAINTENANCE'">
                        <img :src="mtc_i" class="statSZ" />
                      </span>
                      <span v-else-if="station[1].table.siaga == 'SIAGA 1'">
                        <img :src="s1_i" class="statSZ" />
                      </span>
                      <span v-else-if="station[1].table.siaga == 'SIAGA 2'">
                        <img :src="s2_i" class="statSZ" />
                      </span>
                      <span v-else-if="station[1].table.siaga == 'SIAGA 3'">
                        <img :src="s3_i" class="statSZ" />
                      </span>
                      <span v-else-if="station[1].table.siaga == 'OK'">
                        <img :src="ok_i" class="statSZ" />
                      </span>

                      <div class="my-1 text-muted">
                        {{ formatDate(station[1].table.date) }},
                        {{ formatTime(station[1].table.date) }}
                      </div>
                    </div>
                  </div>
                  <router-link
                    type="button"
                    class="btn btn-success d-flex flex-row justify-content-center p-0"
                    :to="`/station/update/${balai}/${stations[0].id}`"
                    v-if="role == 'is_superuser' || role == 'is_staff'"
                  >
                    <img :src="edit_i" class="mx-1" />
                    <span style="font-size: 0.8rem">Edit</span></router-link
                  >
                </div>
              </v-popup>
            </v-marker>
          </span>
        </span>
      </v-marker-cluster>
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
import Vue2LeafletMarkerCluster from "vue2-leaflet-markercluster";
import awlr_im from "@/assets/icons/map/mawlr.svg";
import arr_im from "@/assets/icons/map/marr.svg";
import aws_im from "@/assets/icons/map/maws.svg";
import awlr_i from "@/assets/icons/map/awlr.svg";
import arr_i from "@/assets/icons/map/arr.svg";
import aws_i from "@/assets/icons/map/aws.svg";
import edit_i from "@/assets/icons/map/edit.svg";
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
    "v-marker-cluster": Vue2LeafletMarkerCluster,
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
      balai: "",
      clusterOptions: {},
      awlr_im,
      arr_im,
      aws_im,
      awlr_i,
      arr_i,
      aws_i,
      edit_i,
      mtc_i,
      ok_i,
      s1_i,
      s2_i,
      s3_i,
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

  created() {
    this.gAuthStation();
  },
  async mounted() {
    this.zoom = this.detBalai.map_zoom;
    this.center = [this.detBalai.latitude, this.detBalai.longitude];

    setTimeout(() => {
      this.$nextTick(() => {
        this.clusterOptions = { disableClusteringAtZoom: 11 };
      });
    }, 5000);
  },
};
</script>

<style scoped>
.map {
  height: 35vh;
}
@import "~leaflet.markercluster/dist/MarkerCluster.css";
@import "~leaflet.markercluster/dist/MarkerCluster.Default.css";

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
</style>

<style scoped src="@/assets/css/figma.css">
</style>
