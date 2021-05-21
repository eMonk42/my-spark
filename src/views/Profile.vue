<template lang="">
  <div>
    <NavBar />
    <div v-if="isLoading" class="text-6xl text-purple-600 text-center">
      <img :src="loading" alt="Loading..." class="w-24 mx-auto" />
    </div>
    <div v-else>
      <div
        class="p-4 max-w-screen-sm mx-auto rounded-lg bg-gray-900 bg-opacity-60 relative"
      >
        <div
          v-if="fetchError"
          class="mt-8 flex-col justify-center text-center text-red-500"
        >
          <i class="text-6xl far fa-frown-open mb-4"></i>
          <p class=" text-lg">
            Sorry, there was an Error loading your Profile informations!
          </p>
        </div>
        <div v-else>
          <div class="flex">
            <h1 class="text-4xl bold mt-auto font-semibold text-purple-400">
              User Profile
            </h1>
            <div class="flex-col ml-auto place-items-center">
              <img
                class="rounded-full w-20 mx-auto cursor-pointer"
                :src="pictures[parseInt(userSettings.profilepic) - 1]"
                alt="ProfilePic"
                @click="showSelection = true"
              />
              <input
                v-model="userSettings.nickname"
                type="text"
                class="text-xl text-indigo-500 text-center align-text-bottom font-semibold rounded-lg bg-transparent border border-transparent focus:border-purple-500"
                @blur="updateNickname"
              />
              <p v-if="!validateNickname" class="text-red-500">
                {{ error }}
              </p>
            </div>
            <!-- START OF PICTURE SELECT -->
            <div
              class="fixed w-screen h-screen top-0 right-0 bottom-0 left-0 flex place-items-center pt-16 bg-black bg-opacity-20 "
              v-if="showSelection"
              @click="showSelection = false"
            >
              <div
                class="min-w-64 mx-auto grid grid-rows-3 grid-cols-4 grid-flow-col-dense bg-gray-200 bg-opacity-80 rounded-lg p-16 relative"
                @click.prevent=""
              >
                <p
                  class="absolute top-8 left-16 text-lg font-semibold text-gray-800"
                >
                  Choose you Profile-Picture
                </p>
                <div
                  class="p-4 hover:scale-105 transform transition-all duration-200 cursor-pointer"
                  v-for="(img, index) of pictures"
                  :key="index"
                >
                  <img
                    class="rounded-full"
                    @click="setProfilePic(img)"
                    :src="img"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="my-4">
            <h2 class="my-2 text-xl font-bold">Information</h2>
            <p>{{ user.id }}</p>
            <p>{{ user.passwordChangeRequired }}</p>
            <p>{{ user.email }}</p>
            <p>{{ user.verified }}</p>
            <!-- <p>{{ user }}</p> -->
          </div>
          <div>
            <h2 class="my-2 text-xl font-bold">Reset password</h2>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import NavBar from "@/components/NavBar.vue";
import axios from "axios";
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
import loading from "@/assets/loading.gif";

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
  components: { NavBar },
  data() {
    return {
      user: {},
      userSettings: {},
      pictures,
      showSelection: false,
      error: "That Nickname is invalid",
      fetchError: false,
      isLoading: false,
      loading,
    };
  },
  methods: {
    // async fetchUser() {
    //   try {
    //     this.fetchError = false;
    //     const res = await axios.get(
    //       "http://gabriel.devhausleipzig.de:9011/api/user/" +
    //         this.$store.state.user.id,
    //       {
    //         headers: {
    //           Authorization: process.env.VUE_APP_FUSION_AUTH_API_KEY,
    //         },
    //       }
    //     );
    //     //console.log(res.data);
    //     this.user = await res.data.user;
    //     const res2 = await axios.get("http://localhost:3000/users");
    //     this.userSettings = await res2.data.filter((user) => {
    //       return user.userId == res.data.user.id;
    //     })[0];
    //     if (!this.userSettings) {
    //       const res3 = await axios.post("http://localhost:3000/users", {
    //         userId: this.$store.state.user.id,
    //         profilePic: "001",
    //         nickName: "name yourself here",
    //         tags: ["Personal", "Todo"],
    //       });
    //       this.userSettings = await res3.data;
    //       console.log(res3.data);
    //     }
    //   } catch (err) {
    //     console.log(err);
    //     this.fetchError = true;
    //   }
    // },
    async fetchUser() {
      try {
        this.isLoading = true;
        const res2 = await axios.get(
          "http://localhost:3000/users/" + this.$store.state.user.id
        );
        this.userSettings = await res2.data[0];
      } catch (err) {
        console.log(err);
      } finally {
        this.isLoading = false;
      }
    },
    async setProfilePic(img) {
      try {
        this.showSelection = false;
        const pic = img.substr(5, 3);
        this.userSettings.profilepic = pic;
        await this.updateUser();
      } catch (err) {
        console.log(err.message);
      }
    },
    async updateNickname() {
      if (!this.validateNickname) return;
      try {
        await this.updateUser();
      } catch (err) {
        console.log(err.message);
      }
    },
    async updateUser() {
      try {
        //console.log(this.userSettings);
        const res = await axios.patch(
          "http://localhost:3000/users",
          this.userSettings
        );
        this.userSettings = res.data;
        //console.log(this.userSettings);
        this.$store.dispatch("notify", "Profile updated!");
      } catch (err) {
        console.log(err.message);
      }
    },
  },
  mounted() {
    this.fetchUser();
  },
  computed: {
    validateNickname() {
      if (!this.userSettings.nickname) return false;
      if (this.userSettings.nickname == "") {
        return false;
      } else if (this.userSettings.nickname.length > 24) {
        return false;
      }
      return true;
    },
  },
};
</script>
<style lang=""></style>
