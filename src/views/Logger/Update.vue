<template>
  <div>
    <Header />
    <form @submit.prevent="update">
      <div class="mobile-width">
        <div class="bwsTitle mobile-top">
          {{ $app_title }}
        </div>

        <div class="row my-2">
          <div class="col-md subTitle">Edit Logger {{ item.logger_ver }}</div>
          <div class="col-md d-flex justify-content-end">
            <router-link
              :to="{ name: 'Logger' }"
              type="button"
              class="btn btn-light border mx-4 bg-white"
              >Cancel</router-link
            >
            <button class="btn btn-primary" type="submit">Simpan</button>
          </div>
        </div>

        <div class="card">
          <div class="card-header">Data Logger</div>
          <div class="card-body row">
            <div class="col-md-6">
              <div class="pb-3">
                <label for="floatingInput">Versi Logger*</label>
                <input
                  v-model="item.logger_ver"
                  type="text"
                  class="form-control"
                  placeholder="Versi Logger"
                  required
                />
              </div>
              <div class="pb-3">
                <label for="floatingInput">Max Channel</label>
                <input
                  v-model="item.max_channel"
                  type="number"
                  class="form-control"
                  placeholder="Max Channel"
                  required
                />
              </div>
            </div>
            <div class="col-md">
              <div class="pb-3">
                <label for="floatingInput">Max Analog*</label>
                <input
                  v-model="item.max_analog"
                  type="number"
                  class="form-control"
                  placeholder="Max Analog"
                  required
                />
              </div>
              <div class="pb-3">
                <label for="floatingInput">Max Digital*</label>
                <input
                  v-model="item.max_digital"
                  type="number"
                  class="form-control"
                  placeholder="Max Digital"
                  required
                />
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
  name: "UpdateProvinsi",
  components: {
    Header,
  },
  data() {
    return {
      item: {
        logger_ver: "",
        max_channel: null,
        max_analog: null,
        max_digital: null,
      },
    };
  },
  methods: {
    async updateData() {
      await axios
        .put(
          `${this.$baseURL}/logger-type/` + this.$route.params.id,
          this.item,
          {
            headers: {
              Authorization: `Token ${this.token}`,
            },
          }
        )
        .then((r) => {
          if (r.status == 200) {
            this.$router.push({ name: "Logger" });
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

      this.updateData();
    },
  },
  async mounted() {
    await axios
      .get(`${this.$baseURL}/logger-type/` + this.$route.params.id, {
        headers: {
          Authorization: `Token ${this.token}`,
        },
      })
      .then((r) => {
        this.item = r.data;
      });
  },
  created() {
    this.gAuthCheck();
  },
};
</script> <style scoped src="@/assets/css/figma.css">
</style>
