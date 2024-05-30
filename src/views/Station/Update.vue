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
            Edit Data Pos {{ item.station_name }}
          </div>
          <div class="col-md d-flex justify-content-end">
            <router-link
              :to="{ name: 'Station' }"
              type="button"
              class="btn btn-light border mx-4 bg-white"
              >Cancel</router-link
            >
            <button class="btn btn-primary" type="submit">Update</button>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="card">
              <div class="card-header">Data Stasiun</div>
              <div class="card-body">
                <div class="col-md pb-3">
                  <div class="form-group">
                    <label for="inputNaPo">Nama Pos*</label>
                    <input
                      v-model="item.station_name"
                      type="text"
                      class="form-control"
                      id="inputNaPo"
                      placeholder="Nama Pos"
                      required
                    />
                  </div>
                </div>
                <div class="col-md pb-3">
                  <div class="form-group">
                    <label for="inputLo">Lokasi*</label>
                    <input
                      v-model="item.location"
                      type="text"
                      class="form-control"
                      id="inputLo"
                      placeholder="Lokasi"
                      required
                    />
                  </div>
                </div>
            
                <div class="col-md pb-3">
                  <div class="form-group">
                    <label for="inputLo">Latitude*</label>
                    <input
                      v-model="item.latitude"
                      type="number"
                      class="form-control"
                      id="inputLo"
                      placeholder="Latitude"
                      step="0.000000001"
                      required
                    />
                  </div>
                </div>
                <div class="col-md pb-3">
                  <div class="form-group">
                    <label for="inputLo">Longitude*</label>
                    <input
                      v-model="item.longitude"
                      type="number"
                      class="form-control"
                      id="inputLo"
                      placeholder="Longitude"
                      step="0.000000001"
                      required
                    />
                  </div>
                </div>
             
                <div class="col-md pb-3">
                  <div class="form-group">
                    <label for="inputNaPe">Nama Pengamat</label>
                    <input
                      v-model="item.observator"
                      type="text"
                      class="form-control"
                      id="inputNaPe"
                      placeholder="Nama Pengamat"
                    />
                  </div>
                </div>
                <div class="col-md pb-3">
                  <div class="form-group">
                    <label for="inputNoPe">No Pengamat</label>
                    <input
                      v-model="item.observator_phone"
                      type="text"
                      class="form-control"
                      id="inputNoPe"
                      placeholder="Nama Pengamat"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="card">
              <!-- --- -->
              <div class="card-header">Foto Stasiun</div>
              <div class="card-body">
                <div v-if="!file">
                  <div
                    :class="['dropZone', dragging ? 'dropZone-over' : '']"
                    @dragenter="dragging = true"
                    @dragleave="dragging = false"
                  >
                    <div class="dropZone-info" @drag="onChange">
                      <img
                        v-if="item.image"
                        :src="item.image"
                        style="max-width: 120px; max-height: 60px"
                      />
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
                    <img
                      v-if="item.image"
                      :src="item.image"
                      style="max-width: 120px; max-height: 60px"
                    />
                    <span class="dropZone-filename p-1">{{ file.name }}</span>
                    <button
                      type="button"
                      class="btn btn-primary removeFile p-1"
                      @click="removeFile"
                    >
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
                      <label for="floatingInput">Serial Number Logger</label
                      ><input
                        v-model="item.sn_logger"
                        type="text"
                        class="form-control"
                        placeholder="Serial Number Logger"
                      />
                    </div>
                  </div>
                </div>
                <div class="col-md">
                  <div class="col-md pb-3">
                    <div class="form-group">
                      <label for="floatingInput">Serial Number Modem</label>
                      <input
                        v-model="item.sn_modem"
                        type="text"
                        class="form-control"
                        placeholder="Serial Number Modem"
                      />
                    </div>
                  </div>
                </div>

                <div class="col-md">
                  <div class="col-md pb-3">
                    <div class="form-group">
                      <label for="floatingInput">Topic MQTT</label>
                      <input
                        v-model="item.topic_MQTT"
                        type="text"
                        class="form-control"
                        placeholder="Topic MQTT"
                      />
                    </div>
                  </div>
                </div>

                <div class="col-md">
                  <div class="col-md pb-3">
                    <div class="form-group">
                      <label for="floatingInput">Maintenance Status</label>
                      <select
                        class="form-select"
                        v-model="item.maintenance"
                      >
                        <option
                          v-for="item in maintStatus"
                          :key="item.id"
                          :value="item"
                        >
                          {{ item }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>

                <div class="col-md">
                  <div class="col-md pb-3">
                    <div class="form-group">
                      <label for="floatingInput">Maintenance Date</label
                      ><input
                        v-model="item.created_at"
                        type="datetime-local"
                        class="form-control"
                        placeholder="Maintenance Date"
                      />
                    </div>
                  </div>
                </div>

                <div class="col-md">
                  <div class="col-md pb-3">
                    <div class="form-group">
                      <label for="floatingInput">Hide Status</label>
                      <select
                        class="form-select"
                        v-model="item.hide"
                      >
                        <option
                          v-for="item in hideStatus"
                          :key="item.id"
                          :value="item"
                        >
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
                      <textarea
                        v-model="item.note"
                        class="form-control"
                        id="exampleFormControlTextarea1"
                        rows="2"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- --- -->
      
      </div>
    </form>
  </div>
</template>

<script>
import Header from "@/components/Public/Header.vue";
import axios from "axios";
import moment from "moment";
import login_i from "@/assets/icons/menu/upload.svg";

export default {
  name: "UpdateStation",
  components: {
    Header,
  },
  data() {
    return {
      totalSensor: 1,
      dragging: false,
      login_i,
      channels: [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      ],
      balais: [],
      provinsis: [],
      sensorTypes: [],
      stationTypes: [],
      snLoggers: [],
      snModems: [],
      maintStatus: [false, true],
      hideStatus: [false, true],
      file: "",
      reader: "",

      debit: {
        kons_a: null,
        kons_b: null,
        tma_0: null,
      },

      item: {
        station_name: null,
        location: "",        
        sn_logger: null,
        sn_modem: null,
        latitude: null,
        longitude: null,
        image: null,
        topic_MQTT: "",
        observator: "",
        observator_phone: "",
        map_icon: null,
        created_by: null,
        maintenance: false,
        hide: false,
        note: null,
        // DATA -------------------
        created_at: "",
   
      },
    };
  },

  methods: {
    // Drag n drop
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
    // Drag n drop end
    fileSelected(event) {
      this.file = event.target.files.item(0);
      this.reader = new FileReader();
      this.reader.addEventListener("load", this.imageLoaded);
      this.reader.readAsDataURL(this.file);
    },
    imageLoaded(event) {
      this.item.image = event.target.result;
    },
    localDate(date) {
      var x = new Date(date);
      var d = x.getDate();
      var m = x.getMonth() + 1; //Month from 0 to 11
      var y = x.getFullYear();
      var h = x.getHours();
      var min = x.getMinutes();

      return (
        y +
        "-" +
        (m <= 9 ? "0" + m : m) +
        "-" +
        (d <= 9 ? "0" + d : d) +
        "T" +
        (h <= 9 ? "0" + h : h) +
        ":" +
        (min <= 9 ? "0" + min : min)
      );
    },

    async updateStation() {
      const form = new FormData();
      form.append(this.file, this.file.name);

      for (let i = 2; i <= 20; i++) {
        this.item[`sensor${i}_act`] = this.totalSensor >= i;
      }

      if (
        this.debit.kons_a == null ||
        this.debit.kons_b == null ||
        this.debit.tma_0 == null ||
        this.debit.kons_a == "" ||
        this.debit.kons_b == "" ||
        this.debit.tma_0 == ""
      ) {
        await axios
          .put(
            `${this.$baseURL}/station/${this.$route.params.id}`,
            this.item,
            {
              headers: {
                Authorization: `Token ${this.token}`,
              },
            }
          )
          .then((r) => {
            if (r.status == 200) {
              this.$router.push({ name: "Station" });
            }
          })
          .catch(function (e) {
            console.log(e);
          });
      } else {
        await axios
          .all([
            axios.put(
              `${this.$baseURL}/station/${this.$route.params.id}`,
              this.item,
              {
                headers: {
                  Authorization: `Token ${this.token}`,
                },
              }
            ),
           
          ])
          .then(
            axios.spread((r1, r2) => {
              if (r1.status || r2.status == 200) {
                this.$router.push({ name: "Station" });
              }
            })
          )
          .catch(function (e) {
            console.log(e);
          });
      }
      console.log(this.item);
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
    async delete(id) {
      await axios
        .delete(`${this.$baseURL}/debit-setup-detail/${id}`, {
          headers: {
            Authorization: `Token ${this.token}`,
          },
        })
        .then((r) => {
          if (r.status == 204) {
            this.$router.push({ name: "Station" });
          }
        });
    },
    deleteData(id) {
      this.$swal({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          this.debit.kons_a = null;
          this.debit.kons_b = null;
          this.debit.tma_0 = null;
          this.delete(id);
        }
      });
    },
  },

  created() {
    this.gAuthStation();
  },
  async mounted() {
    //
    await axios
      .all([
        axios.get(
          `${this.$baseURL}/station/${this.$route.params.id}`,
          {
            headers: {
              Authorization: `Token ${this.token}`,
            },
          }
        ),
        // axios.get(`${this.$baseURL}/debit-setup/${this.$route.params.id}`, {
        //   headers: {
        //     Authorization: `Token ${this.token}`,
        //   },
        // }),
      ])
      .then(
        axios.spread((r1) => {
          this.item = r1.data;
       
          // console.log(this.debit);
        })
      );

    this.item.image = `${this.item.image}`;

    // this.gBalai();
    // this.gProvinsi();
    // this.gStType();
    // this.gSensor();

    var date = new Date();

    this.item.created_at = moment(date).format("YYYY-MM-DDThh:mm");

    const getBase64FromUrl = async (url) => {
      const data = await fetch(url);
      const blob = await data.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64data = reader.result;
          resolve(base64data);
        };
      });
    };

    if (typeof this.item.image == "string") {
      this.item.image = await getBase64FromUrl(
        this.item.image
      );
    }

    let le = 0;

    for (let i = 1; i <= 20; i++) {
      if (this.item[`sensor${i}_act`]) {
        le++;
      }
    }

    this.totalSensor = le;
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

.math .frac > *:first-child {
  border-bottom: 2px solid currentColor;
  padding-bottom: 5px;
}

.math .frac > *:last-child {
  padding-top: 5px;
}

.math .frac > * {
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
  clip-path: polygon(
    0 50%,
    2px 50%,
    50% calc(100% - 2px),
    calc(100% - 2px) 0,
    100% 0,
    100% 2px,
    calc(50% + 2px) 100%,
    calc(50% - 2px) 100%,
    0 calc(50% + 2px)
  );
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

.cs > sup {
  position: absolute;
  bottom: calc(100% - 10px);
  left: 50%;
  transform: translate(-50%);
  width: max-content;
}

.cs > sub {
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
<style scoped src="@/assets/css/figma.css">
</style>
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
