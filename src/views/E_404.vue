<template>
  <div
    class="d-flex flex-column min-vh-100 justify-content-center align-items-center"
  >
    <router-link :to="{ name: 'Home', params: { balai_id: balai } }">
      <img :src="bg_img" />
    </router-link>
  </div>
</template>

<script>
import bg_img from "@/assets/img/404.svg";

export default {
  name: "404",
  components: {},
  data() {
    return {
      bg_img,
    };
  },
  mounted() {
    console.log(this.balai);
  }
};
</script>

<style scoped>
.vertical-center {
  position: relative;
  height: 100vh;
  margin: 0 auto;
}
.col-md-2 {
  background-color: #ccc;
}
</style>