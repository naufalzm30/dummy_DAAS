<template>
  <div>
    <Header />

    <form @submit.prevent="submit" v-if="role == 'is_superuser'">
      <div class="mobile-width">
        <div class="bwsTitle mobile-top">
          {{ $app_title }}
        </div>
        <div class="row my-2">
          <div class="col-md subTitle">Tambah Sensor Baru</div>
          <div class="col-md d-flex justify-content-end">
            <router-link
              :to="{ name: 'Sensor' }"
              type="button"
              class="btn btn-light border mx-4 bg-white"
              >Cancel</router-link
            >
            <button class="btn btn-primary" type="submit">Simpan</button>
          </div>
        </div>

        <div class="card">
          <div class="card-header">Data Sensor</div>
          <div class="card-body row">
            <div class="col-md-6">
              <div class="pb-3">
                <label for="floatingInput">Nama Sensor*</label>
                <input
                  v-model="sensor_label"
                  type="text"
                  class="form-control"
                  placeholder="Nama Sensor"
                  required
                />
              </div>
              <div class="pb-3">
                <label for="floatingInput">Satuan</label>
                <input
                  v-model="sensor_symbol"
                  type="text"
                  class="form-control"
                  placeholder="Satuan"
                />
              </div>
            </div>
            <div class="col-md-6">
              <div class="pb-3 row">
                <div class="col-md-10">
                  <label for="floatingInput">Icon*</label>
                  <select class="form-select fa_select" v-model="sensor_icon">
                    <option value="">---</option>
                    <option
                      v-for="item in icons"
                      :key="item.id"
                      :value="item.id"
                    >
                      {{ item.name }}
                    </option>
                  </select>
                </div>

                <div class="col-md-2 mt-4">
                  <div v-for="item in icons" :key="item.id">
                    <div v-if="item.id == sensor_icon" class="justify">
                      <img
                        class="my-2 mx-auto d-block"
                        :src="item.icon"
                        :alt="item.name"
                        height="35"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="pb-3">
                <label for="floatingInput">Jenis Chart*</label>
                <select class="form-select" v-model="chart_type" required>
                  <option v-for="item in charts" :key="item" :value="item">
                    {{ item }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import Header from "@/components/Public/Header.vue";
import axios from "axios";

export default {
  name: "AddSensor",
  components: {
    Header,
  },
  data() {
    return {
      icons: [],
      sensor_label: "",
      sensor_symbol: "",
      sensor_icon: "",
      chart_type: "",
      charts: ["BarChart", "LineChart", "Gauge", "Card"],
    };
  },
  methods: {
    async submitStation() {
      await axios
        .post(
          `${this.$baseURL}/sensor-type/`,
          {
            sensor_label: this.sensor_label,
            sensor_symbol: this.sensor_symbol,
            sensor_icon: this.sensor_icon,
            chart_type: this.chart_type,
          },
          {
            headers: {
              Authorization: `Token ${this.token}`,
            },
          }
        )
        .then((r) => {
          if (r.status == 201) {
            this.$router.push({ name: "Sensor" });
          }
        });
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

      this.submitStation();
    },
  },
  created() {
    this.gAuthCheck();
  },
  async mounted() {
    this.gIcons();
  },
};
</script>
<style scoped src="@/assets/css/figma.css">
</style>