<template>
  <div>
    <Header />
    <div class="mobile-width d-flex justify-content-between align-items-center">
      <div class="bwsTitle mobile-top">
        {{ $app_title }}
      </div>
    </div>
    <div class="mobile-width">
      <div class="d-flex justify-content-between align-items-center">
        <div class="subTitle">Daftar Stasiun</div>
        <div>
          <router-link v-if="role === 'SuperAdmin'" :to="{ name: 'AddStation' }" type="button"
            class="btn btn-primary float-right my-1" style="padding: 5px 10px">Tambah Data</router-link>
        </div>
      </div>

      <dataset v-slot="{ ds }" :ds-data="stations" :ds-sortby="sortBy" :ds-search-in="['station_name', 'location']">
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
                      <td v-if="role == 'SuperAdmin'">{{ row.balai.balai_name }}</td>
                      <td>{{ row.latitude }}</td>
                      <td>{{ row.longitude }}</td>
                      <td>
                        <router-link type="button" class="btn btn-primary btn-sm mx-1"
                          :to="{ path: `/station/data/${row.station_serial_id}` }">Data</router-link>
                        <span v-if="role == 'SuperAdmin'">
                          <router-link type="button" class="btn btn-success btn-sm mx-1"
                            :to="`/station/update/${row.station_serial_id}/`">Edit</router-link>
                        </span>
      
                        <span v-if="is_staff === true">
                          <button type="button" class="btn btn-danger btn-sm mx-1" v-on:click="deleteData(row.station_serial_id)">
                            Delete
                          </button>
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
          name: "Produksi",
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
    async delete(id) {
      try {
        const response = await axios.delete(`${this.$baseURL}/pdam/station/${id}`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });
        if (response.status == 204) {
          await this.loadData(this.currentPage);
        }
      } catch (error) {
        console.error("Error deleting data:", error);
      }
    },
    deleteData(id) {
      this.$swal({
        title: `Are you sure?`,
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          this.delete(id);
        }
      });
    },
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
      if (this.role == "SuperAdmin") {
        this.cols = this.colSuper;
      } 
      // else {
      //   console.log(this.cols);
      // }

      await axios
        .get(`${this.$baseURL}/pdam/station/`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        })
        .then((r) => {
          // console.log(r);
          
          this.stations = r.data.data;
          if (r.status == 200) {
            this.loading_i = false;
          }
        }).catch((error) => {
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            this.logoutUser();
          } else {
            console.error('Error msg: ', error);
          }
        });
    },
  },
  created() {
    this.extractUserInfo()
    this.loadData();
  },
};
</script>

<style scoped src="@/assets/css/figma.css"></style>
<style scoped>
table td {
  padding: 4px 0;
}


</style>