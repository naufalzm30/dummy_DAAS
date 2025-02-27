<template>
  <div class="container px-0">
    <div v-if="!['QA', 'APPROVAL'].includes(role) && !station"
      class="d-flex flex-column justify-content-center align-items-center" style="min-height: 70vh">
      <i class="zmdi zmdi-spinner zmdi-hc-spin" style="font-size: 2rem; margin-right: 20px"></i>
    </div>
    <div v-if="role === 'QA' && !stationQA" class="d-flex flex-column justify-content-center align-items-center"
      style="min-height: 90vh">
      <i class="zmdi zmdi-spinner zmdi-hc-spin" style="font-size: 2rem; margin-right: 20px"></i>
      <div class="py-2">Drawing Chart...</div>
    </div>
    <div v-if="role === 'APPROVAL' && !stationApproval"
      class="d-flex flex-column justify-content-center align-items-center" style="min-height: 90vh">
      <i class="zmdi zmdi-spinner zmdi-hc-spin" style="font-size: 2rem; margin-right: 20px"></i>
      <div class="py-2">Drawing Chart...</div>
    </div>
    <div v-if="station && !['QA', 'APPROVAL'].includes(role)">
      <div style="max-width: 100% !important; min-width: 100% !important">
        <div class="card box-sm mt-2 mx-1 comShadow" style="box-shadow: 10px; border-radius: 5x">
          <div class="row">
            <div class="col-md-4 p-0 imgSZ">
              <img :src="`${station.image}`" class="img-fluid" alt="station-img" style="
              object-fit: cover;
              border-radius: 5px 0px 0px 5px;
              margin-left: 12px;
              width: 92%;
            " />
            </div>
            <div class="col-md-8 my-0" :class="{ 'mt-2': ava_width < 768 }">
              <div class="row">
                <div class="col-md-7 col-7">
                  <div style="
                        font-weight: 500;
                        font-size: 1rem;
                        margin-left: 7px;
                      ">
                    <!-- {{ station.station_name }} -->
                    Water Station {{ station.id }}
                  </div>
                </div>
                <!-- <div v-if="station.maintenance" class="col-md-5 col-5 d-flex justify-content-end align-items-center "
                  style="font-size: 0.8rem;">
                  <span class="dotMTC mx-1"></span>
                  <span style="color: black;" class="mx-1">MTC</span>
                </div> -->
                <div class="col-md-5 col-5 d-flex justify-content-end">
                  <div v-if="station.station_status == 'OK'" class="statusText px-2" style="font-size: 0.8rem;">
                    <span class="dotOK mx-1"></span> <span style="color: #219653;">{{ station.station_status }}</span>
                  </div>
                  <div v-else-if="station.station_status == 'maintenance'" class="statusText px-2"
                    style="font-size: 0.8rem;">
                    <span class="dotMTC mx-1"></span> <span style="color: black;">MTC</span>
                  </div>
                  <div v-else-if="station.station_status == 'Min Threshold'" class="statusText px-2"
                    style="font-size: 0.8rem;">
                    <span class="dotMin mx-1"></span> <span style="color: #00B2FF;">{{ station.station_status }}</span>
                  </div>
                  <div v-else-if="station.station_status == 'Max Threshold'" class="statusText px-2"
                    style="font-size: 0.8rem;">
                    <span class="dotMax mx-1"></span> <span style="color: #D34053;">{{ station.station_status }}</span>
                  </div>
                  <div v-else class="statusText px-2" style="font-size: 0.8rem;">{{ station.station_status }}</div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-7 mx-0">
                  <div class="my-1 mx-2">
                    <div class="info-label">Lokasi</div>
                    <!-- <div class="info-value">{{ station.location }}</div> -->
                    <div class="info-value">locs</div>

                  </div>
                  <div v-if="station.balai == 'Distribusi'" class="my-1 mx-2">
                    <div class="info-label">In/Out Interzone</div>
                    <div class="info-value">{{ station.interzone }}</div>
                  </div>
                  <div v-else class="my-1 mx-2">
                    <div class="info-label">Nameplate Head</div>
                    <div class="info-value"> {{ station.nameplate_head }}</div>
                  </div>
                </div>
                <div v-if="station.balai == 'Distribusi'" class="col-md-5 mx-0">
                  <div class="my-1 mx-2">
                    <div class="info-label"> Max Flow</div>
                    <div class="info-value">{{ station.max_flow }} L/s</div>
                  </div>
                  <div class="my-1 mx-2">
                    <div class="info-label">Diameter Pipa</div>
                    <div class="info-value">
                      {{ station.diameter }} mm
                    </div>
                  </div>
                </div>
                <div v-else class="col-md-5 mx-0">
                  <div class="my-1 mx-2">
                    <div class="info-label">Jumlah Operasi</div>
                    <div class="info-value">{{ station.jumlah_operasi }}</div>
                  </div>
                  <div class="my-1 mx-2">
                    <div class="info-label">Kapasitas</div>
                    <div class="info-value">
                      {{ station.kapasitas }} L/s
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div style="border-radius: 5px">
          <div class="box-sm border mx-1 bg-white comShadow" style="border-radius: 5px">
            <div>
              <div class="px-2 py-1" style="font-weight: 500; font-size: 0.9em">
                Data Debit
                <!-- {{ station.chart.sensor_data[0].sensor_name }} ({{ station.chart.sensor_data[0].notation }}) -->
              </div>
            </div>
            <Chart class="hChart25 p-0 pr-0 pt-0 pb-0" :label="formatAllDates(station.chart.time)"
              :chart-data="station.chart.sensor_data[0].value"
              :title="`Debit (${station.chart.sensor_data[0].notation})`" is="LineChart">
            </Chart>
          </div>
        </div>
        <div style="border-radius: 5px">
          <div class="box-sm border mx-1 bg-white comShadow" style="border-radius: 5px">
            <div>
              <div class="px-2 py-1" style="font-weight: 500; font-size: 0.9em">
                Data Totalizer
                <!-- {{ station.chart.sensor_data[1].sensor_name }} ({{ station.chart.sensor_data[1].notation }}) -->
              </div>
            </div>
            <Chart class="hChart25 p-0 pr-0 pt-0 pb-0" :label="formatAllDates(station.chart.time)"
              :chart-data="station.chart.sensor_data[1].value"
              :title="`Totalizer (${station.chart.sensor_data[1].notation})`" is="TotalChart">
            </Chart>
          </div>
        </div>
        <div v-if="role === 'QA'" style="border-radius: 5px">
          <div class="box-sm border mx-1 bg-white comShadow" style="border-radius: 5px">
            <div>
              <div class="px-2 py-1" style="font-weight: 500; font-size: 0.9em">
                Data Gangguan
                <!-- {{ station.chart.sensor_data[1].sensor_name }} ({{ station.chart.sensor_data[1].notation }}) -->
              </div>
            </div>
            <Chart class="hChart25 p-0 pr-0 pt-0 pb-0" :label="formatAllDates(station.chart.time)"
              :chart-data="station.chart.sensor_data[1].value"
              :title="`${station.chart.sensor_data[1].sensor_name} (${station.chart.sensor_data[1].notation})`"
              is="TotalChartBar">
            </Chart>
          </div>
        </div>
      </div>
    </div>
    <div v-if="stationQA && role === 'QA'">
      <div class="mt-2">
        <div style="border-radius: 5px">
          <div class="box-sm border mx-1 bg-white comShadow" style="border-radius: 5px">
            <div>
              <div style="font-weight: 500; font-size: 1rem;margin-left: 7px;"
                class="mt-1 d-flex justify-content-center">
                <!-- {{ stationQA.station_name }} -->
                Water Station {{ stationQA.id }}

              </div>
              <div class="px-2 py-1" style="font-weight: 500; font-size: 0.9em">
                Jumlah Data
              </div>
            </div>
            <Chart class="hChartQA p-0 pr-0 pt-0 pb-0" :label="stationQA.data.map(item => item.date).reverse()"
              :chart-data="stationQA.data.map(item => item.sum).reverse()" :title="`Jumlah Data`" is="TotalChartBar">
            </Chart>
          </div>
        </div>
        <div style="border-radius: 5px">
          <div class="box-sm border mx-1 bg-white comShadow" style="border-radius: 5px">
            <div>
              <div class="px-2 py-1" style="font-weight: 500; font-size: 0.9em">
                Persentase Data (%)
              </div>
            </div>
            <Chart class="hChartQA p-0 pr-0 pt-0 pb-0" :label="stationQA.data.map(item => item.date).reverse()"
              :chart-data="stationQA.data.map(item => item.percentage).reverse()" :title="`Persentase Data (%)`"
              is="TotalChartBar">
            </Chart>
          </div>
        </div>
        <div style="border-radius: 5px">
          <div class="box-sm border mx-1 bg-white comShadow" style="border-radius: 5px">
            <div>
              <div class="px-2 py-1" style="font-weight: 500; font-size: 0.9em">
                Jumlah Gangguan
              </div>
            </div>
            <Chart class="hChartQA p-0 pr-0 pt-0 pb-0" :label="stationQA.data.map(item => item.date).reverse()"
              :chart-data="stationQA.data.map(item => item.maintenance).reverse()" :title="`Jumlah Gangguan`"
              is="TotalChartBar">
            </Chart>
          </div>
        </div>
      </div>
    </div>
    <div v-if="stationApproval && role === 'APPROVAL'">
      <div class="mt-2">
        <div style="border-radius: 5px">
          <div class="box-sm border mx-1 bg-white comShadow p-1" style="border-radius: 5px">
            <div>
              <div style="font-weight: 500; font-size: 1.3rem;margin-left: 7px;"
                class="mt-1 d-flex justify-content-center py-2">
                <!-- {{ stationApproval.station_name }} -->
                Water Station {{ stationApproval.id }}

              </div>

            </div>
            <div v-if="stationApproval.data.length > 0" class="pt-2 pb-1 d-flex justify-content-between mx-2">
              <div>Total Data Taksasi {{ stationApproval.sum_approval_data }} </div>
              <button class="btn btn-success btn-sm py-1"
                @click="approveAllRanges(stationApproval.station_serial_id)">Approve All </button>
            </div>


            <table v-if="stationApproval.data.length > 0"
              class="table table-hover table-responsive text-nowrap text-center table-border bg-white">
              <thead class="table-light">
                <tr>
                  <th v-for="(head, index) in table_headApproval" :key="index"
                    :class="{ thClass: index >= 0, sticky: index === 2 }" style="font-weight: normal;">
                    {{ head }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(station, index) in stationApproval.data" :key="index">
                  <td>{{ index + 1 }}</td>

                  <td>{{ station.date }}</td>
                  <td>{{ station.sum }}</td>
                  <td>
                    <button class="btn btn-secondary btn-sm "
                      @click="approveRange(station.date, station.date, stationApproval.station_serial_id)">Approve</button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-else class="px-1 py-1">
              No Data to Approve
            </div>

          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import LineChart from "@/components/Chart/LineChart";
import TotalChart from "@/components/Chart/TotalChart";
import TotalChartBar from "@/components/Chart/TotalChartBar";
import axios from "axios";
import moment from 'moment';
export default {
  name: "StationData",
  props: ['station', 'stationQA', 'stationApproval'],
  data() {
    return {
      loading_i: true,
      window_loc: "",
      options: {
        arcColors: ["rgb(44,151,222)", "lightgray"],
        arcDelimiters: [80],
        rangeLabel: ["0%", "100%"],
        centralLabel: "70%",
      },
      currentIndex: 0,
      ava_width: null,
      table_headApproval: [],

    };
  },
  components: {
    LineChart,
    TotalChart,
    // BarChart,
    TotalChartBar,
  },
  watch: {
    // Watch the 'station' prop for changes
    station: {
      handler(newVal) {
        // Perform actions when the 'station' prop changes
        // console.log('The station prop has changed:', newVal);

        // Update component data based on the new 'station' value
        this.updateComponentData(newVal);
      },
      deep: true // This ensures the watcher also detects changes to nested properties
    },
    // Watch the 'stationQA' prop for changes
    stationQA: {
      handler(newVal) {
        // Perform actions when the 'stationQA' prop changes
        // console.log('The stationQA prop has changed:', newVal);

        // Update component data based on the new 'stationQA' value
        this.updateComponentData(newVal);
      },
      deep: true // This ensures the watcher also detects changes to nested properties
    },
    stationApproval: {
      handler(newVal) {
        this.updateComponentData(newVal);
      },
      deep: true
    }
  },
  methods: {
    async approveAllRanges(stationSerialId) {
      if (this.stationApproval.data.length === 0) {
        console.error("No data available to approve.");
        return;
      }

      // Get the oldest and newest dates
      const oldestDate = this.stationApproval.data.reduce((oldest, station) => {
        const date = moment(station.date);
        return date.isBefore(oldest) ? date : oldest;
      }, moment(this.stationApproval.data[0].date));

      const newestDate = this.stationApproval.data.reduce((newest, station) => {
        const date = moment(station.date);
        return date.isAfter(newest) ? date : newest;
      }, moment(this.stationApproval.data[0].date));

      // Call approveRange with the oldest and newest dates
      await this.approveRange(oldestDate.format('YYYY-MM-DD 00:00'), newestDate.format('YYYY-MM-DD 23:55'), stationSerialId);
    },
    async approveRange(fromDate, untilDate, stationSerialId) {
      const from = fromDate ? moment(fromDate).format('YYYY-MM-DD 00:00') : null;
      const until = untilDate ? moment(untilDate).format('YYYY-MM-DD 23:55') : null;

      try {
        const response = await axios.get(`${this.$baseURL}/pdam/approve_taksasi/${stationSerialId}/`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
          params: {
            from: from,
            until: until,
          },
        });
        console.log(response);
      } catch (error) {
        console.log(error);
      }
      this.$swal({
        position: "top-end",
        width: "300px",
        icon: "success",
        title: "Approve berhasil",
        showConfirmButton: false,
        timer: 1000,
      });
    setTimeout(() => {
      location.reload();
    }, 1200);

    },
    updateComponentData(newVal) {
      // Logic to update the component's data based on the new prop value
      // For example, you could update 'loading_i', 'window_loc', etc.
      this.loading_i = false; // Example update
      this.window_loc = newVal.location || ""; // Example update
    },
    formatDate(dateString) {
      try {
        const date = new Date(dateString);
        if (isNaN(date)) throw new Error("Invalid date");

        const options = {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          timeZone: 'Asia/Jakarta', // Adjust as necessary
        };
        return new Intl.DateTimeFormat('en-GB', options).format(date);
      } catch (error) {
        console.error('Error parsing date:', error);
        return dateString; // Fallback to original if parsing fails
      }
    },
    formatAllDates(timeArray) {
      return timeArray.map(this.formatDate);
    },

  },

  created() {
    this.extractUserInfo()
    this.ava_width = screen.availWidth;
    this.table_headApproval = ["No", "Tanggal", "Jumlah Data Taksasi", "Approve Taksasi"];
  },
};
</script>

