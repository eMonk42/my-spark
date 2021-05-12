<template lang="">
  <div
    class="mx-auto max-w-screen-sm flex-col flex items-center justify-center"
  >
    <NavBar />
    <h1 class="mx-auto text-purple-600 text-6xl my-4">
      Take a note
    </h1>

    <form @submit.prevent="submitForm" class="my-16 w-full">
      <!-- <input v-model="collection" type="text" name="city" list="cityname" />
      <datalist id="cityname">
        <option value="Todo"> </option>
        <option value="Personal"> </option>
      </datalist> -->
      <div name="collection-select">
        <label for="select" class="text-gray-500 block mb-4"
          >Select a Tag for your Note</label
        >
        <span id="select" class="text-gray-500">
          <select
            v-model="collection"
            name=""
            id="select-tag"
            class="bg-transparent border border-transparent text-lg text-purple-400"
          >
            <option value="0" class="">Personal</option>
            <option value="Todo" class="text-gray-500">Todo</option>
          </select>
        </span>
      </div>

      <div class="my-4">
        <label for="title" class="sr-only w-full">Title</label>
        <input
          class="w-full bg-transparent"
          v-model="title"
          type="text"
          name="title"
          placeholder="Title"
        />
        <p v-if="emptyTitle != ''" class="text-sm text-red-600">
          {{ emptyTitle }}
        </p>
      </div>
      <div class="my-4">
        <label for="content" class="sr-only">Content</label>
        <textarea
          spellcheck="false"
          class="w-full bg-transparent resize-none"
          v-model="content"
          placeholder="Content"
        />
      </div>
      <button
        class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        type="submit"
        style="align-self: flex-end; jsutify-self: flex-end;"
      >
        Create
      </button>
      <p
        id="submit-error"
        class="text-sm text-red-600"
        v-if="submitError != ''"
      >
        {{ submitError }}
      </p>
    </form>
    <!-- <div>
      <router-link
        class="border-2 border-purple-600 rounded-lg px-6 py-2 hover:bg-purple-900"
        to="/"
        >Home</router-link
      >
    </div> -->
  </div>
</template>
<script>
import axios from "axios";
import NavBar from "@/components/NavBar.vue";
export default {
  components: { NavBar },
  data() {
    return {
      title: "",
      content: "",
      newNote: {},
      submitError: "",
      emptyTitle: "",
      collection: 0,
    };
  },
  methods: {
    async submitForm() {
      if (this.title == "") {
        this.emptyTitle = "Please enter a title!";
        return;
      }
      this.error = "";
      this.emptyTitle = "";
      try {
        this.newNote.title = this.title;
        this.newNote.content = this.content;
        this.newNote.createdBy = this.$store.state.user.id;
        this.newNote.createdAt = new Date();
        this.newNote.updatedAt = this.newNote.createdAt;
        if (this.collection == 0) {
          this.newNote.collection = "Personal";
        } else {
          this.newNote.collection = this.collection;
        }
        //console.log(this.newNote);
        const response = await axios.post(
          "http://localhost:3000/notes",
          this.newNote
        );
        let id = await response.data.id;
        this.$router.push("/notes/" + id);
        this.$store.dispatch("notify", "Note created successfully!");
      } catch (err) {
        console.log(err.message);
        this.submitError = err.message;
      }
    },
  },
};
</script>
<style lang="scss"></style>
