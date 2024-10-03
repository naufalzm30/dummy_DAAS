<template v-if="role == 'SuperAdmin'">
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
          <router-link v-if="role === 'SuperAdmin' || role === 'Admin'" :to="{ name: 'AddUser' }" type="button"
            class="btn btn-primary float-right my-2" style="padding: 5px 10px">Tambah Data</router-link>
        </div>
      </div>

      <dataset v-slot="{ ds }" :ds-data="users" :ds-sortby="sortBy" :ds-search-in="['user', 'created_by']">
        <div :data-page-count="ds.dsPagecount">
          <!-- <dataset-search ds-search-placeholder="Search..." /> -->
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="table-responsive">
              <table class="table table-hover table-responsive text-nowrap text-center table-borderless bg-white">
                <thead class="table-light">
                  <tr>
                    <th scope="col">#</th>
                    <th v-for="(th, index) in cols" :key="th.field" :class="['sort', th.sort]"
                      @click="click($event, index)" class="thLight">
                      {{ th.name }} <i class="gg-select float-right"></i>
                    </th>
                  </tr>
                </thead>
                <div v-if="loading_i" class="d-flex flex-column justify-content-center align-items-center">
                  <i class="zmdi zmdi-spinner zmdi-hc-spin" style="font-size: 1.5rem"></i>
                </div>
                <dataset-item tag="tbody">
                  <template #default="{ row, rowIndex }">
                    <tr>
                      <td scope="row">{{ rowIndex + 1 }}</td>
                      <td>{{ row.username }}</td>
                      <td>{{ row.role_name }}</td>
                      <td v-if="row.balai !== null && row.role_name == 'Admin'">{{ row.balai.balai_name }}</td>
                      <td v-else></td>
                      <td>{{ row.created_by }}</td>
                      <td>
                        <span>
                          <button type="button" class="btn btn-danger btn-sm mx-1" v-on:click="deleteData(row.id)">
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
        <div class="d-flex flex-md-row flex-row justify-content-end align-items-center">


          <button @click="loadPrevPage" :disabled="!prevPage" class="btn btn-sm btn-light mx-1">Previous</button>
          <!-- Page Number Buttons -->
          <span v-for="page in totalPages" :key="page">
            <button @click="loadData(page)" :class="['btn btn-sm', page === currentPage ? 'btn-primary' : 'btn-light']">
              {{ page }}
            </button>
          </span>
          <button @click="loadNextPage" :disabled="!nextPage" class="btn btn-sm btn-light mx-1">Next</button>


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
  // DatasetInfo,
  // DatasetPager,
  // DatasetSearch,
  // DatasetShow,
} from "vue-dataset";

export default {
  name: "User",
  components: {
    Header,
    Dataset,
    DatasetItem,
    // DatasetInfo,
    // DatasetPager,
    // DatasetSearch,
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
          name: "Username",
          field: "user",
        },
      ],
      colSuper: [

        {
          name: "Role",
        },
        {
          name: "Produksi",
        },
      ],
      colCreated: [
        {
          name: "Created by",
        },
        {
          name: "Delete",
        },
      ],
      currentPage: 1, // Start at the first page
      totalPages: 0,  // To be calculated
      nextPage: null,
      prevPage: null,
      maxPerPage: 10,
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
      if (this.role == "SuperAdmin") {
        this.cols.push(...this.colSuper);
      }
      this.cols.push(...this.colCreated);
    },
    async loadData(pageNumber) {
      this.loading_i = true;
      await axios
        .get(`${this.$baseURL}/user/?page=${pageNumber}`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        })
        .then((r) => {
          this.users = r.data.results;
          this.nextPage = r.data.next;
          this.prevPage = r.data.previous;
          this.currentPage = pageNumber;
          // Calculate total pages based on the count and max_per_page
          this.totalPages = Math.ceil(r.data.count / r.data.max_per_page);

          if (r.status == 200) {
            this.loading_i = false;
          }
        });
    },
    async loadNextPage() {
      if (this.nextPage) {
        const nextPageNumber = this.currentPage + 1;
        await this.loadData(nextPageNumber);
      }
    },
    async loadPrevPage() {
      if (this.prevPage) {
        const prevPageNumber = this.currentPage - 1;
        await this.loadData(prevPageNumber);
      }
    },
    // click(event, index) {
    //   // Sorting logic here
    // },
    // deleteData(id) {
    //   // Deletion logic here
    // },
    async delete(id) {
      try {
        const response = await axios.delete(`${this.$baseURL}/user/${id}`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });
        if (response.status == 204) {
          // Reload the current page data after deletion
          await this.loadData(this.currentPage);
        }
      } catch (error) {
        console.error("Error deleting data:", error);
      }
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
  async created() {
    this.extractUserInfo()
    this.loadHeader();
    await this.loadData(this.currentPage);
  },
  async mounted() {

    await axios
      .get(`${this.$baseURL}/user/`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      })
      .then((r) => {
        this.userList = r.data.results;
        // console.log(this.userList);

      }).catch((error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          this.logoutUser();
        } else {
          console.error('Error msg: ', error);
        }
      });
  },

  
};
</script>

<style scoped src="@/assets/css/figma.css"></style>

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