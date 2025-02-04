<template>
  <div>
    <div v-if="loading_i && !['QA', 'APPROVAL'].includes(role)"
      class="d-flex flex-column justify-content-center align-items-center" style="min-height: 35vh">
      <i class="zmdi zmdi-spinner zmdi-hc-spin" style="font-size: 2rem; margin-right: 20px"></i>
    </div>
    <div v-if="loading_i && ['QA', 'APPROVAL'].includes(role)"
      class="d-flex flex-column justify-content-center align-items-center" style="min-height: 90vh">
      <i class="zmdi zmdi-spinner zmdi-hc-spin" style="font-size: 2rem; margin-right: 20px"></i>
    </div>
    <div v-if="role === 'QA'" class="box">
      <div v-if="!loading_i" class="tab-content station-list" id="tabs-tabContent">
        <div class="tableFixHead tab-pane fade active show" :class="{ h100: ava_width <= 850, tableQA: role == 'QA' }"
          id="tabs-ARR" role="tabpanel" aria-labelledby="tabs-ARR-tab">

          <table class="table table-hover table-responsive text-nowrap text-center table-border bg-white mx-2">
            <thead class="table-light">
              <tr>
                <th v-for="(head, index) in table_headQA" :key="index"
                  :class="{ thClass: index >= 0, sticky: index === 2 }">
                  {{ head }}
                </th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(station, index) in stationsQA" :key="station.station_serial_id"
                @click="selectStationQA(station)" style="cursor: pointer">
                <td>{{ index + 1 }}</td>

                <td>
                  {{ station.station_name }}
                </td>
                <td>

                  <router-link type="button" class="btn btn-primary btn-sm m-0 p-0"
                    style="font-size: 0.8rem; padding: 0 5px!important;"
                    :to="{ path: '/station/data/' + station.station_serial_id }">Data</router-link>
                </td>
                <td>
                  {{ formatDate(station.data[0].date) }}
                </td>
                <td>{{ station.data[0].sum }}</td>
                <td>{{ station.data[0].percentage }} %</td>
                <td>{{ station.data[0].maintenance }}</td>


              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-else-if="role === 'APPROVAL'" class="box">

      <div v-if="!loading_i" class="tab-content station-list" id="tabs-tabContent">
        <div class="tableFixHead tab-pane fade active show"
          :class="{ h100: ava_width <= 850, tableApproval: role == 'APPROVAL' }" id="tabs-ARR" role="tabpanel"
          aria-labelledby="tabs-ARR-tab">

          <table class="table table-hover table-responsive text-nowrap text-center table-border bg-white mx-2">
            <thead class="table-light">
              <tr>
                <th v-for="(head, index) in table_headApproval" :key="index"
                  :class="{ thClass: index >= 0, sticky: index === 2 }">
                  {{ head }}
                </th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(station, index) in stationsApproval" :key="station.station_serial_id"
                @click="selectStationApproval(station)" style="cursor: pointer">
                <td>{{ index + 1 }}</td>

                <td>
                  {{ station.station_name }}
                </td>

                <td>
                  {{ station.sum_approval_data }}

                </td>
                <td>
                  <router-link type="button" class="btn btn-primary btn-sm m-0 p-0"
                    style="font-size: 0.8rem; padding: 0 5px!important;"
                    :to="{ path: '/station/data/' + station.station_serial_id }">Detail</router-link>
                </td>
                <td>
                  <router-link type="button" class="btn btn-success btn-sm m-0 p-0"
                    style="font-size: 0.8rem; padding: 0 5px!important;"
                    :to="{ path: '/station/data/' + station.station_serial_id }">Approve All</router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div v-else class="box">

      <div v-if="!loading_i" class="tab-content station-list" id="tabs-tabContent">
        <div class="tableFixHead tab-pane fade active show" :class="{ h100: ava_width <= 850, tableQA: role == 'QA' }"
          id="tabs-ARR" role="tabpanel" aria-labelledby="tabs-ARR-tab">
          <!-- <small v-if="role == 'SuperAdmin' && localStations.length > 34">
            {{ localStations[34].station_name }}: {{ formatDate(localStations[34].last_time) }} {{
              formatTime(localStations[34].last_time) }}
          </small> -->
          <table class="table table-hover table-responsive text-nowrap text-center table-border bg-white mx-2">
            <thead class="table-light">
              <tr>
                <th v-for="(head, index) in table_head" :key="index"
                  :class="{ thClass: index >= 0, sticky: index === 2 }">
                  {{ head }}
                </th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(station, index) in localStations" :key="station.station_serial_id"
                @click="selectStation(station)" style="cursor: pointer">
                <td>{{ index + 1 }}</td>
                <!-- <td v-if="station.maintenance"
                  style="display: flex; flex-direction: column; align-items: center; font-size: 0.7rem;">
                  <div class="statusText">
                    <span class="dotMTC mx-1"></span> <span style="color: black;">MTC</span>
                  </div>
                </td> -->
                <td style="display: flex; flex-direction: column; align-items: center; font-size: 0.7rem;">
                  <div v-if="station.station_status == 'OK'" class="statusText">
                    <span class="dotOK mx-1"></span> <span style="color: #219653;">{{ station.station_status }}</span>
                  </div>
                  <div v-else-if="station.station_status == 'maintenance'" class="statusText">
                    <span class="dotMTC mx-1"></span> <span style="color: black;">MTC</span>
                  </div>
                  <div v-else-if="station.station_status == 'Min Threshold'" class="statusText">
                    <span class="dotMin mx-1"></span> <span style="color: #00B2FF;">{{ station.station_status }}</span>
                  </div>
                  <div v-else-if="station.station_status == 'Max Threshold'" class="statusText">
                    <span class="dotMax mx-1"></span> <span style="color: #D34053;">{{ station.station_status }}</span>
                  </div>
                  <div v-else class="statusText">
                    <span class="dotMax mx-1"></span> {{ station.station_status }}
                  </div>
                </td>
                <td>
                  {{ station.station_name }}
                </td>
                <td>
                  <router-link v-if="role == 'SuperAdmin'" type="button" class="btn btn-sm btn-primary m-0 p-0"
                    style="font-size: 0.8rem; padding: 0 5px!important;"
                    :to="{ path: '/station/data/' + station.station_serial_id }">Data</router-link>
                  <router-link v-else type="button" class="btn btn-primary btn-sm m-0 p-0"
                    style="font-size: 0.8rem; padding: 0 5px!important;"
                    :to="{ path: '/station/data/' + station.station_serial_id }">Data</router-link>
                </td>
                <td>
                  {{ formatDate(station.last_time) }}
                </td>
                <td>
                  {{ formatTime(station.last_time) }}
                </td>
                <td v-for="(sensor, index) in station.last_data" :key="index">
                  {{ sensor.value }} {{ sensor.notation }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Stations",
  props: ['stationsQA', 'stationsApproval', 'stations', 'loading_i'],
  data() {
    return {

      users: [],
      st_stations: [],
      st_stationsQA: [],
      st_stationsApproval: [],

      table_head: [],
      table_headQA: [],
      table_headApproval: [],

      total_stat: null,
      total_statQA: null,
      total_statApproval: null,

      table_head_pre: [],
      role: null,
      balai: null,
      indexSt: null,
      // loading_i: true,
      ava_width: null,
      ava_height: null,
      // localStations: []
      localStationsData: [],
      intervalId: null
    };
  },
  computed: {
    localStations() {
      // Combine prop and local data, prioritizing local data
      return this.localStationsData.length > 0 ? this.localStationsData : this.stations;
    }
  },
  methods: {
    selectStation(station) {
      this.$emit('station-selected', station);
    },
    selectStationQA(stationQA) {
      this.$emit('stationqa-selected', stationQA);
    },
    selectStationApproval(stationApproval) {
      this.$emit('stationapproval-selected', stationApproval);
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

    async loadStations() {
      this.processStations();
      if (this.$options.name === 'Stations') {
        this.intervalId = setInterval(async () => {
          await this.fetchStations();
          this.processStations();
        }, 300000);
      }


    },
    async loadStationsQA() {
      this.processStationsQA();
    },
    async loadStationsApproval() {
      this.processStationsApproval();
    },
    async fetchStations() {
      try {
        const response = await axios.get(`${this.$baseURL}/pdam/dashboard/`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });

        this.localStationsData = response.data.data;
        this.localStationsData = response.data.data.map(station => ({
          ...station,
          last_data: station.last_data.map(data => ({
            ...data,
            value: function formatValue(val) {
              val = parseFloat(val).toFixed(2);
              if (val.endsWith('.00')) {
                val = val.replace('.00', '');
              }
              val = val.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              return val;
            }(data.value)
          }))
        }));
        // Emit the update to the parent
        this.$emit('update:stations', this.localStationsData);

        this.loading_i = response.status === 200 ? false : true;
      } catch (error) {
        console.error(error);
      }
    },
    processStations() {
      // console.log('tset');

      this.st_stations = [...this.localStations];
      this.total_stat = this.localStations.length;
      this.table_head = ["No", "Status", "Nama Stasiun", "Data", "Tanggal", "Waktu", "Debit", "Totalizer"];
      // this.localStations.forEach(station => {
      //   station.last_data.forEach(data => {
      //     if (data.sensor_name && !this.table_head.includes(data.sensor_name)) { 
      //       this.table_head.push(data.sensor_name);
      //     }
      //   });
      // });
    },

    processStationsQA() {
      this.st_stationsQA = [...this.stationsQA];
      this.total_statQA = this.stationsQA.length;
      this.table_headQA = ["No", "Nama Stasiun", "Data", "Tanggal", "Jumlah Data", "Persentase Data", "Jumlah Gangguan"];
    },
    processStationsApproval() {
      this.st_stationsApproval = [...this.stationsApproval];
      this.total_statApproval = this.stationsApproval.length;
      this.table_headApproval = ["No", "Nama Stasiun", "Jumlah Data Taksasi", "Detail", "Approve All"];
    },
    handleScroll() {
      const stickyCol = document.querySelector("th.sticky");
      const table = document.querySelector("table");
      const tableRect = table.getBoundingClientRect();
      const stickyColRect = stickyCol.getBoundingClientRect();

      if (
        stickyColRect.top <= tableRect.top &&
        stickyColRect.bottom >= tableRect.bottom
      ) {
        stickyCol.style.top = "0";
      } else if (stickyColRect.top <= tableRect.top) {
        stickyCol.style.top = `${tableRect.top - stickyColRect.top}px`;
      } else if (stickyColRect.bottom >= tableRect.bottom) {
        stickyCol.style.top = `${tableRect.bottom - stickyColRect.bottom}px`;
      }
    },
  },

  created() {
    this.extractUserInfo()
    this.ava_width = screen.availWidth;
    this.ava_height = screen.availHeight;

  },
  mounted() {


    if (this.role === 'QA') {
      this.loadStationsQA();
    } else if (this.role === 'APPROVAL') {
      this.loadStationsApproval();

    }

    else {

      this.loadStations();
    }
    // this.updateUserStationList(this.userStationList);
  },
  beforeDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
};
</script>

