<template>
  <div class="p-4 max-w-screen-sm mx-auto">
    <NavBar />
    <!-- <div class="flex justify-end">
      <router-link
        class="border-2 border-purple-600 rounded-lg px-6 py-2 hover:bg-purple-900"
        :to="{ name: 'CreateNote' }"
        >Create a Note</router-link
      >
    </div> -->
    <div
      id="filter-options"
      class="flex justify-between my-6 pb-4 border-b border-purple-500"
    >
      <input
        class="border border-transparent focus:border-purple-500"
        type="search"
        placeholder="Search your Notes"
        v-model="query"
      />
      <div name="collection-select">
        <label for="select" class="text-gray-500 mr-4">Filter by Tag</label>
        <span id="select" class="text-gray-500">
          <select
            v-model="collection"
            name=""
            id="select-tag"
            class="bg-transparent border border-transparent text-indigo-500"
          >
            <option value="0" class="">All</option>
            <option value="Personal" class="text-gray-500">Personal</option>
            <option value="Todo" class="text-gray-500">Todo</option>
          </select>
        </span>
      </div>
    </div>

    <div class="relative block" v-for="note in notes" :key="note.id">
      <router-link
        :to="{ name: 'Note', params: { id: note.id } }"
        v-if="
          checkForQuery(note) &&
            (collection == 0 || collection == note.collection)
        "
        class="block border-b my-4 py-2 border-gray-500"
      >
        <button
          class="absolute top-4 right-0 hover:text-red-400"
          @click.prevent="deleteFunction(note.id)"
        >
          Delete this one
        </button>
        <div>
          <header class="mb-2">
            <h3 class="text-xs text-indigo-500">
              {{ note.collection }}
            </h3>
            <h2 class="text-lg font-medium">{{ note.title }}</h2>
          </header>
          <p>{{ note.content }}</p>
          <p class="text-sm text-gray-400 mt-2 text-right">
            {{ new Date(note.createdAt).toLocaleDateString() }}
          </p>
        </div>
      </router-link>
    </div>
    <div class="flex mt-8 justify-end">
      <button @click="logout" class="text-sm hover:text-indigo-600">
        Logout
      </button>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import swal from "sweetalert2";
import NavBar from "@/components/NavBar.vue";

export default Vue.extend({
  name: "Dashboard",
  components: { NavBar },
  data() {
    return {
      notes: [],
      query: "",
      isReady: false,
      collection: 0,
    };
  },
  mounted() {
    this.fetchAllNotes();
  },
  methods: {
    logout() {
      this.$store.commit("CLEAR");
      this.$router.push({ name: "Login" });
    },
    async deleteNote(id) {
      try {
        const res = await axios.delete("http://localhost:3000/notes/" + id);
        console.log(res.data);
        this.$store.dispatch("notify", "Note deleted");
        this.fetchAllNotes();
      } catch (err) {
        this.$store.dispatch("notify", "Ooops something went wrong!");
        console.log(err.message);
      }
    },
    async fetchAllNotes() {
      const response = await axios.get("http://localhost:3000/notes");
      this.notes = response.data;
      this.isReady = true;
    },
    async deleteFunction(id) {
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
          this.deleteNote(id);
        });
    },
    checkForQuery(item) {
      if (!this.isReady) return false;
      const arr = this.query.split(" ");
      let matches = true;
      arr.forEach((word) => {
        if (
          (item.content.toLowerCase().indexOf(word.toLowerCase()) !== -1 ||
            item.title.toLowerCase().indexOf(word.toLowerCase()) !== -1) &&
          matches
        ) {
          matches = true;
        } else {
          matches = false;
        }
      });
      if (matches) {
        return true;
      } else {
        return false;
      }
    },
  },
});
</script>
