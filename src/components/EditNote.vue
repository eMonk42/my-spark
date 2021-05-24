<template lang="">
  <div
    v-if="!isLoading"
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
            <option
              v-for="(tag, index) of tags"
              :key="index"
              :value="tag.tag_id"
              >{{ tag.tag_name }}</option
            >
            <!-- <option value="Personal" class="">Personal</option>
            <option value="Todo" class="text-gray-500">Todo</option> -->
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
    <div class="flex justify-between mt-4">
      <div>
        <p class="text-gray-500 text-sm">
          Last modified {{ new Date(note.updatedat).toLocaleDateString() }} by
          {{ userSettings.nickname }}
        </p>
      </div>
      <button
        class="hover:text-purple-500 text-sm border border-transparent px-4 py-2 hover:border-purple-500 bg-gray-900 rounded-lg text-gray-400"
        @click="updateDatabase"
      >
        Done
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import swal from "sweetalert2";

export default {
  props: { note: {} },
  data() {
    return {
      content: "",
      title: "",
      error: "",
      collection: "",
      userSettings: {},
      isLoading: true,
      tags: [
        { tag_id: 1, tag_name: "Personal" },
        { tag_id: 2, tag_name: "Todo" },
      ],
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
        await axios.patch(process.env.SPARK_DB_URL + "/notes/" + this.note.id, {
          title: this.title,
          content: this.content,
          updatedat: new Date(),
          collection: this.collection,
        });
        //console.log(res.data);
        this.$store.dispatch("notify", "Changes successfully saved!");
        this.$emit("note-updated");
      } catch (err) {
        console.log(err.message);
      }
    },
    async deleteNote() {
      try {
        await axios.delete(process.env.SPARK_DB_URL + "/notes/" + this.note.id);
        this.$store.dispatch("notify", "Note deleted!");
      } catch (err) {
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
          background: "#272727",
        })
        .then((res) => {
          if (!res.isConfirmed) return;
          this.deleteNote();
          this.$emit("notedeleted");
        });
    },
    async fetchData() {
      const response = await axios.get(
        process.env.SPARK_DB_URL + "/notes/" + this.noteid
      );
      this.note = await response.data;
      this.content = await this.note.content;
      this.title = await this.note.title;
      this.collection = await this.note.collection;
    },
    async fetchTags() {
      try {
        const res = await axios.get(
          process.env.SPARK_DB_URL + "/tags/" + this.userSettings.id
        );
        this.tags = await res.data.tags;
      } catch (error) {
        this.$store.dispatch("notify", error.message);
      }
    },
    async fetchUser() {
      try {
        const res2 = await axios.get(
          process.env.SPARK_DB_URL + "/users/" + this.$store.state.user.id
        );
        this.userSettings = await res2.data[0];
        await this.fetchTags();
        //console.log(this.userSettings);
        //.filter((user) => {
        //return user.userId == this.$store.state.user.id;
        //})[0];
        // if (!this.userSettings) {
        //   const res3 = await axios.post("http://localhost:3000/users", {
        //     userId: this.$store.state.user.id,
        //     profilepic: "001",
        //     nickname: "name yourself here",
        //     tags: ["Personal", "Todo"],
        //   });
        //   this.userSettings = await res3.data;
        //   console.log("unknown user was saved to database");
        //   //console.log(res3.data);
        // }
      } catch (err) {
        console.log(err);
      }
    },
  },
  async mounted() {
    this.content = this.note.content;
    this.title = this.note.title;
    this.collection = this.note.collection;
    await this.fetchUser();
    //console.log(this.userSettings);
    this.isLoading = false;
    //await this.fetchData();
    //setInterval(this.fetchData, 10000);
  },
};
</script>
