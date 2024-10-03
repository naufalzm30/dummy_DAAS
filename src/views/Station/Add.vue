<template>
  <div>
    <Header />
    <form @submit.prevent="submit">
      <div class="mobile-width">
        <div class="bwsTitle mobile-top">
          {{ $app_title }} {{ role }}
        </div>
        <div class="row">
          <div class="d-flex justify-content-between align-items-center">
            <div class="subTitle">Tambah Stasiun</div>
            <div>
              <router-link :to="{ name: 'Station' }" type="button"
                class="btn btn-light border mx-4 bg-white">Cancel</router-link>
              <button class="btn btn-primary" type="submit">Simpan</button>
            </div>
          </div>
        </div>
        <div class="row ">
          <div class="col-md-6">
            <div class="card">
              <div class="card-header">Data Stasiun</div>
              <div class="card-body">
                <div class="col-md pb-1">
                  <div class="form-group">
                    <label for="inputNaPo">Nama Stasiun*</label>
                    <input v-model="item.station_name" type="text" class="form-control" id="inputNaPo"
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
                    <label for="inputLa">Latitude*</label>
                    <input v-model="item.latitude" type="number" class="form-control" id="inputLa" step="0.000000001"
                      placeholder="Latitude" required />
                  </div>
                </div>
                <div class="col-md py-1">
                  <div class="form-group">
                    <label for="inputLo">Longitude*</label>
                    <input v-model="item.longitude" type="number" class="form-control" id="inputLo" step="0.000000001"
                      placeholder="Longitude" required />
                  </div>
                </div>
              </div>
            </div>
            <div class="card">
              <div class="card-header">Foto Stasiun</div>
              <div class="card-body">
                <div v-if="!item.image">
                  <div :class="['dropZone', dragging ? 'dropZone-over' : '']" @dragenter="dragging = true"
                    @dragleave="dragging = false">
                    <div class="dropZone-info" @drag="onChange">
                      <img :src="item.image" style="max-width: 120px; max-height: 60px" />
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
                <div v-else class="dropZone-uploaded">
                  <div class="dropZone-uploaded-info">
                    <img :src="item.image" style="max-width: 120px; max-height: 60px" />
                    <span class="dropZone-filename p-1">{{ file.name }}</span>
                    <button type="button" class="btn btn-primary removeFile p-1" @click="removeFile">
                      Remove File
                    </button>
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
                        <option v-for="item in maintStatus" :key="item.id" :value="item">
                          {{ item }}
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
                  <label for="floatingInput">Produksi*</label>

                  <select class="form-select" v-model="item.balai" required>
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
                    <input v-model="item.unit_price" type="number" class="form-control" id="HargaSatuan"
                      placeholder="Harga Satuan" />
                  </div>
                </div>
                <div v-if="item.balai == 4" class="col-md py-1">
                  <div class="form-group">
                    <label for="In/Out Interzone">In/Out Interzone</label>
                    <input v-model="item.interzone" type="text" class="form-control" id="In/Out Interzone"
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
                <div v-if="item.balai == 4" class="col-md py-1">
                  <div class="form-group">
                    <label for="Max">Max Flow</label>
                    <input v-model="item.max_flow" type="text" class="form-control" id="Max" placeholder="Max Flow" />
                  </div>
                  <div class="form-group">
                    <label for="Diameter">Diameter Pipa</label>
                    <input v-model="item.pipe_diameter" type="text" class="form-control" id="Diameter"
                      placeholder="Diameter Pipa" />
                  </div>
                </div>
                <div v-else class="col-md py-1">
                  <div class="form-group">
                    <label for="Kapasitas">Kapasitas</label>
                    <input v-model="item.capacity" type="text" class="form-control" id="Kapasitas"
                      placeholder="Kapasitas" />
                  </div>
                  <div class="form-group">
                    <label for="Jumlah">Jumlah Operasi</label>
                    <input v-model="item.sum_operation" type="number" class="form-control" id="Jumlah"
                      placeholder="Jumlah Operasi" />
                  </div>
                </div>
                <div class="col-md py-1">
                  <div class="form-group">
                    <label for="Percent">Percent Cal</label>
                    <input v-model="item.percent_cal" type="number" class="form-control" id="Percent" step="0.01"
                      placeholder="Percent Cal" />
                  </div>
                </div>
                <div class="col-md py-1">
                  <div class="form-group">
                    <label for="floatingInput">Factor Cal</label>
                    <select class="form-select" v-model="item.factor_cal">
                      <option v-for="item in maintStatus" :key="item.id" :value="item">
                        {{ item }}
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
import moment from "moment";
import login_i from "@/assets/icons/menu/upload.svg";
import logoPDAM from "@/assets/icons/logo-pdam.png";

