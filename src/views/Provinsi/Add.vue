<template>
  <div>
    <Header />
    <form @submit.prevent="submit" v-if="role == 'is_superuser'">
      <div class="mobile-width">
        <div class="bwsTitle mobile-top">
          {{ $app_title }}
        </div>
        <div class="row my-2">
          <div class="col-md subTitle">Tambah Provinsi Baru</div>
          <div class="col-md d-flex justify-content-end">
            <router-link
              :to="{ name: 'Provinsi' }"
              type="button"
              class="btn btn-light border mx-4 bg-white"
              >Cancel</router-link
            >
            <button class="btn btn-primary" type="submit">Simpan</button>
          </div>
        </div>

        <div class="card">
          <div class="card-header">Data Provinsi</div>
          <div class="card-body">
            <div class="col-md pb-3">
              <label for="floatingInput">Nama Provinsi*</label>
              <input
                v-model="provinsi"
                type="text"
                class="form-control"
                placeholder="Nama Provinsi"
                required
              />
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
  name: "AddProvinsi",
  components: {
    Header,
  },
  data() {
    return {
      provinsi: "",
    };
  },
  methods: {
    async submitData() {
      await axios
        .post(
          `${this.$baseURL}/provinsi/`,
          {
            provinsi: this.provinsi,
          },
          {
            headers: {
              Authorization: `Token ${this.token}`,
            },
          }
        )
        .then((r) => {
          if (r.status == 201) {
            this.$router.push({ name: "Provinsi" });
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

