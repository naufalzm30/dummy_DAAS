<template>
  <div class="log"></div>
</template>

<script>
export default {
  created() {
    this.$store.dispatch("userLogout", { router: this.$router });
  },
};
</script>

<style>
</style>