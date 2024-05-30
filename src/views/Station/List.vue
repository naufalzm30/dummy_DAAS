<template>
  <div>
    <Header />
    <div class="mobile-width d-flex justify-content-between align-items-center">
      <!-- {{ profile.station }}
      {{ profile.user.username }}, {{ profile.station.station_name }} -->
      <div class="bwsTitle mobile-top">
        {{ $app_title }}
      </div>
    </div>
    <div class="mobile-width">
      <div class="d-flex justify-content-between align-items-center">
        <div class="subTitle">Daftar Stasiun</div>
        <div>
          <router-link v-if="role === 'is_superuser'" :to="{ name: 'AddStation' }" type="button"
            class="btn btn-primary float-right my-2" style="padding: 5px 10px">Tambah Data</router-link>
        </div>
      </div>
      <dataset v-slot="{ ds }" :ds-data="stations" :ds-sortby="sortBy" :ds-search-in="['station_name']">
        <div :data-page-count="ds.dsPagecount">
          <dataset-search ds-search-placeholder="Search..." />
        </div>

        <div class="row mt-2">
          <div class="col-md-12">
            <div class="table-responsive">
              <table class="table table-hover table-responsive text-nowrap text-center table-borderless bg-white">
                <thead class="table-light">
                  <tr>
                    <th scope="col">#</th>
                    <th v-for="(th, index) in cols" :key="th.field" :class="['sort', th.sort]"
                      @click="click($event, index)" class="thLight">
                      {{ th.name }} <i class="gg-select float-right"></i>
                    </th>
                  </tr>
                </thead>
                <div v-if="loading_i" class="d-flex flex-column justify-content-center align-items-center">
                  <i class="zmdi zmdi-spinner zmdi-hc-spin" style="font-size: 1.5rem"></i>
                </div>
                <dataset-item tag="tbody">
                  <template #default="{ row, rowIndex }">
                    <tr>
                      <td scope="row">{{ rowIndex + 1 }}</td>
                      <td>{{ row.station_name }}</td>
                      <td>{{ row.location }}</td>
                      <td>{{ row.latitude }}</td>
                      <td>{{ row.longitude }}</td>
                      <td>
                        <router-link v-if="profile.station == null" type="button" class="btn btn-primary btn-sm mx-1"
                          :to="{ path: '/station/data/' + row.id + '/0'}">Data</router-link>
                        <router-link v-else type="button" class="btn btn-primary btn-sm mx-1"
                          :to="{ path: '/station/data/' + row.id + '/' + profile.station.id }">Data</router-link>
                        <span v-if="role == 'is_staff' || role == 'is_superuser'">
                          <router-link type="button" class="btn btn-success btn-sm mx-1"
                            :to="`/station/update/0/${row.id}`">Edit</router-link>
                        </span>
                      </td>
                    </tr>
                  </template>
                </dataset-item>
              </table>
            </div>
          </div>
        </div>
        <div class="d-flex flex-md-row flex-column justify-content-between align-items-center">
          <dataset-info class="mb-2 mb-md-0" />
          <dataset-pager />
        </div>
      </dataset>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Public/Header.vue";
import axios from "axios";
import { mapActions } from 'vuex';

import {
  Dataset,
  DatasetItem,
  DatasetInfo,
  DatasetPager,
  DatasetSearch,
  // DatasetShow,
} from "vue-dataset";

export default {
  name: "Station",
  components: {
    Header,
    Dataset,
    DatasetItem,
    DatasetInfo,
    DatasetPager,
    DatasetSearch,
    // DatasetShow,
  },
  data: function () {
    return {
      stations: [],
      loading_i: true,
      balais: [],
      role: null,
      station: 0,
      balai: null,
      nama_pos: "",
      cols: [
        {
          name: "Nama Stasiun",
        },
        {
          name: "Lokasi",
        },
        {
          name: "Latitude",
        },
        {
          name: "Longitude",
        },

        {
          name: "Action",
        },
      ],
      colSuper: [
        {
          name: "Nama Stasiun",
        },

        {
          name: "Lokasi",
        },
        {
          name: "Latitude",
        },
        {
          name: "Longitude",
        },

        {
          name: "Action",
        },
      ],
      userStationList: []
    };
  },
  computed: {
    sortBy() {
      return this.cols.reduce((acc, o) => {
        if (o.sort) {
          o.sort === "asc" ? acc.push(o.field) : acc.push("-" + o.field);
        }
        return acc;
      }, []);
    },
  },
 
  methods: {
    ...mapActions(['updateUserStationList']),
    click(event, i) {
      let toset;
      const sortEl = this.cols[i];
      if (!event.shiftKey) {
        this.cols.forEach((o) => {
          if (o.field !== sortEl.field) {
            o.sort = "";
          }
        });
      }
      if (!sortEl.sort) {
        toset = "asc";
      }
      if (sortEl.sort === "desc") {
        toset = event.shiftKey ? "" : "asc";
      }
      if (sortEl.sort === "asc") {
        toset = "desc";
      }
      sortEl.sort = toset;
    },
    async loadData() {
      // console.log('role: ', this.role);
      if (this.role == "is_superuser") {
        this.cols = this.colSuper;
        this.station = 0
      } else {
        this.station = this.profile.station.id
      }


      if (this.profile.station == null) {
      await axios
        .get(`${this.$baseURL}/station/0`, {
          headers: {
            Authorization: `Token ${this.token}`,
          },
        })
        .then((r) => {

          if (r.data.length > 1) {
            this.stations = r.data;
          } else {
            this.stations = [r.data];
          }

          if (r.status == 200) {
            this.loading_i = false;
          }
        });
      } else if (this.profile.station != null) {
        await axios
          .get(`${this.$baseURL}/station/role/${this.profile.station.id}`, {
            headers: {
              Authorization: `Token ${this.token}`,
            },
          })
          .then((r) => {

            if (r.data.length > 1) {
              this.stations = r.data;
            } else {
              this.stations = [r.data];
            }

            if (r.status == 200) {
              this.loading_i = false;
            }
            this.userStationList = this.stations.map(station => station.id)
            this.updateUserStationList(this.userStationList);
            console.log('L ist.vue', this.userStationList);
          });
      }
    },
  },
  created() {
    this.extractUserInfo()
    this.gAuthStation();
    this.loadData();


  },
  mounted() {
    // this.gBalai();
    this.updateUserStationList(this.userStationList);
  },
};
</script>

<style scoped src="@/assets/css/figma.css"></style>
