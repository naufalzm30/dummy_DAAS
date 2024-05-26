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
        <div class="subTitle">Daftar Pos</div>
        <div>
          <router-link
            v-if="role === 'is_superuser'"
            :to="{ name: 'AddStation' }"
            type="button"
            class="btn btn-primary float-right my-2"
            style="padding: 5px 10px"
            >Tambah Data</router-link
          >
        </div>
      </div>
      <dataset
        v-slot="{ ds }"
        :ds-data="stations"
        :ds-sortby="sortBy"
        :ds-search-in="['station_name']"
      >
        <div :data-page-count="ds.dsPagecount">
          <dataset-search ds-search-placeholder="Search..." />
        </div>

        <div class="row mt-2">
          <div class="col-md-12">
            <div class="table-responsive">
              <table
                class="table table-hover table-responsive text-nowrap text-center table-borderless bg-white"
              >
                <thead class="table-light">
                  <tr>
                    <th scope="col">#</th>
                    <th
                      v-for="(th, index) in cols"
                      :key="th.field"
                      :class="['sort', th.sort]"
                      @click="click($event, index)"
                      class="thLight"
                    >
                      {{ th.name }} <i class="gg-select float-right"></i>
                    </th>
                  </tr>
                </thead>
                <div
                  v-if="loading_i"
                  class="d-flex flex-column justify-content-center align-items-center"
                >
                  <i
                    class="zmdi zmdi-spinner zmdi-hc-spin"
                    style="font-size: 1.5rem"
                  ></i>
                </div>
                <dataset-item tag="tbody">
                  <template #default="{ row, rowIndex }">
                    <tr>
                      <td scope="row">{{ rowIndex + 1 }}</td>
                      <td>{{ row.station_name }}</td>

                      <!-- <td v-if="role == 'is_superuser'">
                        <span v-for="item in balais" :key="item.id">
                          <span v-if="item.id == row.balai">
                            {{ item.balai }}
                          </span>
                        </span>
                      </td> -->
                      <td>{{ row.location }}</td>
                      <td>{{ row.latitude }}</td>
                      <td>{{ row.longitude }}</td>
                      <td>
                        <router-link
                          type="button"
                          class="btn btn-primary btn-sm mx-1"
                          :to="{
                            path: '/station/data/' + row.id + '/1',
                          }"
                          >Data</router-link
                        >
                        <span
                          v-if="role == 'is_staff' || role == 'is_superuser'"
                        >
                          <router-link
                            type="button"
                            class="btn btn-success btn-sm mx-1"
                            :to="`/station/update/6/${row.id}`"
                            >Edit</router-link
                          >
                        </span>
                      </td>
                    </tr>
                  </template>
                </dataset-item>
              </table>
            </div>
          </div>
        </div>
        <div
          class="d-flex flex-md-row flex-column justify-content-between align-items-center"
        >
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
      station:0,
      balai: null,
      nama_pos: "",
      cols: [
        {
          name: "Nama Pos",
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
          name: "Nama Pos",
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
      console.log('role: ', this.role);
      
      await axios
        .get(`${this.$baseURL}/station/${this.station}`, {
          headers: {
            Authorization: `Token ${this.token}`,
          },
        })
        .then((r) => {
          this.stations = r.data;
          if (r.status == 200) {
            this.loading_i = false;
          }
        });
    },
  },
  created() {
    this.gAuthStation();
    this.loadData();
    if (this.role == "is_superuser") {
      this.cols = this.colSuper;
      this.station = 0
    }
  },
  mounted() {
    this.gBalai();
  },
};
</script>

<style scoped src="@/assets/css/figma.css">
</style>
