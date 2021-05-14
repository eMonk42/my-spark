<template lang="">
  <div>
    <h1 class="mx-auto text-purple-600 text-2xl my-4">
      Take a note
    </h1>
    <!-- START NEW TAG CREATION -->
    <div
      v-if="showNewTag"
      class="fixed w-full h-full top-0 right-0 bottom-0 left-0 bg-gray-800 bg-opacity-20 flex place-items-center"
      style="z-index: 99;"
    >
      <div
        class="bg-gray-800 mx-auto min-w-64 p-8 text-gray-800 flex-col place-items-center"
        style="z-index: 999;"
      >
        <!-- ACTUAL CONTENT -->
        <div class="my-auto flex-col">
          <div
            v-for="(tag, index) of userSettings.tags"
            :key="index"
            class="flex py-2"
          >
            <input
              class="rounded-sm bg-transparent border border-transparent hover:border-purple-500 text-gray-400 pl-2 focus:text-purple-400"
              v-model="userSettings.tags[index]"
              type="text"
            />
            <div>
              <a
                class="text-gray-400 hover:text-red-500 px-2"
                href="#"
                @click="deleteTag(tag)"
                ><i class="fas fa-trash-alt"></i
              ></a>
            </div>
          </div>
        </div>
        <!-- ADD BUTTON -->
        <div class="flex justify-center">
          <div class="w-8 h-8 mt-4">
            <a
              class="bg-gray-400 mx-auto rounded-full block w-full h-full text-center hover:bg-gray-300 font-bold hover:scale-105 transform transition-all duration-100"
              href="#"
              style="padding-top: 1px;"
              @click="userSettings.tags.push('my new Tag')"
              ><span>+</span></a
            >
          </div>
        </div>
        <!-- BUTTONS -->
        <div class="flex justify-between mt-8">
          <button
            class="border border-gray-400 text-gray-400 py-2 px-4 rounded-lg hover:border-purple-500 hover:text-purple-300"
            @click="
              (showNewTag = false), $emit('tags-updated-sof'), fetchUser()
            "
          >
            Discard
          </button>
          <button
            class="bg-purple-800 text-white py-2 px-4 rounded-lg hover:bg-purple-600 -mr-2"
            @click="submitTags"
          >
            Done
          </button>
        </div>
        <!-- ACTUAL CONTENT -->
      </div>
    </div>
    <!-- END NEW TAG CREATION -->
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
            <option
              v-for="(tag, index) of userSettings.tags"
              :key="index"
              :value="index == 0 ? 0 : tag"
              >{{ tag }}</option
            >
          </select>
        </span>
        <div class="w-8 h-8 inline-block ml-4">
          <a
            class="bg-gray-800 rounded-full block w-full h-full text-center hover:bg-gray-700 font-bold hover:scale-105 transform transition-all duration-100"
            href="#"
            style="padding-top: 1px;"
            @click="showNewTag = !showNewTag"
            ><span v-if="!showNewTag">+</span
            ><span v-if="showNewTag">-</span></a
          >
        </div>
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
      showNewTag: false,
      userSettings: {},
      notes: [],
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
    deleteTag(tag) {
      if (this.userSettings.tags.length < 2) {
        this.$store.dispatch("notify", "you must have at least one tag");
        return;
      }
      this.userSettings.tags = this.userSettings.tags.filter((t) => {
        return t != tag;
      });
    },
    async fetchAllNotes() {
      try {
        this.isLoading = true;
        this.error = "";
        const response = await axios.get("http://localhost:3000/notes");
        this.notes = response.data;
        if (this.reverseList) this.notes.reverse();
        this.isReady = true;
      } catch (err) {
        this.$store.dispatch("notify", err.message);
        this.error = "Something went wrong! Sorry!";
      } finally {
        this.isLoading = false;
      }
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
            tags: ["Personal", "Todo"],
          });
          this.userSettings = await res3.data;
          //console.log(res3.data);
        }
      } catch (err) {
        console.log(err);
      }
    },
    async submitTags() {
      try {
        await axios.patch(
          "http://localhost:3000/users/" + this.userSettings.id,
          { tags: this.userSettings.tags }
        );
        for (let i = 0; i < this.notes.length; i++) {
          if (this.userSettings.tags.indexOf(this.notes[i].collection) == -1) {
            await axios.patch(
              "http://localhost:3000/notes/" + this.notes[i].id,
              { collection: this.userSettings.tags[0] }
            );
          }
        }
        this.$store.dispatch("notify", "Tags updated!");
        this.showNewTag = false;
        this.$emit("tags-updated");
        //console.log(res.data);
      } catch (err) {
        console.log(err.message);
        this.$store.dispatch("notify", "Error sending Data");
      }
    },
  },
  mounted() {
    this.fetchAllNotes();
    this.fetchUser();
  },
};
</script>
<style lang="scss"></style>
