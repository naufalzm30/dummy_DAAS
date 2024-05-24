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
        <div class="subTitle">Daftar Sensor</div>
        <div>
          <router-link
            v-if="role === 'is_superuser'"
            :to="{ name: 'AddSensor' }"
            type="button"
            class="btn btn-primary float-right my-2"
            style="padding: 5px 10px"
            >Tambah Data</router-link
          >
        </div>
      </div>
      <dataset
        v-slot="{ ds }"
        :ds-data="sensors"
        :ds-sortby="sortBy"
        :ds-search-in="['sensor_label']"
      >
        <div :data-page-count="ds.dsPagecount" class="mb-2">
          <dataset-search ds-search-placeholder="Search..." />
        </div>
        <div class="row">
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
                      class="thLight"
                      @click="click($event, index)"
                    >
                      {{ th.name }} <i class="gg-select float-right"></i>
                    </th>
                  </tr>
                </thead>
                <dataset-item tag="tbody">
                  <template #default="{ row, rowIndex }">
                    <tr>
                      <td scope="row">{{ rowIndex + 1 }}</td>
                      <td>{{ row.sensor_label }}</td>
                      <td>{{ row.sensor_symbol }}</td>
                      <td>
                        <span v-for="item in icons" :key="item.id">
                          <span v-if="item.id == row.sensor_icon">
                            <img
                              :src="item.icon"
                              :alt="item.name"
                              height="25"
                            />
                          </span>
                        </span>
                      </td>
                      <td>{{ row.chart_type }}</td>
                      <td>
                        <span>
                          <router-link
                            type="button"
                            class="btn btn-success btn-sm mx-1"
                            :to="'/sensor/update/' + row.id"
                            >Edit</router-link
                          >
                          <button
                            type="button"
                            class="btn btn-danger btn-sm mx-1"
                            v-on:click="deleteStation(row.id)"
                          >
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
  name: "Sensor",
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
      role: "",
      sensors: [],
      icons: [],
      cols: [
        {
          name: "Label",
          field: "sensor_label",
        },
        {
          name: "Satuan",
          field: "sensor_symbol",
        },

        {
          name: "Icon",
          field: "sensor_icon",
        },
        {
          name: "Chart",
          field: "chart_type",
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
      await axios
        .get(`${this.$baseURL}/sensor-type/`, {
          headers: {
            Authorization: `Token ${this.token}`,
          },
        })
        .then((r) => {
          this.sensors = r.data;
        });
    },
    async delete(id) {
      await axios
        .delete(`${this.$baseURL}/sensor-type/` + id, {
          headers: {
            Authorization: `Token ${this.token}`,
          },
        })
        .then((r) => {
          if (r.status == 204) {
            this.loadData();
          }
        });
    },
    deleteStation(id) {
      this.$swal({
        title: "Are you sure?",
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
  },
  created() {
    this.gAuthCheck();
    this.loadData();
  },
  async mounted() {
    this.gIcons();
  },
};
</script> <style scoped src="@/assets/css/figma.css">
</style>