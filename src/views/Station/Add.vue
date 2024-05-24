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
              <router-link
                :to="{ name: 'Station' }"
                type="button"
                class="btn btn-light border mx-4 bg-white"
                >Cancel</router-link
              >
              <button class="btn btn-primary" type="submit">Simpan</button>
            </div>
          </div>
        </div>

        <div class="row mt-1">
          <div class="col-md-6">
            <div class="card">
              <div class="card-header">Data Stasiun</div>
              <div class="card-body">
                <div class="col-md pb-3" v-if="role == 'is_superuser'">
                  <label for="floatingInput">Balai*</label>
                  <select class="form-select" v-model="balaiStation" required>
                    <option
                      v-for="item in balais"
                      :key="item.id"
                      :value="item.id"
                    >
                      {{ item.balai }}
                    </option>
                  </select>
                </div>
                <div class="col-md pb-3">
                  <label for="floatingInput">Provinsi*</label>
                  <select class="form-select" v-model="provinsi" required>
                    <option
                      v-for="item in provinsis"
                      :key="item.id"
                      :value="item.id"
                    >
                      {{ item.provinsi }}
                    </option>
                  </select>
                </div>
                <div class="col-md pb-3">
                  <label for="floatingInput">Jenis pos*</label>
                  <select class="form-select" v-model="station_type" required>
                    <option
                      v-for="item in stationTypes"
                      :key="item.id"
                      :value="item.id"
                    >
                      {{ item.types }}
                    </option>
                  </select>
                </div>
                <div class="col-md pb-3">
                  <div class="form-group">
                    <label for="inputNaPo">Nama Pos*</label>
                    <input
                      v-model="station_name"
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
                      v-model="location"
                      type="text"
                      class="form-control"
                      id="inputLo"
                      placeholder="Lokasi"
                      required
                    />
                  </div>
                </div>
                <div class="col-md pb-3" v-if="station_type == 2">
                  <div class="form-group">
                    <label for="inputLo">Sungai</label>
                    <input
                      v-model="sungai"
                      type="text"
                      class="form-control"
                      id="inputLo"
                      placeholder="Sungai"
                    />
                  </div>
                </div>
                <div class="col-md pb-3">
                  <div class="form-group">
                    <label for="inputLo">Latitude*</label>
                    <input
                      v-model="latitude"
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
                      v-model="longitude"
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
                    <label for="inputLo">Elevasi </label>
                    <input
                      v-model="elevasi"
                      type="number"
                      class="form-control"
                      id="inputLo"
                      placeholder="Elevasi (m)"
                    />
                  </div>
                </div>
                <div class="col-md pb-3">
                  <div class="form-group">
                    <label for="inputNaPe">Nama Pengamat</label>
                    <input
                      v-model="observator"
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
                      v-model="observator_phone"
                      type="text"
                      class="form-control"
                      id="inputNoPe"
                      placeholder="Nama Pengamat"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card">
              <div class="card-header">Foto Stasiun</div>
              <div class="card-body">
                <!-- -----DRAND AND DROP----- -->

                <div v-if="!file">
                  <div
                    :class="['dropZone', dragging ? 'dropZone-over' : '']"
                    @dragenter="dragging = true"
                    @dragleave="dragging = false"
                  >
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
                    <img
                      v-if="imagePath"
                      :src="imagePath"
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

                <!-- <div class="uploadedFile-info">
                  <div>fileName: {{ file.name }}</div>
                  <div>fileZise(bytes): {{ file.size }}</div>
                  <div>extension：{{ extension }}</div>
                </div> -->
                <!-- -------- -->
              </div>
            </div>
            <div class="card pt-1" v-if="role == 'is_superuser'">
              <div class="card-header">Data Logger</div>
              <div class="card-body">
                <div class="col-md">
                  <div class="col-md pb-3">
                    <div class="form-group">
                      <label for="floatingInput">Serial Number Logger</label
                      ><input
                        v-model="sn_logger"
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
                        v-model="sn_modem"
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
                        v-model="topic_MQTT"
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
                      <select class="form-select" v-model="maintenance">
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
                        v-model="created_at"
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
                      <label for="floatingInput">Hide Status</label
                      ><select class="form-select" v-model="hide">
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
                        v-model="note"
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
        <div class="col-md">
          <div class="card p-3">
            <div class="card-header">Data Stasiun</div>
            <div class="card-body pb-0">
              <div class="row">
                <div class="col-md-6">
                  <div class="col-md pb-3">
                    <div class="form-group">
                      <label for="floatingInput">Jumlah Sensor</label>
                      <input
                        v-model="totalSensor"
                        type="number"
                        class="form-control"
                        placeholder="Jumlah Sensor"
                      />
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="col-md">
                    <div class="col-md pb-3">
                      <div class="form-group">
                        <label for="floatingInput">Acuan Siaga</label>
                        <select class="form-select" v-model="siaga">
                          <option value="">---</option>
                          <option
                            v-for="item in sensorTypes"
                            :key="item.id"
                            :value="item.id"
                          >
                            {{ item.sensor_label }}
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="px-3">
              <div class="card">
                <div class="card-header">Sensor 1</div>
                <div class="card-body">
                  <div class="col">
                    <div class="column" :class="{ 'd-none': !sensor1_act }">
                      <div class="row">
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Jenis Sensor*</label>
                              <select
                                class="form-select"
                                v-model="sensor1_type"
                                :disabled="!sensor1_act ? true : false"
                                required
                              >
                                <option
                                  v-for="item in sensorTypes"
                                  :key="item.id"
                                  :value="item.id"
                                >
                                  {{ item.sensor_label }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Sensor Mix</label>
                              <select
                                class="form-select"
                                v-model="sensor1_mix"
                                :disabled="!sensor1_act ? true : false"
                              >
                                <option selected value>no-mix</option>
                                <option
                                  v-for="item in sensorTypes"
                                  :key="item.id"
                                  :value="item.id"
                                >
                                  {{ item.sensor_label }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">CH Logger*</label>
                              <select
                                class="form-select"
                                v-model="sensor1_ch"
                                :disabled="!sensor1_act ? true : false"
                                required
                              >
                                <option
                                  v-for="(item, index) in channels"
                                  :key="index"
                                  :value="item"
                                >
                                  {{ item }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Siaga 3</label>
                              <input
                                v-model="sensor1_w_lvl_1"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 3 (m)"
                                step="0.001"
                                :disabled="!sensor1_act ? true : false"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Siaga 2</label>
                              <input
                                v-model="sensor1_w_lvl_2"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 2 (m)"
                                step="0.001"
                                :disabled="!sensor1_act ? true : false"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Siaga 1</label>
                              <input
                                v-model="sensor1_w_lvl_3"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 1 (m)"
                                step="0.001"
                                :disabled="!sensor1_act ? true : false"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- --- -->
            <div class="px-3">
              <div class="card" :class="{ 'd-none': totalSensor < 2 }">
                <div class="card-header">Sensor 2</div>
                <div class="card-body">
                  <div class="col">
                    <div class="column" :class="{ 'd-none': totalSensor < 2 }">
                      <div class="row">
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Jenis Sensor</label>
                              <select
                                class="form-select"
                                v-model="sensor2_type"
                                :disabled="totalSensor < 2 ? true : false"
                                required
                              >
                                <option
                                  v-for="item in sensorTypes"
                                  :key="item.id"
                                  :value="item.id"
                                >
                                  {{ item.sensor_label }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Sensor Mix</label>
                              <select
                                class="form-select"
                                v-model="sensor2_mix"
                                :disabled="totalSensor < 2 ? true : false"
                              >
                                <option selected value>no-mix</option>

                                <option
                                  v-for="item in sensorTypes"
                                  :key="item.id"
                                  :value="item.id"
                                >
                                  {{ item.sensor_label }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">CH Logger</label>
                              <select
                                class="form-select"
                                v-model="sensor2_ch"
                                :disabled="totalSensor < 2 ? true : false"
                                required
                              >
                                <option
                                  v-for="(item, index) in channels"
                                  :key="index"
                                  :value="item"
                                >
                                  {{ item }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Siaga 3</label>
                              <input
                                v-model="sensor2_w_lvl_1"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 3 (m)"
                                step="0.001"
                                :disabled="totalSensor < 2 ? true : false"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Siaga 2</label>
                              <input
                                v-model="sensor2_w_lvl_2"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 2 (m)"
                                step="0.001"
                                :disabled="totalSensor < 2 ? true : false"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Siaga 1</label>
                              <input
                                v-model="sensor2_w_lvl_3"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 1 (m)"
                                step="0.001"
                                :disabled="totalSensor < 2 ? true : false"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- -S3- -->
            <div class="px-3">
              <div class="card" :class="{ 'd-none': totalSensor < 3 }">
                <div class="card-header">Sensor 3</div>
                <div class="card-body">
                  <div class="col">
                    <div class="column" :class="{ 'd-none': totalSensor < 3 }">
                      <div class="row">
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Jenis Sensor</label>
                              <select
                                class="form-select"
                                v-model="sensor3_type"
                                :disabled="totalSensor < 3 ? true : false"
                                required
                              >
                                <option
                                  v-for="item in sensorTypes"
                                  :key="item.id"
                                  :value="item.id"
                                >
                                  {{ item.sensor_label }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Sensor Mix</label>
                              <select
                                class="form-select"
                                v-model="sensor3_mix"
                                :disabled="totalSensor < 3 ? true : false"
                              >
                                <option selected value>no-mix</option>

                                <option
                                  v-for="item in sensorTypes"
                                  :key="item.id"
                                  :value="item.id"
                                >
                                  {{ item.sensor_label }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">CH Logger</label>
                              <select
                                class="form-select"
                                v-model="sensor3_ch"
                                :disabled="totalSensor < 3 ? true : false"
                                required
                              >
                                <option
                                  v-for="(item, index) in channels"
                                  :key="index"
                                  :value="item"
                                >
                                  {{ item }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Siaga 3</label>
                              <input
                                v-model="sensor3_w_lvl_1"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 3 (m)"
                                step="0.001"
                                :disabled="totalSensor < 3 ? true : false"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Siaga 2</label>
                              <input
                                v-model="sensor3_w_lvl_2"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 2 (m)"
                                step="0.001"
                                :disabled="totalSensor < 3 ? true : false"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Siaga 1</label>
                              <input
                                v-model="sensor3_w_lvl_3"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 1 (m)"
                                step="0.001"
                                :disabled="totalSensor < 3 ? true : false"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- -S4- -->
            <div class="px-3">
              <div class="card" :class="{ 'd-none': totalSensor < 4 }">
                <div class="card-header">Sensor 4</div>
                <div class="card-body">
                  <div class="col">
                    <div class="column" :class="{ 'd-none': totalSensor < 4 }">
                      <div class="row">
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Jenis Sensor</label>
                              <select
                                class="form-select"
                                v-model="sensor4_type"
                                :disabled="totalSensor < 4 ? true : false"
                                required
                              >
                                <option
                                  v-for="item in sensorTypes"
                                  :key="item.id"
                                  :value="item.id"
                                >
                                  {{ item.sensor_label }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Sensor Mix</label>
                              <select
                                class="form-select"
                                v-model="sensor4_mix"
                                :disabled="totalSensor < 4 ? true : false"
                              >
                                <option selected value>no-mix</option>
                                <option
                                  v-for="item in sensorTypes"
                                  :key="item.id"
                                  :value="item.id"
                                >
                                  {{ item.sensor_label }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">CH Logger</label>
                              <select
                                class="form-select"
                                v-model="sensor4_ch"
                                :disabled="totalSensor < 4 ? true : false"
                                required
                              >
                                <option
                                  v-for="(item, index) in channels"
                                  :key="index"
                                  :value="item"
                                >
                                  {{ item }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Siaga 3</label>
                              <input
                                v-model="sensor4_w_lvl_1"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 3 (m)"
                                step="0.001"
                                :disabled="totalSensor < 4 ? true : false"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Siaga 2</label>
                              <input
                                v-model="sensor4_w_lvl_2"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 2 (m)"
                                step="0.001"
                                :disabled="totalSensor < 4 ? true : false"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Siaga 1</label>
                              <input
                                v-model="sensor4_w_lvl_3"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 1 (m)"
                                step="0.001"
                                :disabled="totalSensor < 4 ? true : false"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- -S5- -->
            <div class="px-3">
              <div class="card" :class="{ 'd-none': totalSensor < 5 }">
                <div class="card-header">Sensor 5</div>
                <div class="card-body">
                  <div class="col">
                    <div class="column" :class="{ 'd-none': totalSensor < 5 }">
                      <div class="row">
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Jenis Sensor</label>
                              <select
                                class="form-select"
                                v-model="sensor5_type"
                                :disabled="totalSensor < 5 ? true : false"
                                required
                              >
                                <option
                                  v-for="item in sensorTypes"
                                  :key="item.id"
                                  :value="item.id"
                                >
                                  {{ item.sensor_label }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Sensor Mix</label>
                              <select
                                class="form-select"
                                v-model="sensor5_mix"
                                :disabled="totalSensor < 5 ? true : false"
                              >
                                <option selected value>no-mix</option>
                                <option
                                  v-for="item in sensorTypes"
                                  :key="item.id"
                                  :value="item.id"
                                >
                                  {{ item.sensor_label }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">CH Logger</label>
                              <select
                                class="form-select"
                                v-model="sensor5_ch"
                                :disabled="totalSensor < 5 ? true : false"
                                required
                              >
                                <option
                                  v-for="(item, index) in channels"
                                  :key="index"
                                  :value="item"
                                >
                                  {{ item }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Siaga 3</label>
                              <input
                                v-model="sensor5_w_lvl_1"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 3 (m)"
                                step="0.001"
                                :disabled="totalSensor < 5 ? true : false"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Siaga 2</label>
                              <input
                                v-model="sensor5_w_lvl_2"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 2 (m)"
                                step="0.001"
                                :disabled="totalSensor < 5 ? true : false"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Siaga 1</label>
                              <input
                                v-model="sensor5_w_lvl_3"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 1 (m)"
                                step="0.001"
                                :disabled="totalSensor < 5 ? true : false"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- -S6- -->
            <div class="px-3">
              <div class="card" :class="{ 'd-none': totalSensor < 6 }">
                <div class="card-header">Sensor 6</div>
                <div class="card-body">
                  <div class="col">
                    <div class="column" :class="{ 'd-none': totalSensor < 6 }">
                      <div class="row">
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Jenis Sensor</label>
                              <select
                                class="form-select"
                                v-model="sensor6_type"
                                :disabled="totalSensor < 6 ? true : false"
                                required
                              >
                                <option
                                  v-for="item in sensorTypes"
                                  :key="item.id"
                                  :value="item.id"
                                >
                                  {{ item.sensor_label }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Sensor Mix</label>
                              <select
                                class="form-select"
                                v-model="sensor6_mix"
                                :disabled="totalSensor < 6 ? true : false"
                              >
                                <option selected value>no-mix</option>
                                <option
                                  v-for="item in sensorTypes"
                                  :key="item.id"
                                  :value="item.id"
                                >
                                  {{ item.sensor_label }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">CH Logger</label>
                              <select
                                class="form-select"
                                v-model="sensor6_ch"
                                :disabled="totalSensor < 6 ? true : false"
                                required
                              >
                                <option
                                  v-for="(item, index) in channels"
                                  :key="index"
                                  :value="item"
                                >
                                  {{ item }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Siaga 3</label>
                              <input
                                v-model="sensor6_w_lvl_1"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 3 (m)"
                                step="0.001"
                                :disabled="totalSensor < 6 ? true : false"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Siaga 2</label>
                              <input
                                v-model="sensor6_w_lvl_2"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 2 (m)"
                                step="0.001"
                                :disabled="totalSensor < 6 ? true : false"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Siaga 1</label>
                              <input
                                v-model="sensor6_w_lvl_3"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 1 (m)"
                                step="0.001"
                                :disabled="totalSensor < 6 ? true : false"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- -S7- -->
            <div class="px-3">
              <div class="card" :class="{ 'd-none': totalSensor < 7 }">
                <div class="card-header">Sensor 7</div>
                <div class="card-body">
                  <div class="col">
                    <div class="column" :class="{ 'd-none': totalSensor < 7 }">
                      <div class="row">
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Jenis Sensor</label>
                              <select
                                class="form-select"
                                v-model="sensor7_type"
                                :disabled="totalSensor < 7 ? true : false"
                                required
                              >
                                <option
                                  v-for="item in sensorTypes"
                                  :key="item.id"
                                  :value="item.id"
                                >
                                  {{ item.sensor_label }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Sensor Mix</label>
                              <select
                                class="form-select"
                                v-model="sensor7_mix"
                                :disabled="totalSensor < 7 ? true : false"
                              >
                                <option selected value>no-mix</option>
                                <option
                                  v-for="item in sensorTypes"
                                  :key="item.id"
                                  :value="item.id"
                                >
                                  {{ item.sensor_label }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">CH Logger</label>
                              <select
                                class="form-select"
                                v-model="sensor7_ch"
                                :disabled="totalSensor < 7 ? true : false"
                                required
                              >
                                <option
                                  v-for="(item, index) in channels"
                                  :key="index"
                                  :value="item"
                                >
                                  {{ item }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Siaga 3</label>
                              <input
                                v-model="sensor7_w_lvl_1"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 3 (m)"
                                step="0.001"
                                :disabled="totalSensor < 7 ? true : false"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Siaga 2</label>
                              <input
                                v-model="sensor7_w_lvl_2"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 2 (m)"
                                step="0.001"
                                :disabled="totalSensor < 7 ? true : false"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Siaga 1</label>
                              <input
                                v-model="sensor7_w_lvl_3"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 1 (m)"
                                step="0.001"
                                :disabled="totalSensor < 7 ? true : false"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- -S8- -->
            <div class="px-3">
              <div class="card" :class="{ 'd-none': totalSensor < 8 }">
                <div class="card-header">Sensor 8</div>
                <div class="card-body">
                  <div class="col">
                    <div class="column" :class="{ 'd-none': totalSensor < 8 }">
                      <div class="row">
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Jenis Sensor</label>
                              <select
                                class="form-select"
                                v-model="sensor8_type"
                                :disabled="totalSensor < 8 ? true : false"
                                required
                              >
                                <option
                                  v-for="item in sensorTypes"
                                  :key="item.id"
                                  :value="item.id"
                                >
                                  {{ item.sensor_label }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Sensor Mix</label>
                              <select
                                class="form-select"
                                v-model="sensor8_mix"
                                :disabled="totalSensor < 8 ? true : false"
                              >
                                <option selected value>no-mix</option>
                                <option
                                  v-for="item in sensorTypes"
                                  :key="item.id"
                                  :value="item.id"
                                >
                                  {{ item.sensor_label }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">CH Logger</label>
                              <select
                                class="form-select"
                                v-model="sensor8_ch"
                                :disabled="totalSensor < 8 ? true : false"
                                required
                              >
                                <option
                                  v-for="(item, index) in channels"
                                  :key="index"
                                  :value="item"
                                >
                                  {{ item }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Siaga 3</label>
                              <input
                                v-model="sensor8_w_lvl_1"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 3 (m)"
                                step="0.001"
                                :disabled="totalSensor < 8 ? true : false"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Siaga 2</label>
                              <input
                                v-model="sensor8_w_lvl_2"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 2 (m)"
                                step="0.001"
                                :disabled="totalSensor < 8 ? true : false"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Siaga 1</label>
                              <input
                                v-model="sensor8_w_lvl_3"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 1 (m)"
                                step="0.001"
                                :disabled="totalSensor < 8 ? true : false"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- -S9- -->
            <div class="px-3">
              <div class="card" :class="{ 'd-none': totalSensor < 9 }">
                <div class="card-header">Sensor 9</div>
                <div class="card-body">
                  <div class="col">
                    <div class="column" :class="{ 'd-none': totalSensor < 9 }">
                      <div class="row">
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Jenis Sensor</label>
                              <select
                                class="form-select"
                                v-model="sensor9_type"
                                :disabled="totalSensor < 9 ? true : false"
                                required
                              >
                                <option
                                  v-for="item in sensorTypes"
                                  :key="item.id"
                                  :value="item.id"
                                >
                                  {{ item.sensor_label }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Sensor Mix</label>
                              <select
                                class="form-select"
                                v-model="sensor9_mix"
                                :disabled="totalSensor < 9 ? true : false"
                              >
                                <option selected value>no-mix</option>
                                <option
                                  v-for="item in sensorTypes"
                                  :key="item.id"
                                  :value="item.id"
                                >
                                  {{ item.sensor_label }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">CH Logger</label>
                              <select
                                class="form-select"
                                v-model="sensor9_ch"
                                :disabled="totalSensor < 9 ? true : false"
                                required
                              >
                                <option
                                  v-for="(item, index) in channels"
                                  :key="index"
                                  :value="item"
                                >
                                  {{ item }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Siaga 3</label>
                              <input
                                v-model="sensor9_w_lvl_1"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 3 (m)"
                                step="0.001"
                                :disabled="totalSensor < 9 ? true : false"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Siaga 2</label>
                              <input
                                v-model="sensor9_w_lvl_2"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 2 (m)"
                                step="0.001"
                                :disabled="totalSensor < 9 ? true : false"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Siaga 1</label>
                              <input
                                v-model="sensor9_w_lvl_3"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 1 (m)"
                                step="0.001"
                                :disabled="totalSensor < 9 ? true : false"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- -S10- -->
            <div class="px-3">
              <div class="card" :class="{ 'd-none': totalSensor < 10 }">
                <div class="card-header">Sensor 10</div>
                <div class="card-body">
                  <div class="col">
                    <div class="column" :class="{ 'd-none': totalSensor < 10 }">
                      <div class="row">
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Jenis Sensor</label>
                              <select
                                class="form-select"
                                v-model="sensor10_type"
                                :disabled="totalSensor < 10 ? true : false"
                                required
                              >
                                <option
                                  v-for="item in sensorTypes"
                                  :key="item.id"
                                  :value="item.id"
                                >
                                  {{ item.sensor_label }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Sensor Mix</label>
                              <select
                                class="form-select"
                                v-model="sensor10_mix"
                                :disabled="totalSensor < 10 ? true : false"
                              >
                                <option selected value>no-mix</option>
                                <option
                                  v-for="item in sensorTypes"
                                  :key="item.id"
                                  :value="item.id"
                                >
                                  {{ item.sensor_label }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">CH Logger</label>
                              <select
                                class="form-select"
                                v-model="sensor10_ch"
                                :disabled="totalSensor < 10 ? true : false"
                                required
                              >
                                <option
                                  v-for="(item, index) in channels"
                                  :key="index"
                                  :value="item"
                                >
                                  {{ item }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Siaga 3</label>
                              <input
                                v-model="sensor10_w_lvl_1"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 3 (m)"
                                step="0.001"
                                :disabled="totalSensor < 10 ? true : false"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Siaga 2</label>
                              <input
                                v-model="sensor10_w_lvl_2"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 2 (m)"
                                step="0.001"
                                :disabled="totalSensor < 10 ? true : false"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Siaga 1</label>
                              <input
                                v-model="sensor10_w_lvl_3"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 1 (m)"
                                step="0.001"
                                :disabled="totalSensor < 10 ? true : false"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- -S11- -->
            <div class="px-3">
              <div class="card" :class="{ 'd-none': totalSensor < 11 }">
                <div class="card-header">Sensor 11</div>
                <div class="card-body">
                  <div class="col">
                    <div class="column" :class="{ 'd-none': totalSensor < 11 }">
                      <div class="row">
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Jenis Sensor</label>
                              <select
                                class="form-select"
                                v-model="sensor11_type"
                                :disabled="totalSensor < 11 ? true : false"
                                required
                              >
                                <option
                                  v-for="item in sensorTypes"
                                  :key="item.id"
                                  :value="item.id"
                                >
                                  {{ item.sensor_label }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Sensor Mix</label>
                              <select
                                class="form-select"
                                v-model="sensor11_mix"
                                :disabled="totalSensor < 11 ? true : false"
                              >
                                <option selected value>no-mix</option>
                                <option
                                  v-for="item in sensorTypes"
                                  :key="item.id"
                                  :value="item.id"
                                >
                                  {{ item.sensor_label }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">CH Logger</label>
                              <select
                                class="form-select"
                                v-model="sensor11_ch"
                                :disabled="totalSensor < 11 ? true : false"
                                required
                              >
                                <option
                                  v-for="(item, index) in channels"
                                  :key="index"
                                  :value="item"
                                >
                                  {{ item }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Siaga 3</label>
                              <input
                                v-model="sensor11_w_lvl_1"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 3 (m)"
                                step="0.001"
                                :disabled="totalSensor < 11 ? true : false"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Siaga 2</label>
                              <input
                                v-model="sensor11_w_lvl_2"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 2 (m)"
                                step="0.001"
                                :disabled="totalSensor < 11 ? true : false"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Siaga 1</label>
                              <input
                                v-model="sensor11_w_lvl_3"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 1 (m)"
                                step="0.001"
                                :disabled="totalSensor < 11 ? true : false"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- -S12- -->
            <div class="px-3">
              <div class="card" :class="{ 'd-none': totalSensor < 12 }">
                <div class="card-header">Sensor 12</div>
                <div class="card-body">
                  <div class="col">
                    <div class="column" :class="{ 'd-none': totalSensor < 12 }">
                      <div class="row">
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Jenis Sensor</label>
                              <select
                                class="form-select"
                                v-model="sensor12_type"
                                :disabled="totalSensor < 12 ? true : false"
                                required
                              >
                                <option
                                  v-for="item in sensorTypes"
                                  :key="item.id"
                                  :value="item.id"
                                >
                                  {{ item.sensor_label }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Sensor Mix</label>
                              <select
                                class="form-select"
                                v-model="sensor12_mix"
                                :disabled="totalSensor < 12 ? true : false"
                              >
                                <option selected value>no-mix</option>
                                <option
                                  v-for="item in sensorTypes"
                                  :key="item.id"
                                  :value="item.id"
                                >
                                  {{ item.sensor_label }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">CH Logger</label>
                              <select
                                class="form-select"
                                v-model="sensor12_ch"
                                :disabled="totalSensor < 12 ? true : false"
                                required
                              >
                                <option
                                  v-for="(item, index) in channels"
                                  :key="index"
                                  :value="item"
                                >
                                  {{ item }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Siaga 3</label>
                              <input
                                v-model="sensor12_w_lvl_1"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 3 (m)"
                                step="0.001"
                                :disabled="totalSensor < 12 ? true : false"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Siaga 2</label>
                              <input
                                v-model="sensor12_w_lvl_2"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 2 (m)"
                                step="0.001"
                                :disabled="totalSensor < 12 ? true : false"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Siaga 1</label>
                              <input
                                v-model="sensor12_w_lvl_3"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 1 (m)"
                                step="0.001"
                                :disabled="totalSensor < 12 ? true : false"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- -S13- -->
            <div class="px-3">
              <div class="card" :class="{ 'd-none': totalSensor < 13 }">
                <div class="card-header">Sensor 13</div>
                <div class="card-body">
                  <div class="col">
                    <div class="column" :class="{ 'd-none': totalSensor < 13 }">
                      <div class="row">
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Jenis Sensor</label>
                              <select
                                class="form-select"
                                v-model="sensor13_type"
                                :disabled="totalSensor < 13 ? true : false"
                                required
                              >
                                <option
                                  v-for="item in sensorTypes"
                                  :key="item.id"
                                  :value="item.id"
                                >
                                  {{ item.sensor_label }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Sensor Mix</label>
                              <select
                                class="form-select"
                                v-model="sensor13_mix"
                                :disabled="totalSensor < 13 ? true : false"
                              >
                                <option selected value>no-mix</option>
                                <option
                                  v-for="item in sensorTypes"
                                  :key="item.id"
                                  :value="item.id"
                                >
                                  {{ item.sensor_label }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">CH Logger</label>
                              <select
                                class="form-select"
                                v-model="sensor13_ch"
                                :disabled="totalSensor < 13 ? true : false"
                                required
                              >
                                <option
                                  v-for="(item, index) in channels"
                                  :key="index"
                                  :value="item"
                                >
                                  {{ item }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Siaga 3</label>
                              <input
                                v-model="sensor13_w_lvl_1"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 3 (m)"
                                step="0.001"
                                :disabled="totalSensor < 13 ? true : false"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Siaga 2</label>
                              <input
                                v-model="sensor13_w_lvl_2"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 2 (m)"
                                step="0.001"
                                :disabled="totalSensor < 13 ? true : false"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Siaga 1</label>
                              <input
                                v-model="sensor13_w_lvl_3"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 1 (m)"
                                step="0.001"
                                :disabled="totalSensor < 13 ? true : false"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- -S14- -->
            <div class="px-3">
              <div class="card" :class="{ 'd-none': totalSensor < 14 }">
                <div class="card-header">Sensor 14</div>
                <div class="card-body">
                  <div class="col">
                    <div class="column" :class="{ 'd-none': totalSensor < 14 }">
                      <div class="row">
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Jenis Sensor</label>
                              <select
                                class="form-select"
                                v-model="sensor14_type"
                                :disabled="totalSensor < 14 ? true : false"
                                required
                              >
                                <option
                                  v-for="item in sensorTypes"
                                  :key="item.id"
                                  :value="item.id"
                                >
                                  {{ item.sensor_label }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Sensor Mix</label>
                              <select
                                class="form-select"
                                v-model="sensor14_mix"
                                :disabled="totalSensor < 14 ? true : false"
                              >
                                <option selected value>no-mix</option>
                                <option
                                  v-for="item in sensorTypes"
                                  :key="item.id"
                                  :value="item.id"
                                >
                                  {{ item.sensor_label }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">CH Logger</label>
                              <select
                                class="form-select"
                                v-model="sensor14_ch"
                                :disabled="totalSensor < 14 ? true : false"
                                required
                              >
                                <option
                                  v-for="(item, index) in channels"
                                  :key="index"
                                  :value="item"
                                >
                                  {{ item }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Siaga 3</label>
                              <input
                                v-model="sensor14_w_lvl_1"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 3 (m)"
                                step="0.001"
                                :disabled="totalSensor < 14 ? true : false"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Siaga 2</label>
                              <input
                                v-model="sensor14_w_lvl_2"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 2 (m)"
                                step="0.001"
                                :disabled="totalSensor < 14 ? true : false"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Siaga 1</label>
                              <input
                                v-model="sensor14_w_lvl_3"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 1 (m)"
                                step="0.001"
                                :disabled="totalSensor < 14 ? true : false"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- -S15- -->
            <div class="px-3">
              <div class="card" :class="{ 'd-none': totalSensor < 15 }">
                <div class="card-header">Sensor 15</div>
                <div class="card-body">
                  <div class="col">
                    <div class="column" :class="{ 'd-none': totalSensor < 15 }">
                      <div class="row">
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Jenis Sensor</label>
                              <select
                                class="form-select"
                                v-model="sensor15_type"
                                :disabled="totalSensor < 15 ? true : false"
                                required
                              >
                                <option
                                  v-for="item in sensorTypes"
                                  :key="item.id"
                                  :value="item.id"
                                >
                                  {{ item.sensor_label }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Sensor Mix</label>
                              <select
                                class="form-select"
                                v-model="sensor15_mix"
                                :disabled="totalSensor < 15 ? true : false"
                              >
                                <option selected value>no-mix</option>
                                <option
                                  v-for="item in sensorTypes"
                                  :key="item.id"
                                  :value="item.id"
                                >
                                  {{ item.sensor_label }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">CH Logger</label>
                              <select
                                class="form-select"
                                v-model="sensor15_ch"
                                :disabled="totalSensor < 15 ? true : false"
                                required
                              >
                                <option
                                  v-for="(item, index) in channels"
                                  :key="index"
                                  :value="item"
                                >
                                  {{ item }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Siaga 3</label>
                              <input
                                v-model="sensor15_w_lvl_1"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 3 (m)"
                                step="0.001"
                                :disabled="totalSensor < 15 ? true : false"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Siaga 2</label>
                              <input
                                v-model="sensor15_w_lvl_2"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 2 (m)"
                                step="0.001"
                                :disabled="totalSensor < 15 ? true : false"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Siaga 1</label>
                              <input
                                v-model="sensor15_w_lvl_3"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 1 (m)"
                                step="0.001"
                                :disabled="totalSensor < 15 ? true : false"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- -S16- -->
            <div class="px-3">
              <div class="card" :class="{ 'd-none': totalSensor < 16 }">
                <div class="card-header">Sensor 16</div>
                <div class="card-body">
                  <div class="col">
                    <div class="column" :class="{ 'd-none': totalSensor < 16 }">
                      <div class="row">
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Jenis Sensor</label>
                              <select
                                class="form-select"
                                v-model="sensor16_type"
                                :disabled="totalSensor < 16 ? true : false"
                                required
                              >
                                <option
                                  v-for="item in sensorTypes"
                                  :key="item.id"
                                  :value="item.id"
                                >
                                  {{ item.sensor_label }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Sensor Mix</label>
                              <select
                                class="form-select"
                                v-model="sensor16_mix"
                                :disabled="totalSensor < 16 ? true : false"
                              >
                                <option selected value>no-mix</option>
                                <option
                                  v-for="item in sensorTypes"
                                  :key="item.id"
                                  :value="item.id"
                                >
                                  {{ item.sensor_label }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">CH Logger</label>
                              <select
                                class="form-select"
                                v-model="sensor16_ch"
                                :disabled="totalSensor < 16 ? true : false"
                                required
                              >
                                <option
                                  v-for="(item, index) in channels"
                                  :key="index"
                                  :value="item"
                                >
                                  {{ item }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Siaga 3</label>
                              <input
                                v-model="sensor16_w_lvl_1"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 3 (m)"
                                step="0.001"
                                :disabled="totalSensor < 16 ? true : false"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Siaga 2</label>
                              <input
                                v-model="sensor16_w_lvl_2"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 2 (m)"
                                step="0.001"
                                :disabled="totalSensor < 16 ? true : false"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Siaga 1</label>
                              <input
                                v-model="sensor16_w_lvl_3"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 1 (m)"
                                step="0.001"
                                :disabled="totalSensor < 16 ? true : false"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- -S17- -->
            <div class="px-3">
              <div class="card" :class="{ 'd-none': totalSensor < 17 }">
                <div class="card-header">Sensor 17</div>
                <div class="card-body">
                  <div class="col">
                    <div class="column" :class="{ 'd-none': totalSensor < 17 }">
                      <div class="row">
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Jenis Sensor</label>
                              <select
                                class="form-select"
                                v-model="sensor17_type"
                                :disabled="totalSensor < 17 ? true : false"
                                required
                              >
                                <option
                                  v-for="item in sensorTypes"
                                  :key="item.id"
                                  :value="item.id"
                                >
                                  {{ item.sensor_label }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Sensor Mix</label>
                              <select
                                class="form-select"
                                v-model="sensor17_mix"
                                :disabled="totalSensor < 17 ? true : false"
                              >
                                <option selected value>no-mix</option>
                                <option
                                  v-for="item in sensorTypes"
                                  :key="item.id"
                                  :value="item.id"
                                >
                                  {{ item.sensor_label }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">CH Logger</label>
                              <select
                                class="form-select"
                                v-model="sensor17_ch"
                                :disabled="totalSensor < 17 ? true : false"
                                required
                              >
                                <option
                                  v-for="(item, index) in channels"
                                  :key="index"
                                  :value="item"
                                >
                                  {{ item }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Siaga 3</label>
                              <input
                                v-model="sensor17_w_lvl_1"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 3 (m)"
                                step="0.001"
                                :disabled="totalSensor < 17 ? true : false"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Siaga 2</label>
                              <input
                                v-model="sensor17_w_lvl_2"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 2 (m)"
                                step="0.001"
                                :disabled="totalSensor < 17 ? true : false"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Siaga 1</label>
                              <input
                                v-model="sensor17_w_lvl_3"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 1 (m)"
                                step="0.001"
                                :disabled="totalSensor < 17 ? true : false"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- -S18- -->
            <div class="px-3">
              <div class="card" :class="{ 'd-none': totalSensor < 18 }">
                <div class="card-header">Sensor 18</div>
                <div class="card-body">
                  <div class="col">
                    <div class="column" :class="{ 'd-none': totalSensor < 18 }">
                      <div class="row">
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Jenis Sensor</label>
                              <select
                                class="form-select"
                                v-model="sensor18_type"
                                :disabled="totalSensor < 18 ? true : false"
                                required
                              >
                                <option
                                  v-for="item in sensorTypes"
                                  :key="item.id"
                                  :value="item.id"
                                >
                                  {{ item.sensor_label }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Sensor Mix</label>
                              <select
                                class="form-select"
                                v-model="sensor18_mix"
                                :disabled="totalSensor < 18 ? true : false"
                              >
                                <option selected value>no-mix</option>
                                <option
                                  v-for="item in sensorTypes"
                                  :key="item.id"
                                  :value="item.id"
                                >
                                  {{ item.sensor_label }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">CH Logger</label>
                              <select
                                class="form-select"
                                v-model="sensor18_ch"
                                :disabled="totalSensor < 18 ? true : false"
                                required
                              >
                                <option
                                  v-for="(item, index) in channels"
                                  :key="index"
                                  :value="item"
                                >
                                  {{ item }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Siaga 3</label>
                              <input
                                v-model="sensor18_w_lvl_1"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 3 (m)"
                                step="0.001"
                                :disabled="totalSensor < 18 ? true : false"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Siaga 2</label>
                              <input
                                v-model="sensor18_w_lvl_2"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 2 (m)"
                                step="0.001"
                                :disabled="totalSensor < 18 ? true : false"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Siaga 1</label>
                              <input
                                v-model="sensor18_w_lvl_3"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 1 (m)"
                                step="0.001"
                                :disabled="totalSensor < 18 ? true : false"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- -S19- -->
            <div class="px-3">
              <div class="card" :class="{ 'd-none': totalSensor < 19 }">
                <div class="card-header">Sensor 19</div>
                <div class="card-body">
                  <div class="col">
                    <div class="column" :class="{ 'd-none': totalSensor < 19 }">
                      <div class="row">
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Jenis Sensor</label>
                              <select
                                class="form-select"
                                v-model="sensor19_type"
                                :disabled="totalSensor < 19 ? true : false"
                                required
                              >
                                <option
                                  v-for="item in sensorTypes"
                                  :key="item.id"
                                  :value="item.id"
                                >
                                  {{ item.sensor_label }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Sensor Mix</label>
                              <select
                                class="form-select"
                                v-model="sensor19_mix"
                                :disabled="totalSensor < 19 ? true : false"
                              >
                                <option selected value>no-mix</option>
                                <option
                                  v-for="item in sensorTypes"
                                  :key="item.id"
                                  :value="item.id"
                                >
                                  {{ item.sensor_label }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">CH Logger</label>
                              <select
                                class="form-select"
                                v-model="sensor19_ch"
                                :disabled="totalSensor < 19 ? true : false"
                                required
                              >
                                <option
                                  v-for="(item, index) in channels"
                                  :key="index"
                                  :value="item"
                                >
                                  {{ item }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Siaga 3</label>
                              <input
                                v-model="sensor19_w_lvl_1"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 3 (m)"
                                step="0.001"
                                :disabled="totalSensor < 19 ? true : false"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Siaga 2</label>
                              <input
                                v-model="sensor19_w_lvl_2"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 2 (m)"
                                step="0.001"
                                :disabled="totalSensor < 19 ? true : false"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Siaga 1</label>
                              <input
                                v-model="sensor19_w_lvl_3"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 1 (m)"
                                step="0.001"
                                :disabled="totalSensor < 19 ? true : false"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- -S20- -->
            <div class="px-3">
              <div class="card" :class="{ 'd-none': totalSensor < 20 }">
                <div class="card-header">Sensor 20</div>
                <div class="card-body">
                  <div class="col">
                    <div class="column" :class="{ 'd-none': totalSensor < 20 }">
                      <div class="row">
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Jenis Sensor</label>
                              <select
                                class="form-select"
                                v-model="sensor20_type"
                                :disabled="totalSensor < 20 ? true : false"
                                required
                              >
                                <option
                                  v-for="item in sensorTypes"
                                  :key="item.id"
                                  :value="item.id"
                                >
                                  {{ item.sensor_label }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Sensor Mix</label>
                              <select
                                class="form-select"
                                v-model="sensor20_mix"
                                :disabled="totalSensor < 20 ? true : false"
                              >
                                <option selected value>no-mix</option>
                                <option
                                  v-for="item in sensorTypes"
                                  :key="item.id"
                                  :value="item.id"
                                >
                                  {{ item.sensor_label }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">CH Logger</label>
                              <select
                                class="form-select"
                                v-model="sensor20_ch"
                                :disabled="totalSensor < 20 ? true : false"
                                required
                              >
                                <option
                                  v-for="(item, index) in channels"
                                  :key="index"
                                  :value="item"
                                >
                                  {{ item }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Siaga 3</label>
                              <input
                                v-model="sensor20_w_lvl_1"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 3 (m)"
                                step="0.001"
                                :disabled="totalSensor < 20 ? true : false"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Siaga 2</label>
                              <input
                                v-model="sensor20_w_lvl_2"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 2 (m)"
                                step="0.001"
                                :disabled="totalSensor < 20 ? true : false"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Siaga 1</label>
                              <input
                                v-model="sensor20_w_lvl_3"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 1 (m)"
                                step="0.001"
                                :disabled="totalSensor < 20 ? true : false"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
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

      station_name: "",
      station_type: null,
      provinsi: null,
      balaiStation: null,
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
      sensor1_act: true,
      sensor1_ch: null,
      sensor1_mix: null,
      sensor1_type: null,
      sensor1_w_lvl_1: null,
      sensor1_w_lvl_2: null,
      sensor1_w_lvl_3: null,
      sensor2_act: false,
      sensor2_ch: null,
      sensor2_mix: null,
      sensor2_type: null,
      sensor2_w_lvl_1: null,
      sensor2_w_lvl_2: null,
      sensor2_w_lvl_3: null,
      sensor3_act: false,
      sensor3_ch: null,
      sensor3_mix: null,
      sensor3_type: null,
      sensor3_w_lvl_1: null,
      sensor3_w_lvl_2: null,
      sensor3_w_lvl_3: null,
      sensor4_act: false,
      sensor4_ch: null,
      sensor4_mix: null,
      sensor4_type: null,
      sensor4_w_lvl_1: null,
      sensor4_w_lvl_2: null,
      sensor4_w_lvl_3: null,
      sensor5_act: false,
      sensor5_ch: null,
      sensor5_mix: null,
      sensor5_type: null,
      sensor5_w_lvl_1: null,
      sensor5_w_lvl_2: null,
      sensor5_w_lvl_3: null,
      sensor6_act: false,
      sensor6_ch: null,
      sensor6_mix: null,
      sensor6_type: null,
      sensor6_w_lvl_1: null,
      sensor6_w_lvl_2: null,
      sensor6_w_lvl_3: null,
      sensor7_act: false,
      sensor7_ch: null,
      sensor7_mix: null,
      sensor7_type: null,
      sensor7_w_lvl_1: null,
      sensor7_w_lvl_2: null,
      sensor7_w_lvl_3: null,
      sensor8_act: false,
      sensor8_ch: null,
      sensor8_mix: null,
      sensor8_type: null,
      sensor8_w_lvl_1: null,
      sensor8_w_lvl_2: null,
      sensor8_w_lvl_3: null,
      sensor9_act: false,
      sensor9_ch: null,
      sensor9_mix: null,
      sensor9_type: null,
      sensor9_w_lvl_1: null,
      sensor9_w_lvl_2: null,
      sensor9_w_lvl_3: null,
      sensor10_act: false,
      sensor10_ch: null,
      sensor10_mix: null,
      sensor10_type: null,
      sensor10_w_lvl_1: null,
      sensor10_w_lvl_2: null,
      sensor10_w_lvl_3: null,
      sensor11_act: false,
      sensor11_ch: null,
      sensor11_mix: null,
      sensor11_type: null,
      sensor11_w_lvl_1: null,
      sensor11_w_lvl_2: null,
      sensor11_w_lvl_3: null,
      sensor12_act: false,
      sensor12_ch: null,
      sensor12_mix: null,
      sensor12_type: null,
      sensor12_w_lvl_1: null,
      sensor12_w_lvl_2: null,
      sensor12_w_lvl_3: null,
      sensor13_act: false,
      sensor13_ch: null,
      sensor13_mix: null,
      sensor13_type: null,
      sensor13_w_lvl_1: null,
      sensor13_w_lvl_2: null,
      sensor13_w_lvl_3: null,
      sensor14_act: false,
      sensor14_ch: null,
      sensor14_mix: null,
      sensor14_type: null,
      sensor14_w_lvl_1: null,
      sensor14_w_lvl_2: null,
      sensor14_w_lvl_3: null,
      sensor15_act: false,
      sensor15_ch: null,
      sensor15_mix: null,
      sensor15_type: null,
      sensor15_w_lvl_1: null,
      sensor15_w_lvl_2: null,
      sensor15_w_lvl_3: null,
      sensor16_act: false,
      sensor16_ch: null,
      sensor16_mix: null,
      sensor16_type: null,
      sensor16_w_lvl_1: null,
      sensor16_w_lvl_2: null,
      sensor16_w_lvl_3: null,
      sensor17_act: false,
      sensor17_ch: null,
      sensor17_mix: null,
      sensor17_type: null,
      sensor17_w_lvl_1: null,
      sensor17_w_lvl_2: null,
      sensor17_w_lvl_3: null,
      sensor18_act: false,
      sensor18_ch: null,
      sensor18_mix: null,
      sensor18_type: null,
      sensor18_w_lvl_1: null,
      sensor18_w_lvl_2: null,
      sensor18_w_lvl_3: null,
      sensor19_act: false,
      sensor19_ch: null,
      sensor19_mix: null,
      sensor19_type: null,
      sensor19_w_lvl_1: null,
      sensor19_w_lvl_2: null,
      sensor19_w_lvl_3: null,
      sensor20_act: false,
      sensor20_ch: null,
      sensor20_mix: null,
      sensor20_type: null,
      sensor20_w_lvl_1: null,
      sensor20_w_lvl_2: null,
      sensor20_w_lvl_3: null,
    };
  },
  methods: {
    // DRAG N DROP
    // onChange(e) {
    //   var files = e.target.files || e.dataTransfer.files;

    //   if (!files.length) {
    //     this.dragging = false;
    //     return;
    //   }

    //   this.createFile(files[0]);
    // },
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

      if (this.totalSensor >= 2) {
        this.sensor2_act = true;
      }
      if (this.totalSensor >= 3) {
        this.sensor3_act = true;
      }
      if (this.totalSensor >= 4) {
        this.sensor4_act = true;
      }
      if (this.totalSensor >= 5) {
        this.sensor5_act = true;
      }
      if (this.totalSensor >= 6) {
        this.sensor6_act = true;
      }
      if (this.totalSensor >= 7) {
        this.sensor7_act = true;
      }
      if (this.totalSensor >= 8) {
        this.sensor8_act = true;
      }
      if (this.totalSensor >= 9) {
        this.sensor9_act = true;
      }
      if (this.totalSensor >= 10) {
        this.sensor10_act = true;
      }
      if (this.totalSensor >= 11) {
        this.sensor11_act = true;
      }
      if (this.totalSensor >= 12) {
        this.sensor12_act = true;
      }
      if (this.totalSensor >= 13) {
        this.sensor13_act = true;
      }
      if (this.totalSensor >= 14) {
        this.sensor14_act = true;
      }
      if (this.totalSensor >= 15) {
        this.sensor15_act = true;
      }
      if (this.totalSensor >= 16) {
        this.sensor16_act = true;
      }
      if (this.totalSensor >= 17) {
        this.sensor17_act = true;
      }
      if (this.totalSensor >= 18) {
        this.sensor18_act = true;
      }
      if (this.totalSensor >= 19) {
        this.sensor19_act = true;
      }
      if (this.totalSensor >= 20) {
        this.sensor20_act = true;
      }
      await axios
        .post(
          `${this.$baseURL}/station-sensor/${this.balai}`,
          {
            station_name: {
              station_name: this.station_name,
              location: this.location,
              sungai: this.sungai,
              latitude: this.latitude,
              longitude: this.longitude,
              elevasi: this.elevasi,
              image: this.imagePath,
              topic_MQTT: this.topic_MQTT,
              observator: this.observator,
              observator_phone: this.observator_phone,
              map_icon: this.map_icon,
              station_type: this.station_type,
              provinsi: this.provinsi,
              balai: this.balaiStation,
              sn_logger: this.sn_logger,
              sn_modem: this.sn_modem,
              siaga: this.siaga,
              created_by: this.created_by,
              maintenance: this.maintenance,
              hide: this.hide,
              note: this.note,
            },
            created_at: this.created_at,
            sensor1_act: this.sensor1_act,
            sensor1_ch: this.sensor1_ch,
            sensor1_mix: this.sensor1_mix,
            sensor1_type: this.sensor1_type,
            sensor1_w_lvl_1: this.sensor1_w_lvl_1,
            sensor1_w_lvl_2: this.sensor1_w_lvl_2,
            sensor1_w_lvl_3: this.sensor1_w_lvl_3,
            sensor2_act: this.sensor2_act,
            sensor2_ch: this.sensor2_ch,
            sensor2_mix: this.sensor2_mix,
            sensor2_type: this.sensor2_type,
            sensor2_w_lvl_1: this.sensor2_w_lvl_1,
            sensor2_w_lvl_2: this.sensor2_w_lvl_2,
            sensor2_w_lvl_3: this.sensor2_w_lvl_3,
            sensor3_act: this.sensor3_act,
            sensor3_ch: this.sensor3_ch,
            sensor3_mix: this.sensor3_mix,
            sensor3_type: this.sensor3_type,
            sensor3_w_lvl_1: this.sensor3_w_lvl_1,
            sensor3_w_lvl_2: this.sensor3_w_lvl_2,
            sensor3_w_lvl_3: this.sensor3_w_lvl_3,
            sensor4_act: this.sensor4_act,
            sensor4_ch: this.sensor4_ch,
            sensor4_mix: this.sensor4_mix,
            sensor4_type: this.sensor4_type,
            sensor4_w_lvl_1: this.sensor4_w_lvl_1,
            sensor4_w_lvl_2: this.sensor4_w_lvl_2,
            sensor4_w_lvl_3: this.sensor4_w_lvl_3,
            sensor5_act: this.sensor5_act,
            sensor5_ch: this.sensor5_ch,
            sensor5_mix: this.sensor5_mix,
            sensor5_type: this.sensor5_type,
            sensor5_w_lvl_1: this.sensor5_w_lvl_1,
            sensor5_w_lvl_2: this.sensor5_w_lvl_2,
            sensor5_w_lvl_3: this.sensor5_w_lvl_3,
            sensor6_act: this.sensor6_act,
            sensor6_ch: this.sensor6_ch,
            sensor6_mix: this.sensor6_mix,
            sensor6_type: this.sensor6_type,
            sensor6_w_lvl_1: this.sensor6_w_lvl_1,
            sensor6_w_lvl_2: this.sensor6_w_lvl_2,
            sensor6_w_lvl_3: this.sensor6_w_lvl_3,
            sensor7_act: this.sensor7_act,
            sensor7_ch: this.sensor7_ch,
            sensor7_mix: this.sensor7_mix,
            sensor7_type: this.sensor7_type,
            sensor7_w_lvl_1: this.sensor7_w_lvl_1,
            sensor7_w_lvl_2: this.sensor7_w_lvl_2,
            sensor7_w_lvl_3: this.sensor7_w_lvl_3,
            sensor8_act: this.sensor8_act,
            sensor8_ch: this.sensor8_ch,
            sensor8_mix: this.sensor8_mix,
            sensor8_type: this.sensor8_type,
            sensor8_w_lvl_1: this.sensor8_w_lvl_1,
            sensor8_w_lvl_2: this.sensor8_w_lvl_2,
            sensor8_w_lvl_3: this.sensor8_w_lvl_3,
            sensor9_act: this.sensor9_act,
            sensor9_ch: this.sensor9_ch,
            sensor9_mix: this.sensor9_mix,
            sensor9_type: this.sensor9_type,
            sensor9_w_lvl_1: this.sensor9_w_lvl_1,
            sensor9_w_lvl_2: this.sensor9_w_lvl_2,
            sensor9_w_lvl_3: this.sensor9_w_lvl_3,
            sensor10_act: this.sensor10_act,
            sensor10_ch: this.sensor10_ch,
            sensor10_mix: this.sensor10_mix,
            sensor10_type: this.sensor10_type,
            sensor10_w_lvl_1: this.sensor10_w_lvl_1,
            sensor10_w_lvl_2: this.sensor10_w_lvl_2,
            sensor10_w_lvl_3: this.sensor10_w_lvl_3,
            sensor11_act: this.sensor11_act,
            sensor11_ch: this.sensor11_ch,
            sensor11_mix: this.sensor11_mix,
            sensor11_type: this.sensor11_type,
            sensor11_w_lvl_1: this.sensor11_w_lvl_1,
            sensor11_w_lvl_2: this.sensor11_w_lvl_2,
            sensor11_w_lvl_3: this.sensor11_w_lvl_3,
            sensor12_act: this.sensor12_act,
            sensor12_ch: this.sensor12_ch,
            sensor12_mix: this.sensor12_mix,
            sensor12_type: this.sensor12_type,
            sensor12_w_lvl_1: this.sensor12_w_lvl_1,
            sensor12_w_lvl_2: this.sensor12_w_lvl_2,
            sensor12_w_lvl_3: this.sensor12_w_lvl_3,
            sensor13_act: this.sensor13_act,
            sensor13_ch: this.sensor13_ch,
            sensor13_mix: this.sensor13_mix,
            sensor13_type: this.sensor13_type,
            sensor13_w_lvl_1: this.sensor13_w_lvl_1,
            sensor13_w_lvl_2: this.sensor13_w_lvl_2,
            sensor13_w_lvl_3: this.sensor13_w_lvl_3,
            sensor14_act: this.sensor14_act,
            sensor14_ch: this.sensor14_ch,
            sensor14_mix: this.sensor14_mix,
            sensor14_type: this.sensor14_type,
            sensor14_w_lvl_1: this.sensor14_w_lvl_1,
            sensor14_w_lvl_2: this.sensor14_w_lvl_2,
            sensor14_w_lvl_3: this.sensor14_w_lvl_3,
            sensor15_act: this.sensor15_act,
            sensor15_ch: this.sensor15_ch,
            sensor15_mix: this.sensor15_mix,
            sensor15_type: this.sensor15_type,
            sensor15_w_lvl_1: this.sensor15_w_lvl_1,
            sensor15_w_lvl_2: this.sensor15_w_lvl_2,
            sensor15_w_lvl_3: this.sensor15_w_lvl_3,
            sensor16_act: this.sensor16_act,
            sensor16_ch: this.sensor16_ch,
            sensor16_mix: this.sensor16_mix,
            sensor16_type: this.sensor16_type,
            sensor16_w_lvl_1: this.sensor16_w_lvl_1,
            sensor16_w_lvl_2: this.sensor16_w_lvl_2,
            sensor16_w_lvl_3: this.sensor16_w_lvl_3,
            sensor17_act: this.sensor17_act,
            sensor17_ch: this.sensor17_ch,
            sensor17_mix: this.sensor17_mix,
            sensor17_type: this.sensor17_type,
            sensor17_w_lvl_1: this.sensor17_w_lvl_1,
            sensor17_w_lvl_2: this.sensor17_w_lvl_2,
            sensor17_w_lvl_3: this.sensor17_w_lvl_3,
            sensor18_act: this.sensor18_act,
            sensor18_ch: this.sensor18_ch,
            sensor18_mix: this.sensor18_mix,
            sensor18_type: this.sensor18_type,
            sensor18_w_lvl_1: this.sensor18_w_lvl_1,
            sensor18_w_lvl_2: this.sensor18_w_lvl_2,
            sensor18_w_lvl_3: this.sensor18_w_lvl_3,
            sensor19_act: this.sensor19_act,
            sensor19_ch: this.sensor19_ch,
            sensor19_mix: this.sensor19_mix,
            sensor19_type: this.sensor19_type,
            sensor19_w_lvl_1: this.sensor19_w_lvl_1,
            sensor19_w_lvl_2: this.sensor19_w_lvl_2,
            sensor19_w_lvl_3: this.sensor19_w_lvl_3,
            sensor20_act: this.sensor20_act,
            sensor20_ch: this.sensor20_ch,
            sensor20_mix: this.sensor20_mix,
            sensor20_type: this.sensor20_type,
            sensor20_w_lvl_1: this.sensor20_w_lvl_1,
            sensor20_w_lvl_2: this.sensor20_w_lvl_2,
            sensor20_w_lvl_3: this.sensor20_w_lvl_3,
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
    if (this.role == "is_staff") {
      this.balaiStation = this.detBalai.id;
    }

    var date = new Date();
    this.created_at = moment(date).format("YYYY-MM-DDThh:mm");
  },
  async mounted() {
    this.gBalai();
    this.gProvinsi();
    this.gStType();
    this.gSensor();
    // $(".file-upload").file_upload();
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
