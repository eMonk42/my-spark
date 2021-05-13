<template lang="">
  <div>
    <h1 class="mx-auto text-purple-600 text-2xl my-4">
      Take a note
    </h1>

    <form @submit.prevent="submitForm" class="my-8 w-full">
      <div name="collection-select">
        <label for="select" class="text-gray-500 block mb-4"
          >Select a Tag for your Note</label
        >
        <span id="select" class="text-gray-500">
          <select
            v-model="collection"
            name=""
            id="select-tag"
            class="bg-transparent border border-transparent text-lg text-indigo-500"
          >
            <option value="0" class="">Personal</option>
            <option value="Todo" class="text-gray-500">Todo</option>
          </select>
        </span>
      </div>

      <div class="my-4">
        <label for="title" class="sr-only w-full">Title</label>
        <input
          class="w-full border-l-2 border-purple-500 pl-4 bg-transparent"
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
          class="w-full bg-transparent resize-none border-l-2 border-purple-500 pl-4"
          v-model="content"
          placeholder="Content"
        />
      </div>
      <div class="flex justify-between">
        <div
          class="text-gray-300 py-1 px-4 border border-gray-500 rounded-lg border-opacity-30 hover:border-red-200 hover:border-opacity-20 hover:text-red-500 cursor-pointer"
          @click="$emit('discard-note')"
        >
          <a class=" text-sm" href="#">Discard Note</a>
        </div>
        <div>
          <button
            class="ml-auto py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-purple-200 text-opacity-80 hover:text-white bg-purple-800 bg-opacity-70 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
        </div>
      </div>
    </form>
  </div>
</template>
<script>
import axios from "axios";
export default {
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
        await axios.post("http://localhost:3000/notes", this.newNote);
        this.$store.dispatch("notify", "Note created successfully!");
        this.$emit("new-note-created");
      } catch (err) {
        console.log(err.message);
        this.submitError = err.message;
        this.$store.dispatch("notify", err.message);
      }
    },
  },
};
</script>
<style lang="scss"></style>
