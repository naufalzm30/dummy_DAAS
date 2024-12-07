<template>
  <section>
    <div class="container">
      <div class="row d-flex align-items-center justify-content-center">
        <div class="img-fluid login100-more" v-bind:style="{ backgroundImage: `url(' ${bg_surabaya_img} ')` }">
          <div class="logo-container m-3">
            <router-link :to="{ name: 'Home', params: { balai_id: balai } }">
              <img :src="logoPDAM" alt="" class="logo-img" />
            </router-link>
            <div>
              <p class="bws">PDAM SURYA SEMBADA</p>
              <p class="bws">DATA AS SERVICE</p>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <form class="login100-form validate-form" @submit.prevent="login">
            <div class="form-group py-2">
              <span class="form-title"> Sign In </span>
              <label for="username" class="mb-2">Username</label>
              <div class="input-group mb-3">
                <span class="input-group-icon">
                  <img src="../assets/icons/user.svg" alt="usr icon" />
                </span>
                <input type="text" class="form-control py-2" style="padding: 0.375rem 0.75rem;" placeholder="Username"
                  id="username" autocomplete="username" v-model="username" required />
              </div>
            </div>

            <div class="form-group py-2" style="border-radius: 1rem">
              <label for="password" class="mb-2">Password</label>
              <div class="input-group mb-3">
                <span class="input-group-icon">
                  <img src="../assets/icons/lock.svg" alt="Check icon" />
                </span>
                <input type="password" class="form-control py-2" style="padding: 0.375rem 0.75rem;"
                  placeholder="Password" id="password" autocomplete="current-password" v-model="password" required />
              </div>

            </div>
            <p v-if="incorrectAuth" class="pb-3" style="color: #fbb040">
              {{ msg }}
            </p>
            <div v-if="spin_i" class="d-flex flex-column justify-content-center align-items-center pb-3">
              <i class="zmdi zmdi-spinner zmdi-hc-spin" style="font-size: 1.5rem"></i>
            </div>
            <div class="container-login100-form-btn">

              <button class="login100-form-btn rounded" type="submit" style="min-width: 100%">
                Sign In
              </button>
            </div>

            <div class="text-center p-t-90 pb-3" style="color: gray">
              &copy; {{ year }} {{ $app_title }}
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import bg_surabaya_img from "@/assets/img/surabaya-bg2.png";
import bg_weather_img from "@/assets/img/bweather-bg.jpg";
import logoPDAM from "@/assets/icons/logo-pdam2.png";

export default {
  name: "Login",
  components: {},
  data() {
    return {
      username: "",
      password: "",
      msg: "",

      bg_surabaya_img,
      bg_weather_img,

      logoPDAM,
      incorrectAuth: false,
      year: null,
      balai: null,
      spin_i: false,
      balai_name: "",
      stats: false,
    };
  },
  methods: {
    async login() {
      this.spin_i = true;

      this.$store
        .dispatch("userLogin", {
          username: this.username,
          password: this.password,
        })
        .then((r) => {
          this.$router.push({ name: "Home" });
          if (r.status == 200) {
            this.spin_i = false;
          }
        })
        .catch((err) => {
          this.incorrectAuth = true;

          if (err == "Error: Request failed with status code 400") {
            this.msg = "These credentials do not match our records.";
          } else {
            this.msg = "Please try to login again.";
          }
          this.spin_i = false;
        });
    },
  },
  created() {
    const d = new Date();
    this.year = d.getFullYear();
    console.log('x7.12.24');
    
  },
};
</script>

<style scoped src="@/assets/css/main.css"></style>
<style scoped src="@/assets/css/util.css"></style>

<style scoped>
.bws {
  font-size: 1.3rem;
  font-weight: bold;
  margin: 0;
  margin-left: 25px;
  /* color: #fbb040; */
  color: #D6FB40
}

.weather {
  font-size: 1.4rem;
  font-weight: bold;
  margin: 0;
  margin-left: 25px;
  color: #fff;
}

.form-title {
  font-family: Poppins-Medium;
  font-size: 25px;
  font-weight: bold;
  line-height: 1.2;
  display: block;
  color: #68C0FF;
  padding: 20px 0;
}

.form-weather {
  font-family: Poppins-Medium;
  font-size: 25px;
  font-weight: bold;
  line-height: 1.2;
  display: block;
  color: #02b29c;
  padding: 20px 0;
}

.login100-form-btn {
  background-color: #68C0FF;
}

.bg-weather {
  background-color: #02b29c;

}

.logo-img {
  width: 80px;

}

.logo-container {
  display: flex;
  align-items: center;
}

.img-fluid {
  width: 50%;
  min-height: 100vh;
}

.form-control:focus {
  border-color: #3ca745;
  box-shadow: rgba(60, 167, 69, 0.4) 0px 0px 0px 2px,
    rgba(60, 167, 69, 0.65) 0px 4px 6px -1px,
    rgba(255, 255, 255, 0.08) 0px 1px 0px inset;
}

.input-group {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.input-group-icon {
  margin-right: 10px;
}

form {
  padding: 0 150px;
}




@media screen and (max-width: 768px) {
  .img-fluid {
    width: 100%;
    min-height: 40vh;
  }

  .logo-img {
    width: 70px;
  }

  .bws {
    font-size: 1.1rem;
    font-weight: bold;
    margin-left: 15px;
    /* margin-left: 25px; */
  }

  .weather {
    font-size: 1.2rem;
    font-weight: bold;
    margin: 0;
    margin-left: 25px;
  }

  form {
    padding: 0 30px;
  }

  .form-title,
  .form-weather {
    padding: 15px 0 20px 0;
    font-size: 20px;
  }

  .input-group {
    margin-bottom: 0px;
  }
}
</style>