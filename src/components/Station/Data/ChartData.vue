<template>
  <div v-if="stations[0]">
    <div
      class="card box-sm mt-2 comShadow"
      style="box-shadow: 10px; border-radius: 10px"
    >
      <div class="row">
        <div class="col-md-4 p-0 imgSZ">
          <img
            :src="`${$baseURL}${stations[0].image}`"
            class="img-fluid"
            alt="test"
            style="
              object-fit: cover;
              border-radius: 10px 0px 0px 10px;
              margin-left: 12px;
              width: 94%;
            "
          />
        </div>
        <div class="col-md-8 my-1">
          <div class="d-flex align-items-center mx-2">
            <div class="col-md-10 col-10">
              <div style="font-weight: 500; font-size: 1.2rem">
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
                <div class="info-value" v-if="stations[0].station_type == 2">
                  {{ stations[0].sungai }}
                </div>
              </div>
              <div class="my-1 mx-2">
                <div class="info-dummy" v-if="stations[0].station_type != 2">
                  .
                </div>
                <div class="info-label">Latitude</div>
                <div class="info-value">
                  {{ stations[0].latitude }}<span>&#176;</span>
                </div>
              </div>
            </div>

            <div class="col-md-6 mx-0">
              <div class="my-1 mx-2">
                <div class="info-label">Elevasi</div>
                <div class="info-value">{{ stations[0].elevasi }} m</div>
                <div class="info-dummy">.</div>
              </div>
              <div class="my-1 mx-2">
                <div class="info-label">Longitude</div>
                <div class="info-value">
                  {{ stations[0].longitude }}<span>&#176;</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="ava_width > 768">
      <div v-if="stations[1][0].chart.chart_sensor.flat().length == 1">
        <div v-for="card in [stations[1]]" :key="card.id">
          <div
            class="bg-white text-center comShadow"
            style="border-radius: 15px; margin-left: 12px"
          >
            <div
              v-for="(item, index) in chart_f2(
                card[0].chart.mix_status,
                card[0].chart.chart_sensor,
                card[0].chart.array_act_chart_type,
                card[0].chart.chart_label,
                card[0].chart.chart_data,
                card[0].chart.array_act_icon,
                card[0].chart.array_act_symbol
              )"
              :key="'C' + index"
            >
              <div>
                <div class="d-flex row my-2">
                  <div
                    class="col-md-6 text-white p-2"
                    style="background: #46dddd; border-radius: 15px"
                  >
                    <div class="mb-1 iconSZ">
                      <img :src="`${$baseURL}${item.chart_icon}`" height="85" />
                    </div>
                    <div class="fw-bold" style="font-size: 1.2rem">
                      <div>{{ item.sensor[0][0] }}</div>
                    </div>
                    <div style="font-size: 0.8rem">
                      {{ formatDate(card[0].chart.chart_date) }},
                      {{ formatTime(card[0].chart.chart_date) }}
                    </div>
                  </div>
                  <div
                    class="col-md-6 col d-flex align-items-center justify-content-center"
                    style="color: #46dddd; border-radius: 55px"
                  >
                    <p class="fw-bold mt-2 mx-2" style="font-size: 2.5rem">
                      {{ item.chart_data[0].slice(-1)[0] }}
                    </p>
                    <span style="font-size: 1.5rem">{{
                      item.symbol[0][0]
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="stations[1][0].chart.chart_sensor.flat().length == 2">
        <div v-for="card in [stations[1]]" :key="card.id">
          <div
            class="d-flex justify-content-center align-content-around flex-wrap data align-items-center"
          >
            <div
              v-for="(item, index) in chart_f2(
                card[0].chart.mix_status,
                card[0].chart.chart_sensor,
                card[0].chart.array_act_chart_type,
                card[0].chart.chart_label,
                card[0].chart.chart_data,
                card[0].chart.array_act_icon,
                card[0].chart.array_act_symbol
              )"
              :key="'C' + index"
              class="my-2"
            >
              <div
                class="text-center comShadow mx-1"
                style="background: #fff; border-radius: 15px"
              >
                <div
                  class="text-white p-2"
                  style="
                    background: #46dddd;
                    border-radius: 15px;
                    min-width: 19vw;
                  "
                >
                  <div>
                    <img
                      :src="`${$baseURL}${item.chart_icon[0]}`"
                      height="70"
                    />
                  </div>
                  <div class="fw-bold mt-1">
                    <div>{{ item.sensor[0][0] }}</div>
                  </div>
                  <div style="font-size: 0.9rem">
                    {{ formatDate(card[0].chart.chart_date) }},
                    {{ formatTime(card[0].chart.chart_date) }}
                  </div>
                </div>
                <div style="color: #46dddd">
                  <p class="p-0 m-0">
                    <span class="fw-bold mx-1" style="font-size: 2rem">{{
                      item.chart_data[0].slice(-1)[0]
                    }}</span>
                    <span style="font-size: 1rem">{{ item.symbol[0][0] }}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="stations[1][0].chart.chart_sensor.flat().length == 3">
        <div v-for="card in [stations[1]]" :key="card.id">
          <div
            class="d-flex justify-content-center align-content-around flex-wrap data align-items-center"
          >
            <div
              v-for="(item, index) in chart_f2(
                card[0].chart.mix_status,
                card[0].chart.chart_sensor,
                card[0].chart.array_act_chart_type,
                card[0].chart.chart_label,
                card[0].chart.chart_data,
                card[0].chart.array_act_icon,
                card[0].chart.array_act_symbol
              )"
              :key="'C' + index"
              class="my-2"
            >
              <div
                class="text-center comShadow mx-1"
                style="background: #fff; border-radius: 15px"
              >
                <div
                  class="text-white p-2"
                  style="
                    background: #46dddd;
                    border-radius: 15px;
                    min-width: 12vw;
                  "
                >
                  <div>
                    <img
                      :src="`${$baseURL}${item.chart_icon[0]}`"
                      height="70"
                    />
                  </div>
                  <div class="fw-bold mt-1">
                    <div>{{ item.sensor[0][0] }}</div>
                  </div>
                  <div style="font-size: 0.9rem">
                    {{ formatDate(card[0].chart.chart_date) }},
                    {{ formatTime(card[0].chart.chart_date) }}
                  </div>
                </div>
                <div style="color: #46dddd">
                  <p class="p-0 m-0">
                    <span class="fw-bold mx-1" style="font-size: 2rem">{{
                      item.chart_data[0].slice(-1)[0]
                    }}</span>
                    <span style="font-size: 1rem">{{ item.symbol[0][0] }}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="stations[1][0].chart.chart_sensor.flat().length > 3">
        <div v-for="card in [stations[1]]" :key="card.id">
          <div>
            <carousel
              :perPage="3"
              :autoplay="true"
              :navigationEnabled="true"
              :loop="true"
              :autoplayHoverPause="true"
              :autoplayTimeout="5000"
              :paginationEnabled="false"
              navigationNextLabel="<i class='zmdi zmdi-chevron-right zmdi-hc-lg'></i>"
              navigationPrevLabel="<i class='zmdi zmdi-chevron-left zmdi-hc-lg'></i>"
            >
              <slide
                v-for="(item, index) in chart_f2(
                  card[0].chart.mix_status,
                  card[0].chart.chart_sensor,
                  card[0].chart.array_act_chart_type,
                  card[0].chart.chart_label,
                  card[0].chart.chart_data,
                  card[0].chart.array_act_icon,
                  card[0].chart.array_act_symbol
                )"
                :key="'C' + index"
                class="my-2 d-flex justify-content-around"
              >
                <div
                  class="text-center comShadow"
                  style="background: #fff; border-radius: 15px; max-width: 12vw"
                >
                  <div
                    class="text-white p-2"
                    style="
                      background: #46dddd;
                      border-radius: 15px;
                      min-width: 12vw;
                    "
                  >
                    <div>
                      <img
                        :src="`${$baseURL}${item.chart_icon[0]}`"
                        height="70"
                      />
                    </div>
                    <div class="fw-bold mt-1">
                      <div>{{ item.sensor[0][0] }}</div>
                    </div>
                    <div style="font-size: 0.9rem">
                      {{ formatDate(card[0].chart.chart_date) }},
                      {{ formatTime(card[0].chart.chart_date) }}
                    </div>
                  </div>
                  <div style="color: #46dddd">
                    <p class="p-0 m-0">
                      <span class="fw-bold mx-1" style="font-size: 2rem">{{
                        item.chart_data[0].slice(-1)[0]
                      }}</span>
                      <span style="font-size: 1rem">{{
                        item.symbol[0][0]
                      }}</span>
                    </p>
                  </div>
                </div>
              </slide>
            </carousel>
          </div>
        </div>
      </div>
    </div>

    <div v-for="card in [stations[1]]" :key="card.id">
      <div
        v-for="(item, index) in chart_f2(
          card[0].chart.mix_status,
          card[0].chart.chart_sensor,
          card[0].chart.array_act_chart_type,
          card[0].chart.chart_label,
          card[0].chart.chart_data,
          card[0].chart.array_act_icon,
          card[0].chart.array_act_symbol
        )"
        :key="index"
      >
        <div v-if="!item.mix" class="comShadow" style="border-radius: 15px">
          <div
            v-if="
              item.chart_type == 'BarChart' || item.chart_type == 'LineChart'
            "
            class="box-sm border mx-auto bg-white mb-2"
            style="border-radius: 15px"
          >
            <div>
              <h6 class="px-2 pt-2">
                Data {{ item.sensor[0][0] }} 24 Jam Terakhir
              </h6>
            </div>
            <Chart
              style="height: 28vh"
              class="p-0 pr-0 pt-0 pb-0"
              :label="item.chart_label[0]"
              :chart-data="item.chart_data[0]"
              :title="`${item.sensor[0]} (${item.symbol[0][0]})`"
              :is="item.chart_type[0][0]"
            ></Chart>

            <div class="row text-secondary pb-1" style="font-size: 0.8rem">
              <div class="col-sm-6">
                <span
                  class="float-start"
                  style="margin-top: -10px; margin-left: 25px"
                >
                  {{ formatPrevDate(card[0].chart.chart_date) }}
                </span>
              </div>
              <div class="col-sm-6">
                <span class="float-end mx-1" style="margin-top: -10px">
                  {{ formatDate(card[0].chart.chart_date) }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div v-if="item.mix">
          <div
            class="box-sm border mt-2 mx-auto bg-white"
            style="border-radius: 15px"
          >
            <div>
              <h5 class="px-2 pt-2">
                Data {{ item.sensor[0][0] }} dan {{ item.sensor[1][0] }} 24 Jam
                Terakhir
              </h5>
            </div>

            <Chart
              style="height: 28vh"
              class="p-0 pr-0 pt-0 pb-0"
              :label="item.chart_label[0]"
              :chart-data="item.chart_data[0]"
              :chart-data2="item.chart_data[1]"
              :title1="`${item.sensor[0]} (${item.symbol[0][0]})`"
              :title2="`${item.sensor[1]} (${item.symbol[1][0]})`"
              :type1="item.chart_type[0]"
              :type2="item.chart_type[1]"
              is="MixChart"
            ></Chart>
            <div class="row text-secondary" style="font-size: 0.8rem">
              <div class="col-sm-6">
                <p class="float-start mx-2">
                  {{ formatPrevDate(card[0].chart.chart_date) }}
                </p>
              </div>
              <div class="col-sm-6">
                <p class="float-end mx-1">
                  {{ formatDate(card[0].chart.chart_date) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Gauge from "@/components/Gauge.vue";
import BarChart from "@/components/Chart/BarChart";
import LineChart from "@/components/Chart/LineChart";
import MixChart from "@/components/Chart/MixChart";
import mtc_i from "@/assets/icons/map/mtc.svg";
import ok_i from "@/assets/icons/map/ok.svg";
import s1_i from "@/assets/icons/map/s1.svg";
import s2_i from "@/assets/icons/map/s2.svg";
import s3_i from "@/assets/icons/map/s3.svg";

export default {
  name: "Slider",
  props: ["stations", "status", "ava_width"],
  components: {
    BarChart,
    LineChart,
    MixChart,
    Gauge,
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
  .flex > div {
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
  font-size: 1rem;
}

.info-value {
  margin-left: 10px;
  font-size: 1rem;
}

/* Dummy element style to hide if needed */
.info-dummy {
  margin-left: 10px;
  color: rgba(255, 255, 255, 0);
  font-size: 1rem;
}

.imgSZ img {
  resize: both;
  height: 180px;
  width: 190px;
}

@media (max-width: 768px) {
  .imgSZ {
    height: 170px; /* You can adjust the height as needed */
  }
  .info-dummy {
    display: none;
  }
}
</style>