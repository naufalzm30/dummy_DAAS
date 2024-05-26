<template>
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
                    <label for="inputNama">Nama*</label>
                    <input v-model="userData" type="text" class="form-control" id="inputNama" placeholder="Nama"
                      required />
                  </div>
                </div>

                <div class="col-md pb-3">
                  <div class="form-group">
                    <label for="inputPass">Password*</label>
                    <input type="password" class="form-control" placeholder="Password" v-model="password" required
                      id="inputPass" />
                  </div>
                </div>

                <div class="col-md pb-3" v-if="role == 'is_superuser'">
                  <label for="floatingInput">Role*</label>
                  <select class="form-select" v-model="roleUser" required>
                    <option value="is_superuser">Superadmin</option>
                    <option value="is_staff">Admin</option>
                    <option value="is_guess">Tamu</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="card">
              <div class="card-header">Data Balai</div>
              <div class="card-body">
                <div class="col-md pb-3" v-if="role == 'is_superuser'">
                  <label for="floatingInput">Station*</label>
                  <select class="form-select" v-model="stationUser" required>
                    <option v-for="item in stations" :key="item.id" :value="item.id">
                      {{ item.station_name }}
                    </option>
                  </select>
                </div>

             
                <div class="col-md pb-3">
                  <div class="form-group">
                    <label for="inputPhone">Phone</label>
                    <input v-model="phone" type="text" class="form-control" id="inputPhone" placeholder="Phone" />
                  </div>
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
      stations: [],
      
      userData: "",
      password: "",
      roleUser: null,
      phone: null,
      provinsi: null,
      stationUser: null,
    };
  },
  methods: {
    async submitData() {
      await axios
        .post(
          `${this.$baseURL}/user/0`,
          {
            station: this.stationUser,
            user: this.userData,
            password: this.password,
            role: this.roleUser,
            phone: this.phone,
            
            created_by: this.user_id,
          },
          {
            headers: {
              Authorization: `Token ${this.token}`,
            },
          }
        )
        .then((r) => {
          console.log(r.data);
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
  created() {
    this.gAuthUser();
  
  },
  async mounted() {
    this.stations = await this.fetchData(`${this.$baseURL}/station/0`);
  },
};
</script>

<style scoped src="@/assets/css/figma.css"></style>