<style scoped>
.tableFixHead {
  overflow-y: scroll;
  height: 42vh;
}

.tableQA {
  overflow-y: scroll;
  height: 92vh;
}

.tableApproval {
  overflow-y: scroll;
  height: 92vh;
}

.tableFixHead table {
  border-collapse: collapse;
  width: 100%;
}

.tableFixHead th,
.tableFixHead td {
  padding: 2px 7px !important;
}

.tableFixHead th {
  position: sticky !important;
  top: 0;
  background: #eee;
}

.h100 {
  min-height: 70vh;
}

.thClass {
  font-weight: normal;
  color: #696969;
  font-size: 0.9rem;
  background: #f8fafc !important;
}

td {
  font-size: 0.9rem;
}

.table-border td,
.table-border th {
  border: none !important;
  border-right: solid 1px #ccc !important;
}

.table> :not(:first-child) {
  border-top: 0;
}

.imgSZ {
  height: 25px;
}

thead {
  padding: 20px !important;
}

th:nth-child(3),
td:nth-child(3) {
  position: sticky;
  left: 0px;
  z-index: 5;
  background-color: #fff;
}

th.sticky {
  position: sticky;
  left: 0;
  top: 0;
  z-index: 10;
  background-color: #fff;
}

.nav-link.active {
  background: #3056d3 !important;
  color: #fff !important;
}

.nav-link {
  color: #555555 !important;
}

.statSZ {
  height: 1.5rem;
}

/* Remove bullets from unordered lists */
ul {
  list-style-type: none;
  /* Removes bullets */
  padding: 0;
  /* Removes default padding */
  margin: 0;
  /* Removes default margin */
}
</style>