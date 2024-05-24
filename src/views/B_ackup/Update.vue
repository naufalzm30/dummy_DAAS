<template>
  <div>
    <Header />
    <form @submit.prevent="update">
      <div class="mobile-width">
        <div class="bwsTitle mobile-top">
          {{ $app_title }}
        </div>

        <div class="row my-2">
          <div class="col-md subTitle">
            Edit Data Backup
            <span v-for="title in stations" :key="title.id">
              <span v-if="title.id == item.station">
                {{ title.station_name }}
              </span>
            </span>
          </div>
          <div class="col-md d-flex justify-content-end">
            <router-link
              :to="{ name: 'Backup' }"
              type="button"
              class="btn btn-light border mx-4 bg-white"
              >Cancel</router-link
            >
            <button class="btn btn-primary" type="submit">Simpan</button>
          </div>
        </div>

        <div class="card">
          <div class="card-header">Data Dummy</div>
          <div class="card-body row">
            <div class="col-md-5">
              <div class="pb-3">
                <label for="floatingInput" class="mx-2">Station*</label>
                <select
                  class="form-select fa_select"
                  v-model="item.station"
                  required
                >
                  <option
                    v-for="item in stations"
                    :key="item.id"
                    :value="item.id"
                  >
                    {{ item.station_name }}
                  </option>
                </select>
              </div>
            </div>
            <div class="col-md-5">
              <div class="pb-3">
                <label for="floatingInput">Average*</label>
                <input
                  v-model="item.average"
                  type="number"
                  class="form-control"
                  placeholder="Average Value"
                  required
                  step="0.000001"
                />
              </div>
            </div>
            <div class="col-md">
              <div class="pb-3">
                <div style="font-weight: 500">Active Status</div>
                <label class="switch mt-2">
                  <input
                    type="checkbox"
                    class="switch-input"
                    v-model="item.active"
                  /><!--<i class="icon-play"></i>-->
                  <span
                    class="switch-label"
                    data-on="True"
                    data-off="False"
                  ></span>
                  <span class="switch-handle"></span>
                </label>
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
  name: "UpdateSetup",
  components: {
    Header,
  },
  data() {
    return {
      stations: [],
      item: {
        modem_ver: "",
      },
    };
  },
  methods: {
    async updateData() {
      await axios
        .put(`${this.$baseURL}/dummy/` + this.$route.params.id, this.item, {
          headers: {
            Authorization: `Token ${this.token}`,
          },
        })
        .then((r) => {
          if (r.status == 200) {
            this.$router.push({ name: "Backup" });
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
      .get(`${this.$baseURL}/dummy/` + this.$route.params.id, {
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
    this.gStation();
  },
};
</script> <style scoped src="@/assets/css/figma.css">
</style>

<style scoped>
body {
  font: 13px/20px "Helvetica Neue", Helvetica, Arial, sans-serif;
  color: #404040;
  background: #f2f2f2;
}

p {
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
  color: #999;
}
i {
  position: absolute;
  z-index: 1;
  top: 7px;
  left: 9px;
  color: #999;
}
.container {
  margin: 50px auto;
  width: 280px;
  text-align: center;
  background-color: #f2f2f2;
}
.container > .switch {
  display: block;
  margin: 22px auto;
}

.switch {
  position: relative;
  display: inline-block;
  vertical-align: top;
  width: 96px;
  height: 36px;
  padding: 1px;
  border-radius: 3px;
  cursor: pointer;
}

.switch-input {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
}
.switch-label {
  position: relative;
  display: block;
  height: inherit;
  font-size: 12px;
  text-transform: uppercase;
  background: #fff;
  border-radius: inherit;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.12),
    inset 0 0 2px rgba(0, 0, 0, 0.15);
  -webkit-transition: 0.15s ease-out;
  -moz-transition: 0.15s ease-out;
  -o-transition: 0.15s ease-out;
  transition: 0.15s ease-out;
  -webkit-transition-property: opacity background;
  -moz-transition-property: opacity background;
  -o-transition-property: opacity background;
  transition-property: opacity background;
}
.switch-label:before,
.switch-label:after {
  position: absolute;
  top: 50%;
  margin-top: -0.5em;
  line-height: 1;
  -webkit-transition: inherit;
  -moz-transition: inherit;
  -o-transition: inherit;
  transition: inherit;
}
.switch-label:before {
  content: attr(data-off);
  right: 15px;
  color: #aaa;
  text-shadow: 0 1px rgba(255, 255, 255, 0.5);
}
.switch-label:after {
  content: attr(data-on);
  left: 15px;
  color: white;
  text-shadow: 0 1px rgba(0, 0, 0, 0.2);
  opacity: 0;
}
.switch-input:checked ~ .switch-label {
  background: #3056d3;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.15),
    inset 0 0 3px rgba(0, 0, 0, 0.2);
}
.switch-input:checked ~ .switch-label:before {
  opacity: 0;
}
.switch-input:checked ~ .switch-label:after {
  opacity: 1;
}

.switch-handle {
  position: absolute;
  top: 1px;
  left: -5px;
  width: 36px;
  height: 36px;
  background: white;
  border-radius: 3px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
  background-image: -webkit-linear-gradient(top, white 40%, #f0f0f0);
  background-image: -moz-linear-gradient(top, white 40%, #f0f0f0);
  background-image: -o-linear-gradient(top, white 40%, #f0f0f0);
  background-image: linear-gradient(to bottom, white 40%, #f0f0f0);
  -webkit-transition: left 0.15s ease-out;
  -moz-transition: left 0.15s ease-out;
  -o-transition: left 0.15s ease-out;
  transition: left 0.15s ease-out;
}
.switch-handle:before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -6px 0 0 -6px;
  width: 12px;
  height: 12px;
  background: #f9f9f9;
  border-radius: 6px;
  box-shadow: inset 0 1px rgba(0, 0, 0, 0.02);
  background-image: -webkit-linear-gradient(top, #eeeeee, white);
  background-image: -moz-linear-gradient(top, #eeeeee, white);
  background-image: -o-linear-gradient(top, #eeeeee, white);
  background-image: linear-gradient(to bottom, #eeeeee, white);
}
.switch-input:checked ~ .switch-handle {
  left: 70px;
  box-shadow: -1px 1px 5px rgba(0, 0, 0, 0.2);
}

.switch-green > .switch-input:checked ~ .switch-label {
  background: #4fb845;
}
</style>