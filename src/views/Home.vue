<template>
  <div class="mobile-width">
    <Header />

    <div v-if="loading_i" class="center-container mt-2">
      <div class="content-container">
        <div class="icon-container">
          <i class="zmdi zmdi-spinner zmdi-hc-spin" style="font-size: 2rem"></i>
        </div>

        <p class="mt-3">Fetching data, please wait...</p>
      </div>
    </div>
    <div v-else>

      <div class="bwsTitle mobile-top">
        {{ balai_name }}

      </div>
      <div v-if="loading_i" class="d-flex flex-column justify-content-center align-items-center mt-2">
        <i class="zmdi zmdi-spinner zmdi-hc-spin" style="font-size: 2rem; margin-right: 20px"></i>
      </div>
      <!-- text_duration: {{ text_duration }} custom_duration: {{ custom_duration }} -->
      <div class="d-flex flex-row" v-if="ava_width > 768">
        <marquee-text :repeat="text_repeat" :duration="custom_duration" :paused="isPaused"
          class="card mt-0 pb-1 box custom-col-md" @mouseenter="isPaused = !isPaused" @mouseleave="isPaused = false">
          <span v-for="station in stations" :key="station[0].id" style="font-size: 1.35rem">
            <span style="color: #1b396b; font-weight: 500">
              {{ station[0].station_name }} &bull;
            </span>
            <span v-if="station[2]">
              <span v-for="(card, index) in [station[2]]" :key="index" class="flex mt-2" style="min-height: 12vh">
                <span v-for="(label, labelIndex) in card.running_label" :key="labelIndex" style="color: #1b396b">
                  {{ label }}: {{ card.running_data[labelIndex] }}
                  {{ card.running_symbol[labelIndex] }}
                  <span v-if="labelIndex !== card.running_label.length - 1">
                    |
                  </span>
                </span>
              </span>
            </span>
            <img v-if="$app_title == 'WEATHER-VUE'" :src="logoBT" style="width: 20px" class="mx-3 my-1" />
            <img v-else-if="$app_title == 'PDAM SURYA SEMBADA'" :src="logoPDAM" style="width: 20px" class="mx-3 my-1" />

            <img v-else :src="logoPU" style="width: 20px" class="mx-3 my-1" />
          </span>
        </marquee-text>
      </div>

      <!-- <div class="row">
        <div class="col" :class="{ 'col-6': ava_width > 768 }">
          <Map />
        </div>
        <div class="col" :class="{ 'col-6 p-0': ava_width > 768 }">
          <Slider :ava_width="ava_width" />
        </div>
      </div> -->
      <Map />
      <Footer />
    </div>
  </div>
</template>

<script>
import Header from "@/components/Public/Header";
import logoPU from "@/assets/logo_pupr.svg";
import logoBT from "@/assets/icons/logo-bt.svg";
import logoPDAM from "@/assets/icons/logo-pdam.png";

import MarqueeText from "@/assets/MarqueeText.vue";
import Map from "@/components/Map/Map.vue";
// import Slider from "@/components/Chart/Slider.vue";
import axios from "axios";

