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
import Map from "@/components/Map/Map.vue";

export default {
  components: {
    Header,
    Map,
  },
  data() {
    return {
      // stations: [],
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
  // watch: {
  //   stations(newVal) {
  //     if (newVal.length) {
  //       // console.log('Stations updated:', newVal);
  //     }
  //   }
  // },
  methods: {
    async checkScreen() {
      this.ava_width = screen.availWidth;
      this.ava_height = screen.availHeight;

    },


  },
  async created() {
    this.extractUserInfo()
    this.balai_name = document.title;
    this.loading_i = false;
  },
  async mounted() {
    this.checkScreen();
  },
};
</script>

<style scoped src="@/assets/css/flex14.css"></style>

<style>
.mobile-width {
  /* max-width: 91%;
  margin-left: 90px; */
  max-width: 92%;
  margin-left: 80px;

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