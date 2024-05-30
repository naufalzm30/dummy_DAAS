<template>
  <div>
    <span v-for="item in stations" :key="item.id">
      <div v-if="item.id == $route.params.id" class="row">
        <div class="left-container" :class="{ p012: item.station_type == 3 }">
          <TableMap :stations="item" :status="status" :loading_i="loading_i" class="mx-auto comShadow border"
            style="border-radius: 15px" />
        </div>
      </div>
    </span>

    <div style="border-radius: 15px" class="mt-2">
      <!-- {{ filterData }} -->

      <dataset class="box comShadow px-3" v-slot="{ ds }" :ds-data="filterData" :ds-sortby="sortBy">
        <div class="row" :data-page-count="ds.dsPagecount">
          <div v-if="loading_i && role == 'is_guess'"
            class="d-flex flex-column justify-content-center align-items-center">
            <i class="zmdi zmdi-spinner zmdi-hc-spin" style="font-size: 1.5rem"></i>
          </div>

          <div class="col-md-1 d-flex justify-content-start" style="margin-top: 1rem">
            <div class="dropdown col">
              <button class="btn btn-sm btn-success dropdown-toggle" type="button" id="dropdownMenuButton1"
                data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                title="Download sesuai filter tanggal" style="font-size: 0.8rem">
                <i v-if="loading_dw" class="zmdi zmdi-rotate-right zmdi-hc-spin"
                  style="font-size: 1.2rem; margin-right: 3px"></i>

                <span>Detail</span>
              </button>
<!-- {{ detailAPI }} -->
              <ul v-if="detailAPI" class="dropdown-menu col" aria-labelledby="dropdownMenuButton1">
                <li class="dropdown-item">
                  Jumlah Data: {{ detailAPI.jumlah_data }}
                </li>
                <li class="dropdown-item">
                  Rata Debit: {{ detailAPI.rata_debit }}
                </li>
                <li class="dropdown-item">
                  Total Volume: {{ detailAPI.total_volume }}
                </li>
              </ul>
            </div>
          </div>

          <div class="col-md-9 d-flex justify-content-end" style="margin-top: 1rem">
            <div v-if="role != 'is_guess'">
              <i v-if="loading_data" class="zmdi zmdi-spinner zmdi-hc-spin mx-2" style="font-size: 1.2rem"></i>
              <i v-if="loading_date_data" class="zmdi zmdi-rotate-right zmdi-hc-spin mx-2"
                style="font-size: 1.2rem"></i>
              <input name="from" type="datetime-local" v-model="startDate" @change="search" title="Data Awal"
                style="font-size: 0.8rem" />
              <label for="to" class="px-3" style="font-size: 0.8rem; font-weight: normal">s.d</label>
              <input name="" type="datetime-local" v-model="endDate" @change="search" title="Data Akhir"
                style="font-size: 0.8rem" />
            </div>
          </div>

          <div class="col-md-2 d-flex justify-content-end" style="margin-top: 1rem">
            <button class="btn btn-sm btn-primary dropdown-toggle" type="button" @click.prevent="download"
              title="Download sesuai filter tanggal" style="font-size: 0.8rem">
              <i v-if="loading_dw" class="zmdi zmdi-rotate-right zmdi-hc-spin"
                style="font-size: 1.2rem; margin-right: 3px"></i>
              <span>Download</span>
            </button>
          </div>

        </div>
        <p v-if="csv_code">File status: {{ csv_code }}</p>
        <div class="row mt-1">
          <div class="col-md-12">
            <div class="table-responsive">
              <table
                class="table table-hover table-responsive text-nowrap text-center table-borderless bg-white table-bordered">
                <thead class="table-light">
                  <tr>
                    <th scope="col" class="thClass">#</th>
                    <th v-for="(th, index) in cols" :key="th.field" :class="['sort', th.sort]"
                      @click="click($event, index)" class="thClass">
                      {{ th.name }} <i class="gg-select float-right"></i>
                    </th>
                  </tr>
                </thead>
                <dataset-item tag="tbody">
                  <template #default="{ row, index }">
                    <tr>
                      <td scope="row">{{ index + 1 }}</td>
                      <td>{{ formatDate(row.waktu) }}</td>
                      <td>{{ formatTime(row.waktu) }}</td>
                      <td v-for="(item, index) in conf_2(
      row.weather_data,
      row.symbol
    )" :key="index+2">
                        {{ item.data }} {{ item.symbol }}
                      </td>
                      <td v-if="balai == 0">{{ row.bat.toFixed(2) }} v</td>
                      <td v-if="balai == 0">{{ row.temp.toFixed(2) }} C</td>
                    </tr>
                  </template>
                </dataset-item>
              </table>
            </div>
          </div>
        </div>

        <div class="d-flex flex-md-row flex-column justify-content-end align-items-center">
          <dataset-pager style="font-size: 0.9rem" />
        </div>
      </dataset>

    </div>
  </div>