export default {
  components: {
    Header,
    MarqueeText,
    Map,
    // Slider,
  },
  data() {
    return {
      stations: [],
      isPaused: false,
      text_duration: null,
      text_repeat: null,
      logoPU,
      logoBT,
      logoPDAM,
      ava_width: null,
      ava_height: null,
      balai: null,
      loading_i: true,
      balai_name: "",
      custom_duration: null,
      showCarousel: true,
      proxyUrl: null,
      proxyFixedBalai: null,

    };
  },
  methods: {
    async checkScreen() {
      this.ava_width = screen.availWidth;
      this.ava_height = screen.availHeight;
      // console.log('w: '+ this.ava_width + ', h: ' + this.ava_height);
    },
    marquee_f(a, b, c, d) {
      return a.map((card, i) => {
        return {
          sensor: card,
          data: b[i],
          symbol: c[i],
          siaga: d[i],
          role: "is_guess",
        };
      });
    },
    marquee_g(a, b, c) {
      return a.map((card, i) => {
        return {
          sensor: card,
          data: b[i],
          symbol: c[i],
          role: "is_guess",
        };
      });
    },
    async homeData() {
      var st_name = [];
      var sensor = [];
      var st_name_length = null;
      var sensor_length = null;

      if (this.profile.station == null) {
        await axios
          .get(`${this.$baseURL}/home-data`)
          .then((r) => {
            r.data.forEach((e) => {
              st_name.push(e[0].station_name.length);
              sensor.push(
                e[1].table.array_table_label.reduce((a, b) => a + b, 0).length
              );

              var x =
                e[0].station_name.length +
                e[1].table.array_table_label.reduce((a, b) => a + b, 0).length;

              e.duration = x * 510;
            });

            st_name_length = st_name.reduce((a, b) => a + b, 0);
            sensor_length = sensor.reduce((a, b) => a + b, 0);
            this.stations = r.data;

            this.custom_duration = (st_name_length + sensor_length) / 2;
            this.stations.slice(-1).pop().duration + 200;

            if (r.status == 200) {
              this.loading_i = false;
            }

          });
      } else if (this.profile.station != null) {
        await axios
          .get(`${this.$baseURL}/home-data/${this.profile.station.id}`)
          .then((r) => {
            r.data.forEach((e) => {
              st_name.push(e[0].station_name.length);
              sensor.push(
                e[1].table.array_table_label.reduce((a, b) => a + b, 0).length
              );

              var x =
                e[0].station_name.length +
                e[1].table.array_table_label.reduce((a, b) => a + b, 0).length;

              e.duration = x * 510;
            });

            st_name_length = st_name.reduce((a, b) => a + b, 0);
            sensor_length = sensor.reduce((a, b) => a + b, 0);
            this.stations = r.data;

            this.custom_duration = (st_name_length + sensor_length) / 2;
            this.stations.slice(-1).pop().duration + 200;

            if (r.status == 200) {
              this.loading_i = false;
            }

          });
      }


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
  },
  async created() {

    this.balai_name = document.title;
    let user = localStorage.getItem("user-info") || {};

    // this.$proxyBaseUrl = "https://weatherapi.blitztechnology.tech"
    // this.$proxyFixedBalai = 1

    if (typeof user == "object") {
      this.balai = this.$proxyFixedBalai;

      await axios
        .get(`${this.$proxyBaseUrl}/balai/non-auth/${this.balai}`)
        .then((r) => {
          this.detBalai = r.data[0];
        });



      this.text_duration = this.detBalai.text_duration;
      this.text_repeat = this.detBalai.text_repeat;
      this.homeData();
    } else if (typeof user == "string") {
      this.role = JSON.parse(user).profile.role;
      this.user_id = JSON.parse(user).profile.user.id;
      this.balai = JSON.parse(user).profile.balai.id;
      this.token = JSON.parse(user).token;

      await axios
        .get(`${this.$baseURL}/balai/6`, {
          headers: {
            Authorization: `Token ${this.token}`,
          },
        })
        .then((r) => {
          this.detBalai = r.data;
        });
      this.text_duration = this.detBalai.text_duration;
      this.text_repeat = this.detBalai.text_repeat;
      this.homeData();
    }
  },
  async mounted() {
    this.checkScreen();
    // console.log('test home');
    this.extractUserInfo()
  },
};
</script>

<style scoped src="@/assets/css/flex14.css"></style>

<style>
.mobile-width {
  max-width: 90%;
  margin-left: 90px;
}

.mobile-top {
  margin: 0px 0px;
}

@media (max-width: 768px) {
  .mobile-width {
    max-width: 97%;
    margin: auto;
  }

  .mobile-top {
    margin-top: 5px;
  }
}

.center-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  /* Center vertically within viewport */
}

.content-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.icon-container {
  margin-right: 20px;
}
</style>