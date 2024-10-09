<template>
  <div>
    <div v-if="role !== 'QA'" class="card box-sm mt-2 comShadow mb-2" style="box-shadow: 10px; border-radius: 10px">
      <div class="row">
        <div class="col-md-4 p-0 imgSZ">
          <img :src="`${station.image}`" class="img-fluid" alt="station-img" style="
              object-fit: cover;
              border-radius: 10px 0px 0px 0px;
              margin-left: 12px;
              width: 94%;
            " />
        </div>
        <div class="col-md-8 my-0">
          <div class="d-flex align-items-center mx-2">
            <div class="col-md-12 col-10">
              <div style="font-weight: 500; font-size: 1.1rem">
                {{ station.station_name }}
              </div>
            </div>
          </div>

          <div class="row" v-if="profile">
            <div class="col-md-6 mx-0">
              <div class="my-1 mx-2">
                <div class="info-label">Lokasi</div>
                <div class="info-value">{{ profile.location }}</div>
              </div>
              <div v-if="profile.balai.balai_name == 'Distribusi'" class="my-1 mx-2">
                <div class="info-label">In/Out Interzone</div>
                <div class="info-value">{{ profile.interzone }}</div>
              </div>
              <div v-else class="my-1 mx-2">
                <div class="info-label">Nameplate Head</div>
                <div class="info-value">{{ profile.nameplate_head }}</div>
              </div>

            </div>

            <div v-if="profile.balai.balai_name == 'Distribusi'" class="col-md-6 mx-0">
              <div class="my-1 mx-2">
                <div class="info-label"> Max Flow</div>
                <div class="info-value">{{ profile.max_flow }} L/s</div>
              </div>
              <div class="my-1 mx-2">
                <div class="info-label">Diameter Pipa</div>
                <div class="info-value">
                  {{ profile.diameter }} mm
                </div>
              </div>
            </div>
            <div v-else class="col-md-6 mx-0">
              <div class="my-1 mx-2">
                <div class="info-label">Jumlah Operasi</div>
                <div class="info-value">{{ profile.jumlah_operasi }}</div>
              </div>
              <div class="my-1 mx-2">
                <div class="info-label">Kapasitas</div>
                <div class="info-value">
                  {{ profile.kapasitas }} L/s
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class=" mx-auto bg-white mb-2" style="border-radius: 15px">
          <div class="d-flex pt-2 px-2 justify-content-between">
            <h6>
              Data {{ station.chart[0].sensor_data[0].sensor_name }} <span v-if="role == 'SuperAdmin'"> & {{ station.chart[0].sensor_data[2].sensor_name }} ({{ station.chart[0].sensor_data[2].notation }})</span>
            </h6>
            
            <div>
              <button v-if="role == 'SuperAdmin'" data-bs-toggle="modal" data-bs-target="#approveTaksasi"
                class="btn btn-sm btn-success" type="button" style="font-size: 0.8rem">
                <i class="zmdi zmdi-check"></i> Approve
              </button>
              <button v-if="role == 'SuperAdmin'" data-bs-toggle="modal" data-bs-target="#taksasiData"
                class="btn btn-sm btn-primary mx-1" type="button" style="font-size: 0.8rem">
                <i class="zmdi zmdi-edit"></i> Taksasi
              </button>

            </div>

          </div>
          <div class="modal fade" id="taksasiData" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
            aria-labelledby="taksasiDataLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <form @submit.prevent="tresholdDataUpload">
                  <div class="modal-header">
                    <h5 class="modal-title text-primary" id="taksasiDataLabel">
                      Taksasi Data
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <div>

                      <DatePicker name="from" v-model="startDate" type="datetime" format="DD/MM/YYYY HH:mm"
                        placeholder="Select first date" :minute-step="5"></DatePicker>

                      <label for="to" class="px-2" style="font-size: 0.8rem; font-weight: normal">s.d</label>
                      <DatePicker name="to" v-model="endDate" type="datetime" format="DD/MM/YYYY HH:mm"
                        placeholder="Select last date" :minute-step="5"></DatePicker>
                    </div>
                    <!-- <div class="form-group">
                      <p class=" mt-3 mb-3">Tipe Taksasi</p>
                      <select class="form-select" v-model="taksasi">
                        <option v-for="item in taksasiType" :key="item.id" :value="item">
                          {{ item }}
                        </option>
                      </select>
                    </div> -->
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-sm btn-secondary" data-bs-dismiss="modal">
                      Close
                    </button>
                    <button type="submit" class="btn btn-sm btn-primary" data-bs-dismiss="modal">
                      Taksasi
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div class="modal fade" id="approveTaksasi" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
            aria-labelledby="approveTaksasiLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <form @submit.prevent="tresholdDataUpload">
                  <div class="modal-header">
                    <h5 class="modal-title text-success" id="approveTaksasiLabel">
                      Approve Taksasi
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <div>

                      <DatePicker name="from" v-model="startDate" type="datetime" format="DD/MM/YYYY HH:mm"
                        :minute-step="5" placeholder="Select first date"></DatePicker>
                      <label for="to" class="px-2" style="font-size: 0.8rem; font-weight: normal">s.d</label>
                      <DatePicker :minute-step="5" name="to" v-model="endDate" type="datetime" format="DD/MM/YYYY HH:mm"
                        placeholder="Select last date"></DatePicker>
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-sm btn-secondary" data-bs-dismiss="modal">
                      Close
                    </button>
                    <button type="submit" class="btn btn-sm btn-success" data-bs-dismiss="modal">
                      Approve
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          
          <Chart v-if="role == 'SuperAdmin'" style="height: 27vh" class="p-0 pr-0 pt-1 pb-0" :label="formatAllDates(label)" :chart-data="[debitData, taksasiData]"
            :title1="`${station.chart[0].sensor_data[0].sensor_name} (${station.chart[0].sensor_data[0].notation})`"
            :title2="`${station.chart[0].sensor_data[2].sensor_name} (${station.chart[0].sensor_data[2].notation})`"
            is="LineChartFiltered">
          </Chart>

          <Chart v-else style="height: 27vh" class="p-0 pr-0 pt-1 pb-0" :label="formatAllDates(label)" :chart-data="[debitData, null]"
            :title1="`${station.chart[0].sensor_data[0].sensor_name} (${station.chart[0].sensor_data[0].notation})`"
            :title2="null"
            is="LineChartFiltered">
          </Chart>

          

        </div>
      </div>
      <div>
        <div>
          <div class="border mx-auto bg-white mb-2">
            <div>
              <h6 class="px-2 pt-2">
                Data {{ station.chart[0].sensor_data[1].sensor_name }} ({{ station.chart[0].sensor_data[1].notation }})
              </h6>
            </div>
            <Chart style="height: 27vh" class="p-0 pr-0 pt-1 pb-0" :label="formatAllDates(label)"
              :chart-data="totalData"
              :title="`${station.chart[0].sensor_data[0].sensor_name} (${station.chart[0].sensor_data[0].notation})`"
              is="TotalChartFiltered">
            </Chart>
          </div>
        </div>
      </div>
    </div>


    <div v-if="role == 'QA' && stationQA">
      <div class="comShadow" style="border-radius: 15px">
        <div class="box-sm border mx-auto bg-white mb-2" style="border-radius: 15px">
          <div>
            <h6 class="px-2 pt-2">
              Jumlah Data
            </h6>
          </div>

          <Chart style="height: 25vh" :label="formatAllDatesQA(labelQA)" :chart-data="sumDataQA" :title="`Jumlah Data`"
            is="TotalChartBarFiltered">
          </Chart>
        </div>
      </div>

      <div class="comShadow" style="border-radius: 15px">
        <div class="box-sm border mx-auto bg-white mb-2" style="border-radius: 15px">
          <div>
            <h6 class="px-2 pt-2">
              Data Persentase (%)
            </h6>
          </div>

          <Chart style="height: 25vh" :label="formatAllDatesQA(labelQA)" :chart-data="percentDataQA"
            :title="`Persentase Data (%)`" is="TotalChartBarFiltered">
          </Chart>
        </div>
      </div>


      <div class="comShadow" style="border-radius: 15px">
        <div class="box-sm border mx-auto bg-white" style="border-radius: 15px">
          <div>
            <h6 class="px-2">
              Jumlah Gangguan
            </h6>
          </div>
          <Chart style="height: 25vh" :label="formatAllDatesQA(labelQA)" :chart-data="mtcDataQA"
            :title="`Jumlah Gangguan`" is="TotalChartBarFiltered">
          </Chart>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import LineChartFiltered from "@/components/Chart/LineChartFiltered";
