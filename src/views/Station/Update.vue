<template>
  <div v-if="item">
    <Header />
    <form @submit.prevent="update">
      <div class="mobile-width">
        <div class="bwsTitle mobile-top">
          {{ $app_title }}
        </div>
        <div class="row my-2">
          <div class="col-md subTitle">
            Edit Data Stasiun {{ item.station_name }}
          </div>
          <div class="col-md d-flex justify-content-end">
            <router-link :to="{ name: 'Station' }" type="button"
              class="btn btn-light border mx-4 bg-white">Cancel</router-link>
            <button class="btn btn-primary" type="submit">Update</button>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="card">
              <div class="card-header">Data Stasiun</div>
              <div class="card-body">
                <div class="col-md pb-1">
                  <div class="form-group">
                    <label for="inputLo">Nama Stasiun*</label>
                    <input v-model="item.station_name" type="text" class="form-control" id="inputLo"
                      placeholder="Nama Stasiun" required />
                  </div>
                </div>
                <div class="col-md py-1">
                  <div class="form-group">
                    <label for="inputLo">Lokasi</label>
                    <input v-model="item.location" type="text" class="form-control" id="inputLo" placeholder="Lokasi" />
                  </div>
                </div>

                <div class="col-md py-1">
                  <div class="form-group">
                    <label for="inputLo">Latitude*</label>
                    <input v-model="item.latitude" type="number" class="form-control" id="inputLo"
                      placeholder="Latitude" step="0.000000001" required />
                  </div>
                </div>
                <div class="col-md py-1">
                  <div class="form-group">
                    <label for="inputLo">Longitude*</label>
                    <input v-model="item.longitude" type="number" class="form-control" id="inputLo"
                      placeholder="Longitude" step="0.000000001" required />
                  </div>
                </div>


              </div>
            </div>
            <div class="card">
              <div class="card-header">Foto Stasiun</div>
              <div class="card-body">
                <div v-if="!file">
                  <div :class="['dropZone', dragging ? 'dropZone-over' : '']" @dragenter="dragging = true"
                    @dragleave="dragging = false">
                    <div class="dropZone-info" @drag="onChange">
                      <img v-if="item.image" :src="item.image" style="max-width: 120px; max-height: 60px" />
                      <div class="dropZone-title">
                        <span style="color: #3056d3">Click to upload</span> or
                        drag and drop
                      </div>
                      <div class="dropZone-upload-limit-info">
                        <div>PNG, JPG or JPEG</div>
                      </div>
                    </div>
                    <input type="file" @change="updateImage" />
                  </div>
                </div>
              </div>
            </div>
            <div class="card pt-1">
              <div class="card-header">Data Logger</div>
              <div class="card-body">
                <div class="col-md">
                  <div class="col-md py-1">
                    <div class="form-group">
                      <label for="floatingInput">Serial Number Logger</label><input v-model="item.sn_logger" type="text"
                        class="form-control" placeholder="Serial Number Logger" />
                    </div>
                  </div>
                </div>
                <div class="col-md">
                  <div class="col-md py-1">
                    <div class="form-group">
                      <label for="floatingInput">Serial Number Modem</label>
                      <input v-model="item.sn_modem" type="text" class="form-control"
                        placeholder="Serial Number Modem" />
                    </div>
                  </div>
                </div>

                <div class="col-md">
                  <div class="col-md py-1">
                    <div class="form-group">
                      <label for="floatingInput">Topic MQTT*</label>
                      <input v-model="item.topic" type="text" class="form-control" placeholder="Topic MQTT" required />
                    </div>
                  </div>
                </div>

                <div class="col-md">
                  <div class="col-md py-1">
                    <div class="form-group">
                      <label for="floatingInput">Maintenance Status</label>
                      <select class="form-select" v-model="item.maintenance_status">
                        <option v-for="status in maintStatus" :key="status.value" :value="status.value">
                          {{ status.text }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card">
              <div class="card-header">Data Produksi</div>
              <div class="card-body">

                <div class="col-md py-1">
                  <label for="floatingInput">Produksi</label>
                  <select class="form-select" v-model="item.balai.id">
                    <option v-for="item in produksis" :key="item.id" :value="item.id">
                      {{ item.balai_name }}
                    </option>
                  </select>
                </div>

                <div class="col-md py-1">
                  <div class="form-group">
                    <label for="UkuranSensor">Ukuran Sensor</label>
                    <input v-model="item.sensor_size" type="text" class="form-control" id="UkuranSensor"
                      placeholder="Ukuran Sensor" />
                  </div>
                </div>
                <div class="col-md py-1">
                  <div class="form-group">
                    <label for="HargaSatuan">Harga Satuan</label>
                    <input v-model="item.unit_price" type="text" class="form-control" id="HargaSatuan"
                      placeholder="Harga Satuan" />
                  </div>
                </div>
                <div v-if="item.balai.id == 4" class="col-md py-1">
                  <div class="form-group">
                    <label for="In/OutInterzone">In/Out Interzone</label>
                    <input v-model="item.interzone" type="text" class="form-control" id="In/OutInterzone"
                      placeholder="Interzone" />
                  </div>
                </div>
                <div v-else class="col-md py-1">
                  <div class="form-group">
                    <label for="Nameplate">Nameplate Head</label>
                    <input v-model="item.nameplate_head" type="text" class="form-control" id="Nameplate"
                      placeholder="Nameplate Head" />
                  </div>
                </div>
                <div v-if="item.balai.id == 4" class="col-md ">
                  <div class="form-group py-1">
                    <label for="Max">Max Flow</label>
                    <input v-model="item.max_flow" type="text" class="form-control" id="Max" placeholder="Max Flow" />
                  </div>
                  <div class="form-group py-1">
                    <label for="Diameter">Diameter Pipa</label>
                    <input v-model="item.pipe_diameter" type="number" class="form-control" id="Diameter"
                      placeholder="Diameter Pipa" step="0.01" />
                  </div>
                </div>

                <div v-else class="col-md ">
                  <div class="form-group py-1">
                    <label for="Kapasitas">Kapasitas</label>
                    <input v-model="item.capacity" type="text" class="form-control" id="Kapasitas"
                      placeholder="Kapasitas" />
                  </div>
                  <div class="form-group py-1">
                    <label for="Jumlah">Jumlah Operasi</label>
                    <input v-model="item.sum_operation" type="text" class="form-control" id="Jumlah"
                      placeholder="Jumlah Operasi" />
                  </div>
                </div>

                <div class="col-md py-1">
                  <div class="form-group">
                    <label for="Percent">Percent Cal</label>
                    <input v-model="item.percent_cal" type="number" class="form-control" id="Percent"
                      placeholder="Percent Cal" step="0.01" />
                  </div>
                </div>
           
                
                
                  <div class="col-md py-1">
                    <div class="form-group">
                      <label for="floatingInput">Factor Cal</label>
                      <select class="form-select" v-model="item.factor_cal">
                        <option v-for="status in factor_cal_value" :key="status.value" :value="status.value">
                          {{ status.text }}
                        </option>
                      </select>
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
import login_i from "@/assets/icons/menu/upload.svg";

export default {
  name: "UpdateStation",
  components: {
    Header,
  },
  data() {
    return {
      dragging: false,
      login_i,
      produksis: [],
      snLoggers: [],
      snModems: [],
      maintStatus: [
        { value: false, text: 'OK' },
        { value: true, text: 'MAINTENANCE' }
      ],
      factor_cal_value: [
        { value: false, text: 'MIN' },
        { value: true, text: 'SUM' }
      ],
      file: null,
      reader: "",
      item: {
        station_name: "",
        location: "",
        topic: "",
        percent_cal: null,
        factor_cal: true,
        maintenance_status: false,
        elevation: null,
        sn_modem: "",
        sn_logger: "",
        image: "",
        latitude: "",
        longitude: "",
        nameplate_head: "",
        sum_operation: "",
        capacity: "",
        interzone: "",
        max_flow: "",
        pipe_diameter: "",
        unit_price: null,
        sensor_size: "",
        logger_type: null,
        created_by: null,
        balai: null,

      },
    };
  },

  methods: {
    async updateStation() {
      try {
        const formData = new FormData();

        // Handle image
        if (this.item.image && !(this.item.image.startsWith('http'))) {
          if (this.item.image instanceof File) {
            // If it's a File object, use it directly
            formData.append('image', this.item.image);
          } else if (this.item.image.startsWith('data:image')) {
            // If it's a data URL (from FileReader)
            const response = await fetch(this.item.image);
            const blob = await response.blob();
            formData.append('image', new File([blob], 'image.jpg', { type: 'image/jpeg' }));
          } else {
            throw new Error('Invalid image format');
          }
        }

        const loggerTypeId = this.item.logger_type ? this.item.logger_type.id : null;
        const balaiId = this.item.balai ? this.item.balai.id : null;

        const updatedItem = {
          ...this.item,
          logger_type: loggerTypeId,
          balai: balaiId,
        };

        for (const key in updatedItem) {
          if (key !== 'image') {
            formData.append(key, updatedItem[key]);
          }
        }

        const config = {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${this.token}`,
          },
        };

        await axios.put(`${this.$baseURL}/pdam/station/${this.$route.params.id}/`, formData, config);

        this.$router.push({ name: "Station" });
      } catch (error) {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          this.logoutUser();
        } else {
          console.error('Error msg: ', error);
        }
      }
    },
    updateImage(event) {
      let file;
      if (event.target.files) {
        file = event.target.files[0];
      } else if (event.dataTransfer) {
        file = event.dataTransfer.files[0];
      }
      const allowedExtensions = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!allowedExtensions.includes(file.type)) {
        alert('Invalid file format. Please upload a PNG, JPEG or JPG image.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        this.item.image = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    // async convertToSupportedFormat(file) {
    //   return new Promise((resolve, reject) => {
    //     const allowedExtensions = ['image/png', 'image/jpeg', 'image/jpg'];

    //     if (allowedExtensions.includes(file.type)) {
    //       resolve(file);
    //     } else {
    //       const reader = new FileReader();
    //       reader.onload = (event) => {
    //         const img = new Image();
    //         img.onload = () => {
    //           const canvas = document.createElement('canvas');
    //           canvas.width = img.width;
    //           canvas.height = img.height;
    //           const ctx = canvas.getContext('2d');
    //           ctx.drawImage(img, 0, 0);
    //           canvas.toBlob((blob) => {
    //             const convertedFile = new File([blob], 'converted_image.png', { type: 'image/png' });
    //             resolve(convertedFile);
    //           }, 'image/png');
    //         };
    //         img.onerror = reject;
    //         img.src = event.target.result;
    //       };
    //       reader.onerror = reject;
    //       reader.readAsDataURL(file);
    //     }
    //   });
    // },

    onChange(e) {
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
    imageLoaded(event) {
      this.item.image = event.target.result;
    },


    update() {
      this.$swal({
        position: "top-end",
        width: "300px",
        icon: "success",
        title: "Your work has been saved",
        showConfirmButton: false,
        timer: 1500,
      });
      this.updateStation();


    },
  },

  async created() {
    this.extractUserInfo()
    await axios
      .get(`${this.$baseURL}/balai/`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      })
      .then((r) => {
        this.produksis = r.data.data
      }).catch((error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          this.logoutUser();
        } else {
          console.error('Error msg: ', error);
        }
      });
    try {
      const response = await axios.get(`${this.$baseURL}/pdam/station/${this.$route.params.id}/`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      this.item = response.data.data;
    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        this.logoutUser();
      } else {
        console.error('Error msg: ', error);
      }
    }

    this.item.image = `${this.item.image}`;
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@200;400&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@200;400&display=swap&text=∑");

body {
  background: #263238;
  color: #b0bec5;
  font-family: "Roboto Slab", serif;
}

h1 {
  font-weight: 200;
  font-size: 2em;
  color: #c792ea;
}

.center {
  text-align: center;
}

hr {
  width: 200px;
  border: 1px solid #2e3c43;
  position: relative;
  margin: 50px auto;
}

hr::before {
  content: "***";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 10px;
  background: #263238;
  display: block;
  color: #607d8b;
}

.showcase {
  padding: 15px;
  text-align: center;
  position: relative;
}

.math {
  font-family: "Roboto Slab", serif;
}

.math .small {
  font-size: 0.7em;
}

.math .frac {
  display: inline-flex;
  vertical-align: middle;
  flex-direction: column;
  text-align: center;
  margin-top: -1px;
}

.math .frac>*:first-child {
  border-bottom: 2px solid currentColor;
  padding-bottom: 5px;
}

.math .frac>*:last-child {
  padding-top: 5px;
}

.math .frac>* {
  padding: 0 0.5em;
}

.math .sqrt {
  border-top: 2px solid currentColor;
  margin-left: 10px;
  padding-left: 5px;
  position: relative;
  display: inline-block;
}

.math .sqrt::before {
  content: "";
  position: absolute;
  top: -2px;
  left: -10px;
  bottom: 0px;
  width: 10px;
  background: currentColor;
  clip-path: polygon(0 50%,
      2px 50%,
      50% calc(100% - 2px),
      calc(100% - 2px) 0,
      100% 0,
      100% 2px,
      calc(50% + 2px) 100%,
      calc(50% - 2px) 100%,
      0 calc(50% + 2px));
}

.surround {
  padding: 0 10px;
  position: relative;
  display: inline-block;
  --round: 5px;
  --off: 0;
}

.surround::before {
  content: "";
  width: 5px;
  position: absolute;
  top: 0px;
  left: var(--off);
  bottom: 0px;
  width: 5px;
  border-top: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  border-left: 2px solid currentColor;
  border-top-left-radius: var(--round);
  border-bottom-left-radius: var(--round);
}

.surround::after {
  content: "";
  width: 5px;
  position: absolute;
  top: 0px;
  right: var(--off);
  bottom: 0px;
  width: 5px;
  border-top: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  border-right: 2px solid currentColor;
  border-top-right-radius: var(--round);
  border-bottom-right-radius: var(--round);
}

.surround.round {
  --round: 10px 30px;
}

.surround.square {
  --round: 0;
}

.surround.curly {
  --round: 10px;
  --off: 5px;
  padding: 0 15px;
  background-image: linear-gradient(0deg, currentColor 25%, currentColor 25%),
    linear-gradient(0deg, currentColor 25%, currentColor 25%);
  background-repeat: no-repeat;
  background-size: 5px 2px;
  background-position: 0 center, 100% center;
}

.surround.sys {
  --round: 10px;
  --off: 5px;
  padding: 0 15px;
  background-image: linear-gradient(0deg, currentColor 25%, currentColor 25%);
  background-repeat: no-repeat;
  background-size: 5px 2px;
  background-position: 0 center;
}

.surround.sys::after {
  content: unset;
}

.cs {
  position: relative;
  display: inline-block;
}

.cs>sup {
  position: absolute;
  bottom: calc(100% - 10px);
  left: 50%;
  transform: translate(-50%);
  width: max-content;
}

.cs>sub {
  position: absolute;
  top: calc(100% - 5px);
  left: 50%;
  transform: translate(-50%);
  width: max-content;
}

.big {
  font-size: 2em;
  font-weight: 200;
}

.arrow {
  position: relative;
}

.arrow::before {
  content: "";
  position: absolute;
  bottom: calc(100% + 5px);
  left: 0;
  right: 0;
  height: 2px;
  background: currentColor;
}

.arrow::after {
  content: "";
  position: absolute;
  bottom: calc(100% - 1px);
  right: -1px;
  height: 5px;
  width: 5px;
  border-top: 2px solid currentColor;
  border-right: 2px solid currentColor;
  transform-origin: top right;
  transform: rotate(45deg);
}

.surround.vec {
  display: inline-flex;
  flex-direction: column;
  vertical-align: middle;
}

.matrix {
  display: inline-grid;
  grid-template-columns: repeat(var(--c), 1fr);
  grid-gap: 5px;
  padding: 5px 15px;
  vertical-align: middle;
}

.annot {
  color: #607d8b;
  position: absolute;
  right: 15px;
  top: calc(50% - 0.5em);
}
</style>
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
