<template>
  <div>
    <span v-for="item in stations" :key="item.id">
      <div v-if="item.id == $route.params.id" class="row">
        <div class="left-container" :class="{ p012: item.station_type == 3 }">
          <TableMap :stations="item" :status="status" :loading_i="loading_i" class="mx-auto comShadow border"
            style="border-radius: 15px" />
        </div>
        <div v-if="item.station_type == 3" class="right-container">
          <WindRoseChart style="border-radius: 15px" class="box comShadow"
            v-if="computedWindData.length && stations.length > 0" :sampleData="computedWindData" :stations="stations"
            :startDate="startDate" :endDate="endDate" />
        </div>
      </div>
    </span>

    <div style="border-radius: 15px" class="mt-2">
      <dataset class="box comShadow px-3" v-slot="{ ds }" :ds-data="filterData" :ds-sortby="sortBy">
        <div class="row" :data-page-count="ds.dsPagecount">
          <div v-if="loading_i && role == 'is_guess'"
            class="d-flex flex-column justify-content-center align-items-center">
            <i class="zmdi zmdi-spinner zmdi-hc-spin" style="font-size: 1.5rem"></i>
          </div>
          <div class="col-md-1 d-flex justify-content-start" style="margin: 1rem 0 1rem 0">
            <button v-if="role == 'is_superuser'" type="button" class="btn btn-sm btn-success d-none"
              data-bs-toggle="modal" style="font-size: 0.8rem" data-bs-target="#staticBackdrop">
              <span>CSV</span>
            </button>
          </div>

          <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
            aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <form @submit.prevent="modified">
                  <div class="modal-header">
                    <h5 class="modal-title" id="staticBackdropLabel">
                      Upload CSV File
                      <span v-for="item in stations" :key="item.id">
                        <span v-if="item.id == $route.params.id">
                          {{ item.station_name }}
                        </span>
                      </span>
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <div>
                      <label>
                        <input type="file" id="file" v-on:change="onChangeFileUpload($event)" />
                      </label>
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                      Close
                    </button>
                    <button type="submit" class="btn btn-primary" data-bs-dismiss="modal">
                      Upload
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div class="col-md-9 d-flex justify-content-end" style="margin-top: 1rem">
            <div v-if="role != 'is_guess'">
              <i v-if="loading_data" class="zmdi zmdi-spinner zmdi-hc-spin mx-2" style="font-size: 1.2rem"></i>
              <i v-if="loading_date_data" class="zmdi zmdi-rotate-right zmdi-hc-spin mx-2"
                style="font-size: 1.2rem"></i>
              <input name="from" type="date" v-model="startDate" @change="search" title="Data Awal"
                style="font-size: 0.8rem" />
              <label for="to" class="px-3" style="font-size: 0.8rem; font-weight: normal">s.d</label>
              <input name="" type="date" v-model="endDate" @change="search" title="Data Akhir"
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
    )" :key="index">
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
import WindRoseChart from "@/components/Chart/WindRoseChart";
import TableMap from "@/components/Station/Data/TableMap.vue";

import {
  Dataset,
  DatasetItem,
  // DatasetInfo,
  DatasetPager,
  // DatasetShow,
} from "vue-dataset";
// import { error } from "highcharts";

function isInDirection(windSpeed, windDirection, startDegree, endDegree) {
  if (isNaN(parseFloat(windSpeed)) || isNaN(parseFloat(windDirection))) {
    console.log(
      "Invalid windSpeed or windDirection:",
      windSpeed,
      windDirection
    );
    return false;
  }

  const normalizedValue = (windDirection + 360) % 360;
  const normalizedStart = (parseFloat(startDegree) + 360) % 360;
  const normalizedEnd = (parseFloat(endDegree) + 360) % 360;

  if (normalizedStart <= normalizedEnd) {
    return (
      normalizedValue >= normalizedStart && normalizedValue <= normalizedEnd
    );
  } else {
    return (
      normalizedValue >= normalizedStart || normalizedValue <= normalizedEnd
    );
  }
}

