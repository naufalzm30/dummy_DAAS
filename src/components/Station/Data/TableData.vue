<template>
  <div>
    <div v-if="loading_i" class="d-flex flex-column justify-content-center align-items-center pb-3"
      style="height: 90vh; width: 93vw;">
      <div class="content-container">

        <div class="icon-container">
          <i class="zmdi zmdi-spinner zmdi-hc-spin" style="font-size: 2rem"></i>
        </div>
        <p class="mt-3">{{ msg }}</p>
      </div>
    </div>

    <div v-else>

      <div class="left-container">

        <TableMap v-if="role !== 'QA' && !loading_i" :loading_i="loading_i" class="mx-auto comShadow border mt-2"
          style="border-radius: 15px" :profile="profile" />

        <div v-else class="card box-sm comShadow m-0" style="box-shadow: 10px; border-radius: 10px;">
          <div class="row" v-if="profile">
            <div class="col-md-4 p-0 imgSZ">
              <img :src="`${profile.image}`" class="img-fluid" alt="station-img" style="
              object-fit: cover;
              border-radius: 10px 0px 0px 10px;
              margin-left: 12px;
              width: 95%;
            " />
            </div>
            <div class="col-md-8 my-2">
              <div class="d-flex align-items-center">
                <div class="col-md-10 col-10">
                  <div style="font-weight: 500; font-size: 1.1rem">
                    {{ profile.station_name }}
                  </div>
                </div>
              </div>
              <div style="font-size: 0.8rem; color: gray;">
                {{ formatDate(summaryQA.data[summaryQA.data.length - 1].date) }} s/d {{
                  formatDate(summaryQA.data[0].date)
                }}
              </div>


              <div class="row mt-1 mx-0">

                <table style="width: 100%; ">
                  <tr>
                    <td style="font-size: 1rem" class="col-6">Rata-rata Data Masuk</td>
                    <td style="font-size: 1rem" class="col-6">: {{ (summaryQA.average_all_data * 100 / 288).toFixed(2)
                      }}
                      % </td>
                  </tr>
                  <tr>
                    <td style="font-size: 1rem">Target Data Seluruhnya</td>
                    <td style="font-size: 1rem">: 100 % </td>
                    <!-- <small> ({{ daysBetween }}) </small> -->
                  </tr>

                  <tr>
                    <td style="font-size: 1rem">Data Tidak Terkirim</td>
                    <td style="font-size: 1rem">: {{ (daysBetween - summaryQA.sum_all_data) / 100 }} % </td>
                    <!-- <small>({{(daysBetween - summaryQA.sum_all_data) }})</small>  -->
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="role !== 'QA'" style="border-radius: 15px" class="mt-2">
        <div v-if="produksi === 'PTAB' || role === 'SuperAdmin'" class="mx-3">
          <p>{{ error_msg }}</p>
          <button v-if="error_msg !== null" class="btn btn-sm btn-primary" type="button" title="Upload Sensor Data"
            style="font-size: 0.8rem" data-bs-toggle="modal" data-bs-target="#sDataZero">
            <i v-if="loading_upload" class="zmdi zmdi-rotate-right zmdi-hc-spin"
              style="font-size: 1.2rem; margin-right: 3px"></i>
            <span><i class="zmdi zmdi-upload"></i></span> Upload Sensor Data
          </button>
          <div class="modal fade" id="sDataZero" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
            aria-labelledby="sDataZeroLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <form @submit.prevent="sensorDataUpload">
                  <div class="modal-header">
                    <h5 class="modal-title" id="sDataZeroLabel">
                      Upload Data Sensor
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <div>
                      <label>
                        <input type="file" id="file" v-on:change="onChangeFileUpload($event)" required />
                      </label>
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-sm btn-success" data-bs-dismiss="modal"
                      @click.prevent="formatSensorData">
                      Download Format
                    </button>
                    <button type="submit" class="btn btn-sm btn-primary" data-bs-dismiss="modal">
                      Upload Data Sensor
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>


        <dataset v-if="dataStation" class="box comShadow px-3" v-slot="{ ds }" :ds-data="dataStation"
          :ds-sortby="sortBy" :ds-search-in="['status_data']">
          <!-- VERIFIKASI -->

          <div v-if="username == 'UserVerifikasi'" class="mt-2">
            <button class="btn btn-sm btn-primary" type="button" title="Verifikasi" style="font-size: 0.8rem"
              data-bs-toggle="modal" data-bs-target="#verifikasiData">
              <i v-if="loading_upload" class="zmdi zmdi-rotate-right zmdi-hc-spin"
                style="font-size: 1.2rem; margin-right: 3px"></i>Upload Verifikasi
            </button>
            <div class="modal fade" id="verifikasiData" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
              aria-labelledby="verifikasiDataLabel" aria-hidden="true">
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                  <form @submit.prevent="verifikasiDataUpload">
                    <div class="modal-header">
                      <h5 class="modal-title" id="verifikasiDataLabel">
                        Verifikasi
                      </h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                      <div>
                        <!-- <p>Verifikasi 24 Jam</p> -->
                        <label>
                          <input type="file" id="file" v-on:change="onChangeFileUpload($event)" />
                        </label>
                      </div>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-sm btn-secondary" data-bs-dismiss="modal"
                        @click.prevent="formatVerifikasi">
                        Download Format
                      </button>
                      <button type="submit" class="btn btn-sm btn-primary" data-bs-dismiss="modal">
                        Upload Verifikasi
                      </button>

                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <div class="row " :data-page-count="ds.dsPagecount">
            <div class="col-md-1 d-flex justify-content-start" style="margin-top: 1rem">
              <div class="dropdown col">
                <button class="btn btn-sm btn-primary dropdown-toggle" type="button" id="dropdownMenuButton1"
                  data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" title="Summary Data"
                  style="font-size: 0.8rem">
                  <span><i class="zmdi zmdi-search"></i></span>
                </button>

                <ul class="dropdown-menu col" aria-labelledby="dropdownMenuButton1">
                  <li class="dropdown-item py-0" style="font-size: 0.9rem;">
                    Jumlah Data: {{ summary.total_data }}
                  </li>
                  <li class="dropdown-item py-0" style="font-size: 0.9rem;">
                    Rata Debit: {{ summary.average_flow }} L/s
                  </li>
                  <li class="dropdown-item py-0" style="font-size: 0.9rem;">
                    Total Volume: {{ summary.sum_volume }} m³
                  </li>
                  <li v-if="role == 'SuperAdmin'" class="dropdown-item py-0" style="font-size: 0.9rem;">
                    Persentase Data: {{ summary.data_precentage }} %
                  </li>
                </ul>
              </div>
            </div>

            <div class="col-md-1 d-flex justify-content-start" style="margin-top: 1rem">
              <div v-if="produksi === 'PTAB'" class="dropdown col">
                <button class="btn btn-sm btn-primary dropdown-toggle" type="button" id="dropdownMenuButton1"
                  data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" title="Upload File"
                  style="font-size: 0.8rem">
                  <i v-if="loading_upload" class="zmdi zmdi-rotate-right zmdi-hc-spin"
                    style="font-size: 1.2rem; margin-right: 3px"></i>
                  <span><i class="zmdi zmdi-upload"></i></span>
                </button>
                <ul class="dropdown-menu col" aria-labelledby="dropdownMenuButton1">
                  <li class="dropdown-submenu">
                    <a data-bs-toggle="modal" data-bs-target="#thresholdData" class="dropdown-item py-0" href="#"
                      style="font-size: 0.9rem">Threshold</a>
                  </li>

                  <li class="dropdown-submenu">
                    <div class="dropdown-divider"></div>
                    <a data-bs-toggle="modal" data-bs-target="#sensorData" class="dropdown-item py-0" href="#"
                      style="font-size: 0.9rem">Data Sensor</a>
                  </li>
                </ul>
              </div>

              <div v-else>

                <button v-if="role !== 'DIREKSI'" class="btn btn-sm btn-primary" type="button" title="Upload Threshold"
                  style="font-size: 0.8rem" data-bs-toggle="modal" data-bs-target="#thresholdData">
                  <i v-if="loading_upload" class="zmdi zmdi-rotate-right zmdi-hc-spin"
                    style="font-size: 1.2rem; margin-right: 3px"></i>
                  <span><i class="zmdi zmdi-upload"></i></span>
                </button>
              </div>

            </div>

            <div class="modal fade" id="thresholdData" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
              aria-labelledby="thresholdDataLabel" aria-hidden="true">
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                  <form @submit.prevent="tresholdDataUpload">
                    <div class="modal-header">
                      <h5 class="modal-title" id="thresholdDataLabel">
                        Upload Threshold
                      </h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                      <div>
                        <!-- <p>Threshold 24 Jam</p> -->
                        <label>
                          <input type="file" id="file" v-on:change="onChangeFileUpload($event)" />
                        </label>
                      </div>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-sm btn-success" data-bs-dismiss="modal"
                        @click.prevent="formatThreshold">
                        Download Format
                      </button>
                      <button type="submit" class="btn btn-sm btn-primary" data-bs-dismiss="modal">
                        Upload Threshold
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div class="modal fade" id="sensorData" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
              aria-labelledby="sensorDataLabel" aria-hidden="true">
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                  <form @submit.prevent="sensorDataUpload">
                    <div class="modal-header">
                      <h5 class="modal-title" id="sensorDataLabel">
                        Upload Data Sensor
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
                      <button type="button" class="btn btn-sm btn-success" data-bs-dismiss="modal"
                        @click.prevent="formatSensorData">
                        Download Format
                      </button>
                      <button type="submit" class="btn btn-sm btn-primary" data-bs-dismiss="modal">
                        Upload Data Sensor
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div class="col-md d-flex justify-content-end" :class="{ 'justify-content-center': role == 'QA' }"
              style="margin-top: 1rem;">
              <div>
                <i v-if="loading_data" class="zmdi zmdi-spinner zmdi-hc-spin mx-2" style="font-size: 1.2rem"></i>
                <DatePicker name="from" v-model="startDate" @change="search" type="datetime" format="YYYY-MM-DD HH:mm"
                  :default-value="new Date().setHours(0, 0, 0, 0)" placeholder="Select first date" :minute-step="5">
                </DatePicker>
                <label for="to" class="px-2" style="font-size: 0.8rem; font-weight: normal">-</label>
                <DatePicker name="to" v-model="endDate" @change="search" type="datetime" format="YYYY-MM-DD HH:mm"
                  :default-value="new Date().setHours(23, 55, 0, 0)" placeholder="Select last date" :minute-step="5">
                </DatePicker>
              </div>

            </div>

            <div v-if="role == 'SuperAdmin'" class="col-md-1 d-flex justify-content-end" style="margin-top: 1.2rem">
              <div class="dropdown">
                <button class="btn btn-sm btn-primary dropdown-toggle" type="button" id="dropdownMenuButton1"
                  data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                  title="Download sesuai filter tanggal" style="font-size: 0.8rem">
                  <i v-if="loading_dw" class="zmdi zmdi-rotate-right zmdi-hc-spin"
                    style="font-size: 1.2rem; margin-right: 3px"></i>
                  <span><i class="zmdi zmdi-download"></i></span>
                </button>

                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                  <li>
                    <a class="dropdown-item py-0" href="#" @click.prevent="downloadAll" style="font-size: 0.9rem">Semua
                      Data</a>
                  </li>
                  <li>
                    <a class="dropdown-item py-0" href="#" @click.prevent="downloadDaily" style="font-size: 0.9rem">Data
                      per hari</a>
                  </li>
                </ul>
              </div>
            </div>

            <div v-else class="col-md-1 d-flex justify-content-end" style="margin-top: 1.2rem">
              <button class="btn btn-sm btn-primary" type="button" title="Download sesuai filter tanggal"
                style="font-size: 0.8rem" @click.prevent="downloadAll">
                <i v-if="loading_dw" class="zmdi zmdi-rotate-right zmdi-hc-spin"
                  style="font-size: 1.2rem; margin-right: 3px"></i>
                <span></span> <i class="zmdi zmdi-download"></i>
              </button>
            </div>

            <div :data-page-count="ds.dsPagecount" v-if="role === 'SuperAdmin'"
              class="p-0 col-md-1 d-flex justify-content-end" style="margin-top: 1.2rem;">
              <dataset-search ds-search-placeholder="status" class="p-0 " style="font-size: 0.8rem;" />
            </div>
          </div>
          <!-- <p v-if="csv_code">File stat us: {{ csv_code }}</p> -->

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
                        <td>{{ formatDate(row.time) }}</td>
                        <td>{{ formatTime(row.time) }}</td>
              
                        <td v-for="(sensor, index) in row.sensor_data" :key="index">
                          <span>{{ sensor.value }} </span>
                          <span v-if="sensor.value !== null">{{ sensor.notation }}</span>

                        </td>
                        <td v-if="role == 'SuperAdmin'">
                          <div v-if="row.status == 'OK'" style="font-size: 0.8rem;"><span style="color: #219653;">{{
                            row.status }}</span></div>
                          <div v-else-if="row.status == 'maintenance'" style="font-size: 0.8rem;"> <span
                              style="color: black;">MTC</span></div>
                          <div v-else-if="row.status == 'Min Threshold'" style="font-size: 0.8rem;"> <span
                              style="color: #00B2FF;">{{ row.status }}</span></div>
                          <div v-else-if="row.status == 'Max Threshold'" style="font-size: 0.8rem;"> <span
                              style="color: #D34053;">{{ row.status }}</span></div>
                          <div v-else>{{ row.status }}</div>
                        </td>
                        <td v-if="role == 'SuperAdmin'">{{ row.status_data }}</td>
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
      <div v-else style="border-radius: 15px" class="mt-2">

        <dataset v-if="dataStationQA" class="box comShadow px-3" v-slot="{ ds }" :ds-data="dataStationQA"
          :ds-sortby="sortBy">
          <div class="row " :data-page-count="ds.dsPagecount">
            <div class="col-md d-flex justify-content-end" :class="{ 'justify-content-center': role == 'QA' }"
              style="margin-top: 1rem;">
              <div>
                <i v-if="loading_data" class="zmdi zmdi-spinner zmdi-hc-spin mx-2" style="font-size: 1.2rem"></i>
                <!-- <i v-if="loading_date_data" class="zmdi zmdi-rotate-right zmdi-hc-spin mx-2"style="font-size: 1.2rem"></i> -->
                <DatePicker name="from" v-model="startDate" @change="search" format="YYYY-MM-DD HH:mm" type="datetime"
                  :default-value="new Date().setHours(0, 0, 0, 0)" :hour-options="hourStart"
                  :minute-options="minuteStart" placeholder="Select first date">
                </DatePicker>
                <label for="to" class="px-2" style="font-size: 0.8rem; font-weight: normal">s.d</label>
                <DatePicker name="to" v-model="endDate" @change="search" format="YYYY-MM-DD HH:mm" type="datetime"
                  :default-value="new Date().setHours(23, 55, 0, 0)" :hour-options="hourEnd" :minute-options="minuteEnd"
                  placeholder="Select last date">
                </DatePicker>
              </div>
            </div>
            <div class="d-flex justify-content-between px-0 py-2 " :class="{ 'px-5': ava_width > 768 }">
              <button class="btn btn-sm btn-primary" type="button" @click.prevent="downloadQADaily"
                style="font-size: 0.8rem">
                <i v-if="loading_dw" class="zmdi zmdi-rotate-right zmdi-hc-spin"
                  style="font-size: 1.2rem; margin-right: 3px"></i>Data Per Hari
              </button>
              <button class="btn btn-sm btn-primary" type="button" @click.prevent="downloadAll"
                style="font-size: 0.8rem">
                <i v-if="loading_dw" class="zmdi zmdi-rotate-right zmdi-hc-spin"
                  style="font-size: 1.2rem; margin-right: 3px"></i>Download Data
              </button>
              <button class="btn btn-sm btn-primary" type="button" @click.prevent="downloadQAHourly"
                style="font-size: 0.8rem">
                <i v-if="loading_dw" class="zmdi zmdi-rotate-right zmdi-hc-spin"
                  style="font-size: 1.2rem; margin-right: 3px"></i>Download Verifikasi
              </button>
              <!-- <button class="btn btn-sm btn-primary" type="button" title="Verifikasi" style="font-size: 0.8rem"
                data-bs-toggle="modal" data-bs-target="#verifikasiData">
                <i v-if="loading_upload" class="zmdi zmdi-rotate-right zmdi-hc-spin"
                  style="font-size: 1.2rem; margin-right: 3px"></i>Upload Verifikasi
              </button> -->
              <!-- <button class="btn btn-sm btn-primary" type="button" @click.prevent="downloadAll"
                style="font-size: 0.8rem">
                <i v-if="loading_dw" class="zmdi zmdi-rotate-right zmdi-hc-spin"
                  style="font-size: 1.2rem; margin-right: 3px"></i>Insidentil
              </button> -->
            </div>
          </div>
          <div class="modal fade" id="verifikasiData" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
            aria-labelledby="verifikasiDataLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <form @submit.prevent="verifikasiDataUpload">
                  <div class="modal-header">
                    <h5 class="modal-title" id="verifikasiDataLabel">
                      Verifikasi
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <div>
                      <!-- <p>Verifikasi 24 Jam</p> -->
                      <label>
                        <input type="file" id="file" v-on:change="onChangeFileUpload($event)" />
                      </label>
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-sm btn-secondary" data-bs-dismiss="modal"
                      @click.prevent="formatVerifikasi">
                      Download Format
                    </button>
                    <button type="submit" class="btn btn-sm btn-primary" data-bs-dismiss="modal">
                      Upload Verifikasi
                    </button>

                  </div>
                </form>
              </div>
            </div>
          </div>
          <div class="row mt-1">
            <div class="col-md-12">
              <div class="table-responsive">
                <table
                  class="table table-hover table-responsive text-nowrap text-center table-borderless bg-white table-bordered">
                  <thead class="table-light">
                    <tr>
                      <th scope="col" class="thClass">#</th>
                      <th v-for="(th, index) in colsQA" :key="th.field" :class="['sort', th.sort]"
                        @click="click($event, index)" class="thClass">
                        {{ th.name }} <i class="gg-select float-right"></i>
                      </th>
                    </tr>
                  </thead>
                  <dataset-item tag="tbody">
                    <template #default="{ row, index }">
                      <tr>
                        <td scope="row">{{ index + 1 }}</td>
                        <td>{{ formatDate(row.date) }}</td>
                        <td>{{ row.sum }}</td>
                        <td>{{ row.percentage }} %</td>
                        <td>{{ row.maintenance }}</td>
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
  </div>
