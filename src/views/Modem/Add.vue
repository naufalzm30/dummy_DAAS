<template>
  <div>
    <Header />
    <form @submit.prevent="submit">
      <div class="mobile-width">
        <div class="bwsTitle mobile-top">
          {{ $app_title }}
        </div>
        <div class="row my-2">
          <div class="col-md subTitle">Tambah Modem Baru</div>
          <div class="col-md d-flex justify-content-end">
            <router-link
              :to="{ name: 'Modem' }"
              type="button"
              class="btn btn-light border mx-4 bg-white"
              >Cancel</router-link
            >
            <button class="btn btn-primary" type="submit">Simpan</button>
          </div>
        </div>

        <div class="card">
          <div class="card-header">Data Modem</div>
          <div class="card-body row">
            <div class="col-md">
              <div class="pb-3">
                <label for="floatingInput">Versi Modem*</label>
                <input
                  v-model="modem_ver"
                  type="number"
                  class="form-control"
                  placeholder="Versi Modem"
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
  name: "AddModem",
  components: {
    Header,
  },
  data() {
    return {
      modem_ver: "",
    };
  },
  methods: {
    async submitData() {
      await axios
        .post(
          `${this.$baseURL}/modem-type/`,
          {
            modem_ver: this.modem_ver,
          },
          {
            headers: {
              Authorization: `Token ${this.token}`,
            },
          }
        )
        .then((r) => {
          if (r.status == 201) {
            this.$router.push({ name: "Modem" });
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

      this.submitData();
    },
  },
  created() {
    this.gAuthCheck();
  },
};
</script> <style scoped src="@/assets/css/figma.css">
</style>