export default {
  name: "TableData",
  components: {
    Dataset,
    DatasetItem,
    // DatasetInfo,
    DatasetPager,
    // DatasetShow,
    TableMap,
    WindRoseChart,
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
      sampleData: [
        {
          bgcolor: "#CCCCFF",
          cells: [
            { value: "Direction", class: "freq" },
            { value: "< 0.5 m/s", class: "freq" },
            { value: "0.5-2 m/s", class: "freq" },
            { value: "2-4 m/s", class: "freq" },
            { value: "4-6 m/s", class: "freq" },
            { value: "6-8 m/s", class: "freq" },
            { value: "8-10 m/s", class: "freq" },
            { value: "> 10 m/s", class: "freq" },
            { value: "Total", class: "freq" },
          ],
        },
        {
          bgcolor: "",
          cells: [
            { value: "N", class: "dir" },
            { value: "1.81", class: "data" },
            { value: "1.78", class: "data" },
            { value: "0.16", class: "data" },
            { value: "0.00", class: "data" },
            { value: "0.00", class: "data" },
            { value: "0.00", class: "data" },
            { value: "0.00", class: "data" },
            { value: "3.75", class: "data" },
          ],
        },
        {
          bgcolor: "#DDDDDD",
          cells: [
            { value: "NNE", class: "dir" },
            { value: "0.62", class: "data" },
            { value: "1.09", class: "data" },
            { value: "0.00", class: "data" },
            { value: "0.00", class: "data" },
            { value: "0.00", class: "data" },
            { value: "0.00", class: "data" },
            { value: "0.00", class: "data" },
            { value: "1.71", class: "data" },
          ],
        },
        {
          bgcolor: "",
          cells: [
            { value: "NE", class: "dir" },
            { value: "0.82", class: "data" },
            { value: "0.82", class: "data" },
            { value: "0.07", class: "data" },
            { value: "0.00", class: "data" },
            { value: "0.00", class: "data" },
            { value: "0.00", class: "data" },
            { value: "0.00", class: "data" },
            { value: "1.71", class: "data" },
          ],
        },
        {
          bgcolor: "#DDDDDD",
          cells: [
            { value: "ENE", class: "dir" },
            { value: "0.59", class: "data" },
            { value: "1.22", class: "data" },
            { value: "0.07", class: "data" },
            { value: "0.00", class: "data" },
            { value: "0.00", class: "data" },
            { value: "0.00", class: "data" },
            { value: "0.00", class: "data" },
            { value: "1.88", class: "data" },
          ],
        },
        {
          bgcolor: "",
          cells: [
            { value: "E", class: "dir" },
            { value: "0.62", class: "data" },
            { value: "2.20", class: "data" },
            { value: "0.49", class: "data" },
            { value: "0.00", class: "data" },
            { value: "0.00", class: "data" },
            { value: "0.00", class: "data" },
            { value: "0.00", class: "data" },
            { value: "3.32", class: "data" },
          ],
        },
        {
          bgcolor: "#DDDDDD",
          cells: [
            { value: "ESE", class: "dir" },
            { value: "1.22", class: "data" },
            { value: "2.01", class: "data" },
            { value: "1.55", class: "data" },
            { value: "0.30", class: "data" },
            { value: "0.13", class: "data" },
            { value: "0.00", class: "data" },
            { value: "0.00", class: "data" },
            { value: "5.20", class: "data" },
          ],
        },
        {
          bgcolor: "",
          cells: [
            { value: "SE", class: "dir" },
            { value: "1.61", class: "data" },
            { value: "3.06", class: "data" },
            { value: "2.37", class: "data" },
            { value: "2.14", class: "data" },
            { value: "1.74", class: "data" },
            { value: "0.39", class: "data" },
            { value: "0.13", class: "data" },
            { value: "11.45", class: "data" },
          ],
        },
        {
          bgcolor: "#DDDDDD",
          cells: [
            { value: "SSE", class: "dir" },
            { value: "2.04", class: "data" },
            { value: "3.42", class: "data" },
            { value: "1.97", class: "data" },
            { value: "0.86", class: "data" },
            { value: "0.53", class: "data" },
            { value: "0.49", class: "data" },
            { value: "0.00", class: "data" },
            { value: "9.31", class: "data" },
          ],
        },
        {
          bgcolor: "",
          cells: [
            { value: "S", class: "dir" },
            { value: "2.66", class: "data" },
            { value: "4.74", class: "data" },
            { value: "0.43", class: "data" },
            { value: "0.00", class: "data" },
            { value: "0.00", class: "data" },
            { value: "0.00", class: "data" },
            { value: "0.00", class: "data" },
            { value: "7.83", class: "data" },
          ],
        },
        {
          bgcolor: "#DDDDDD",
          cells: [
            { value: "SSW", class: "dir" },
            { value: "2.96", class: "data" },
            { value: "4.14", class: "data" },
            { value: "0.26", class: "data" },
            { value: "0.00", class: "data" },
            { value: "0.00", class: "data" },
            { value: "0.00", class: "data" },
            { value: "0.00", class: "data" },
            { value: "7.37", class: "data" },
          ],
        },
        {
          bgcolor: "",
          cells: [
            { value: "SW", class: "dir" },
            { value: "2.53", class: "data" },
            { value: "4.01", class: "data" },
            { value: "1.22", class: "data" },
            { value: "0.49", class: "data" },
            { value: "0.13", class: "data" },
            { value: "0.00", class: "data" },
            { value: "0.00", class: "data" },
            { value: "8.39", class: "data" },
          ],
        },
        {
          bgcolor: "#DDDDDD",
          cells: [
            { value: "WSW", class: "dir" },
            { value: "1.97", class: "data" },
            { value: "2.66", class: "data" },
            { value: "1.97", class: "data" },
            { value: "0.79", class: "data" },
            { value: "0.30", class: "data" },
            { value: "0.00", class: "data" },
            { value: "0.00", class: "data" },
            { value: "7.70", class: "data" },
          ],
        },
        {
          bgcolor: "",
          cells: [
            { value: "W", class: "dir" },
            { value: "1.64", class: "data" },
            { value: "1.71", class: "data" },
            { value: "0.92", class: "data" },
            { value: "1.45", class: "data" },
            { value: "0.26", class: "data" },
            { value: "0.10", class: "data" },
            { value: "0.00", class: "data" },
            { value: "6.09", class: "data" },
          ],
        },
        {
          bgcolor: "#DDDDDD",
          cells: [
            { value: "WNW", class: "dir" },
            { value: "1.32", class: "data" },
            { value: "2.40", class: "data" },
            { value: "0.99", class: "data" },
            { value: "1.61", class: "data" },
            { value: "0.33", class: "data" },
            { value: "0.00", class: "data" },
            { value: "0.00", class: "data" },
            { value: "6.64", class: "data" },
          ],
        },
        {
          bgcolor: "",
          cells: [
            { value: "NW", class: "dir" },
            { value: "1.58", class: "data" },
            { value: "4.28", class: "data" },
            { value: "1.28", class: "data" },
            { value: "0.76", class: "data" },
            { value: "0.66", class: "data" },
            { value: "0.69", class: "data" },
            { value: "0.03", class: "data" },
            { value: "9.28", class: "data" },
          ],
        },
        {
          bgcolor: "#DDDDDD",
          cells: [
            { value: "NNW", class: "dir" },
            { value: "1.51", class: "data" },
            { value: "5.00", class: "data" },
            { value: "1.32", class: "data" },
            { value: "0.13", class: "data" },
            { value: "0.23", class: "data" },
            { value: "0.13", class: "data" },
            { value: "0.07", class: "data" },
            { value: "8.39", class: "data" },
          ],
        },
        {
          bgcolor: "",
          cells: [
            { value: "Total", class: "totals", title: "", speed: "" },
            {
              value: "25.53",
              class: "totals",
              title: "< 0.5 m/s",
              speed: "< 0.5",
            },
            {
              value: "44.54",
              class: "totals",
              title: "0.5 -2 m/s",
              speed: "0.5 - 2",
            },
            {
              value: "15.07",
              class: "totals",
              title: "2 - 4 m/s",
              speed: "2 - 4",
            },
            {
              value: "8.52",
              class: "totals",
              title: "4 - 6 m/s",
              speed: "4 - 6",
            },
            {
              value: "4.31",
              class: "totals",
              title: "6 - 8 m/s",
              speed: "6 - 8",
            },
            {
              value: "1.81",
              class: "totals",
              title: "8 - 10 m/s",
              speed: "8 - 10",
            },
            {
              value: "0.23",
              class: "totals",
              title: "> 10 m/s",
              speed: "> 10",
            },
            { value: "&nbsp;", class: "totals", title: "", speed: "" },
          ],
        },
      ],
      wind_directions: [
        {
          bgcolor: "",
          direction: "N",
          degrees: "348.75 - 11.25",
        },
        {
          bgcolor: "#DDDDDD",
          direction: "NNE",
          degrees: "11.25 - 33.75",
        },
        {
          bgcolor: "",
          direction: "NE",
          degrees: "33.75 - 56.25",
        },
        {
          bgcolor: "#DDDDDD",
          direction: "ENE",
          degrees: "56.25 - 78.75",
        },
        {
          bgcolor: "",
          direction: "E",
          degrees: "78.75 - 101.25",
        },
        {
          bgcolor: "#DDDDDD",
          direction: "ESE",
          degrees: "101.25 - 123.75",
        },
        {
          bgcolor: "",
          direction: "SE",
          degrees: "123.75 - 146.25",
        },
        {
          bgcolor: "#DDDDDD",
          direction: "SSE",
          degrees: "146.25 - 168.75",
        },
        {
          bgcolor: "",
          direction: "S",
          degrees: "168.75 - 191.25",
        },
        {
          bgcolor: "#DDDDDD",
          direction: "SSW",
          degrees: "191.25 - 213.75",
        },
        {
          bgcolor: "",
          direction: "SW",
          degrees: "213.75 - 236.25",
        },
        {
          bgcolor: "#DDDDDD",
          direction: "WSW",
          degrees: "236.25 - 258.75",
        },
        {
          bgcolor: "",
          direction: "W",
          degrees: "258.75 - 281.25",
        },
        {
          bgcolor: "#DDDDDD",
          direction: "WNW",
          degrees: "281.25 - 303.75",
        },
        {
          bgcolor: "",
          direction: "NW",
          degrees: "303.75 - 326.25",
        },
        {
          bgcolor: "#DDDDDD",
          direction: "NNW",
          degrees: "326.25 - 348.75",
        },
      ],
      windSpeedInterval: [
        { title: "< 0.5 m/s", speed: "0 - 0.50 m/s", start: 0, end: 0.5 },
        {
          title: "0.50 - 2.00 m/s",
          speed: "0.50 - 2.00 m/s",
          start: 0.5,
          end: 2.0,
        },
        {
          title: "2.01 - 4.00 m/s",
          speed: "2.01 - 4.00 m/s",
          start: 2.01,
          end: 4.0,
        },
        {
          title: "4.01 - 6.00 m/s",
          speed: "4.01 - 6.00 m/s",
          start: 4.01,
          end: 6.0,
        },
        {
          title: "6.01 - 8.00 m/s",
          speed: "6.01 - 8.00 m/s",
          start: 6.01,
          end: 8.0,
        },
        {
          title: "8.01 - 10.00 m/s",
          speed: "8.01 - 10.00 m/s",
          start: 8.01,
          end: 10.0,
        },
        {
          title: "> 10 m/s",
          speed: "10.01 - Infinity",
          start: 10.01,
          end: Infinity,
        },
      ],
      output: [
        {
          bgcolor: "",
          cells: [
            { value: "N", class: "dir", speed: null, rawData: null },
            { value: "0.00", class: "data", speed: "< 0.5", rawData: [] },
            {
              value: "50.00",
              class: "data",
              speed: "0.50 - 2.00",
              rawData: [1.2, 2.0],
            },
            {
              value: "0.00",
              class: "data",
              speed: "2.01 - 4.00",
              rawData: [],
            },
            {
              value: "25.00",
              class: "data",
              speed: "4.01 - 6.00",
              rawData: [4.03],
            },
            { value: "0.00", class: "data", speed: "6.01 - 8.00", rawData: [] },
            {
              value: "25.00",
              class: "data",
              speed: "8.01 - 10.00",
              rawData: [6.05],
            },
            { value: "0.00", class: "data", speed: "> 10", rawData: [] },
            {
              value: "100.00",
              class: "data",
              speed: null,
              rawData: [1.2, 2.0, 4.03, 6.05],
            },
          ],
        },
        {
          bgcolor: "#DDDDDD",
          cells: [
            { value: "NNE", class: "dir", speed: null, rawData: null },
            { value: "0.00", class: "data", speed: "< 0.5", rawData: [] },
            { value: "0.00", class: "data", speed: "0.50 - 2.00", rawData: [] },
            { value: "0.00", class: "data", speed: "2.01 - 4.00", rawData: [] },
            { value: "0.00", class: "data", speed: "4.01 - 6.00", rawData: [] },
            { value: "0.00", class: "data", speed: "6.01 - 8.00", rawData: [] },
            {
              value: "0.00",
              class: "data",
              speed: "8.01 - 10.00",
              rawData: [],
            },
            { value: "0.00", class: "data", speed: "> 10", rawData: [] },
            { value: "0.00", class: "data", speed: null, rawData: [] },
          ],
        },
      ],
      windRoseData: [
        {
          bgcolor: "#CCCCFF",
          cells: [
            { value: "Direction", class: "freq" },
            { value: "< 0.5 m/s", class: "freq" },
            { value: "0.5-2 m/s", class: "freq" },
            { value: "2-4 m/s", class: "freq" },
            { value: "4-6 m/s", class: "freq" },
            { value: "6-8 m/s", class: "freq" },
            { value: "8-10 m/s", class: "freq" },
            { value: "> 10 m/s", class: "freq" },
            { value: "Total", class: "freq" },
          ],
        },
        {
          bgcolor: "",
          cells: [
            { value: "N", class: "dir", speed: null, rawData: null },
            { value: "0.00", class: "data", speed: "< 0.5 m/s", rawData: [] },
            {
              value: "50.00",
              class: "data",
              speed: "0.50 - 2.00 m/s",
              rawData: [2, 1.2],
            },
            {
              value: "0.00",
              class: "data",
              speed: "2.01 - 4.00 m/s",
              rawData: [],
            },
            {
              value: "0.00",
              class: "data",
              speed: "4.01 - 6.00 m/s",
              rawData: [],
            },
            {
              value: "25.00",
              class: "data",
              speed: "6.01 - 8.00 m/s",
              rawData: [6.05],
            },
            {
              value: "0.00",
              class: "data",
              speed: "8.01 - 10.00 m/s",
              rawData: [],
            },
            { value: "0.00", class: "data", speed: "> 10 m/s", rawData: [] },
            {
              value: "75.00",
              class: "data",
              speed: "Total",
              rawData: [2, 1.2, 6.05],
            },
          ],
        },
        {
          bgcolor: "#DDDDDD",
          cells: [
            { value: "NNE", class: "dir", speed: null, rawData: null },
            { value: "0.00", class: "data", speed: "< 0.5 m/s", rawData: [] },
            {
              value: "0.00",
              class: "data",
              speed: "0.50 - 2.00 m/s",
              rawData: [],
            },
            {
              value: "0.00",
              class: "data",
              speed: "2.01 - 4.00 m/s",
              rawData: [],
            },
            {
              value: "25.00",
              class: "data",
              speed: "4.01 - 6.00 m/s",
              rawData: [4.03],
            },
            {
              value: "0.00",
              class: "data",
              speed: "6.01 - 8.00 m/s",
              rawData: [],
            },
            {
              value: "0.00",
              class: "data",
              speed: "8.01 - 10.00 m/s",
              rawData: [],
            },
            { value: "0.00", class: "data", speed: "> 10 m/s", rawData: [] },
            { value: "25.00", class: "data", speed: "Total", rawData: [4.03] },
          ],
        },
        {
          bgcolor: "",
          cells: [
            { value: "NE", class: "dir", speed: null, rawData: null },
            { value: "0.00", class: "data", speed: "< 0.5 m/s", rawData: [] },
            {
              value: "0.00",
              class: "data",
              speed: "0.50 - 2.00 m/s",
              rawData: [],
            },
            {
              value: "0.00",
              class: "data",
              speed: "2.01 - 4.00 m/s",
              rawData: [],
            },
            {
              value: "0.00",
              class: "data",
              speed: "4.01 - 6.00 m/s",
              rawData: [],
            },
            {
              value: "0.00",
              class: "data",
              speed: "6.01 - 8.00 m/s",
              rawData: [],
            },
            {
              value: "0.00",
              class: "data",
              speed: "8.01 - 10.00 m/s",
              rawData: [],
            },
            { value: "0.00", class: "data", speed: "> 10 m/s", rawData: [] },
            { value: "0.00", class: "data", speed: "Total", rawData: [] },
          ],
        },
        {
          bgcolor: "#DDDDDD",
          cells: [
            { value: "ENE", class: "dir", speed: null, rawData: null },
            { value: "0.00", class: "data", speed: "< 0.5 m/s", rawData: [] },
            {
              value: "0.00",
              class: "data",
              speed: "0.50 - 2.00 m/s",
              rawData: [],
            },
            {
              value: "0.00",
              class: "data",
              speed: "2.01 - 4.00 m/s",
              rawData: [],
            },
            {
              value: "0.00",
              class: "data",
              speed: "4.01 - 6.00 m/s",
              rawData: [],
            },
            {
              value: "0.00",
              class: "data",
              speed: "6.01 - 8.00 m/s",
              rawData: [],
            },
            {
              value: "0.00",
              class: "data",
              speed: "8.01 - 10.00 m/s",
              rawData: [],
            },
            { value: "0.00", class: "data", speed: "> 10 m/s", rawData: [] },
            { value: "0.00", class: "data", speed: "Total", rawData: [] },
          ],
        },
        {
          bgcolor: "",
          cells: [
            { value: "E", class: "dir", speed: null, rawData: null },
            { value: "0.00", class: "data", speed: "< 0.5 m/s", rawData: [] },
            {
              value: "0.00",
              class: "data",
              speed: "0.50 - 2.00 m/s",
              rawData: [],
            },
            {
              value: "0.00",
              class: "data",
              speed: "2.01 - 4.00 m/s",
              rawData: [],
            },
            {
              value: "0.00",
              class: "data",
              speed: "4.01 - 6.00 m/s",
              rawData: [],
            },
            {
              value: "0.00",
              class: "data",
              speed: "6.01 - 8.00 m/s",
              rawData: [],
            },
            {
              value: "0.00",
              class: "data",
              speed: "8.01 - 10.00 m/s",
              rawData: [],
            },
            { value: "0.00", class: "data", speed: "> 10 m/s", rawData: [] },
            { value: "0.00", class: "data", speed: "Total", rawData: [] },
          ],
        },
        {
          bgcolor: "#DDDDDD",
          cells: [
            { value: "ESE", class: "dir", speed: null, rawData: null },
            { value: "0.00", class: "data", speed: "< 0.5 m/s", rawData: [] },
            {
              value: "0.00",
              class: "data",
              speed: "0.50 - 2.00 m/s",
              rawData: [],
            },
            {
              value: "0.00",
              class: "data",
              speed: "2.01 - 4.00 m/s",
              rawData: [],
            },
            {
              value: "0.00",
              class: "data",
              speed: "4.01 - 6.00 m/s",
              rawData: [],
            },
            {
              value: "0.00",
              class: "data",
              speed: "6.01 - 8.00 m/s",
              rawData: [],
            },
            {
              value: "0.00",
              class: "data",
              speed: "8.01 - 10.00 m/s",
              rawData: [],
            },
            { value: "0.00", class: "data", speed: "> 10 m/s", rawData: [] },
            { value: "0.00", class: "data", speed: "Total", rawData: [] },
          ],
        },
        {
          bgcolor: "",
          cells: [
            { value: "SE", class: "dir", speed: null, rawData: null },
            { value: "0.00", class: "data", speed: "< 0.5 m/s", rawData: [] },
            {
              value: "0.00",
              class: "data",
              speed: "0.50 - 2.00 m/s",
              rawData: [],
            },
            {
              value: "0.00",
              class: "data",
              speed: "2.01 - 4.00 m/s",
              rawData: [],
            },
            {
              value: "0.00",
              class: "data",
              speed: "4.01 - 6.00 m/s",
              rawData: [],
            },
            {
              value: "0.00",
              class: "data",
              speed: "6.01 - 8.00 m/s",
              rawData: [],
            },
            {
              value: "0.00",
              class: "data",
              speed: "8.01 - 10.00 m/s",
              rawData: [],
            },
            { value: "0.00", class: "data", speed: "> 10 m/s", rawData: [] },
            { value: "0.00", class: "data", speed: "Total", rawData: [] },
          ],
        },
        {
          bgcolor: "#DDDDDD",
          cells: [
            { value: "SSE", class: "dir", speed: null, rawData: null },
            { value: "0.00", class: "data", speed: "< 0.5 m/s", rawData: [] },
            {
              value: "0.00",
              class: "data",
              speed: "0.50 - 2.00 m/s",
              rawData: [],
            },
            {
              value: "0.00",
              class: "data",
              speed: "2.01 - 4.00 m/s",
              rawData: [],
            },
            {
              value: "0.00",
              class: "data",
              speed: "4.01 - 6.00 m/s",
              rawData: [],
            },
            {
              value: "0.00",
              class: "data",
              speed: "6.01 - 8.00 m/s",
              rawData: [],
            },
            {
              value: "0.00",
              class: "data",
              speed: "8.01 - 10.00 m/s",
              rawData: [],
            },
            { value: "0.00", class: "data", speed: "> 10 m/s", rawData: [] },
            { value: "0.00", class: "data", speed: "Total", rawData: [] },
          ],
        },
        {
          bgcolor: "",
          cells: [
            { value: "S", class: "dir", speed: null, rawData: null },
            { value: "0.00", class: "data", speed: "< 0.5 m/s", rawData: [] },
            {
              value: "0.00",
              class: "data",
              speed: "0.50 - 2.00 m/s",
              rawData: [],
            },
            {
              value: "0.00",
              class: "data",
              speed: "2.01 - 4.00 m/s",
              rawData: [],
            },
            {
              value: "0.00",
              class: "data",
              speed: "4.01 - 6.00 m/s",
              rawData: [],
            },
            {
              value: "0.00",
              class: "data",
              speed: "6.01 - 8.00 m/s",
              rawData: [],
            },
            {
              value: "0.00",
              class: "data",
              speed: "8.01 - 10.00 m/s",
              rawData: [],
            },
            { value: "0.00", class: "data", speed: "> 10 m/s", rawData: [] },
            { value: "0.00", class: "data", speed: "Total", rawData: [] },
          ],
        },
        {
          bgcolor: "#DDDDDD",
          cells: [
            { value: "SSW", class: "dir", speed: null, rawData: null },
            { value: "0.00", class: "data", speed: "< 0.5 m/s", rawData: [] },
            {
              value: "0.00",
              class: "data",
              speed: "0.50 - 2.00 m/s",
              rawData: [],
            },
            {
              value: "0.00",
              class: "data",
              speed: "2.01 - 4.00 m/s",
              rawData: [],
            },
            {
              value: "0.00",
              class: "data",
              speed: "4.01 - 6.00 m/s",
              rawData: [],
            },
            {
              value: "0.00",
              class: "data",
              speed: "6.01 - 8.00 m/s",
              rawData: [],
            },
            {
              value: "0.00",
              class: "data",
              speed: "8.01 - 10.00 m/s",
              rawData: [],
            },
            { value: "0.00", class: "data", speed: "> 10 m/s", rawData: [] },
            { value: "0.00", class: "data", speed: "Total", rawData: [] },
          ],
        },
        {
          bgcolor: "",
          cells: [
            { value: "SW", class: "dir", speed: null, rawData: null },
            { value: "0.00", class: "data", speed: "< 0.5 m/s", rawData: [] },
            {
              value: "0.00",
              class: "data",
              speed: "0.50 - 2.00 m/s",
              rawData: [],
            },
            {
              value: "0.00",
              class: "data",
              speed: "2.01 - 4.00 m/s",
              rawData: [],
            },
            {
              value: "0.00",
              class: "data",
              speed: "4.01 - 6.00 m/s",
              rawData: [],
            },
            {
              value: "0.00",
              class: "data",
              speed: "6.01 - 8.00 m/s",
              rawData: [],
            },
            {
              value: "0.00",
              class: "data",
              speed: "8.01 - 10.00 m/s",
              rawData: [],
            },
            { value: "0.00", class: "data", speed: "> 10 m/s", rawData: [] },
            { value: "0.00", class: "data", speed: "Total", rawData: [] },
          ],
        },
        {
          bgcolor: "#DDDDDD",
          cells: [
            { value: "WSW", class: "dir", speed: null, rawData: null },
            { value: "0.00", class: "data", speed: "< 0.5 m/s", rawData: [] },
            {
              value: "0.00",
              class: "data",
              speed: "0.50 - 2.00 m/s",
              rawData: [],
            },
            {
              value: "0.00",
              class: "data",
              speed: "2.01 - 4.00 m/s",
              rawData: [],
            },
            {
              value: "0.00",
              class: "data",
              speed: "4.01 - 6.00 m/s",
              rawData: [],
            },
            {
              value: "0.00",
              class: "data",
              speed: "6.01 - 8.00 m/s",
              rawData: [],
            },
            {
              value: "0.00",
              class: "data",
              speed: "8.01 - 10.00 m/s",
              rawData: [],
            },
            { value: "0.00", class: "data", speed: "> 10 m/s", rawData: [] },
            { value: "0.00", class: "data", speed: "Total", rawData: [] },
          ],
        },
        {
          bgcolor: "",
          cells: [
            { value: "W", class: "dir", speed: null, rawData: null },
            { value: "0.00", class: "data", speed: "< 0.5 m/s", rawData: [] },
            {
              value: "0.00",
              class: "data",
              speed: "0.50 - 2.00 m/s",
              rawData: [],
            },
            {
              value: "0.00",
              class: "data",
              speed: "2.01 - 4.00 m/s",
              rawData: [],
            },
            {
              value: "0.00",
              class: "data",
              speed: "4.01 - 6.00 m/s",
              rawData: [],
            },
            {
              value: "0.00",
              class: "data",
              speed: "6.01 - 8.00 m/s",
              rawData: [],
            },
            {
              value: "0.00",
              class: "data",
              speed: "8.01 - 10.00 m/s",
              rawData: [],
            },
            { value: "0.00", class: "data", speed: "> 10 m/s", rawData: [] },
            { value: "0.00", class: "data", speed: "Total", rawData: [] },
          ],
        },
        {
          bgcolor: "#DDDDDD",
          cells: [
            { value: "WNW", class: "dir", speed: null, rawData: null },
            { value: "0.00", class: "data", speed: "< 0.5 m/s", rawData: [] },
            {
              value: "0.00",
              class: "data",
              speed: "0.50 - 2.00 m/s",
              rawData: [],
            },
            {
              value: "0.00",
              class: "data",
              speed: "2.01 - 4.00 m/s",
              rawData: [],
            },
            {
              value: "0.00",
              class: "data",
              speed: "4.01 - 6.00 m/s",
              rawData: [],
            },
            {
              value: "0.00",
              class: "data",
              speed: "6.01 - 8.00 m/s",
              rawData: [],
            },
            {
              value: "0.00",
              class: "data",
              speed: "8.01 - 10.00 m/s",
              rawData: [],
            },
            { value: "0.00", class: "data", speed: "> 10 m/s", rawData: [] },
            { value: "0.00", class: "data", speed: "Total", rawData: [] },
          ],
        },
        {
          bgcolor: "",
          cells: [
            { value: "NW", class: "dir", speed: null, rawData: null },
            { value: "0.00", class: "data", speed: "< 0.5 m/s", rawData: [] },
            {
              value: "0.00",
              class: "data",
              speed: "0.50 - 2.00 m/s",
              rawData: [],
            },
            {
              value: "0.00",
              class: "data",
              speed: "2.01 - 4.00 m/s",
              rawData: [],
            },
            {
              value: "0.00",
              class: "data",
              speed: "4.01 - 6.00 m/s",
              rawData: [],
            },
            {
              value: "0.00",
              class: "data",
              speed: "6.01 - 8.00 m/s",
              rawData: [],
            },
            {
              value: "0.00",
              class: "data",
              speed: "8.01 - 10.00 m/s",
              rawData: [],
            },
            { value: "0.00", class: "data", speed: "> 10 m/s", rawData: [] },
            { value: "0.00", class: "data", speed: "Total", rawData: [] },
          ],
        },
        {
          bgcolor: "#DDDDDD",
          cells: [
            { value: "NNW", class: "dir", speed: null, rawData: null },
            { value: "0.00", class: "data", speed: "< 0.5 m/s", rawData: [] },
            {
              value: "0.00",
              class: "data",
              speed: "0.50 - 2.00 m/s",
              rawData: [],
            },
            {
              value: "0.00",
              class: "data",
              speed: "2.01 - 4.00 m/s",
              rawData: [],
            },
            {
              value: "0.00",
              class: "data",
              speed: "4.01 - 6.00 m/s",
              rawData: [],
            },
            {
              value: "0.00",
              class: "data",
              speed: "6.01 - 8.00 m/s",
              rawData: [],
            },
            {
              value: "0.00",
              class: "data",
              speed: "8.01 - 10.00 m/s",
              rawData: [],
            },
            { value: "0.00", class: "data", speed: "> 10 m/s", rawData: [] },
            { value: "0.00", class: "data", speed: "Total", rawData: [] },
          ],
        },
        {
          bgcolor: "",
          cells: [
            { value: "Total", class: "totals", title: "", speed: "" },
            {
              value: "0.00",
              class: "totals",
              title: "< 0.5 m/s",
              speed: "0 - 0.50 m/s",
            },
            {
              value: "50.00",
              class: "totals",
              title: "0.50 - 2.00 m/s",
              speed: "0.50 - 2.00 m/s",
            },
            {
              value: "0.00",
              class: "totals",
              title: "2.01 - 4.00 m/s",
              speed: "2.01 - 4.00 m/s",
            },
            {
              value: "25.00",
              class: "totals",
              title: "4.01 - 6.00 m/s",
              speed: "4.01 - 6.00 m/s",
            },
            {
              value: "25.00",
              class: "totals",
              title: "6.01 - 8.00 m/s",
              speed: "6.01 - 8.00 m/s",
            },
            {
              value: "0.00",
              class: "totals",
              title: "8.01 - 10.00 m/s",
              speed: "8.01 - 10.00 m/s",
            },
            {
              value: "0.00",
              class: "totals",
              title: "> 10 m/s",
              speed: "10.01 - Infinity",
            },
            { value: "&nbsp;", class: "totals", title: "", speed: "" },
          ],
        },
      ],
      localStations: this.stations.slice(),
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
    computedWindData() {
      //   console.log("filterData:", this.filterData);
      // console.log("windSpeedInterval:", this.windSpeedInterval);
      if (!this.filterData || this.filterData.length === 0) {
        return [];
      }
      return this.calculateWindData(this.filterData, this.windSpeedInterval);
    },
  },
  methods: {
    calculateWindData(filterData, windSpeedInterval) {
      const windDirectionData = [];
      const windDirections = [
        "N",
        "NNE",
        "NE",
        "ENE",
        "E",
        "ESE",
        "SE",
        "SSE",
        "S",
        "SSW",
        "SW",
        "WSW",
        "W",
        "WNW",
        "NW",
        "NNW",
      ];

      const totalDataCount = filterData.length;

      windDirections.forEach((direction, index) => {
        const startDegree = (index * 22.5 + 348.75) % 360;
        const endDegree = (index * 22.5 + 11.25) % 360;

        const dataPointsInDirection = filterData.filter((data) => {
          const windSpeed = data.weather_data[0];
          const windDirection = data.weather_data[1];
          return isInDirection(
            windSpeed,
            windDirection,
            startDegree,
            endDegree
          );
        });

        const directionData = {
          bgcolor: this.wind_directions[index].bgcolor,
          cells: [
            { value: direction, class: "dir", speed: null, rawData: null },
            ...windSpeedInterval.map((interval) => {
              const rawDataValue = dataPointsInDirection.filter((data) => {
                const windSpeed = data.weather_data[0];
                return windSpeed >= interval.start && windSpeed <= interval.end;
              });

              const percentage =
                totalDataCount > 0
                  ? ((rawDataValue.length / totalDataCount) * 100).toFixed(2)
                  : "0.00";

              return {
                value: percentage,
                class: "data",
                speed: interval.title,
                rawData:
                  totalDataCount > 0
                    ? rawDataValue.map((data) => data.weather_data[0])
                    : [],
              };
            }),
          ],
        };

        windDirectionData.push(directionData);
      });

      windDirections.forEach((direction, index) => {
        const totalPercentageInDirection =
          totalDataCount > 0
            ? windDirectionData[index].cells
              .slice(1, windSpeedInterval.length)
              .map((cell) => parseFloat(cell.value))
              .reduce((acc, value) => acc + value, 0)
              .toFixed(2)
            : "0.00";

        windDirectionData[index].cells.push({
          value: totalPercentageInDirection,
          class: "data",
          speed: "Total",
          rawData:
            totalDataCount > 0
              ? windDirectionData[index].cells
                .slice(1, windSpeedInterval.length)
                .flatMap((cell) => cell.rawData)
              : [],
        });
      });

      const totalPercentages = windSpeedInterval.map(
        (interval, intervalIndex) => {
          return windDirectionData.reduce((acc, directionData) => {
            const cell = directionData.cells[intervalIndex + 1]; // Add 1 to the index to skip the 'direction' cell
            return acc + parseFloat(cell.value);
          }, 0);
        }
      );

      const lastObject = {
        bgcolor: "",
        cells: [
          { value: "Total", class: "totals", title: "", speed: "" },
          ...totalPercentages.map((percentage, index) => ({
            value: index === 0 ? percentage.toFixed(2) : percentage.toFixed(2), // Fix the condition here
            class: "totals",
            title: windSpeedInterval[index].title,
            speed: windSpeedInterval[index].speed,
          })),
          { value: "&nbsp;", class: "totals", title: "", speed: "" },
        ],
      };

      windDirectionData.push(lastObject);

      windDirectionData.unshift({
        bgcolor: "#CCCCFF",
        cells: [
          { value: "Direction", class: "freq" },
          { value: "< 0.5 m/s", class: "freq" },
          { value: "0.5-2 m/s", class: "freq" },
          { value: "2-4 m/s", class: "freq" },
          { value: "4-6 m/s", class: "freq" },
          { value: "6-8 m/s", class: "freq" },
          { value: "8-10 m/s", class: "freq" },
          { value: "> 10 m/s", class: "freq" },
          { value: "Total", class: "freq" },
        ],
      });

      return windDirectionData;
    },

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
      this.windRose_label = result.data[1][0].table.array_table_label;
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
      if (!date || !date.includes("-")) return date;
      const [YYYY, MM, DD] = date.split("-");
      return new Date(`${YYYY}-${MM}-${DD} 00:00:00`);
    },
    localEnd(date) {
      if (!date || !date.includes("-")) return date;
      const [YYYY, MM, DD] = date.split("-");
      return new Date(`${YYYY}-${MM}-${DD} 23:59:00`);
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
    downloadV20() {
      this.loading_dw = true;
      if (this.role == "is_staff" || this.role == "is_superuser") {
        axios
          .post(
            `${this.$baseURL}/excel-v2/0`,
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
            link.setAttribute(
              "download",
              `Data ${this.nama} ${this.startDate} sd ${this.endDate} per jam.xlsx`
            );
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
            `${this.$baseURL}/excel-v2/0`,
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
            link.setAttribute("download", `Data ${this.nama} per jam.xlsx`);
            document.body.appendChild(link);
            link.click();

            if (response.status == 200) {
              this.loading_dw = false;
            }
          })
          .catch((error) => console.log(error));
      }
    },
    downloadV21() {
      this.loading_dw = true;
      if (this.role == "is_staff" || this.role == "is_superuser") {
        axios
          .post(
            `${this.$baseURL}/excel-v2/1`,
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
            link.setAttribute(
              "download",
              `Data ${this.nama} ${this.startDate} sd ${this.endDate} per 3 jam.xlsx`
            );
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
            `${this.$baseURL}/excel-v2/1`,
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
            link.setAttribute("download", `Data ${this.nama} per 3 jam.xlsx`);
            document.body.appendChild(link);
            link.click();

            if (response.status == 200) {
              this.loading_dw = false;
            }
          })
          .catch((error) => console.log(error));
      }
    },
    downloadV22() {
      this.loading_dw = true;
      if (this.role == "is_staff" || this.role == "is_superuser") {
        axios
          .post(
            `${this.$baseURL}/excel-v2/2`,
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
            link.setAttribute(
              "download",
              `Data ${this.nama} ${this.startDate} sd ${this.endDate} jam 7,12,17,24.xlsx`
            );
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
            `${this.$baseURL}/excel-v2/2`,
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
              `Data ${this.nama} jam 7,12,17,24.xlsx`
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
    this.gStation();
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