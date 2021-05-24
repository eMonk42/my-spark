<template lang="">
  <div>
    <div
      id="navbar"
      class="fixed h-screen w-36 top-0 left-0 justify-center z-10 p-4 bg-gray-900 opacity-90 text-gray-300 border-r-4 border-opacity-80 border-purple-700"
    >
      <div class="relative">
        <div
          v-if="!navbarIsOpen"
          class="absolute top-2 left-40 cursor-pointer hover:scale-125 opacity-80 hover:opacity-100 transform transition-all duration-150"
          @click="toggleNavbar"
        >
          <i class="fas fa-chevron-right text-4xl"></i>
        </div>
        <div
          v-else
          class="absolute top-2 left-40 cursor-pointer hover:scale-125 opacity-80 hover:opacity-100 transform transition-all duration-150"
          @click="toggleNavbar"
        >
          <i class="fas fa-chevron-left text-4xl"></i>
        </div>
        <router-link
          v-if="$route.path.substr(0, 5) != '/prof'"
          :to="{ name: 'Profile', params: { userid: $store.state.user.id } }"
          ><img
            class="mx-auto rounded-full w-20 transform transition-all duration-200 hover:scale-110 border-4 border-purple-400 border-opacity-40"
            :src="profilepic"
            alt=""
        /></router-link>
        <ul class="flex flex-col mt-6 text-2xl">
          <li class="text-purple-500 text-4xl font-bold cursor-default py-4">
            <span id="logo">Spark</span>
          </li>
          <li v-if="$route.path != '/'" class=" py-4">
            <router-link to="/" class="link">Dashboard</router-link>
          </li>
          <li v-if="$route.path == '/'" class=" py-4">
            <!-- <router-link to="/create-note" class="">New Note</router-link> -->
            <a href="#top-anchor" @click="$emit('create-clicked')" class="link"
              >New Note</a
            >
          </li>
          <li v-if="!$route.params.userid" class=" py-4">
            <router-link
              class="link"
              :to="{
                name: 'Profile',
                params: { userid: $store.state.user.id },
              }"
              >Profile</router-link
            >
          </li>
          <li class=" py-4">
            <router-link to="/auth/login" @click="logout" class="link"
              >Logout</router-link
            >
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import p001 from "@/assets/profile-pictures/001.png";
import p002 from "@/assets/profile-pictures/002.png";
import p003 from "@/assets/profile-pictures/003.png";
import p004 from "@/assets/profile-pictures/004.png";
import p005 from "@/assets/profile-pictures/005.png";
import p006 from "@/assets/profile-pictures/006.png";
import p007 from "@/assets/profile-pictures/007.png";
import p008 from "@/assets/profile-pictures/008.png";
import p009 from "@/assets/profile-pictures/009.png";
import p010 from "@/assets/profile-pictures/010.png";
import p011 from "@/assets/profile-pictures/011.png";
import p012 from "@/assets/profile-pictures/012.png";
const pictures = [
  p001,
  p002,
  p003,
  p004,
  p005,
  p006,
  p007,
  p008,
  p009,
  p010,
  p011,
  p012,
];
export default {
  props: { profilepic: String },
  data() {
    return {
      pictures,
      navbarIsOpen: false,
    };
  },
  methods: {
    logout() {
      this.$store.commit("CLEAR");
      this.$router.push({ name: "Login" });
    },
    toggleNavbar() {
      this.navbarIsOpen = !this.navbarIsOpen;
      const navbar = document.getElementById("navbar");
      navbar.classList.toggle("translate");
      console.log("you clicked me!");
    },
  },
};
</script>

<style scoped lang="scss">
#navbar {
  margin-left: -145px;
  transition: all 0.3s linear;
}

.translate {
  transform: translateX(145px);
  transition: all 0.3s linear;
}

.link {
  transition: all 0.3s linear;
  position: relative;
}
.link::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgb(209, 102, 14);
  transform: scaleX(0);
  height: 2px;
  transform-origin: 0;
  transition: transform 0.2s ease-in-out;
  transition: all 0.2s linear;
}
.link:hover::after {
  transform: none;
}
#logo {
  transition: all 0.3s linear;
  position: relative;
}
#logo::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgb(117, 47, 163);
  transform: scaleX(0);
  height: 2px;
  transform-origin: 0;
  transition: transform 0.2s ease-in-out;
  transition: all 0.2s linear;
}
#logo:hover::after {
  transform: none;
}
</style>
