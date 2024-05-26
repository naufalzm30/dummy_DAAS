<template>
  <div>
    <Header />
    <div class="mobile-width d-flex justify-content-between align-items-center">
      <div class="bwsTitle mobile-top">
        {{ $app_title }}
      </div>
    </div>
    <div class="mobile-width">
      <div class="d-flex justify-content-between align-items-center">
        <div class="subTitle">Daftar User</div>
        <div>
          <router-link
            v-if="role === 'is_superuser' || role === 'is_staff'"
            :to="{ name: 'AddUser' }"
            type="button"
            class="btn btn-primary float-right my-2"
            style="padding: 5px 10px"
            >Tambah Data</router-link
          >
        </div>
      </div>
      <dataset
        v-slot="{ ds }"
        :ds-data="users"
        :ds-sortby="sortBy"
        :ds-search-in="['user', 'created_by', 'phone']"
      >
        <div :data-page-count="ds.dsPagecount">
          <dataset-search ds-search-placeholder="Search..." />
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="table-responsive">
              <table
                class="table table-hover table-responsive text-nowrap text-center table-borderless bg-white"
              >
                <thead class="table-light">
                  <tr>
                    <th scope="col">#</th>
                    <th
                      v-for="(th, index) in cols"
                      :key="th.field"
                      :class="['sort', th.sort]"
                      @click="click($event, index)"
                      class="thLight"
                    >
                      {{ th.name }} <i class="gg-select float-right"></i>
                    </th>
                  </tr>
                </thead>
                <div
                  v-if="loading_i"
                  class="d-flex flex-column justify-content-center align-items-center"
                >
                  <i
                    class="zmdi zmdi-spinner zmdi-hc-spin"
                    style="font-size: 1.5rem"
                  ></i>
                </div>
                <dataset-item tag="tbody">
                  <template #default="{ row, rowIndex }">
                    <tr>
                      <td scope="row">{{ rowIndex + 1 }}</td>
                      <td>{{ row.user }}</td>
                      <td>{{ row.phone }}</td>
                   
                 
                      <td v-if="role == 'is_superuser'">
                        <span v-if="row.is_superuser"> superadmin </span>
                        <span v-else-if="row.is_staff"> admin </span>
                        <span v-else-if="row.is_guess"> tamu </span>
                      </td>
                      <td>
                        <span v-for="item in userList" :key="item.id">
                          <span v-if="item.id == row.created_by">
                            {{ item.user }}
                          </span>
                        </span>
                      </td>
                      <td>
                        <span>
                          
                          <router-link
                            type="button"
                            class="btn btn-success btn-sm mx-1"
                            :to="`/user/update/0/${row.id} `"
                            >Edit</router-link
                          >
                          <button
                            type="button"
                            class="btn btn-danger btn-sm mx-1"
                            v-on:click="deleteData(row.id)"
                          >
                            Delete
                          </button>
                        </span>
                      </td>
                    </tr>
                  </template>
                </dataset-item>
              </table>
            </div>
          </div>
        </div>
        <div
          class="d-flex flex-md-row flex-column justify-content-between align-items-center"
        >
          <dataset-info class="mb-2 mb-md-0" />
          <dataset-pager />
        </div>
      </dataset>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Public/Header.vue";
import axios from "axios";

import {
  Dataset,
  DatasetItem,
  DatasetInfo,
  DatasetPager,
  DatasetSearch,
  // DatasetShow,
} from "vue-dataset";

export default {
  name: "User",
  components: {
    Header,
    Dataset,
    DatasetItem,
    DatasetInfo,
    DatasetPager,
    DatasetSearch,
    // DatasetShow,
  },
  data: function () {
    return {
      balais: [],
      loading_i: true,
      provinsis: [],
      userList: [],
      role: "",
      users: [],
      cols: [
        {
          name: "Nama",
          field: "user",
        },
        {
          name: "Phone",
          field: "phone",
        },
    
      ],
      colSuper: [
  
        {
          name: "Role",
        },
      ],
      colCreated: [
        {
          name: "Created by",
        },
        {
          name: "Action",
        },
      ],
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
  },
  methods: {
    toggleNav() {
      this.$parent.$emit("toggleNav");
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
    loadHeader() {
      if (this.role == "is_superuser") {
        this.cols.push(...this.colSuper);
      }
      this.cols.push(...this.colCreated);
    },
    async loadData() {
      await axios
        .get(`${this.$baseURL}/user/${this.balai}`, {
          headers: {
            Authorization: `Token ${this.token}`,
          },
        })
        .then((r) => {
          let guess = [];

          if (this.role == "is_superuser") {
            this.users = r.data;
          }

          if (this.role == "is_staff") {
            for (let i = 0; i < r.data.length; i++) {
              if (r.data[i].role == "is_guess") {
                guess.push(r.data[i]);
                this.users = guess;
              }
            }
          }
          if (r.status == 200) {
            this.loading_i = false;
          }
        });
    },
    async delete(id) {
      await axios
        .delete(`${this.$baseURL}/user/${this.balai}/${id}`, {
          headers: {
            Authorization: `Token ${this.token}`,
          },
        })
        .then((r) => {
          if (r.status == 204) {
            this.loadData();
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
          this.delete(id);
        }
      });
    },
  },
  created() {
    this.gAuthUser();
    this.loadHeader();
    this.loadData();
  },
  async mounted() {
    // this.gBalai();
    this.gProvinsi();
    await axios
      .get(`${this.$baseURL}/user/${this.balai}`, {
        headers: {
          Authorization: `Token ${this.token}`,
        },
      })
      .then((r) => {
        this.userList = r.data;
      });
  },
};
</script>

<style scoped src="@/assets/css/figma.css">
</style>

<style scoped>
* {
  box-sizing: border-box;
}
#app {
  display: flex;
}
aside {
  display: none;
  width: 200px;
  background: #cecece;
  height: 100vh;
}
aside.active {
  display: block;
}
aside a {
  display: block;
  padding: 10px 5px;
  color: #666;
  border-bottom: 1px solid #bbb;
}
.wrapper {
  display: flex;
  align-items: stretch;
  flex-direction: column;
  width: 100vw;
}
header {
  width: 100%;
  padding: 10px;
  background: #aaa;
}
main {
  flex-grow: 2;
  padding: 10px;
}
</style>