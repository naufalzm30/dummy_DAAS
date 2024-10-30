<template>
  <div class="row map">
    <div v-if="loading_i" class="d-flex flex-column justify-content-center align-items-center">
      <i class="zmdi zmdi-spinner zmdi-hc-spin" style="font-size: 2rem; margin-right: 20px"></i>
    </div>
    <v-map :zoom=15 :center="center" :options="{ attributionControl: false, zoomControl: false }"
      @update:zoom="zoomUpdated" @update:center="centerUpdated" style="border-radius: 15px" class="box"
      v-if="station && !loading_i && profile && center">
      <v-icondefault></v-icondefault>
      <v-tilelayer :url="url" :attribution="attribution"></v-tilelayer>
      <v-control class="example-custom-control m-2" style="border-radius: 10px; opacity: 75%" :position="'bottomright'">
        <div class="py-2 px-2" style="font-weight: bold">
          <div><img :src="st_im" class="px-1" />Stasiun</div>
        </div>
      </v-control>
      <v-marker v-if="latLng && profile && center" :lat-lng="latLng">
        <v-icon>
          <img :src="st_im" class="iconSZ" />
        </v-icon>
        <v-popup>
          <div class="text-center">
            <img :src="st_i" class="imgSZ" />
            <div class="my-1" style="font-weight: 600">
              {{ profile.station_name }}
            </div>
            <router-link type="button" class="btn btn-success d-flex flex-row justify-content-center p-0"
              :to="`/station/update/${profile.station_serial_id}`" v-if="role == 'SuperAdmin'">
              <img :src="edit_i" class="mx-1" />
              <span style="font-size: 0.8rem">Edit</span></router-link>
          </div>
        </v-popup>
      </v-marker>
      <v-control-scale position="topright" :imperial="false" :metric="true"></v-control-scale>
    </v-map>
  </div>
</template>

<script>
import * as Vue2Leaflet from "vue2-leaflet";
import st_im from "@/assets/icons/map/marr.svg";
import st_i from "@/assets/icons/map/arr.svg";
import edit_i from "@/assets/icons/map/edit.svg";
import axios from "axios";

export default {
  name: "TableMap",
  props: ["loading_i"],

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
      url: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
      attribution: "",
      zoom: null,
      center: undefined,
      st_im,
      st_i,
      edit_i,
      station: [],
      profile: null

    };
  },
  computed: {
    latLng() {
      const latitude = Number(this.profile.latitude);
      const longitude = Number(this.profile.longitude);
      if (isNaN(latitude) || isNaN(longitude)) {
        return null;
      }
      return [latitude, longitude];
    }
  },
  methods: {
    centerUpdated(center) {
      this.center = center;
    },
    zoomUpdated(zoom) {
      this.zoom = zoom;
    },
    async loadProfile() {
      await axios
        .get(`${this.$baseURL}/pdam/station/${this.$route.params.id}/`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        })
        .then((r) => {
          if (r.status == 200) {
            // this.loading_i = false;
            this.profile = r.data.data;
            // console.log(this.profile);
            this.center = [this.profile.latitude, this.profile.longitude];
          }
        })
        .catch((e) => {
          this.e_code = e.response.status;
          this.msg = "An error occurred on the server. Please try again later.";
        });
    },
  },

  created() {
    this.extractUserInfo()



  },
  mounted() {
    this.loadProfile()
    // console.log(this.profile);
  }
};
</script>

<style scoped>
.map {
  height: 30vh;
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

<style scoped src="@/assets/css/figma.css"></style>
