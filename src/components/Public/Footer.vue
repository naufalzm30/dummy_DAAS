<template>
  <div>
    <!-- <p class="zero d-flex flex-column justify-content-center align-items-center text-center" style="height:6vh">
      Copyright &copy; {{ year }} Balai Besar Wilayah Sungai Sumatera VIII
    </p> -->
  </div>
</template>

<script>
export default {
  name: "HeaderPub",
  data() {
    return {
      year: "",
    };
  },
  methods: {
    curDate() {
      this.year = new Date().getFullYear();
    },
  },
  async mounted() {
    this.curDate();
  },
};
</script>