<template lang="">
  <div class="py-6 px-4 max-w-screen-sm mx-auto relative">
    <NavBar />
    <button
      @click="deleteFunction"
      class="absolute top-4 right-2 hover:text-red-400"
    >
      Delete this Note
    </button>
    <header class="mb-4">
      <div name="collection-select">
        <span id="select" class="border text-gray-500 border-transparent">
          <select
            v-model="collection"
            name=""
            id="select-tag"
            class="bg-transparent border border-transparent text-lg text-purple-400"
            @blur="updateDatabase"
          >
            <option value="Personal" class="">Personal</option>
            <option
              value="Todo"
              v-if="value + '' != collection"
              class="text-gray-500"
              >Todo</option
            >
          </select>
        </span>
      </div>
      <input
        type="text"
        v-model="title"
        class="w-full text-4xl font-medium bg-transparent border border-transparent focus:border-purple-600"
        @blur="updateDatabase"
      />
      <p v-if="error != ''" class="text-red-400">{{ error }}</p>
    </header>
    <textarea
      v-model="content"
      class="bg-transparent h-24 leading-relaxed text-lg w-full resize-none border border-transparent focus:border-purple-600"
      @blur="updateDatabase"
    />
    <div class="text-sm text-right text-gray-400 mt-4">
      {{ new Date(note.createdAt).toLocaleDateString() }}
    </div>
  </div>
</template>

<script>
import axios from "axios";
import swal from "sweetalert2";
import NavBar from "@/components/NavBar.vue";

export default {
  components: { NavBar },
  data() {
    return {
      note: {},
      content: "",
      title: "",
      error: "",
      collection: "",
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
        await axios.patch(
          "http://localhost:3000/notes/" + this.$route.params.id,
          {
            title: this.title,
            content: this.content,
            updatedAt: new Date(),
            collection: this.collection,
          }
        );
        this.$store.dispatch("notify", "Changes successfully saved!");
        //this.$router.push("/notes/" + this.$route.params.id);
      } catch (err) {
        //console.log(err.message);
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
      const id = this.$route.params.id;
      const response = await axios.get("http://localhost:3000/notes/" + id);
      this.note = await response.data;
      this.content = await this.note.content;
      this.title = await this.note.title;
      this.collection = await this.note.collection;
    },
  },
  async mounted() {
    this.fetchData();
    //setInterval(this.fetchData, 10000);
  },
};
</script>
