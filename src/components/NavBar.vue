<template lang="">
  <div>
    <div
      class="fixed flex w-full top-0 left-0 justify-center z-10 p-4 bg-gray-50 border border-green-600"
    >
      <ul class="flex space-x-12">
        <li v-if="$route.path != '/'">
          <router-link to="/" class="">Dashboard</router-link>
        </li>
        <li v-if="$route.path != '/create-note'">
          <router-link to="/create-note" class="">New Note</router-link>
        </li>
        <li v-if="!$route.params.userid">
          <router-link
            :to="{ name: 'Profile', params: { userid: $store.state.user.id } }"
            >Profile</router-link
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
