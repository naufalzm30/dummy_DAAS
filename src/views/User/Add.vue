<template >
  <div>
    <Header />
    <div class="mobile-width">
      <div class="bwsTitle mobile-top">
        {{ $app_title }}
      </div>
      <form @submit.prevent="submit">
        <div class="row my-2">
          <div class="col-md subTitle">Tambah User Baru</div>
          <div class="col-md d-flex justify-content-end">
            <router-link :to="{ name: 'User' }" type="button"
              class="btn btn-light border mx-4 bg-white">Cancel</router-link>
            <button class="btn btn-primary" type="submit">Simpan</button>
          </div>
        </div>
        <div class="row mt-3">
          <div class="col-md-6">
            <div class="card">
              <div class="card-header">Data User</div>
              <div class="card-body">
                <div class="col-md pb-3">
                  <div class="form-group">
                    <label for="inputNama">Username*</label>
                    <input v-model="userData" type="text" class="form-control" id="inputNama" placeholder="Nama"
                      required />
                  </div>
                </div>

                <div class="col-md pb-3">
                  <div class="form-group">
                    <label for="inputPass">Password*</label>
                    <input type="password" class="form-control" placeholder="Password" v-model="password" required attr
                      id="inputPass" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="card">
              <div class="card-header">Data Produksi</div>
              <div class="card-body">
                <div class="col-md pb-3" >
                  <label for="floatingInput">Role*</label>
                  <select class="form-select" v-model="roleUser" required>
                    <option disabled value="">Pilih Role</option>
                    <option v-for="item in roles" :key="item.id" :value="item.id">
                      {{ item.role }}
                    </option>
                  </select>
                </div>
                
                <div v-if="roleUser == 2" class="col-md pb-3" >
                  <label for="floatingInput">Produksi*</label>
                  <select class="form-select" v-model="produksi" required>
                    <option disabled value="">Pilih Produksi</option>
                    <option v-for="item in produksis" :key="item.id" :value="item.id">
                      {{ item.balai_name }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Public/Header.vue";
import axios from "axios";

export default {
  name: "AddUser",
  components: {
    Header,
  },
  data() {
    return {
      produksis: [],
      roles: [],
      userData: "",
      password: "",
      roleUser: "",
      produksi: 1,
      email: "q9@test.test",
      first_name: "x",
      last_name: "x",
    };
  },
  methods: {
    async submitData() {
      await axios
        .post(
          `${this.$baseURL}/user/`,
          {
            username: this.userData, password: this.password,
            balai: this.produksi,
            email: this.email,
            first_name: this.first_name,
            last_name: this.last_name,
            role: this.roleUser,

          },
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          }
        )
        .then((r) => {
          if (r.status == 201) {
            this.$router.push({ name: "User" });
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
  async created() {
    this.extractUserInfo()

    await axios
      .get(`${this.$baseURL}/balai/`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      })
      .then((r) => {
        this.produksis = r.data.data
      }).catch((error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          this.logoutUser();
        } else {
          console.error('Error msg: ', error);
        }
      });

    await axios
      .get(`${this.$baseURL}/role/`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      })
      .then((r) => {
        this.roles = r.data.data

      }).catch((error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          this.logoutUser();
        } else {
          console.error('Error msg: ', error);
        }
      });
  },
  async mounted() {


  },
};
</script>

<style scoped src="@/assets/css/figma.css"></style>
