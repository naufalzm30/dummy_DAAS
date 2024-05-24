<template>
  <div>
    <Header />
    <form @submit.prevent="update">
    <div class="mobile-width">
        <div class="bwsTitle mobile-top">
          {{ $app_title }}
        </div>
        <div class="row my-2">
          <div class="col-md subTitle">Edit Icon {{ item.name }}</div>
          <div class="col-md d-flex justify-content-end">
            <router-link
              :to="{ name: 'Icon' }"
              type="button"
              class="btn btn-light border mx-4 bg-white"
              >Cancel</router-link
            >
            <button class="btn btn-primary" type="submit">Simpan</button>
          </div>
        </div>

        <div class="card">
          <div class="card-header">Data Icon</div>
          <div class="card-body row">
            <div class="col-md">
              <div class="pb-3">
                <label for="floatingInput">Nama Icon*</label>
                <input
                  v-model="item.name"
                  type="text"
                  class="form-control"
                  placeholder="Nama Icon"
                  required
                />
              </div>
            </div>

            <div class="col-md mb-3">
              <div>
                <label>Icon*</label>
                <div>
                  <div v-if="!file">
                    <div
                      :class="['dropZone', dragging ? 'dropZone-over' : '']"
                      @dragenter="dragging = true"
                      @dragleave="dragging = false"
                    >
                      <div class="dropZone-info" @drag="onChange">
                        <img
                          v-if="item.icon"
                          :src="item.icon"
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
                        v-if="item.icon"
                        :src="item.icon"
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
  name: "UpdateIcon",
  components: {
    Header,
  },
  data() {
    return {
      item: {
        name: null,
        login_i,
        dragging: false,
        file: "",
        icon: null,
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
      this.item.icon = event.target.result;
    },
    async updateData() {
      await axios
        .put(`${this.$baseURL}/icon/` + this.$route.params.id, this.item, {
          headers: {
            Authorization: `Token ${this.token}`,
          },
        })
        .then((r) => {
          if (r.status == 200) {
            this.$router.push({ name: "Icon" });
          }
        });
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

      this.updateData();
    },
  },
  async mounted() {
    await axios
      .get(`${this.$baseURL}/icon/` + this.$route.params.id, {
        headers: {
          Authorization: `Token ${this.token}`,
        },
      })
      .then((r) => {
        this.item = r.data;
      });

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

    if (typeof this.item.icon == "string") {
      this.item.icon = await getBase64FromUrl(this.item.icon);
    }
  },
  created() {
    this.gAuthCheck();
  },
};
</script> <style scoped src="@/assets/css/figma.css">
</style> <style scoped>
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
</style>