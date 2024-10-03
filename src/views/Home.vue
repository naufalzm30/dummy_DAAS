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
      
      <Map />
      <Footer />
    </div>
  </div>
</template>

<script>
import Header from "@/components/Public/Header";
import logoPDAM from "@/assets/icons/logo-pdam.png";
// import MarqueeText from "@/components/MarqueeText.vue";
import Map from "@/components/Map/Map.vue";
// import axios from "axios";

export default {
  components: {
    Header,
    // MarqueeText,
    Map,
  },
  data() {
    return {
      stations: [],
      isPaused: false,
      text_duration: null,
      text_repeat: null,
      logoPDAM,
      ava_width: null,
      ava_height: null,
      balai: null,
      loading_i: true,
      balai_name: "",
      custom_duration: null,
      showCarousel: true,


    };
  },
  watch: {
    stations(newVal) {
      if (newVal.length) {
        // console.log('Stations updated:', newVal);
      }
    }
  },
  methods: {
    async checkScreen() {
      this.ava_width = screen.availWidth;
      this.ava_height = screen.availHeight;

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
    // async homeData() {
    //   var st_name = [];
    //   var sensor = [];
    //   var st_name_length = null;
    //   var sensor_length = null;

    //   await axios
    //     .get(`${this.$baseURL}/pdam/dashboard/`, {
    //       headers: {
    //         Authorization: `Bearer ${this.token}`,
    //       },
    //     })

    //     .then((r) => {
    //       r.data.data.forEach((e) => {
    //         st_name.push(e.station_name.length);
    //         sensor.push(
    //           e.last_data
    //             .filter(item => item.sensor_name === 'Flow Meter' || item.sensor_name === 'Totalizer')
    //             .reduce((acc, cur) => acc + cur.sensor_name, '')
    //             .length
    //         );
    //         var x =
    //           e.station_name.length + 1
    //         e.last_data
    //           .filter(item => item.sensor_name === 'Flow Meter' || item.sensor_name === 'Totalizer')
    //           .reduce((acc, cur) => acc + cur.sensor_name, '')
    //           .length

    //         e.duration = x * 510;
    //       });
    //       st_name_length = st_name.reduce((a, b) => a + b, 0);
    //       sensor_length = sensor.reduce((a, b) => a + b, 0);
    //       this.stations = r.data.data;
    //       this.custom_duration = (st_name_length + sensor_length) / 2;
    //       this.stations.slice(-1).pop().duration + 200;
    //       if (r.status == 200) {
    //         this.loading_i = false;
    //       }
    //       // console.log(this.stations);

    //     })
    //     .catch((error) => {
    //       if (error.response && (error.response.status === 401 || error.response.status === 403)) {
    //         this.logoutUser();
    //       } else {
    //         console.error('Error msg: ', error);
    //       }
    //     });


    //   let currentIndex = 0;

    //   const playSlide = () => {
    //     setTimeout(() => {
    //       currentIndex = (currentIndex + 1) % this.stations.length;

    //       if (this.$refs.carousel) {
    //         this.$refs.carousel.goToPage(currentIndex);
    //       }
    //       playSlide();
    //     }, this.stations[currentIndex].duration);
    //   };

    //   playSlide();
    // },
  },
  async created() {
    this.extractUserInfo()
    this.balai_name = document.title;
    // console.log(this.role);
    // if (this.role !== 'QA') {
    //   await this.homeData();
    // } else {
    //   this.loading_i = false;
    // }
    this.loading_i = false;

  },
  async mounted() {
    this.checkScreen();
  },
  beforeMount() {
    if (!localStorage.getItem('pageReloaded')) {
      localStorage.setItem('pageReloaded', 'true');
      window.location.reload();
    }
  },

  destroyed() {
    localStorage.removeItem('pageReloaded');
  }
};
</script>

<style scoped src="@/assets/css/flex14.css"></style>

<style>
.mobile-width {
  max-width: 91%;
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