<template>
  <div>
    <Header />
    <form @submit.prevent="submit" v-if="role == 'is_superuser'">
   <div class="mobile-width">
        <div class="bwsTitle mobile-top">
          {{ $app_title }}
        </div>
        <div class="row my-2">
          <div class="col-md subTitle">Tambah Balai Baru</div>
          <div class="col-md d-flex justify-content-end">
            <router-link
              :to="{ name: 'Balai' }"
              type="button"
              class="btn btn-light border mx-4 bg-white"
              >Cancel</router-link
            >
            <button class="btn btn-primary" type="submit">Simpan</button>
          </div>
        </div>

        <div class="row mt-3">
          <div class="col-md-6">
            <div class="card">
              <div class="card-header">Data Balai</div>
              <div class="card-body">
                <div class="col-md pb-3">
                  <label for="floatingInput">Nama Balai*</label>
                  <input
                    v-model="balai"
                    type="text"
                    class="form-control"
                    placeholder="Nama Balai"
                    required
                  />
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-header">Data Running Text</div>
              <div class="card-body">
                <div class="col-md pb-3">
                  <div class="form-group">
                    <label for="inputNama">Text Duration*</label>
                    <input
                      v-model="text_duration"
                      type="number"
                      class="form-control"
                      placeholder="Text Duration"
                      required
                    />
                  </div>
                </div>

                <div class="col-md pb-3">
                  <div class="form-group">
                    <label for="inputPass">Text Repeat*</label>
                    <input
                      v-model="text_repeat"
                      type="number"
                      class="form-control"
                      placeholder="Text Repeat"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="card">
              <div class="card-header">Data Peta</div>
              <div class="card-body">
                <div class="col-md pt-1">
                  <div class="form-group">
                    <label for="inputPhone">Latitude*</label>
                    <input
                      v-model="latitude"
                      type="number"
                      class="form-control"
                      placeholder="Latitude"
                      step="0.000000001"
                      required
                    />
                  </div>
                </div>
                <div class="col-md pt-4">
                  <div class="form-group">
                    <label for="inputPhone">Longitude*</label>
                    <input
                      v-model="longitude"
                      type="number"
                      class="form-control"
                      placeholder="Longitude"
                      step="0.000000001"
                      required
                    />
                  </div>
                </div>
                <div class="col-md pt-4 pb-3">
                  <div class="form-group">
                    <label for="inputPhone">Zoom Peta*</label>
                    <div class="value">{{ map_zoom }}</div>
                    <input
                      v-model="map_zoom"
                      type="range"
                      class="form-control"
                      placeholder="no"
                      min="1"
                      max="17"
                      style="cursor: pointer"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>

    <!-- <div class="value">0</div>
    <input type="range" min="0" max="10" step="1" value="0" /> -->
  </div>
</template>

<script>
import Header from "@/components/Public/Header.vue";
import axios from "axios";

export default {
  name: "AddBalai",
  components: {
    Header,
  },
  data() {
    return {
      balai: "",
      latitude: null,
      longitude: null,
      map_zoom: null,
      text_duration: null,
      text_repeat: null,
    };
  },
  methods: {
    async submitData() {
      let result = await axios.post(
        `${this.$baseURL}/balai/`,
        {
          balai: this.balai,
          latitude: this.latitude,
          longitude: this.longitude,
          map_zoom: this.map_zoom,
          text_duration: this.text_duration,
          text_repeat: this.text_repeat,
        },
        {
          headers: {
            Authorization: `Token ${this.token}`,
          },
        }
      );

      if (result.status == 201) {
        this.$router.push({ name: "Balai" });
      }
    },
    submit() {
      this.$swal({
        position: "top-end",
        width: "300px",
        icon: "success",
        title: "Your work has been saved",
        showConfirmButton: false,
        timer: 1500,
      });

      this.submitData();
    },
  },
  mounted() {
    var elem = document.querySelector('input[type="range"]');

    var rangeValue = function () {
      var newValue = elem.value;
      var target = document.querySelector(".value");
      target.innerHTML = newValue;
    };

    elem.addEventListener("input", rangeValue);
  },
  created() {
    this.gAuthCheck();
  },
};
</script>
<style scoped src="@/assets/css/figma.css">
</style>

<style scoped>
.value {
  border-bottom: 4px dashed #bdc3c7;
  text-align: center;
  font-weight: bold;
  font-size: 3rem;
  width: 300px;
  height: 50px;
  line-height: 10px;
  margin: 20px auto;
  letter-spacing: -0.07em;
  text-shadow: white 2px 2px 2px;
}
input[type="range"] {
  display: block;
  /* -webkit-appearance: none; */
  background-color: #bdc3c7;
  width: 300px;
  height: 5px;
  border-radius: 5px;
  margin: 0 auto;
  outline: 0;
}
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  background-color: #3056d3;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid white;
  cursor: pointer;
  transition: 0.3s ease-in-out;
}
input[type="range"]::-webkit-slider-thumb:hover {
  background-color: white;
  border: 2px solid #3056d3;
}
input[type="range"]::-webkit-slider-thumb:active {
  transform: scale(1.2);
}
</style>