import TotalChartFiltered from "@/components/Chart/TotalChartFiltered";
import TotalChartBarFiltered from "@/components/Chart/TotalChartBarFiltered";

export default {
  name: "ChartData",
  props: ["debitData", "totalData", "taksasiData","label", "station", "ava_width", "stationQA", "percentDataQA", "sumDataQA", "labelQA", "mtcDataQA", "profile"],

  components: {
    TotalChartBarFiltered,
    LineChartFiltered,
    TotalChartFiltered,
  },
  data() {
    return {
      total_s: null,
      taksasi: false,
      taksasiType: [false, true],
      startDate: null,
      endDate: null,
    };
  },

  methods: {
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
          timeZone: 'Asia/Jakarta',
        };
        return new Intl.DateTimeFormat('en-GB', options).format(date);
      } catch (error) {
        console.error('Error parsing date:', error);
        return dateString;
      }
    },
    formatAllDates(timeArray) {
      return timeArray.map(this.formatDate);
    },
    formatDateQA(dateString) {
      try {
        const date = new Date(dateString);
        if (isNaN(date)) throw new Error("Invalid date");

        const options = {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          timeZone: 'Asia/Jakarta',
        };
        return new Intl.DateTimeFormat('en-GB', options).format(date);
      } catch (error) {
        console.error('Error parsing date:', error);
        return dateString;
      }
    },
    formatAllDatesQA(timeArray) {
      return timeArray.map(this.formatDateQA);
    },
  },

  created() {
    this.extractUserInfo()
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