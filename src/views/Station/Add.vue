<template>
  <div>
    <Header />
    <form @submit.prevent="submit">
      <div class="mobile-width">
        <div class="bwsTitle mobile-top">
          {{ $app_title }}
        </div>
        <div class="row">
          <div class="d-flex justify-content-between align-items-center">
            <div class="subTitle">Tambah Pos Baru</div>
            <div>
              <router-link :to="{ name: 'Station' }" type="button"
                class="btn btn-light border mx-4 bg-white">Cancel</router-link>
              <button class="btn btn-primary" type="submit">Simpan</button>
            </div>
          </div>
        </div>

        <div class="row mt-1">
          <div class="col-md-6">
            <div class="card">
              <div class="card-header">Data Stasiun</div>
              <div class="card-body">
                <div class="col-md pb-3">
                  <div class="form-group">
                    <label for="inputNaPo">Nama Stasiun*</label>
                    <input v-model="station_name" type="text" class="form-control" id="inputNaPo"
                      placeholder="Nama Pos" required/>
                  </div>
                </div>
                <div class="col-md pb-3">
                  <div class="form-group">
                    <label for="inputLo">Lokasi*</label>
                    <input v-model="location" type="text" class="form-control" id="inputLo" placeholder="Lokasi" required/>
                  </div>
                </div>

                <div class="col-md pb-3">
                  <div class="form-group">
                    <label for="inputLo">Latitude*</label>
                    <input v-model="latitude" type="number" class="form-control" id="inputLo" placeholder="Latitude"
                      step="0.000000001" required/>
                  </div>
                </div>
                <div class="col-md pb-3">
                  <div class="form-group">
                    <label for="inputLo">Longitude*</label>
                    <input v-model="longitude" type="number" class="form-control" id="inputLo" placeholder="Longitude"
                      step="0.000000001" required/>
                  </div>
                </div>

                
              </div>
            </div>
            <div class="card">
              <div class="card-header">Foto Stasiun</div>
              <div class="card-body">
                <!-- -----DRAND AND DROP----- -->

                <div v-if="!file">
                  <div :class="['dropZone', dragging ? 'dropZone-over' : '']" @dragenter="dragging = true"
                    @dragleave="dragging = false">
                    <div class="dropZone-info" @drag="onChange">
                      <img :src="login_i" class="p-3" />
                      <div class="dropZone-title">
                        <span style="color: #3056d3">Click to upload</span> or
                        drag and drop
                      </div>
                      <div class="dropZone-upload-limit-info">
                        <div>PNG, JPG or JPEG</div>
                        <div>(max 5 MB)</div>
                      </div>
                    </div>
                    <input type="file" @change="onChange" />
                  </div>
                </div>

                <div v-else class="dropZone-uploaded">
                  <div class="dropZone-uploaded-info">
                    <img v-if="imagePath" :src="imagePath" style="max-width: 120px; max-height: 60px" />
                    <span class="dropZone-filename p-1">{{ file.name }}</span>
                    <button type="button" class="btn btn-primary removeFile p-1" @click="removeFile">
                      Remove File
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6">

            <div class="card pt-1" v-if="role == 'is_superuser'">
              <div class="card-header">Data Logger</div>
              <div class="card-body">
                <div class="col-md">
                  <div class="col-md pb-3">
                    <div class="form-group">
                      <label for="floatingInput">Serial Number Logger</label><input v-model="sn_logger" type="text"
                        class="form-control" placeholder="Serial Number Logger" />
                    </div>
                  </div>
                </div>
                <div class="col-md">
                  <div class="col-md pb-3">
                    <div class="form-group">
                      <label for="floatingInput">Serial Number Modem</label>
                      <input v-model="sn_modem" type="text" class="form-control" placeholder="Serial Number Modem" />
                    </div>
                  </div>
                </div>

                <div class="col-md">
                  <div class="col-md pb-3">
                    <div class="form-group">
                      <label for="floatingInput">Topic MQTT</label>
                      <input v-model="topic_MQTT" type="text" class="form-control" placeholder="Topic MQTT" />
                    </div>
                  </div>
                </div>

                <div class="col-md">
                  <div class="col-md pb-3">
                    <div class="form-group">
                      <label for="floatingInput">Maintenance Status</label>
                      <select class="form-select" v-model="maintenance">
                        <option v-for="item in maintStatus" :key="item.id" :value="item">
                          {{ item }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>

                <div class="col-md">
                  <div class="col-md pb-3">
                    <div class="form-group">
                      <label for="floatingInput">Maintenance Date</label><input v-model="created_at"
                        type="datetime-local" class="form-control" placeholder="Maintenance Date" />
                    </div>
                  </div>
                </div>

                <div class="col-md">
                  <div class="col-md pb-3">
                    <div class="form-group">
                      <label for="floatingInput">Hide Status</label><select class="form-select" v-model="hide">
                        <option v-for="item in hideStatus" :key="item.id" :value="item">
                          {{ item }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>

                <div class="col-md">
                  <div class="col-md pb-3">
                    <div class="form-group">
                      <label for="floatingInput">Catatan</label>
                      <textarea v-model="note" class="form-control" id="exampleFormControlTextarea1"
                        rows="3"></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </form>
  </div>
</template>

<script>
import Header from "@/components/Public/Header.vue";
import axios from "axios";
import moment from "moment";
// import $ from "jquery";
import login_i from "@/assets/icons/menu/upload.svg";

export default {
  name: "AddStation",
  components: {
    Header,
  },

  data() {
    return {
      totalSensor: 1,
      login_i,
      //DRAGNDROP
      // file: '',
      dragging: false,
      //DRAGNDROP END
      channels: [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      ],
      
      provinsis: [],
      sensorTypes: [],
      stationTypes: [],
      snLoggers: [],
      snModems: [],
      maintStatus: [false, true],
      hideStatus: [false, true],
      file: "",
      reader: "",

      station_name: "",
      station_type: null,
      provinsi: null,
      
      location: "",
      sungai: null,
      sn_logger: null,
      sn_modem: null,
      latitude: null,
      longitude: null,
      elevasi: null,
      imagePath: null,
      topic_MQTT: "",
      observator: "",
      observator_phone: "",
      map_icon: null,
      siaga: null,
      created_by: null,
      maintenance: false,
      hide: false,
      note: null,
      // DATA -------------------
      created_at: null,
    };
  },
  methods: {

    onChange(e) {
      // var files = e.target.files || e.dataTransfer.files;
      this.file = e.target.files.item(0);
      this.reader = new FileReader();
      this.reader.addEventListener("load", this.imageLoaded);
      this.reader.readAsDataURL(this.file);

      if (!this.file.length) {
        this.dragging = false;
        return;
      }

      this.createFile(this.file[0]);
    },
    createFile(file) {
      if (!file.type.match("image.*")) {
        alert("please select image file");
        // this.$swal({
        //   position: "top-end",
        //   width: "300px",
        //   icon: "success",
        //   title: "Your work has been saved",
        //   showConfirmButton: false,
        //   timer: 1500,
        // });
        this.dragging = false;
        return;
      }

      if (file.size > 5000000) {
        alert("please check file size no over 5 MB.");
        this.dragging = false;
        return;
      }

      this.file = file;
      console.log(this.file);
      this.dragging = false;
    },
    removeFile() {
      this.file = "";
    },
    // END DRAG N DROP

    fileSelected(event) {
      this.file = event.target.files.item(0);
      this.reader = new FileReader();
      this.reader.addEventListener("load", this.imageLoaded);
      this.reader.readAsDataURL(this.file);
    },
    imageLoaded(event) {
      this.imagePath = event.target.result;
    },

    async submitStation() {
      const form = new FormData();
      form.append(this.file, this.file.name);

      await axios
        .post(
          `${this.$baseURL}/station/0`,
          {
            // station_name: {

            // },
            created_at: this.created_at,
            station_name: this.station_name,
            location: this.location,

            latitude: this.latitude,
            longitude: this.longitude,

            image: this.imagePath,
            topic_MQTT: this.topic_MQTT,
            observator: this.observator,
            observator_phone: this.observator_phone,
            map_icon: this.map_icon,

            sn_logger: this.sn_logger,
            sn_modem: this.sn_modem,

            created_by: this.created_by,
            maintenance: this.maintenance,
            hide: this.hide,
            note: this.note,
          },
          {
            headers: {
              Authorization: `Token ${this.token}`,
            },
          }
        )
        .then((r) => {
          if (r.status == 201) {
            this.$router.push({ name: "Station" });
          }
        });
    },
    submit() {
      this.$swal({
        position: "top-end",
        width: "300px",
        icon: "success",
        title: "Your work has been saved",
        showConfirmButton: false,
        timer: 1500,
      });

      this.submitStation();
    },
  },
  created() {
    this.gAuthUser();
 

    var date = new Date();
    this.created_at = moment(date).format("YYYY-MM-DDThh:mm");
  },
  async mounted() {
   
  },
  //DRAGNDROP
  computed: {
    extension() {
      return this.file ? this.file.name.split(".").pop() : "";
    },
  },
  //DRAGNDROP END
};
</script>
<style scoped src="@/assets/css/figma.css"></style>

<style scoped>
.dropZone {
  width: 50%;
  height: 150px;
  position: relative;
  border: 2px dashed rgba(48, 86, 211, 0.7);
  margin: auto;
  border-radius: 7px;
  background-color: #f4f7ff;
}

.dropZone:hover {
  border: 2px solid #2e94c4;
}

.dropZone:hover .dropZone-title {
  color: #1975a0;
}

.dropZone-info {
  color: #a8a8a8;
  position: absolute;
  top: 50%;
  width: 100%;
  transform: translate(0, -50%);
  text-align: center;
}

.dropZone-title {
  color: #787878;
}

.dropZone-filename {
  font-size: 14px;
}

.dropZone input {
  position: absolute;
  cursor: pointer;
  top: 0px;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}

.dropZone-upload-limit-info {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
}

.dropZone-over {
  background: #5c5c5c;
  opacity: 0.8;
}

.dropZone-uploaded {
  width: 50%;
  height: 150px;
  position: relative;
  border: 2px dashed rgba(48, 86, 211, 0.7);
  margin: auto;
  border-radius: 7px;
  background-color: #f4f7ff;
}

.dropZone-uploaded-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #a8a8a8;
  position: absolute;
  top: 50%;
  width: 100%;
  transform: translate(0, -50%);
  text-align: center;
}

.removeFile {
  width: 200px;
}

.card {
  box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px,
    rgba(17, 17, 26, 0.05) 0px 8px 32px;
}
</style>
