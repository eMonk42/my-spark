<template>
  <div
    class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div>
        <h1
          class="mx-auto text-6xl font-extrabold text-indigo-600 text-center mb-4"
        >
          Spark
        </h1>

        <h2 class="text-center mb-4 text-3xl font-extrabold text-gray-900">
          Login to your account
        </h2>
        <p class="text-center">
          Don't have an account yet?
          <router-link
            :to="{ name: 'Register' }"
            class="text-indigo-600 font-semibold hover:underline"
            >Sign up</router-link
          >
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="submit">
        <div class="space-y-4">
          <div>
            <label for="email-address" class="sr-only">Email address</label>
            <input
              id="email-address"
              name="email"
              type="text"
              autocomplete="email"
              class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10"
              placeholder="Email address"
              v-model="email"
              @blur="emailTouched = true"
            />
            <p v-if="emailError" class="px-2 mt-1 text-xs text-red-600">
              {{ emailError }}
            </p>
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10"
              placeholder="Password"
              v-model="password"
              @blur="passwordTouched = true"
            />
            <p v-if="passwordError" class="px-2 mt-1 text-xs text-red-600">
              {{ passwordError }}
            </p>
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <!-- Heroicon name: solid/lock-closed -->
              <svg
                class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
            Login
          </button>
          <p v-if="submitError" class="px-2 mt-1 text-xs text-red-600">
            {{ submitError }}
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import axios from "axios";

const EmailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default Vue.extend({
  data() {
    return {
      email: "",
      emailTouched: false,
      password: "",
      passwordTouched: false,
      submitError: "",
    };
  },
  computed: {
    emailError() {
      if (!this.emailTouched) return "";
      if (!EmailRegex.test(this.email)) {
        return "Please insert a valid email address";
      }
      return "";
    },
    passwordError() {
      if (!this.passwordTouched) return "";
      if (this.password.length < 9) {
        return "Your password must be at least 9 characters long";
      }
      return "";
    },
    entireFormIsValid() {
      return (
        this.passwordTouched &&
        this.emailTouched &&
        this.passwordError == "" &&
        this.emailError == ""
      );
    },
  },
  methods: {
    clearErrors() {
      this.submitError = "";
    },
    async submit() {
      this.emailTouched = true;
      this.passwordTouched = true;
      this.clearErrors();
      if (!this.entireFormIsValid) return;
      console.log("Submitting Form");
      console.log("Email:", this.email, "Password:", this.password);

      const email = this.email;
      const password = this.password;

      try {
        const response = await axios.post(
          process.env.VUE_APP_FUSION_AUTH_URL + "/api/login",
          {
            applicationId: process.env.VUE_APP_FUSION_AUTH_APP_ID,
            loginId: email,
            password,
          },
          {
            headers: {
              Authorization: process.env.VUE_APP_FUSION_AUTH_API_KEY,
            },
          }
        );
        console.log(response);
        const { user, token } = response.data;
        this.$store.commit("SET_USER", { user, token });
        this.$router.push({ name: "Dashboard" });
      } catch (error) {
        console.error(error.response);
        this.submitError =
          "Sorry, something went wrong during login. Please try again.";
      }
    },
  },
});
</script>

<style scoped></style>