</template>

<script>
import axios from "axios";

import TableMap from "@/components/Station/Data/TableMap.vue";

import {
  Dataset,
  DatasetItem,
  DatasetPager,
} from "vue-dataset";



export default {
  name: "TableData",
  components: {
    Dataset,
    DatasetItem,
    DatasetPager,
    TableMap,

  },
  props: ["stations", "loading_i", "status"],

  data: function () {
    return {
      csv_code: null,
      file: null,
      csvFile: null,
      namaPos: "",
      type: "",
      role: undefined,
      json_data: [],
      nama: "",
      cols: [],
      selectedType: "",
      startDate: null,
      endDate: null,
      sensors: [],
      first_date: null,
      last_date: null,
      loading_dw: false,
      loading_date_data: false,
      loading_data: false,
      localStations: this.stations.slice(),
      detailAPI: null
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
    filterData() {
      let filterType = this.selectedType;
      let startDate = this.localStart(this.startDate);
      let endDate = this.localEnd(this.endDate);

      const itemsByType = filterType
        ? this.json_data.filter((item) => item.type === filterType)
        : this.json_data;



      return itemsByType.filter((item) => {
        const itemDate = new Date(item.waktu);
        if (startDate && endDate) {
          return startDate <= itemDate && itemDate <= endDate;
        }
        if (startDate && !endDate) {
          return startDate <= itemDate;
        }
        if (!startDate && endDate) {
          return itemDate <= endDate;
        }


        return true;
      });
    },

  },
  watch: {
    filterData(newVal) {
      this.$emit('update-filtered-data', newVal);
    }
  },
  methods: {

    conf_2(a, b) {
      return a.map((card, i) => {
        return {
          data: card,
          symbol: b[i],
        };
      });
    },
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
    async reCall() {
      await axios.get(
        `${this.$baseURL}/data/${this.$route.params.id}/${this.user_id}`,
        {
          headers: {
            Authorization: `Token ${this.token}`,
          },
        }
      );
    },
    async loadData() {
      this.loading_data = true;
      let result = await axios
        .get(`${this.$baseURL}/data/${this.$route.params.id}/${this.user_id}`, {
          headers: {
            Authorization: `Token ${this.token}`,
          },
        })

        .catch(function (e) {
          console.log(e);
        });

      let raw_table = result.data[1][0].table;
      this.nama = `${result.data[0].station_name}`;
      let sensor_label = result.data[1][0].table.array_table_label;
      let date = raw_table.date;
      let battery = raw_table.battery;
      let temperature = raw_table.temperature;
      let rw_data = raw_table.weather_data;
      let raw_symbol = raw_table.array_act_symbol;

      let a = {};

      date.forEach((waktu, i) => {
        let bat = battery[i];
        let temp = temperature[i];
        let weather_data = rw_data[i];
        let symbol = raw_symbol[i];

        a = { waktu, bat, temp, weather_data, symbol };

        this.json_data.push(a);
      });

      this.cols = [
        {
          name: "Tanggal",
        },
        {
          name: "Waktu",
        },
      ];

      for (let i = 0; i < sensor_label.length; i++) {
        this.cols.push({
          name: sensor_label[i],
        });
      }
      if (this.balai == 0) {
        this.cols.push({
          name: "Battery",
        });
        this.cols.push({
          name: "Temperature",
        });
      }
      if (result.status == 200) {
        this.loading_data = false;
      }
    },

    localStart(date) {
      if (!date) return null;
      return new Date(date);
    },
    localEnd(date) {
      if (!date) return null;
      return new Date(date);
    },
    formatDate(date) {
      var monthShortNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Mei",
        "Jun",
        "Jul",
        "Agu",
        "Sep",
        "Okt",
        "Nov",
        "Des",
      ];
      var d = new Date(date),
        year = d.getFullYear(),
        month = "" + d.getMonth(),
        day = "" + d.getDate();

      if (day.length < 2) day = "0" + day;
      return [day, monthShortNames[month], year].join(" ");
    },
    formatTime(date) {
      var d = new Date(date),
        hour = "" + d.getHours(),
        minute = "" + d.getMinutes(),
        second = d.getSeconds();

      if (hour.length < 2) hour = "0" + hour;
      if (minute.length < 2) minute = "0" + minute;
      if (second.length < 2) second = "0" + second;

      return [hour, minute].join(":");
    },
    download() {
      this.loading_dw = true;
      if (this.role == "is_staff" || this.role == "is_superuser") {
        axios
          .post(
            `${this.$baseURL}/excel/`,
            {
              station_id: this.$route.params.id,
              first_date: this.startDate,
              last_date: this.endDate,
            },
            {
              responseType: "arraybuffer",
              headers: {
                Authorization: `Token ${this.token}`,
              },
            }
          )
          .then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;


            if (this.startDate && this.endDate) {
              link.setAttribute(
                "download",
                `Laporan Pembacaan Sensor ${this.nama} ${this.startDate} sd ${this.endDate}.xlsx`
              );
            } else {
              link.setAttribute(
                "download",
                `Laporan Pembacaan Sensor ${this.nama}.xlsx`
              );
            }

            document.body.appendChild(link);
            link.click();

            if (response.status == 200) {
              this.loading_dw = false;
            }
          })
          .catch((error) => console.log(error));
      } else if (this.role == "is_guess") {
        axios
          .post(
            `${this.$baseURL}/excel/`,
            {
              station_id: this.$route.params.id,
              first_date: null,
              last_date: null,
            },
            {
              responseType: "arraybuffer",
              headers: {
                Authorization: `Token ${this.token}`,
              },
            }
          )
          .then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute(
              "download",
              `Laporan Pembacaan Sensor ${this.nama}.xlsx`
            );
            document.body.appendChild(link);
            link.click();

            if (response.status == 200) {
              this.loading_dw = false;
            }
          })
          .catch((error) => console.log(error));
      }
    },
    async search() {
      this.loading_date_data = true;
      await axios
        .post(
          `${this.$baseURL}/data-date/`,
          {
            station_id: this.$route.params.id,
            user_id: this.user_id,
            first_date: this.startDate,
            last_date: this.endDate,
          },
          {
            headers: {
              Authorization: `Token ${this.token}`,
            },
          }
        )
        .then((result) => {
          this.json_data = [];
          let raw_table = result.data[1][0].table;
          this.nama = `${result.data[0].station_name}`;
          let sensor_label = result.data[1][0].table.array_table_label;

          let date = raw_table.date;
          let battery = raw_table.battery;
          let temperature = raw_table.temperature;
          let rw_data = raw_table.weather_data;
          let raw_symbol = raw_table.array_act_symbol;

          let a = {};

          date.forEach((waktu, i) => {
            let bat = battery[i];
            let temp = temperature[i];
            let weather_data = rw_data[i];
            let symbol = raw_symbol[i];

            a = { waktu, bat, temp, weather_data, symbol };

            this.json_data.push(a);

          });

          this.cols = [
            {
              name: "Tanggal",
              field: "waktu",
              sort: "desc",
            },
            {
              name: "Waktu",
            },
          ];

          for (let i = 0; i < sensor_label.length; i++) {
            this.cols.push({
              name: sensor_label[i],
            });
          }
          if (this.balai == 0) {
            this.cols.push({
              name: "Battery",
            });
            this.cols.push({
              name: "Temperature",
            });
          }
          if (result.status == 200) {
            this.loading_date_data = false;
          }
          // console.log('SUMMARY:', result.data[1][0].summary);
          // console.log('result sum', result.data[1][0].summary);
          this.detailAPI = result.data[1][0].summary;
        })
        .catch((error) => console.log(error));
    },
    onChangeFileUpload(event) {
      this.csvFile = event.target.files[0];
    },
    modified() {
      let formData = new FormData();
      formData.append("station_id", this.$route.params.id);
      formData.append("csvFile", this.csvFile);

      axios
        .post(`${this.$baseURL}/csv/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Token ${this.token}`,
          },
        })
        .then((r) => {
          console.log("status: ", r.status);

          if (r.status == 204) {
            this.csv_code = "File uploaded successfully, reload the page";
            // location.reload();
          }
        })
        .catch((error) => {
          console.log(error);
          this.csv_code = "Error uploading the file. Please try again."; // Display your custom error message
          // this.csv_code = error;
        });
    },
  },
  created() {
    this.gAuthUser();
    this.loadData();
  },
  async mounted() {
    if (this.filterData.length == 0) {
      this.detailAPI = this.stations[1][0].summary;
    }
  },
};
</script>
<style scoped src="@/assets/css/figma.css"></style>
<style scoped>
select,
input,
input:focus {
  border-color: whitesmoke;
  padding: 5px 10px;
  background-color: #fff;
  border-radius: 7px;
  color: grey;
}

th,
td {
  padding: 2px !important;
}

.thClass {
  font-weight: normal;
  color: #696969;
  font-size: 0.9rem;
  padding: 0 5px !important;
}

td {
  font-size: 0.9rem;
}

.row {
  display: flex;
  /* Use flexbox to create a row layout */
  align-items: flex-start;
  /* Align items at the top of the container */
}

.left-container {
  flex: 1;
  /* Allow the container to take up available space */
  /* padding: 0 5px; */
}

.p012 {
  padding: 0 0px 0 12px;
}

.right-container {
  flex: 1;
  /* Allow the container to take up available space */
  margin-left: 0px;
  /* Add some spacing between the left and right containers */
  /* padding: 0 5px; */
}

.table-bordered td {
  border: 1px solid #dee2e6;
  /* Add the desired border style */
}
</style>