<style scoped>
.statSZ {
  height: 1.5rem;
}

.data-font {
  font-size: 2rem;
}

.symbol-font {
  font-size: 1.2rem;
}

.title-font {
  font-size: 1.1rem;
}

.root.padding {
  padding: 0;
}

.flex {
  display: flex;
  /* gap: 0.5rem; */
  flex-wrap: wrap;
}

.steps-wrapper {
  background-color: #232323;
}

.img-normal {
  height: 205px;
}

.img-awlr {
  height: 140px;
}

.min-vh-20 {
  min-height: 20vh;
}

@media only screen and (max-width: 768px) {
  .flex>div {
    flex: 100%;
  }
}

ul {
  list-style: none;
  display: table;
}

li {
  display: table-row;
}

b {
  display: table-cell;
  padding-right: 1em;
}

.comShadow {
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
}

.iconSZ img {
  resize: both;
  height: 10vh;
  max-height: 10vh;
}

/* Add your desired styles for the label and value containers */
.info-label {
  font-weight: 500;
  /* font-size: 0.9rem; */
  font-size: 1em;
}

.info-value {
  margin-left: 10px;
  font-size: 0.9em;
}

/* Dummy element style to hide if needed */
.info-dummy {
  margin-left: 10px;
  color: rgba(255, 255, 255, 0);
  font-size: 1em;
}

