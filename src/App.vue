<template>
  <div class="container" style="padding: 0">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  mounted() {
    this.$store.dispatch("startInactivityTimer");
    ["mousemove", "keydown", "mousedown", "touchstart"].forEach((event) => {
      window.addEventListener(event, this.handleUserActivity);
    });

    // window.addEventListener("beforeunload", this.handleTabClose);
  },
  beforeDestroy() {
    ["mousemove", "keydown", "mousedown", "touchstart"].forEach((event) => {
      window.removeEventListener(event, this.handleUserActivity);
    });
    // window.removeEventListener("beforeunload", this.handleTabClose);

    this.$store.dispatch("clearInactivityTimer");
  },
  methods: {
    handleUserActivity() {
      this.$store.dispatch("resetInactivityTimer");
    },
    // handleTabClose() {
    //   this.$store.dispatch("userLogout");
    // },
  },
  
};
</script>
<style>
body,
.zero {
  padding: 0;
  margin: 0;
  background-color: #fff !important;
}

@media (min-width: 1280px) {
  .container,
  .container-fluid {
    max-width: 3840px !important;
  }
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.w-97 {
  max-width: 90%;
  margin-left: 90px;
}

a,
u {
  text-decoration: none !important;
}

.box {
  transition: box-shadow 0.3s;
  border-radius: 10px;
  border: 1px solid #ccc;
  background: #fff;
}

.box:hover {
  box-shadow: 0 0 21px rgba(33, 33, 33, 0.2);
}

.box-sm {
  transition: box-shadow 0.3s;
  border-radius: 10px;
  border: 1px solid #ccc;
  background: #fff;
}

.box-sm:hover {
  box-shadow: 0 0 10px rgba(33, 33, 33, 0.2);
}

.bwsTitle {
  text-transform: uppercase;
  color: #092581;
  font-size: 1.3rem;
  font-weight: 500;
}

.subTitle {
  font-size: 1.5rem;
  font-weight: 500;
}
/* ---new file */
</style>