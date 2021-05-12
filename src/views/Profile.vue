<template lang="">
  <div class="p-4 max-w-screen-sm mx-auto">
    <NavBar />
    <!-- <p>{{ $store.state.user.id }}</p> -->
    <p>{{ $store.state.user.email }}</p>
  </div>
</template>
<script>
import NavBar from "@/components/NavBar.vue";
//import axios from "axios";
export default {
  components: { NavBar },
  data() {
    return {
      user: this.$store.state.user,
    };
  },
  methods: {
    async fetchUser() {
      try {
        // const res = await axios.post(
        //   process.env.VUE_APP_FUSION_AUTH_URL +
        //     "/api/user/" +
        //     this.$store.state.user.id,
        //   {
        //     headers: {
        //       Authorization: process.env.VUE_APP_FUSION_AUTH_API_KEY,
        //     },
        //   }
        // );
        // console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    },
  },
  mounted() {
    this.fetchUser();
  },
};
</script>
<style lang=""></style>
