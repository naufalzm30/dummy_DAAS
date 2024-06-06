<template>
  <div v-if="stations[0]">
    <div class="card box-sm mt-2 comShadow mb-2" style="box-shadow: 10px; border-radius: 10px">
      <div class="row">
        <div class="col-md-4 p-0 imgSZ">
          <img :src="`${$imageURL}${stations[0].image}`" class="img-fluid" alt="station-img" style="
              object-fit: cover;
              border-radius: 10px 0px 0px 10px;
              margin-left: 12px;
              width: 94%;
            " />
        </div>
        <div class="col-md-8 my-0">
          <div class="d-flex align-items-center mx-2">
            <div class="col-md-10 col-10">
              <div style="font-weight: 500; font-size: 1.1rem">
                {{ stations[0].station_name }}
              </div>
            </div>
            <div class="col-md-2 col-2 d-flex justify-content-end">
              <div v-for="station in status" :key="station[0].id">
                <div v-if="station[0].id == stations[0].id">
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
                </div>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6 mx-0">
              <div class="my-1 mx-2">
                <div class="info-label">Lokasi</div>
                <div class="info-value">{{ stations[0].location }}</div>
              </div>
              <div class="my-1 mx-2">
                <div class="info-label">Nameplate Head</div>
                <div class="info-value">{{ stations[0].nameplate_head }}</div>
              </div>
            </div>

            <div class="col-md-6 mx-0">
              <div class="my-1 mx-2">
                <div class="info-label">Jumlah Pompa</div>
                <div class="info-value">{{ stations[0].jumlah_pompa }}</div>

              </div>
              <div class="my-1 mx-2">
                <div class="info-label">Jumlah Operasi</div>
                <div class="info-value">
                  {{ stations[0].jumlah_operasi }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


    <div v-for="card in [stations[1]]" :key="card.id">
      <div v-for="(item, index) in chart_f2(
    card[0].chart.mix_status,
    card[0].chart.chart_sensor,
    card[0].chart.array_act_chart_type,
    card[0].chart.chart_label,
    card[0].chart.chart_data,
    card[0].chart.array_act_icon,
    card[0].chart.array_act_symbol
  )" :key="index">
        <div v-if="!item.mix" class="comShadow" style="border-radius: 15px">
          <div v-if="item.chart_type == 'BarChart' || item.chart_type == 'LineChart'
    " class="box-sm border mx-auto bg-white mb-2" style="border-radius: 15px">
            <div>
              <h6 class="px-2 pt-2">
                Data {{ item.sensor[0][0] }}
              </h6>
            </div>
            <Chart style="height: 28vh" class="p-0 pr-0 pt-0 pb-0" :label="debitLabel" :chart-data="debitData"
              :title="`${item.sensor[0]} (${item.symbol[0][0]})`" is="LineChartFiltered">
            </Chart>

          </div>
        </div>

      </div>
      <div v-for="(item, index) in chart_f2nd(
    card[0].chart.mix_status,
    card[0].chart.chart_sensor,
    card[0].chart.array_act_chart_type,
    card[0].chart.chart_label,
    card[0].chart.chart_data,
    card[0].chart.array_act_icon,
    card[0].chart.array_act_symbol
  )" :key="index+1">
        <div v-if="!item.mix" class="comShadow" style="border-radius: 15px">
          <div v-if="item.chart_type == 'BarChart' || item.chart_type == 'LineChart'
    " class="box-sm border mx-auto bg-white mb-2" style="border-radius: 15px">
            <div>
              <h6 class="px-2 pt-2">
                Data {{ item.sensor[0][0] }}
              </h6>
            </div>
            <Chart style="height: 28vh" class="p-0 pr-0 pt-0 pb-0" :label="debitLabel" :chart-data="totalData"
              :title="`${item.sensor[0]} (${item.symbol[0][0]})`" is="TotalChartFiltered">
            </Chart>



          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import LineChartFiltered from "@/components/Chart/LineChartFiltered";
import TotalChartFiltered from "@/components/Chart/TotalChartFiltered";

import mtc_i from "@/assets/icons/map/mtc.svg";
import ok_i from "@/assets/icons/map/ok.svg";
import s1_i from "@/assets/icons/map/s1.svg";
import s2_i from "@/assets/icons/map/s2.svg";
import s3_i from "@/assets/icons/map/s3.svg";

