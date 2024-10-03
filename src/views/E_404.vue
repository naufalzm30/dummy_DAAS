<template>
  <div
    class="d-flex flex-column min-vh-100 justify-content-center align-items-center"
  >
    <router-link :to="{ name: 'Home' }">
      <img :src="bg_img" />
    </router-link>
  </div>
</template>

<script>
import bg_img from "@/assets/img/404.svg";

export default {
  name: "E_404",
  components: {},
  data() {
    return {
      bg_img,
    };
  },
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