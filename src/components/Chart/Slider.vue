<template>
  <div class="container">
    <div
      v-if="loading_i"
      class="d-flex flex-column justify-content-center align-items-center"
      style="min-height: 70vh"
    >
      <i
        class="zmdi zmdi-spinner zmdi-hc-spin"
        style="font-size: 2rem; margin-right: 20px"
      ></i>
    </div>

    <carousel
      :perPage="1"
      ref="carousel"
      :autoplay="false"
      :interval="0"
      :navigationEnabled="false"
      :loop="true"
      :paginationEnabled="false"
      navigationNextLabel="<i class='zmdi zmdi-chevron-right zmdi-hc-lg'></i>"
      navigationPrevLabel="<i class='zmdi zmdi-chevron-left zmdi-hc-lg'></i>"
    >
      <slide
        v-for="station in stations"
        :key="station[0].id"
        style="max-width: 100% !important; min-width: 100% !important"
      >
        <div>
          <!-- Location -->
          <div
            class="card box-sm mt-2 mx-1 comShadow"
            style="box-shadow: 10px; border-radius: 10px"
          >
            <div class="row">
              <div class="col-md-4 p-0 imgSZ">
                <img
                  :src="`${$baseURL}${station[0].image}`"
                  class="img-fluid"
                  alt="test"
                  style="
                    object-fit: cover;
                    border-radius: 10px 0px 0px 10px;
                    margin-left: 14px;
                    width: 100%;
                  "
                />
              </div>

              <div class="col-md-8 my-1">
                <div class="row">
                  <div class="col-md-10 col-10">
                    <div
                      style="
                        font-weight: 500;
                        font-size: 1.3em;
                        margin-left: 7px;
                      "
                    >
                      {{ station[0].station_name }}
                    </div>
                  </div>
                  <div class="col-md-2 col-2 d-flex justify-content-end">
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

                <div class="row">
                  <div class="col-md-6 mx-0">
                    <div class="my-1 mx-2">
                      <div class="info-label">Lokasi</div>
                      <div class="info-value">{{ station[0].location }}</div>
                      <div
                        class="info-value"
                        v-if="station[0].station_type == 2"
                      >
                        {{ station[0].sungai }}
                      </div>
                    </div>
                    <div class="my-1 mx-2">
                      <div
                        class="info-dummy"
                        v-if="station[0].station_type != 2"
                      >
                        .
                      </div>
                      <div class="info-label">Latitude</div>
                      <div class="info-value">
                        {{ station[0].latitude }}<span>&#176;</span>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6 mx-0">
                    <div class="my-1 mx-2">
                      <div class="info-label">Elevasi</div>
                      <div class="info-value">{{ station[0].elevasi }} m</div>
                      <div class="info-dummy">.</div>
                    </div>
                    <div class="my-1 mx-2">
                      <div class="info-label">Longitude</div>
                      <div class="info-value">
                        {{ station[0].longitude }}<span>&#176;</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <!-- Cards -->
            <div
              v-if="ava_width > 768"
              style="height: 25vh; position: relative"
            >
              <div
                class="slideCard"
                v-if="station[1].chart.chart_sensor.flat().length == 1"
              >
                <div
                  v-for="card in [station[1]]"
                  :key="card.id"
                  class="d-flex justify-content-center mx-1"
                >
                  <div
                    class="text-center bg-white comShadow"
                    style="
                      border-radius: 15px;
                      width: 98%;
                      position: absolute;
                      top: 50%;
                      left: 50%;
                      transform: translate(-50%, -50%);
                    "
                  >
                    <div
                      v-for="(item, index) in chart_f2(
                        card.chart.mix_status,
                        card.chart.chart_sensor,
                        card.chart.array_act_chart_type,
                        card.chart.chart_label,
                        card.chart.chart_data,
                        [card.chart.chart_date],
                        card.chart.array_act_icon,
                        card.chart.array_act_symbol
                      )"
                      :key="'C' + index"
                    >
                      <div>
                        <div class="d-flex row mx-0">
                          <div
                            class="col-md-6 col d-flex align-items-center justify-content-center text-white py-1 greenCard"
                          >
                            <div>
                              <div class="mb-1">
                                <img
                                  :src="`${$baseURL}${item.chart_icon}`"
                                  style="height: 13vh"
                                />
                              </div>
                              <div class="fw-bold" style="font-size: 1.3rem">
                                <div>{{ item.sensor[0][0] }}</div>
                              </div>
                              <div style="font-size: 0.9rem">
                                {{ formatDate(station[1].chart.chart_date) }},
                                {{ formatTime(station[1].chart.chart_date) }}
                              </div>
                            </div>
                          </div>
                          <div
                            class="col-md-6 col d-flex align-items-center justify-content-center"
                            style="color: #46dddd"
                          >
                            <p
                              class="fw-bold mt-2 mx-2"
                              style="font-size: 2.2rem"
                            >
                              {{ item.chart_data[0].slice(-1)[0] }}
                            </p>
                            <span style="font-size: 1.2rem">{{
                              item.symbol[0][0]
                            }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="slideCard"
                v-else-if="station[1].chart.chart_sensor.flat().length == 2"
              >
                <div
                  v-for="card in [station[1]]"
                  :key="card.id"
                  class="d-flex justify-content-center mx-1"
                >
                  <div
                    class="d-flex justify-content-center align-content-around flex-wrap data align-items-center"
                    style="
                      border-radius: 15px;
                      width: 98%;
                      position: absolute;
                      top: 50%;
                      left: 50%;
                      transform: translate(-50%, -50%);
                    "
                  >
                    <div
                      v-for="(item, index) in chart_f2(
                        card.chart.mix_status,
                        card.chart.chart_sensor,
                        card.chart.array_act_chart_type,
                        card.chart.chart_label,
                        card.chart.chart_data,
                        [card.chart.chart_date],
                        card.chart.array_act_icon,
                        card.chart.array_act_symbol
                      )"
                      :key="'C' + index"
                      class="border-radius: 15px; width: 100%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"
                    >
                      <div
                        class="text-center comShadow mx-1"
                        style="background: #fff; border-radius: 15px"
                      >
                        <div
                          class="text-white p-2 greenCard"
                          style="min-width: 19vw"
                        >
                          <div class="mb-1 iconSZ">
                            <img
                              :src="`${$baseURL}${item.chart_icon[0]}`"
                              height="70"
                            />
                          </div>
                          <div class="fw-bold mt-1">
                            <div>{{ item.sensor[0][0] }}</div>
                          </div>
                          <div style="font-size: 0.9rem">
                            {{ formatDate(station[1].chart.chart_date) }},
                            {{ formatTime(station[1].chart.chart_date) }}
                          </div>
                        </div>
                        <div style="color: #46dddd">
                          <p class="p-0 m-0">
                            <span
                              class="fw-bold mx-1"
                              style="font-size: 1.7rem"
                              >{{ item.chart_data[0].slice(-1)[0] }}</span
                            >
                            <span style="font-size: 1rem">{{
                              item.symbol[0][0]
                            }}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="slideCard"
                v-else-if="station[1].chart.chart_sensor.flat().length == 3"
              >
                <div
                  v-for="card in [station[1]]"
                  :key="card.id"
                  class="d-flex justify-content-center mx-1"
                >
                  <div
                    class="d-flex justify-content-center align-content-around flex-wrap data align-items-center"
                    style="
                      border-radius: 15px;
                      width: 98%;
                      position: absolute;
                      top: 50%;
                      left: 50%;
                      transform: translate(-50%, -50%);
                    "
                  >
                    <div
                      v-for="(item, index) in chart_f2(
                        card.chart.mix_status,
                        card.chart.chart_sensor,
                        card.chart.array_act_chart_type,
                        card.chart.chart_label,
                        card.chart.chart_data,
                        [card.chart.chart_date],
                        card.chart.array_act_icon,
                        card.chart.array_act_symbol
                      )"
                      :key="'C' + index"
                      class="border-radius: 15px; width: 100%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"
                    >
                      <div
                        class="text-center comShadow mx-1"
                        style="background: #fff; border-radius: 15px"
                      >
                        <div
                          class="text-white p-2 greenCard"
                          style="min-width: 12vw"
                        >
                          <div class="mb-1 iconSZ">
                            <img
                              :src="`${$baseURL}${item.chart_icon[0]}`"
                              height="70"
                            />
                          </div>
                          <div class="fw-bold mt-1">
                            <div>{{ item.sensor[0][0] }}</div>
                          </div>
                          <div style="font-size: 0.9rem">
                            {{ formatDate(station[1].chart.chart_date) }},
                            {{ formatTime(station[1].chart.chart_date) }}
                          </div>
                        </div>
                        <div style="color: #46dddd">
                          <p class="p-0 m-0">
                            <span
                              class="fw-bold mx-1"
                              style="font-size: 1.7rem"
                              >{{ item.chart_data[0].slice(-1)[0] }}</span
                            >
                            <span style="font-size: 1rem">{{
                              item.symbol[0][0]
                            }}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="slideCard"
                v-else-if="station[1].chart.chart_sensor.flat().length > 3"
              >
                <div v-for="card in [station[1]]" :key="card.id">
                  <div></div>
                  <carousel
                    :perPage="3"
                    :autoplay="true"
                    :navigationEnabled="false"
                    :loop="true"
                    :autoplayHoverPause="true"
                    :autoplayTimeout="4000"
                    :paginationEnabled="false"
                    navigationNextLabel="<i class='zmdi zmdi-chevron-right zmdi-hc-lg'></i>"
                    navigationPrevLabel="<i class='zmdi zmdi-chevron-left zmdi-hc-lg'></i>"
                    style="
                      border-radius: 15px;
                      width: 100%;
                      position: absolute;
                      top: 50%;
                      left: 50%;
                      transform: translate(-50%, -50%);
                    "
                  >
                    <slide
                      v-for="(item, index) in chart_f2(
                        card.chart.mix_status,
                        card.chart.chart_sensor,
                        card.chart.array_act_chart_type,
                        card.chart.chart_label,
                        card.chart.chart_data,
                        [card.chart.chart_date],
                        card.chart.array_act_icon,
                        card.chart.array_act_symbol
                      )"
                      :key="'C' + index"
                      class="d-flex justify-content-around"
                    >
                      <div
                        class="text-center comShadow"
                        style="
                          background: #fff;
                          border-radius: 15px;
                          max-width: 12vw;
                        "
                      >
                        <div
                          class="text-white p-1 greenCard"
                          style="min-width: 12vw"
                        >
                          <div class="iconSZ">
                            <img
                              :src="`${$baseURL}${item.chart_icon[0]}`"
                              height="70"
                            />
                          </div>
                          <div class="fw-bold">
                            <div>{{ item.sensor[0][0] }}</div>
                          </div>
                          <div style="font-size: 0.9rem">
                            {{ formatDate(station[1].chart.chart_date) }},
                            {{ formatTime(station[1].chart.chart_date) }}
                          </div>
                        </div>
                        <div style="color: #46dddd">
                          <p class="p-0 m-0">
                            <span
                              class="fw-bold mx-1"
                              style="font-size: 1.7rem"
                              >{{ item.chart_data[0].slice(-1)[0] }}</span
                            >
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
            <!-- Charts -->
            <div v-for="card in [station[1]]" :key="card.id">
              <div
                v-for="(item, index) in chart_f2(
                  card.chart.mix_status,
                  card.chart.chart_sensor,
                  card.chart.array_act_chart_type,
                  card.chart.chart_label,
                  card.chart.chart_data,
                  [card.chart.chart_date],
                  card.chart.array_act_icon,
                  card.chart.array_act_symbol
                )"
                :key="index"
              >
                <div v-if="!item.mix" style="border-radius: 15px">
                  <div
                    v-if="
                      item.chart_type == 'BarChart' ||
                      item.chart_type == 'LineChart'
                    "
                    class="box-sm border mx-1 bg-white comShadow"
                    style="border-radius: 15px"
                  >
                    <div>
                      <div
                        class="px-2 py-2"
                        style="font-weight: 500; font-size: 1em"
                      >
                        Data {{ item.sensor[0][0] }} 24 Jam Terakhir
                      </div>
                    </div>
                    <Chart
                      style="height: 25vh"
                      class="p-0 pr-0 pt-0 pb-0"
                      :label="item.chart_label[0]"
                      :chart-data="item.chart_data[0]"
                      :title="`${item.sensor[0]} (${item.symbol[0][0]})`"
                      :is="item.chart_type[0][0]"
                    ></Chart>
                    <div
                      class="row text-secondary pb-1"
                      style="font-size: 0.8rem; margin-top: -10px"
                    >
                      <div class="col-sm-6">
                        <div
                          class="float-start"
                          style="margin-top: -2px; margin-left: 17px"
                        >
                          {{ formatPrevDate(station[1].chart.chart_date) }}
                        </div>
                      </div>
                      <div class="col-sm-6">
                        <div class="float-end mx-1">
                          {{ formatDate(station[1].chart.chart_date) }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="item.mix">
                  <div
                    class="box-sm border mt-2 px-1 bg-white comShadow"
                    style="border-radius: 15px"
                  >
                    <div>
                      <h5 class="px-2 pt-2">
                        Data {{ item.sensor[0][0] }} dan
                        {{ item.sensor[1][0] }} 24 Jam Terakhir
                      </h5>
                    </div>
                    <Chart
                      style="height: 25vh"
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
                        <div
                          class="float-start"
                          style="margin-top: -2px; margin-left: 17px"
                        >
                          {{ formatPrevDate(station[1].chart.chart_date) }}
                        </div>
                      </div>
                      <div class="col-sm-6">
                        <div class="float-end mx-1">
                          {{ formatDate(station[1].chart.chart_date) }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </slide>
    </carousel>
  </div>
</template>

<script>
import BarChart from "@/components/Chart/BarChart";
import LineChart from "@/components/Chart/LineChart";
import MixChart from "@/components/Chart/MixChart";
import Gauge from "@/components/Gauge.vue";
import axios from "axios";
import mtc_i from "@/assets/icons/map/mtc.svg";
import ok_i from "@/assets/icons/map/ok.svg";
import s1_i from "@/assets/icons/map/s1.svg";
import s2_i from "@/assets/icons/map/s2.svg";
import s3_i from "@/assets/icons/map/s3.svg";

export default {
  name: "Slider",
  props: ["ava_width"],
  data() {
    return {
      stations: [],
      mtc_i,
      ok_i,
      s1_i,
      s2_i,
      s3_i,
      loading_i: true,
      window_loc: "",
      options: {
        arcColors: ["rgb(44,151,222)", "lightgray"],
        arcDelimiters: [80],
        rangeLabel: ["0%", "100%"],
        centralLabel: "70%",
      },
      currentIndex: 0,
    };
  },
  components: {
    BarChart,
    LineChart,
    MixChart,
    Gauge,
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
    formatLabel(date) {
      var d = new Date(date),
        hour = "" + d.getHours(),
        minute = "" + d.getMinutes(),
        second = d.getSeconds();

      if (hour.length < 2) hour = "0" + hour;
      if (minute.length < 2) minute = "0" + minute;
      if (second.length < 2) second = "0" + second;

      return [hour, minute].join(":");
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

    chart_f2(a, b, c, d, e, f, g, h) {
      return a.map((card, i) => {
        return {
          mix: card,
          sensor: b[i],
          chart_type: c[i],
          chart_label: d[i],
          chart_data: e[i],
          chart_date: f[i],
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
    async loadHomeData() {
      try {
        const response = await axios.get(
          `${this.$baseURL}/home-data/non-auth/${this.balai}`
        );
        this.stations = response.data.map((element) => {
          const x = element[1].chart.chart_sensor.flat().length;
          const duration = Math.ceil(x / 3) * 3 * 4000 + 1000;
          element.duration = duration;
          return element;
        });

        this.loading_i = false;
      } catch (error) {
        // Handle error if necessary
        console.error("An error occurred:", error);
      }
    },

    async startSlideshow() {
      try {
        const response = await axios.get(
          `${this.$baseURL}/home-data/non-auth/${this.balai}`
        );
        this.stations = response.data.map((element) => {
          const x = element[1].chart.chart_sensor.flat().length;
          const duration = Math.ceil(x / 3) * 3 * 4000 + 1000;
          element.duration = duration;
          return element;
        });

        this.loading_i = false;
        let currentIndex = 0;

        const playSlide = () => {
          setTimeout(() => {
            currentIndex = (currentIndex + 1) % this.stations.length;
            if (this.$refs.carousel) {
              this.$refs.carousel.goToPage(currentIndex);
            }
            playSlide();
          }, this.stations[currentIndex].duration);
        };
        playSlide();
      } catch (error) {
        // Handle error if necessary
        console.error("An error occurred:", error);
      }
    },
  },
  mounted() {
    this.formatDate();
    this.formatLabel();
    this.formatTime();

    this.loadHomeData();
    setInterval(
      function () {
        this.loadHomeData();
      }.bind(this),
      15000
    );

    this.startSlideshow();
  },
  created() {
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
  height: 24vh;
  width: 190px;
}

@media (max-width: 768px) {
  .imgSZ {
    height: 170px; /* You can adjust the height as needed */
    width: 300px;
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
