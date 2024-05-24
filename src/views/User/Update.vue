<template>
  <div>
    <Header />
    <div class="mobile-width">
      <div class="bwsTitle mobile-top">
        {{ $app_title }}
      </div>
      <form @submit.prevent="update">
        <div class="row my-2">
          <div class="col-md subTitle">Edit User {{ item.user }}</div>
          <div class="col-md d-flex justify-content-end">
            <router-link :to="{ name: 'User' }" type="button"
              class="btn btn-light border mx-4 bg-white">Cancel</router-link>
            <button class="btn btn-primary" type="submit">Update</button>
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
                    <input v-model="item.user" type="text" class="form-control" id="inputNama" placeholder="Nama"
                      required />
                  </div>
                </div>

                <div class="col-md pb-3">
                  <div class="form-group">
                    <label for="inputPass">Password*</label>
                    <input type="password" class="form-control" placeholder="Password" v-model="item.password" required
                      id="inputPass" />
                  </div>
                </div>

                <div class="col-md pb-3" v-if="role == 'is_superuser'">
                  <label for="floatingInput">Role*</label>
                  <select class="form-select" v-model="item.role" required>
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
                  <label for="floatingInput">Balai*</label>
                  <select class="form-select" v-model="item.balai" required>
                    <option v-for="item in balais" :key="item.id" :value="item.id">
                      {{ item.balai }}
                    </option>
                  </select>
                </div>

                <div class="col-md pb-3" v-if="role == 'is_superuser'">
                  <label for="floatingInput">Provinsi*</label>
                  <select class="form-select" v-model="item.provinsi" required>
                    <option v-for="item in provinsis" :key="item.id" :value="item.id">
                      {{ item.provinsi }}
                    </option>
                  </select>
                </div>
                <div class="col-md pb-3">
                  <div class="form-group">
                    <label for="inputPhone">Phone</label>
                    <input v-model="item.phone" type="text" class="form-control" id="inputPhone" placeholder="Phone" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- ---- -->
      </form>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Public/Header.vue";
import axios from "axios";

export default {
  name: "UpdateUser",
  components: {
    Header,
  },
  data() {
    return {
      balais: [],
      provinsis: [],
      item: {
        user: "",
        password: "",
        role: null,
        text: "",
        phone: "",
        provinsi: null,
        balai: null,
        created_by: null,
      },
    };
  },
  methods: {
    async updateBalai() {
      await axios
        .put(
          `${this.$baseURL}/user/${this.balai}/${this.$route.params.id}`,
          this.item,
          {
            headers: {
              Authorization: `Token ${this.token}`,
            },
          }
        )
        .then((r) => {
          if (r.status == 200) {
            this.$router.push({ name: "User" });
          }
        })
        .catch(() => {
          localStorage.clear();
          this.$router.push({ name: "Login" });
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
    if (this.$route.params.balai_id != this.balai) {
      localStorage.clear();
      this.$router.push({ name: "Login" });
    }

    await axios
      .get(`${this.$baseURL}/user/${this.balai}/${this.$route.params.id}`, {
        headers: {
          Authorization: `Token ${this.token}`,
        },
      })
      .then((r) => {
        this.item = r.data[0];
      });
  },

  async created() {
    this.gAuthUser();
    this.gBalai();
    this.gProvinsi();
  },
};
</script>

<style scoped src="@/assets/css/figma.css"></style>