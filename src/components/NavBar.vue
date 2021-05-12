<template lang="">
  <div>
    <div
      class="fixed flex w-full top-0 left-0 justify-center z-10 p-4 bg-gray-50 border border-green-600"
    >
      <ul class="flex space-x-12">
        <li>
          <router-link to="/" class="text-gray-500">Dashboard</router-link>
        </li>
        <li>
          <router-link to="/create-note" class="text-gray-500"
            >New Note</router-link
          >
        </li>
        <li>
          <router-link
            to="/login"
            @click="logout"
            class="text-sm hover:text-indigo-600"
            >Logout</router-link
          >
        </li>
      </ul>
    </div>
    <div class="h-14"></div>
  </div>
</template>
<script>
export default {
  methods: {
    logout() {
      this.$store.commit("CLEAR");
      this.$router.push({ name: "Login" });
    },
  },
};
</script>
<style lang=""></style>
