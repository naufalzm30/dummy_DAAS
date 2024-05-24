<template>
  <div v-if="item.station_name">
    <Header />
    <form @submit.prevent="update">
      <div class="mobile-width">
        <div class="bwsTitle mobile-top">
          {{ $app_title }}
        </div>
        <div class="row my-2">
          <div class="col-md subTitle">
            Edit Data Pos {{ item.station_name.station_name }}
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
                <div class="col-md pb-3" v-if="role == 'is_superuser'">
                  <label for="floatingInput">Balai*</label>
                  <select
                    class="form-select"
                    v-model="item.station_name.balai"
                    required
                  >
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
                  <select
                    class="form-select"
                    v-model="item.station_name.provinsi"
                    required
                  >
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
                  <select
                    class="form-select"
                    v-model="item.station_name.station_type"
                    required
                  >
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
                      v-model="item.station_name.station_name"
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
                      v-model="item.station_name.location"
                      type="text"
                      class="form-control"
                      id="inputLo"
                      placeholder="Lokasi"
                      required
                    />
                  </div>
                </div>
                <div
                  class="col-md pb-3"
                  v-if="item.station_name.station_type == 2"
                >
                  <div class="form-group">
                    <label for="inputLo">Sungai</label>
                    <input
                      v-model="item.station_name.sungai"
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
                      v-model="item.station_name.latitude"
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
                      v-model="item.station_name.longitude"
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
                    <p class="d-none">
                      Elevation based on satellite data:
                      {{ item.calc_elevation }} meters
                    </p>
                    <p
                      v-if="
                        item.calc_elevation !== null &&
                        item.calc_elevation !== undefined
                      "
                    >
                      Elevasi dari data satelit: {{ item.calc_elevation }} m
                    </p>

                    <p v-else-if="item.loading_elevation">Loading...</p>
                    <input
                      v-model="item.station_name.elevasi"
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
                      v-model="item.station_name.observator"
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
                      v-model="item.station_name.observator_phone"
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
                        v-if="item.station_name.image"
                        :src="item.station_name.image"
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
                      v-if="item.station_name.image"
                      :src="item.station_name.image"
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
            <div class="card pt-1" v-if="role == 'is_superuser'">
              <div class="card-header">Data Logger</div>
              <div class="card-body">
                <div class="col-md">
                  <div class="col-md pb-3">
                    <div class="form-group">
                      <label for="floatingInput">Serial Number Logger</label
                      ><input
                        v-model="item.station_name.sn_logger"
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
                        v-model="item.station_name.sn_modem"
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
                        v-model="item.station_name.topic_MQTT"
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
                        v-model="item.station_name.maintenance"
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
                        v-model="item.station_name.hide"
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
                        v-model="item.station_name.note"
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
        <div class="col-md">
          <div class="card p-3">
            <div class="card-header">Data Stasiun</div>
            <div
              class="card"
              v-if="item.station_name.station_type == 2"
              style="box-shadow: none"
            >
              <div class="card-header">Setup Perhitungan Debit</div>
              <div class="card-body pb-0">
                <div class="col">
                  <div class="row">
                    <div class="col-md d-flex justify-content-center m-auto">
                      <div class="math showcase">
                        Q =
                        <span>
                          <span> A (H - Ho) <sup>B</sup> </span>
                        </span>
                      </div>
                    </div>
                    <div class="col-md">
                      <div class="col-md pb-3">
                        <div class="form-group">
                          <label for="floatingInput">Konstanta A</label>
                          <input
                            v-model="debit.kons_a"
                            type="number"
                            class="form-control"
                            placeholder="Konstanta A"
                            step="0.0001"

                          />
                        </div>
                      </div>
                    </div>

                    <div class="col-md">
                      <div class="col-md pb-3">
                        <div class="form-group">
                          <label for="floatingInput">Ho</label>
                          <input
                            v-model="debit.tma_0"
                            type="number"
                            step="0.0001"
                            class="form-control"
                            placeholder="Ho"
                          />
                        </div>
                      </div>
                    </div>

                    <div class="col-md">
                      <div class="col-md pb-3">
                        <div class="form-group">
                          <label for="floatingInput">Konstanta B</label>
                          <input
                            v-model="debit.kons_b"
                            type="number"
                            class="form-control"
                            placeholder="Konstanta B"
                            step="0.0001"

                          />
                        </div>
                      </div>
                    </div>
                    <div class="col-md">
                      <div
                        class="form-floating d-flex justify-content-center mt-4"
                      >
                        <button
                          type="button"
                          class="btn btn-danger btn-sm mx-1"
                          v-on:click="deleteData(debit.id)"
                        >
                          Hapus debit setup
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

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
                        <select
                          class="form-select"
                          v-model="item.station_name.siaga"
                        >
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
                    <div
                      class="column"
                      :class="{ 'd-none': !item.sensor1_act }"
                    >
                      <div class="row">
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Jenis Sensor*</label>
                              <select
                                class="form-select"
                                v-model="item.sensor1_type"
                                :disabled="!item.sensor1_act ? true : false"
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
                                v-model="item.sensor1_mix"
                                :disabled="!item.sensor1_act ? true : false"
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
                                v-model="item.sensor1_ch"
                                :disabled="!item.sensor1_act ? true : false"
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
                                v-model="item.sensor1_w_lvl_1"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 3 (m)"
                                step="0.001"
                                :disabled="!item.sensor1_act ? true : false"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Siaga 2</label>
                              <input
                                v-model="item.sensor1_w_lvl_2"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 2 (m)"
                                step="0.001"
                                :disabled="!item.sensor1_act ? true : false"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="col-md pb-3">
                            <div class="form-group">
                              <label for="floatingInput">Siaga 1</label>
                              <input
                                v-model="item.sensor1_w_lvl_3"
                                type="number"
                                class="form-control"
                                placeholder="Siaga 1 (m)"
                                step="0.001"
                                :disabled="!item.sensor1_act ? true : false"
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
                              <label for="floatingInput">Jenis Sensor*</label>
                              <select
                                class="form-select"
                                v-model="item.sensor2_type"
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
                                v-model="item.sensor2_mix"
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
                              <label for="floatingInput">CH Logger*</label>
                              <select
                                class="form-select"
                                v-model="item.sensor2_ch"
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
                                v-model="item.sensor2_w_lvl_1"
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
                                v-model="item.sensor2_w_lvl_2"
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
                                v-model="item.sensor2_w_lvl_3"
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
                              <label for="floatingInput">Jenis Sensor*</label>
                              <select
                                class="form-select"
                                v-model="item.sensor3_type"
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
                                v-model="item.sensor3_mix"
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
                              <label for="floatingInput">CH Logger*</label>
                              <select
                                class="form-select"
                                v-model="item.sensor3_ch"
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
                                v-model="item.sensor3_w_lvl_1"
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
                                v-model="item.sensor3_w_lvl_2"
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
                                v-model="item.sensor3_w_lvl_3"
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
                              <label for="floatingInput">Jenis Sensor*</label>
                              <select
                                class="form-select"
                                v-model="item.sensor4_type"
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
                                v-model="item.sensor4_mix"
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
                              <label for="floatingInput">CH Logger*</label>
                              <select
                                class="form-select"
                                v-model="item.sensor4_ch"
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
                                v-model="item.sensor4_w_lvl_1"
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
                                v-model="item.sensor4_w_lvl_2"
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
                                v-model="item.sensor4_w_lvl_3"
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

            <!-- -- -->
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
                              <label for="floatingInput">Jenis Sensor*</label>
                              <select
                                class="form-select"
                                v-model="item.sensor5_type"
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
                                v-model="item.sensor5_mix"
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
                              <label for="floatingInput">CH Logger*</label>
                              <select
                                class="form-select"
                                v-model="item.sensor5_ch"
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
                                v-model="item.sensor5_w_lvl_1"
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
                                v-model="item.sensor5_w_lvl_2"
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
                                v-model="item.sensor5_w_lvl_3"
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
            <!-- -- -->
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
                              <label for="floatingInput">Jenis Sensor*</label>
                              <select
                                class="form-select"
                                v-model="item.sensor6_type"
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
                                v-model="item.sensor6_mix"
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
                              <label for="floatingInput">CH Logger*</label>
                              <select
                                class="form-select"
                                v-model="item.sensor6_ch"
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
                                v-model="item.sensor6_w_lvl_1"
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
                                v-model="item.sensor6_w_lvl_2"
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
                                v-model="item.sensor6_w_lvl_3"
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
            <!-- --- -->
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
                              <label for="floatingInput">Jenis Sensor*</label>
                              <select
                                class="form-select"
                                v-model="item.sensor7_type"
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
                                v-model="item.sensor7_mix"
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
                              <label for="floatingInput">CH Logger*</label>
                              <select
                                class="form-select"
                                v-model="item.sensor7_ch"
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
                                v-model="item.sensor7_w_lvl_1"
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
                                v-model="item.sensor7_w_lvl_2"
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
                                v-model="item.sensor7_w_lvl_3"
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
            <!-- -- -->
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
                              <label for="floatingInput">Jenis Sensor*</label>
                              <select
                                class="form-select"
                                v-model="item.sensor8_type"
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
                                v-model="item.sensor8_mix"
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
                              <label for="floatingInput">CH Logger*</label>
                              <select
                                class="form-select"
                                v-model="item.sensor8_ch"
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
                                v-model="item.sensor8_w_lvl_1"
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
                                v-model="item.sensor8_w_lvl_2"
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
                                v-model="item.sensor8_w_lvl_3"
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
            <!-- -- -->
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
                              <label for="floatingInput">Jenis Sensor*</label>
                              <select
                                class="form-select"
                                v-model="item.sensor9_type"
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
                                v-model="item.sensor9_mix"
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
                              <label for="floatingInput">CH Logger*</label>
                              <select
                                class="form-select"
                                v-model="item.sensor9_ch"
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
                                v-model="item.sensor9_w_lvl_1"
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
                                v-model="item.sensor9_w_lvl_2"
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
                                v-model="item.sensor9_w_lvl_3"
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
            <!-- -- -->
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
                              <label for="floatingInput">Jenis Sensor*</label>
                              <select
                                class="form-select"
                                v-model="item.sensor10_type"
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
                                v-model="item.sensor10_mix"
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
                              <label for="floatingInput">CH Logger*</label>
                              <select
                                class="form-select"
                                v-model="item.sensor10_ch"
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
                                v-model="item.sensor10_w_lvl_1"
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
                                v-model="item.sensor10_w_lvl_2"
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
                                v-model="item.sensor10_w_lvl_3"
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
            <!-- -- -->
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
                              <label for="floatingInput">Jenis Sensor*</label>
                              <select
                                class="form-select"
                                v-model="item.sensor11_type"
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
                                v-model="item.sensor11_mix"
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
                              <label for="floatingInput">CH Logger*</label>
                              <select
                                class="form-select"
                                v-model="item.sensor11_ch"
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
                                v-model="item.sensor11_w_lvl_1"
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
                                v-model="item.sensor11_w_lvl_2"
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
                                v-model="item.sensor11_w_lvl_3"
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
            <!-- -- -->
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
                              <label for="floatingInput">Jenis Sensor*</label>
                              <select
                                class="form-select"
                                v-model="item.sensor12_type"
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
                                v-model="item.sensor12_mix"
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
                              <label for="floatingInput">CH Logger*</label>
                              <select
                                class="form-select"
                                v-model="item.sensor12_ch"
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
                                v-model="item.sensor12_w_lvl_1"
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
                                v-model="item.sensor12_w_lvl_2"
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
                                v-model="item.sensor12_w_lvl_3"
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
            <!-- -- -->
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
                              <label for="floatingInput">Jenis Sensor*</label>
                              <select
                                class="form-select"
                                v-model="item.sensor13_type"
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
                                v-model="item.sensor13_mix"
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
                              <label for="floatingInput">CH Logger*</label>
                              <select
                                class="form-select"
                                v-model="item.sensor13_ch"
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
                                v-model="item.sensor13_w_lvl_1"
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
                                v-model="item.sensor13_w_lvl_2"
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
                                v-model="item.sensor13_w_lvl_3"
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
            <!-- -- -->
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
                              <label for="floatingInput">Jenis Sensor*</label>
                              <select
                                class="form-select"
                                v-model="item.sensor14_type"
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
                                v-model="item.sensor14_mix"
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
                              <label for="floatingInput">CH Logger*</label>
                              <select
                                class="form-select"
                                v-model="item.sensor14_ch"
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
                                v-model="item.sensor14_w_lvl_1"
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
                                v-model="item.sensor14_w_lvl_2"
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
                                v-model="item.sensor14_w_lvl_3"
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
            <!-- -- -->
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
                              <label for="floatingInput">Jenis Sensor*</label>
                              <select
                                class="form-select"
                                v-model="item.sensor15_type"
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
                                v-model="item.sensor15_mix"
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
                              <label for="floatingInput">CH Logger*</label>
                              <select
                                class="form-select"
                                v-model="item.sensor15_ch"
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
                                v-model="item.sensor15_w_lvl_1"
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
                                v-model="item.sensor15_w_lvl_2"
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
                                v-model="item.sensor15_w_lvl_3"
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
            <!-- -- -->
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
                              <label for="floatingInput">Jenis Sensor*</label>
                              <select
                                class="form-select"
                                v-model="item.sensor16_type"
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
                                v-model="item.sensor16_mix"
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
                              <label for="floatingInput">CH Logger*</label>
                              <select
                                class="form-select"
                                v-model="item.sensor16_ch"
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
                                v-model="item.sensor16_w_lvl_1"
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
                                v-model="item.sensor16_w_lvl_2"
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
                                v-model="item.sensor16_w_lvl_3"
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
            <!-- -- -->
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
                              <label for="floatingInput">Jenis Sensor*</label>
                              <select
                                class="form-select"
                                v-model="item.sensor17_type"
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
                                v-model="item.sensor17_mix"
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
                              <label for="floatingInput">CH Logger*</label>
                              <select
                                class="form-select"
                                v-model="item.sensor17_ch"
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
                                v-model="item.sensor17_w_lvl_1"
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
                                v-model="item.sensor17_w_lvl_2"
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
                                v-model="item.sensor17_w_lvl_3"
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
            <!-- -- -->
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
                              <label for="floatingInput">Jenis Sensor*</label>
                              <select
                                class="form-select"
                                v-model="item.sensor18_type"
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
                                v-model="item.sensor18_mix"
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
                              <label for="floatingInput">CH Logger*</label>
                              <select
                                class="form-select"
                                v-model="item.sensor18_ch"
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
                                v-model="item.sensor18_w_lvl_1"
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
                                v-model="item.sensor18_w_lvl_2"
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
                                v-model="item.sensor18_w_lvl_3"
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
            <!-- -- -->
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
                              <label for="floatingInput">Jenis Sensor*</label>
                              <select
                                class="form-select"
                                v-model="item.sensor19_type"
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
                                v-model="item.sensor19_mix"
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
                              <label for="floatingInput">CH Logger*</label>
                              <select
                                class="form-select"
                                v-model="item.sensor19_ch"
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
                                v-model="item.sensor19_w_lvl_1"
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
                                v-model="item.sensor19_w_lvl_2"
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
                                v-model="item.sensor19_w_lvl_3"
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
            <!-- -- -->
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
                              <label for="floatingInput">Jenis Sensor*</label>
                              <select
                                class="form-select"
                                v-model="item.sensor20_type"
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
                                v-model="item.sensor20_mix"
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
                              <label for="floatingInput">CH Logger*</label>
                              <select
                                class="form-select"
                                v-model="item.sensor20_ch"
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
                                v-model="item.sensor20_w_lvl_1"
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
                                v-model="item.sensor20_w_lvl_2"
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
                                v-model="item.sensor20_w_lvl_3"
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
            <!-- -- -->
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
        station_type: null,
        provinsi: null,
        balai: null,
        location: "",
        sungai: null,
        sn_logger: null,
        sn_modem: null,
        latitude: null,
        longitude: null,
        elevasi: null,
        calc_elevation: null,
        loading_elevation: false,
        image: null,
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
        created_at: "",
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
      },
    };
  },
  watch: {
    "item.station_name.latitude": "fetchElevation",
    "item.station_name.longitude": "fetchElevation",
  },
  methods: {
    async fetchElevationWithRetry(latitude, longitude, maxAttempts = 5) {
      try {
        const url = `https://api.open-meteo.com/v1/elevation?latitude=${latitude}&longitude=${longitude}`;
        const response = await axios.get(url);
        if (response.data.elevation && response.data.elevation.length > 0) {
          return response.data.elevation[0];
        }
      } catch (error) {
        console.error("Error fetching elevation data:", error);
      }

      if (maxAttempts > 1) {
        return this.fetchElevationWithRetry(
          latitude,
          longitude,
          maxAttempts - 1
        );
      } else {
        return null;
      }
    },
    async fetchElevation() {
      const { latitude, longitude } = this.item.station_name;
      if (!latitude || !longitude) {
        this.item.calc_elevation = null;
        return;
      }

      this.item.loading_elevation = true;
      this.item.calc_elevation = await this.fetchElevationWithRetry(
        latitude,
        longitude
      );
      this.item.loading_elevation = false;
    },
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
      this.item.station_name.image = event.target.result;
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
            `${this.$baseURL}/station-sensor/0/${this.$route.params.id}`,
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
              `${this.$baseURL}/station-sensor/0/${this.$route.params.id}`,
              this.item,
              {
                headers: {
                  Authorization: `Token ${this.token}`,
                },
              }
            ),
            axios.post(
              `${this.$baseURL}/debit-setup/${this.$route.params.id}`,
              {
                kons_a: this.debit.kons_a,
                kons_b: this.debit.kons_b,
                tma_0: this.debit.tma_0,
                station: this.$route.params.id,
              },
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
          `${this.$baseURL}/station-sensor/${this.balai}/${this.$route.params.id}`,
          {
            headers: {
              Authorization: `Token ${this.token}`,
            },
          }
        ),
        axios.get(`${this.$baseURL}/debit-setup/${this.$route.params.id}`, {
          headers: {
            Authorization: `Token ${this.token}`,
          },
        }),
      ])
      .then(
        axios.spread((r1, r2) => {
          this.item = r1.data;
          this.debit = r2.data;
          // console.log(this.debit);
        })
      );

    this.item.station_name.image = `${this.$baseURL}${this.item.station_name.image}`;

    this.gBalai();
    this.gProvinsi();
    this.gStType();
    this.gSensor();

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

    if (typeof this.item.station_name.image == "string") {
      this.item.station_name.image = await getBase64FromUrl(
        this.item.station_name.image
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