.imgSZ img {
  resize: both;
  height: 140px;
  width: 190px;
}

@media (max-width: 768px) {
  .imgSZ {
    height: 170px;
    /* You can adjust the height as needed */
    /* width: 300px; */
  }

  .info-dummy {
    display: none;
  }
}

.greenCard {
  background: #46dddd;
  border-radius: 15px;
}
</style>

<style>
.hChart25 {
  height: 30vh;
}

.hChartQA {
  height: 24.5vh;
}

.highcharts-figure {
  min-width: 360px;
  max-width: 660px;
  margin: 1em auto;
}

.highcharts-data-table table {
  font-family: Verdana, sans-serif;
  border-collapse: collapse;
  border: 1px solid #ebebeb;
  margin: 10px auto;
  text-align: center;
  width: 100%;
  max-width: 500px;
}

.highcharts-data-table caption {
  padding: 1em 0;
  font-size: 1.2em;
  color: #555;
}

.highcharts-data-table th {
  font-weight: 600;
  padding: 0.5em;
}

.highcharts-data-table td,
.highcharts-data-table th,
.highcharts-data-table caption {
  padding: 0.5em;
}

.highcharts-data-table thead tr,
.highcharts-data-table tr:nth-child(even) {
  background: #f8f8f8;
}

.highcharts-data-table tr:hover {
  background: #f1f7ff;
}
</style>