</template>

<script>
import axios from "axios";
import moment from 'moment';
import TableMap from "@/components/Station/Data/TableMap.vue";

import {
  Dataset,
  DatasetItem,
  DatasetPager,
  DatasetSearch
} from "vue-dataset";



export default {
  name: "TableData",
  components: {
    Dataset,
    DatasetItem,
    DatasetPager,
    TableMap,
    DatasetSearch
  },
  props: ["station", "loading_i", "profile"],

  data: function () {
    return {
      startDate: null,
      endDate: null,
      loading_data: false,
      dataStation: null,
      dataStationQA: null,
      summary: null,
      summaryQA: null,
      cols: [],
      colsQA: [],
      nama: "",
      loading_upload: false,
      loading_dw: false,
      uploadVal: null,
      // profile: null,
      ava_width: null,
      msg: "Fetching data, please wait...",

      hourStart: Array.from({ length: 1 }).map((_, i) => i + 0),
      hourEnd: Array.from({ length: 1 }).map((_, i) => i + 23),

      minuteStart: Array.from({ length: 1 }).map((_, i) => i + 0),
      minuteEnd: Array.from({ length: 1 }).map((_, i) => i + 55),
      error_msg: null
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
    daysBetween() {
      const startDate = new Date(this.summaryQA.data[this.summaryQA.data.length - 1].date);
      const endDate = new Date(this.summaryQA.data[0].date);
      const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
      const diffDays = Math.round(Math.abs((startDate - endDate) / oneDay)) + 1;
      return diffDays * 288;
    }
  },
  watch: {
    dataStation(newVal) {
      this.$emit('update-filtered-data', newVal);
    },
    dataStationQA(newVal) {
      this.$emit('update-filtered-dataQA', newVal);
    },
  },

  methods: {
    formatNumber(num) {
      num = Number(num).toString();
      return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    async loadData(from = null, until = null) {
      this.loading_data = true;
      let result = await axios
        .get(`${this.$baseURL}/pdam/station_data/${this.$route.params.id}/`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
          params: {
            from: from,
            until: until,
          },
        })
        .catch((e) => {
          setTimeout(() => {
            if (e.response.data.message == 'No sensor data found.') {
              this.dataStation = []
              this.error_msg = e.response.data.message
              this.loading_i = false;
            } else {
              console.log(e);

            }
          }, 100);



        });



      if (result.status == 200) {
        this.nama = result.data.data[0].station_name

        this.summary = result.data.data[0]
        this.summary.average_flow = this.formatNumber((this.summary.average_flow).toFixed(2));
        this.summary.data_precentage = this.formatNumber((this.summary.data_precentage).toFixed(2));
        this.summary.sum_volume = this.formatNumber((this.summary.sum_volume).toFixed(2));

        this.dataStation = result.data.data[0].chart
        // console.log(this.dataStation);

        this.dataStation.forEach(chartItem => {
          chartItem.sensor_data.forEach(data => {
            if (data.value !== null && !isNaN(data.value)) {
              // Check if value is a valid number
              if (Number.isInteger(Number(data.value))) {
                data.value = Number(data.value).toString(); // Convert to string if it's an integer
              } else {
                data.value = parseFloat(Number(data.value).toFixed(2)); // Format as float with 2 decimals
              }
            }
          });
        });

        let sensor_label = this.dataStation[0].sensor_data;
        // console.log('sensor_label: ', sensor_label);



        this.cols = [
          { name: "Tanggal" },
          { name: "Waktu" },
        ];

        for (let i = 0; i < sensor_label.length; i++) {
          this.cols.push({
            name: sensor_label[i].sensor_name,
          });
        }
        // console.log(this.role);
        if (this.role == 'SuperAdmin') {
          this.cols.push(
            {
              name: "Status"
            },
            {
              name: "Status Data"
            },
          )
        }


        this.loading_data = false;
      }
    },
    async loadDataQA(from = null, until = null) {
      this.loading_data = true;
      let result = await axios
        .get(`${this.$baseURL}/pdam/QA/${this.$route.params.id}/`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
          params: {
            from: from,
            until: until,
          },
        })
        .catch(function (e) {
          console.log(e);
        });

      // console.log('TableData.vue: ', result.data[0].data);
      this.dataStationQA = result.data[0].data
      this.summaryQA = result.data[0]

      this.nama = result.data[0].station_name


      this.colsQA = [
        { name: "Tanggal" },
        { name: "Jumlah Data" },
        { name: "Persen Data" },
        { name: "Jumlah Gangguan" },
      ];

      if (result.status == 200) {
        this.loading_data = false;
      }
    },
    search() {
      const from = this.startDate ? moment(this.startDate).format('YYYY-MM-DD HH:mm') : null;
      const until = this.endDate ? moment(this.endDate).format('YYYY-MM-DD HH:mm') : null;
      const diffDays = moment(this.endDate).diff(moment(this.startDate), 'days');
      if (this.role !== 'QA') {
        if (diffDays > 7) {
          this.loadData(null, null);
        } else {
          this.loadData(from, until);
        }
      } else {
        if (diffDays > 2000) {
          this.loadDataQA(null, null);
        } else {
          this.loadDataQA(from, until);
        }
        // this.loadDataQA(from, until);

      }
    },

    formatDatePicker(date) {
      if (!date) return null;
      // Format date to YYYY-MM-DDTHH:mm
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
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
    formatDate(dateString) {
  const date = new Date(dateString);
  const optionsDate = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Jakarta', // Explicitly specify the time zone
  };
  return new Intl.DateTimeFormat('en-GB', optionsDate).format(date);
},
    formatTime(dateString) {
  const date = new Date(dateString);
  const optionsTime = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Jakarta', // Explicitly specify the time zone
  };
  return new Intl.DateTimeFormat('en-GB', optionsTime).format(date);
},
    async downloadAll() {
      const from = this.startDate ? moment(this.startDate).format('YYYY-MM-DD HH:mm') : null;
      const until = this.endDate ? moment(this.endDate).format('YYYY-MM-DD HH:mm') : null;
      this.loading_dw = true;
      try {
        const response = await axios.get(`${this.$baseURL}/pdam/station_data/download/${this.$route.params.id}/`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
          params: {
            from: from,
            until: until,
          },
          responseType: 'blob' // Ensure the response is treated as a blob
        });

        if (response.status === 200) {
          const contentDisposition = response.headers['content-disposition'];
          let filename = 'download'; // Default filename if not present in header

          if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="(.+)"/);
            if (filenameMatch && filenameMatch[1]) {
              filename = filenameMatch[1];
            }
          }

          // Modify filename based on filter
          if (from != null && until != null) {
            filename = `Laporan Pembacaan Sensor ${this.nama} ${from} sd ${until}`;
          } else {
            filename = `Laporan Pembacaan Sensor ${this.nama}`;
          }

          const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
          const a = document.createElement('a');
          a.href = url;
          a.setAttribute('download', filename);
          document.body.appendChild(a);
          a.click();
          a.parentNode.removeChild(a);
          window.URL.revokeObjectURL(url);
        }
      } catch (e) {
        console.log(e);
      } finally {
        this.loading_dw = false;
      }

    },
    async downloadQADaily() {
      const from = this.startDate ? moment(this.startDate).format('YYYY-MM-DD HH:mm') : null;
      const until = this.endDate ? moment(this.endDate).format('YYYY-MM-DD HH:mm') : null;
      this.loading_dw = true;
      try {
        const response = await axios.get(`${this.$baseURL}/pdam/QA/Download/${this.$route.params.id}/`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
          params: {
            from: from,
            until: until,
          },
          responseType: 'blob' // Ensure the response is treated as a blob
        });

        if (response.status === 200) {
          const contentDisposition = response.headers['content-disposition'];
          let filename = 'download'; // Default filename if not present in header

          if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="(.+)"/);
            if (filenameMatch && filenameMatch[1]) {
              filename = filenameMatch[1];
            }
          }

          // Modify filename based on filter
          if (from != null && until != null) {
            filename = `Data QA Station ${this.profile.station_name} ${from} sd ${until}`;
          } else {
            filename = `Data QA Station ${this.profile.station_name}`;
          }

          const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
          const a = document.createElement('a');
          a.href = url;
          a.setAttribute('download', filename);
          document.body.appendChild(a);
          a.click();
          a.parentNode.removeChild(a);
          window.URL.revokeObjectURL(url);
        }
      } catch (e) {
        console.log(e);
      } finally {
        this.loading_dw = false;
      }

    },
    async downloadQAHourly() {
      const from = this.startDate ? moment(this.startDate).format('YYYY-MM-DD HH:mm') : null;
      const until = this.endDate ? moment(this.endDate).format('YYYY-MM-DD HH:mm') : null;
      this.loading_dw = true;
      try {
        const response = await axios.get(`${this.$baseURL}/pdam/QA/Download/${this.$route.params.id}/`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
          params: {
            from: from,
            until: until,
          },
          responseType: 'blob' // Ensure the response is treated as a blob
        });

        if (response.status === 200) {
          const contentDisposition = response.headers['content-disposition'];
          let filename = 'download'; // Default filename if not present in header

          if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="(.+)"/);
            if (filenameMatch && filenameMatch[1]) {
              filename = filenameMatch[1];
            }
          }

          // Modify filename based on filter
          if (from != null && until != null) {
            filename = `Laporan Pembacaan Sensor ${this.nama} ${from} sd ${until}`;
          } else {
            filename = `Laporan Pembacaan Sensor ${this.nama}`;
          }

          const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
          const a = document.createElement('a');
          a.href = url;
          a.setAttribute('download', filename);
          document.body.appendChild(a);
          a.click();
          a.parentNode.removeChild(a);
          window.URL.revokeObjectURL(url);
        }
      } catch (e) {
        console.log(e);
      } finally {
        this.loading_dw = false;
      }

    },
    async downloadDaily() {
      const from = this.startDate ? moment(this.startDate).format('YYYY-MM-DD HH:mm') : null;
      const until = this.endDate ? moment(this.endDate).format('YYYY-MM-DD HH:mm') : null;
      this.loading_dw = true;
      try {
        const response = await axios.get(`${this.$baseURL}/pdam/station_data/download/${this.$route.params.id}/`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
          params: {
            from: from,
            until: until,
            per_day: true
          },
          responseType: 'blob' // Ensure the response is treated as a blob
        });


        if (response.status === 200) {
          const contentDisposition = response.headers['content-disposition'];
          let filename = 'download'; // Default filename if not present in header

          if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="(.+)"/);
            if (filenameMatch && filenameMatch[1]) {
              filename = filenameMatch[1];
            }
          }

          // Modify filename based on filter
          if (from != null && until != null) {
            filename = `Data per hari ${this.nama} ${from} sd ${until}`;
          } else {
            filename = `Data per hari ${this.nama}`;
          }

          const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
          const a = document.createElement('a');
          a.href = url;
          a.setAttribute('download', filename);
          document.body.appendChild(a);
          a.click();
          a.parentNode.removeChild(a);
          window.URL.revokeObjectURL(url);
        }
      } catch (e) {
        console.log(e);
      } finally {
        this.loading_dw = false;
      }
    },
    async formatThreshold() {
      try {
        const response = await axios.get(
          `${this.$baseURL}/pdam/download_format_treshold/`,
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
            responseType: 'blob',
          }
        );
        const blob = new Blob([response.data], { type: response.data.type });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'Format Input Threshold.xlsx');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Error downloading the file', error);
      }
    },
    async formatSensorData() {
      try {
        const response = await axios.get(
          `${this.$baseURL}/pdam/download_format_sensor_data/`,
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
            responseType: 'blob',
          }
        );
        const blob = new Blob([response.data], { type: response.data.type });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'Format Input Sensor Data.xlsx');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Error downloading the file', error);
      }
    },
    async formatVerifikasi() {
      try {
        const response = await axios.get(

          `${this.$baseURL}/pdam/rekap_verifikasi/Download/Format/`,
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
            responseType: 'blob',
          }
        );
        const blob = new Blob([response.data], { type: response.data.type });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'Format Input Verifikasi.xlsx');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Error downloading the file', error);
      }
    },
    onChangeFileUpload(event) {
      this.csvFile = event.target.files[0];
    },
    tresholdDataUpload() {
      let formData = new FormData();
      formData.append("station_serial_id", this.$route.params.id);
      formData.append("file", this.csvFile);

      axios
        .post(`${this.$baseURL}/pdam/upload_treshold/${this.$route.params.id}/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${this.token}`,
          },
        })
        .then((r) => {
          if (r.status == 204) {
            this.csv_code = "File uploaded successfully";
            location.reload();
          }
        })
        .catch((error) => {
          console.log(error);
          this.csv_code = "Error uploading the file. Please try again.";
        });
    },
    sensorDataUpload() {
      let formData = new FormData();
      formData.append("station_serial_id", this.$route.params.id);
      formData.append("files", this.csvFile);

      axios
        .post(`${this.$baseURL}/pdam/sensor_data/upload/${this.$route.params.id}/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${this.token}`,
          },
        })
        .then((r) => {
          if (r.status == 204) {
            this.csv_code = "File uploaded successfully";
            location.reload();
          }
        })
        .catch((error) => {
          console.log(error);
          this.csv_code = "Error uploading the file. Please try again.";
        });
    },
    verifikasiDataUpload() {
      let formData = new FormData();
      formData.append("station_serial_id", this.$route.params.id);
      formData.append("file", this.csvFile);

      axios
        .post(`${this.$baseURL}/pdam/rekap_verifikasi/Upload/${this.$route.params.id}/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${this.token}`,
          },
        })
        .then((r) => {
          if (r.status == 204) {
            this.csv_code = "File uploaded successfully";
            location.reload();
          }
        })
        .catch((error) => {
          console.log(error);
          this.csv_code = "Error uploading the file. Please try again.";
        });
    },
  },
  created() {
    this.extractUserInfo()
    if (this.role !== 'QA') {
      this.loadData();
    } else {
      this.loadDataQA()
    }
    this.ava_width = screen.availWidth;

  },

};
</script>
<style scoped src="@/assets/css/figma.css"></style>
<style scoped>
.align-middle {
  vertical-align: middle;
  /* Centers the numbers vertically */
}

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

.dropdown-submenu {
  position: relative;
}

.dropdown-submenu .dropdown-menu {
  top: 0;
  left: 100%;
  margin-top: -0.125rem;
  display: none;
}

.dropdown-submenu:hover>.dropdown-menu {
  display: block;
}

.mx-datepicker {
  width: 180px;
}

.imgSZ img {
  resize: both;
  height: 150px;
  width: 190px;
}

@media (max-width: 768px) {
  .imgSZ {
    height: 170px;
    /* You can adjust the height as needed */
  }
}
</style>