export default {
  name: "AddStation",
  components: {
    Header,
    // logoPDAM
  },

  data() {
    return {
      login_i,
      dragging: false,
      snLoggers: [],
      snModems: [],
      maintStatus: [false, true],
      file: "",
      reader: "",
      produksis: [],
      item: {
        station_name: null,
        location: null,
        topic: null,
        percent_cal: 0,
        factor_cal: true,
        maintenance_status: false,
        elevation: 0,
        sn_modem: null,
        sn_logger: null,
        image: null,
        latitude: null,
        longitude: null,
        nameplate_head: null,
        sum_operation: null,
        capacity: null,
        interzone: null,
        max_flow: null,
        pipe_diameter: null,
        unit_price: null,
        sensor_size: null,
        logger_type: 1,
        created_by: null,
        balai: null,

      },
    };
  },
  methods: {
    removeFile() {
      this.item.image = null;
      this.fileName = '';
      const fileInput = this.$el.querySelector('input[type="file"]');
      if (fileInput) {
        fileInput.value = '';
      }
    },
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

    fileSelected(event) {
      this.file = event.target.files.item(0);
      this.reader = new FileReader();
      this.reader.addEventListener("load", this.imageLoaded);
      this.reader.readAsDataURL(this.file);
    },
    imageLoaded(event) {
      this.imagePath = event.target.result;
    },
    // async submitStation() {
    //   try {
    //     const config = {
    //       headers: {
    //         'Content-Type': 'application/json',
    //         Authorization: `Bearer ${this.token}`,
    //       },
    //     };

    //     const loggerTypeId = this.item.logger_type && this.item.logger_type.id ? this.item.logger_type.id : this.item.logger_type;
    //     const balaiId = this.item.balai && this.item.balai.id ? this.item.balai.id : this.item.balai;

    //     const updatedItem = {
    //       ...this.item,
    //       logger_type: loggerTypeId,
    //       balai: balaiId,
    //     };

    //     await axios.post(`${this.$baseURL}/pdam/station/`, updatedItem, config);
    //     this.$router.push({ name: "Station" });
    //   } catch (error) {
    //     if (error.response && (error.response.status === 401 || error.response.status === 403)) {
    //       this.logoutUser();
    //     } else {
    //       console.error('Error msg: ', error);
    //     }
    //   }
    // },

    async submitStation() {
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
        } else {
          // If no image selected, send logoPDAM or handle appropriately
          // For example, sending a default image or null
          const response = await fetch(logoPDAM);
          const blob = await response.blob();
          formData.append('image', new File([blob], 'logoPDAM.png', { type: 'image/png' }));
        }

        const loggerTypeId = this.item.logger_type && this.item.logger_type.id ? this.item.logger_type.id : this.item.logger_type;
        const balaiId = this.item.balai && this.item.balai.id ? this.item.balai.id : this.item.balai;

        const updatedItem = {
          ...this.item,
          logger_type: loggerTypeId,
          balai: balaiId,
          // image: this.item.image, // Include the 'image' field, even if it's null
        };

        for (const key in updatedItem) {
          formData.append(key, updatedItem[key]);
        }
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${this.token}`,
          },
        };

        await axios.post(`${this.$baseURL}/pdam/station/`, formData, config);

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


    var date = new Date();
    this.created_at = moment(date).format("YYYY-MM-DDThh:mm");
  },
  computed: {
    extension() {
      return this.file ? this.file.name.split(".").pop() : "";
    },
  },
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
