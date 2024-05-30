<template>
  <div>
    <div v-if="loading_i" class="d-flex flex-column justify-content-center align-items-center" style="min-height: 35vh">
      <i class="zmdi zmdi-spinner zmdi-hc-spin" style="font-size: 2rem; margin-right: 20px"></i>
    </div>
    <span class="d-none">
      {{ stations }}
      <hr />
      {{ backupStat }}
    </span>
    <div class="box" v-if="!loading_i">
      <div class="tab-content station-list" id="tabs-tabContent">

        <div v-if="total_arr >= 1" class="tableFixHead tab-pane fade" :class="{
      active: total_arr >= 1 && total_awlr < 1,
      show: total_arr >= 1 && total_awlr < 1,
      h100: ava_width <= 850,
    }" id="tabs-ARR" role="tabpanel" aria-labelledby="tabs-ARR-tab">

          <table class="table table-hover table-responsive text-nowrap text-center table-border bg-white mx-2">
            <thead class="table-light">
              <tr>
                <th v-for="(head, index) in arr_head" :key="index"
                  :class="{ thClass: index >= 0, sticky: index === 2 }">
                  {{ head }}
                </th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(station, index) in stations" :key="station[0].id" @click="selectStation(station)"
                style="cursor: pointer">
                <td>{{ index + 1 }}</td>
                <td>
                  <span v-if="station[1].table.siaga == []"> </span>
                  <span v-else-if="station[1].table.siaga == 'MAINTENANCE'">
                    <img :src="mtc_i" class="statSZ" />
                  </span>
                  <span v-else-if="station[1].table.siaga == 'SIAGA 1'">
                    <img :src="s1_i" class="statSZ" />
                  </span>
                  <span v-else-if="station[1].table.siaga == 'SIAGA 2'">
                    <img :src="s2_i" class="statSZ" />
                  </span>
                  <span v-else-if="station[1].table.siaga == 'SIAGA 3'">
                    <img :src="s3_i" class="statSZ" />
                  </span>
                  <span v-else-if="station[1].table.siaga == 'OK'">
                    <img :src="ok_i" class="statSZ" />
                  </span>
                </td>
                <td>
                  {{ station[0].station_name }}
                </td>

                <td>
                  {{ formatDate(station[1].table.date) }}
                </td>
                <td>
                  {{ formatTime(station[1].table.date) }}
                </td>

                <td v-for="(sensor, index) in conf_2(
      station[1].table.sensor_data,
      station[1].table.array_table_symbol

    )" :key="index">
                  {{ sensor.data }}
                  {{ sensor.symbol }}

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
import awlr_i from "@/assets/icons/map/awlr.svg";
import arr_i from "@/assets/icons/map/arr.svg";
import mtc_i from "@/assets/icons/map/mtc.svg";
import ok_i from "@/assets/icons/map/ok.svg";
import s1_i from "@/assets/icons/map/s1.svg";
import s2_i from "@/assets/icons/map/s2.svg";
import s3_i from "@/assets/icons/map/s3.svg";

export default {
  name: "stations",
  data() {
    return {
      stations: [],
      backupStat: [],
      awlr_stations: [],
      arr_stations: [],

      awlr_head: [],
      arr_head: [],


      total_awlr: null,
      total_arr: null,


      awlr_head_pre: [],
      arr_head_pre: [],
   
      role: null,
      balai: null,
      indexSt: null,
      loading_i: true,
      ava_width: null,
      ava_height: null,
      awlr_i,
      arr_i,

      mtc_i,
      ok_i,
      s1_i,
      s2_i,
      s3_i,
    };
  },
  methods: {
    selectStation(station) {
      this.$emit('station-selected', station);
    },
    conf_2(a, b) {
      return a.map((card, i) => {
        return {
          data: card,
          symbol: b[i],
        };
      });
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
      if (this.profile.station == null) {
        await axios
          .get(`${this.$baseURL}/home-data/`)
          .then((r) => {
            this.stations = r.data;
            if (r.status == 200) {
              this.loading_i = false;
            }
          })
          .catch(function (e) {
            console.log(e);
          });
      } else if (this.profile.station != null) {
        await axios
          .get(`${this.$baseURL}/home-data/${this.profile.station.id}`)
          .then((r) => {
            this.stations = r.data;
            if (r.status == 200) {
              this.loading_i = false;
            }
          })
          .catch(function (e) {
            console.log(e);
          });
      }

      for (let i = 0; i < this.stations.length; i++) {
        if (this.stations[i][0].station_type == 1) {
          this.arr_stations.push(this.stations[i]);
        }
      }

      let total_arr = this.stations
        .map((x) => x[0].station_type)
        .filter((x) => x == 1).length;

      this.total_arr = total_arr;
  
      this.arr_head = ["No", "Status", "Nama Stasiun", "Tanggal", "Waktu"];


      for (let i = 0; i < this.stations.length; i++) {
      
        if (this.stations[i][0].station_type == 1) {
          this.arr_head_pre.push(this.stations[i][1].table.array_table_label);
        }
        
      }
      let arr_uniq = Array.from(new Set(this.arr_head_pre[0]));
      this.arr_head.splice.apply(this.arr_head, [5, 0].concat(arr_uniq));
      
      

      setInterval(
        function () {

          if (this.profile.station == null) {
            axios
              .get(`${this.$baseURL}/home-data/`)
              .then((r) => {
                this.stations = r.data;
                if (r.status == 200) {
                  this.loading_i = false;
                }
              })
              .catch(function (e) {
                console.log(e);
              });
          } else if (this.profile.station != null) {
            axios
              .get(`${this.$baseURL}/home-data/${this.profile.station.id}`)
              .then((r) => {
                this.stations = r.data;
                if (r.status == 200) {
                  this.loading_i = false;
                }
              })
              .catch(function (e) {
                console.log(e);
              });
          }




          // console.log(this.stations[38]);
          for (let i = 0; i < this.stations.length; i++) {
         
            if (this.stations[i][0].station_type == 1) {
              this.arr_stations = [];
              for (let i = 0; i < this.stations.length; i++) {
                if (this.stations[i][0].station_type == 1) {
                  this.arr_stations.push(this.stations[i]);
                }
              }
            }
          
          }
        }.bind(this),
        15000
      );
      // console.log('before interval');


      setInterval(
        function () {
          
          this.arr_head = ["No", "Status", "Nama Stasiun", "Tanggal", "Waktu"];

          for (let i = 0; i < this.stations.length; i++) {
            
            if (this.stations[i][0].station_type == 1) {
              this.arr_head_pre.push(this.stations[i][1].table.array_table_label);
            }
            
          }
          let arr_uniq = Array.from(new Set(this.arr_head_pre[0]));
          this.arr_head.splice.apply(this.arr_head, [5, 0].concat(arr_uniq));
          

          
        }.bind(this),
        15000
      );
    },
    getYear(x) {
      var d = new Date(x),
        year = d.getFullYear();
      return year;
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

    let user = localStorage.getItem("user-info") || {};
    if (typeof user == "object") {
      this.balai = this.$fixedBalai;
    } else if (typeof user == "string") {
      this.role = JSON.parse(user).profile.role;
      this.user_id = JSON.parse(user).profile.user.id;
      this.balai = JSON.parse(user).profile.balai.id;
      if (this.role == "is_superuser") {
        this.balai = 0;
      }
    }
  },
  mounted() {
    this.loadStations();
    this.formatDate();
    this.formatTime();
    window.addEventListener("scroll", this.handleScroll);
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },
};
</script>

<style scoped>
.tableFixHead {
  overflow-y: scroll;
  height: 37vh;
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
</style>