<template>
  <div>
    <Header />

    <form @submit.prevent="update">
      <div class="mobile-width">
        <div class="bwsTitle mobile-top">
          {{ $app_title }}
        </div>
        <div class="row my-2">
          <div class="col-md subTitle">Edit Sensor {{ item.sensor_label }}</div>
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
                  v-model="item.sensor_label"
                  type="text"
                  class="form-control"
                  placeholder="Nama Sensor"
                  required
                />
              </div>
              <div class="pb-3">
                <label for="floatingInput">Satuan</label>
                <input
                  v-model="item.sensor_symbol"
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
                  <select
                    class="form-select fa_select"
                    v-model="item.sensor_icon"
                  >
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
                  <div v-for="itemIcon in icons" :key="itemIcon.id">
                    <div v-if="itemIcon.id == item.sensor_icon">
                      <img
                        class="my-2 mx-auto d-block"
                        :src="itemIcon.icon"
                        :alt="itemIcon.name"
                        height="35"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="pb-3">
                <label for="floatingInput">Jenis Chart*</label>
                <select class="form-select" v-model="item.chart_type" required>
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
  name: "UpdateSensor",
  components: {
    Header,
  },
  data() {
    return {
      icons: [],
      charts: ["BarChart", "LineChart", "Gauge", "Card"],
      item: {
        sensor_label: "",
        sensor_symbol: "",
        sensor_icon: "",
        chart_type: "",
      },
    };
  },
  methods: {
    async updateBalai() {
      await axios
        .put(
          `${this.$baseURL}/sensor-type/` + this.$route.params.id,
          this.item,
          {
            headers: {
              Authorization: `Token ${this.token}`,
            },
          }
        )
        .then((r) => {
          if (r.status == 200) {
            this.$router.push({ name: "Sensor" });
          }
        });
    },

    update() {
      this.$swal({
        position: "top-end",
        width: "300px",
        icon: "success",
        title: "Your work has been saved",
        showConfirmButton: false,
        timer: 1500,
      });

      this.updateBalai();
    },
  },
  async mounted() {
    await axios
      .get(`${this.$baseURL}/sensor-type/` + this.$route.params.id, {
        headers: {
          Authorization: `Token ${this.token}`,
        },
      })
      .then((r) => {
        this.item = r.data;
      });
    this.gIcons();
  },
  created() {
    this.gAuthCheck();
  },
};
</script>

<style scoped src="@/assets/css/figma.css">
</style>