<template lang="">
  <div
    class="py-6 px-4 mx-auto cursor-default shadow-inner rounded-lg border border-gray-500 border-opacity-10 hover:bg-gray-800 transform scale-x-110"
  >
    <div class="flex justify-between">
      <div name="collection-select">
        <span id="select" class="border text-gray-500 border-transparent">
          <select
            v-model="collection"
            name=""
            id="select-tag"
            class="bg-transparent border border-transparent text-base text-indigo-500"
            @click.prevent=""
          >
            <option value="Personal" class="">Personal</option>
            <option value="Todo" class="text-gray-500">Todo</option>
          </select>
        </span>
      </div>
      <button
        @click="deleteFunction"
        class="hover:text-red-400 text-gray-400 text-sm"
      >
        Delete this Note
      </button>
    </div>
    <input
      type="text"
      v-model="title"
      class="w-full bg-transparent border border-transparent focus:border-purple-600 focus:bg-gray-900 mt-2 text-lg font-semibold text-gray-300"
    />
    <p v-if="error != ''" class="text-red-400">{{ error }}</p>
    <textarea
      v-model="content"
      class="bg-transparent text-gray-400 h-24 leading-relaxed text-lg w-full resize-none border border-transparent focus:border-purple-600 focus:bg-gray-900"
      @click.prevent=""
      style="min-height: 12rem;"
    />
    <button
      class="hover:text-red-500 text-sm text-gray-400"
      @click="updateDatabase"
    >
      Done
    </button>
  </div>
</template>

<script>
import axios from "axios";
import swal from "sweetalert2";
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
  props: { noteid: {} },
  data() {
    return {
      note: {},
      content: "",
      title: "",
      error: "",
      collection: "",
      pictures,
      userSettings: {},
    };
  },
  methods: {
    async updateDatabase() {
      this.error = "";
      if (this.title == "") {
        this.error = "Please enter a title!";
        return;
      }
      try {
        await axios.patch("http://localhost:3000/notes/" + this.note.id, {
          title: this.title,
          content: this.content,
          updatedAt: new Date(),
          collection: this.collection,
        });
        this.$store.dispatch("notify", "Changes successfully saved!");
        this.$emit("note-updated");
      } catch (err) {
        console.log(err.message);
      }
    },
    async deleteNote() {
      try {
        await axios.delete("http://localhost:3000/notes/" + this.note.id);
        this.$store.dispatch("notify", "Note deleted!");
        this.$router.push("/");
      } catch (err) {
        //console.log(err.message);
        this.$store.dispatch(
          "notify",
          "Sorry but I couldn't delete this Note."
        );
      }
    },
    async deleteFunction() {
      await swal
        .fire({
          title: "Are you sure?",
          text: "You will not be able to recover this imaginary file!",
          type: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, delete it!",
          cancelButtonText: "No, keep it",
        })
        .then((res) => {
          if (!res.isConfirmed) return;
          this.deleteNote();
        });
    },
    async fetchData() {
      const response = await axios.get(
        "http://localhost:3000/notes/" + this.noteid
      );
      this.note = await response.data;
      this.content = await this.note.content;
      this.title = await this.note.title;
      this.collection = await this.note.collection;
    },
    async fetchUser() {
      try {
        const res2 = await axios.get("http://localhost:3000/users");
        this.userSettings = await res2.data.filter((user) => {
          return user.userId == this.$store.state.user.id;
        })[0];
        // console.log(this.userSettings);
        if (!this.userSettings) {
          const res3 = await axios.post("http://localhost:3000/users", {
            userId: this.$store.state.user.id,
            profilePic: "001",
            nickName: "name yourself here",
          });
          this.userSettings = await res3.data;
          console.log(res3.data);
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
  async mounted() {
    this.fetchData();
    this.fetchUser();
    //setInterval(this.fetchData, 10000);
  },
};
</script>