export default {
  name: "Slider",
  props: ["debitData", "debitLabel", "totalData", "stations", "status", "ava_width",],
  components: {
    LineChartFiltered,
    TotalChartFiltered,
  },
  data() {
    return {
      mtc_i,
      ok_i,
      s1_i,
      s2_i,
      s3_i,
      total_s: null,
    };
  },
  computed: {
    chartTitle() {
      return this.stations.length > 0 ? `${this.stations[0].sensor[0]} (${this.stations[0].symbol[0][0]})` : 'Chart';
    }
  },

  methods: {

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
    formatPrevDate(date) {
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
      var days = -1;

      var d = new Date(date);

      var d_1 = new Date(d.getTime() + days * 24 * 60 * 60 * 1000),
        day_1 = "" + d_1.getDate(),
        month_1 = "" + d_1.getMonth(),
        year_1 = d_1.getFullYear();

      if (day_1.length < 2) day_1 = "0" + day_1;

      return [day_1, monthShortNames[month_1], year_1].join(" ");
    },
    cards_f(a, b, c, d, e) {
      return a.map((card, i) => {
        return {
          label: card,
          icon: b[i],
          symbol: c[i],
          data: d[i],
          chart_type: e[i],
        };
      });
    },
    chart_f(a, b, c, d, e) {
      return a.map((card, i) => {
        return {
          label: card,
          chart_type: b[i],
          data: c[i],
          sensor: d[i],
          date: e[i],
        };
      });
    },

    chart_f2(a, b, c, d, e, g, h) {
      return a.map((card, i) => {
        return {
          mix: card,
          sensor: b[i],
          chart_type: c[i],
          chart_label: d[i],
          chart_data: e[i],

          chart_icon: g[i],
          symbol: h[i],
        };
      });
    },
    // chart_f2(a, b, c, d, e, f, g, h) {
    //   return a.map((card, i) => {
    //     return {
    //       mix: card,
    //       sensor: b[i],
    //       chart_type: c[i],
    //       chart_label: d[i],
    //       chart_data: e[i],
    //       chart_date: f[i],
    //       chart_icon: g[i],
    //       symbol: h[i],
    //     };
    //   });
    // },
    // chart_f2nd(a, b, c, d, e, f, g, h) {
    //   return a.map((card, i) => {
    //     // Use the second element if it exists, otherwise fallback to the first element
    //     return {
    //       mix: a[1] !== undefined ? a[1] : a[0],
    //       sensor: b[1] !== undefined ? b[1] : b[0],
    //       chart_type: c[1] !== undefined ? c[1] : c[0],
    //       chart_label: d[1] !== undefined ? d[1] : d[0],
    //       chart_data: e[1] !== undefined ? e[1] : e[0],
    //       // chart_date: f[1] !== undefined ? f[1] : f[0],
    //       chart_icon: g[1] !== undefined ? g[1] : g[0],
    //       symbol: h[1] !== undefined ? h[1] : h[0],
    //     };
    //   });
    // },
    chart_f2nd(a, b, c, d, e, g, h) {
      return a.map(() => {
        return {
          mix: a[1] !== undefined ? a[1] : a[0],
          sensor: b[1] !== undefined ? b[1] : b[0],
          chart_type: c[1] !== undefined ? c[1] : c[0],
          chart_label: d[1] !== undefined ? d[1] : d[0],
          chart_data: e[1] !== undefined ? e[1] : e[0],

          chart_icon: g[1] !== undefined ? g[1] : g[0],
          symbol: h[1] !== undefined ? h[1] : h[0],
        };
      });
    },
    chart_f3(a, b, c, d, e) {
      return a.map((card, i) => {
        return {
          mix: card,
          sensor: b[i],
          chart_type: c[i],
          chart_label: d[i],
          chart_data: e[i],
        };
      });
    },
  },

  created() {
    this.gAuthStation();
    var x = this.stations[1][0].chart.chart_sensor;
    this.total_s = x.flat().length;
    // console.log(this.debitData);


  },

  mounted() {
    this.ava_width = screen.availWidth;

  },
};
</script>

<style scoped>
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

.img-awlr {
  height: 150px;
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

.statSZ {
  height: 22px;
}

.comShadow {
  box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
}

.iconSZ img {
  resize: both;
  height: 13vh;
  max-height: 13vh;
}

.img-normal {
  height: 160px;
  width: 190px;
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
  font-size: 1rem;
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
  }

  .info-dummy {
    display: none;
  }
}
</style>