<template>
  <div
    class="p-4 max-w-screen-sm mx-auto bg-gray-900 bg-opacity-80 relative"
    style="z-index: 999;"
  >
    <a id="top-anchor" href="#"></a>
    <NavBar
      @create-clicked="showCreate = true"
      :profilepic="
        userSettings.profilepic
          ? pictures[parseInt(userSettings.profilepic) - 1]
          : pictures[0]
      "
    />
    <!-- START FILTER OPTIONS -->
    <div
      class="flex justify-between my-6 pb-4 border-b border-purple-700 bg-gray-900"
    >
      <input
        class="border border-transparent bg-gray-800 rounded-sm focus:border-purple-500 pl-2"
        type="search"
        placeholder="Search your Notes"
        v-model="query"
      />
      <!-- START TAG SELECT -->
      <div class="pt-1">
        <label for="select" class="text-gray-500 mr-4">Filter by Tag</label>
        <span id="select" class="text-gray-500">
          <select
            v-model="collection"
            name=""
            id="select-tag"
            class="bg-transparent border border-transparent text-indigo-500 cursor-pointer"
          >
            <option value="0" class="">All</option>
            <option
              v-for="(tag, index) of tags"
              :key="index"
              :value="tag.tag_id"
              >{{ tag.tag_name }}</option
            >
            <!-- <option value="Personal" class="text-gray-500">Personal</option>
            <option value="Todo" class="text-gray-500">Todo</option> -->
          </select>
        </span>
      </div>
      <!-- END TAG SELECT -->
      <div class="w-8 h-8">
        <a
          class="bg-gray-800 rounded-full block w-full h-full text-center hover:bg-gray-700 font-bold hover:scale-105 transform transition-all duration-100"
          href="#"
          style="padding-top: 1px;"
          @click="showCreate = !showCreate"
          ><span v-if="!showCreate">+</span><span v-if="showCreate">-</span></a
        >
      </div>
      <div class="w-8 h-8">
        <a
          class="bg-gray-800 rounded-full block w-full h-full text-center hover:bg-gray-700 font-bold hover:scale-105 transform transition-all duration-100"
          href="#"
          style="padding-top: 2px;"
          @click="(reverseList = !reverseList), fetchAllNotes()"
          ><i class="text-sm fas fa-sort"></i
        ></a>
      </div>
    </div>
    <!-- END FILTER OPTIONS -->

    <CreateNew
      v-if="showCreate"
      @discard-note="showCreate = false"
      @new-note-created="(showCreate = false), fetchAllNotes()"
      @tags-updated="fetchUser(), fetchAllNotes()"
      @tags-updated-soft="fetchUser()"
      @tags-synced="fetchTags()"
    />
    <!-- ERRORS AND WARNINGS START -->
    <!-- NO SEARCH RESULTS -->
    <div
      v-if="checkIfNoResults() && !isLoading && error == ''"
      class="flex-row place-items-center mb-8 bg-gray-900 rounded-lg text-center"
    >
      <i
        class="mx-auto text-6xl far fa-sad-tear opacity-80 text-purple-400 mb-4"
      ></i>
      <p class="text-grtay-500">
        Sorry, there are no Notes available that match your search
      </p>
    </div>
    <!-- LOADING -->
    <div class="text-purple-500 text-xl mt-16" v-if="isLoading">
      <img class="mx-auto w-32" :src="loading" alt="" />
    </div>
    <!-- ERROR FETCHING DATA -->
    <div
      class="text-red-500 text-xl text-center mt-16 flex-row place-items-center"
      v-if="error != ''"
    >
      <i class="text-6xl far fa-frown-open mb-4"></i>
      <p>{{ error }}</p>
    </div>
    <!-- ERRORS AND WARNINGS END -->
    <!-- START V-FOR NOTES -->
    <div
      class="relative block bg-gray-900 rounded-lg"
      v-for="note in notes"
      :key="note.id"
    >
      <div
        v-if="
          checkForQuery(note) &&
            (collection == 0 || collection == note.collection)
        "
        class="block mt-4"
      >
        <!-- START DIVIDER -->
        <div
          v-if="checkIfDivider(note)"
          class="bg-purple-900 opacity-80 mb-2 py-1 flex justify-between cursor-pointer rounded-md"
          @click="toggleDateByDay(note.createdat)"
        >
          <p class="pl-2 text-xs text-purple-200 opacity-80">
            {{ new Date(note.createdat).toLocaleDateString() }}
          </p>
          <p
            v-if="
              dateFilter.indexOf(
                new Date(note.createdat).toLocaleDateString()
              ) == -1
            "
            class="pr-2 text-xs text-purple-200 opacity-80"
          >
            <i
              class="fas fa-angle-up transform hover:scale-150 transition-all duration-100"
            ></i>
          </p>
          <p
            v-if="
              dateFilter.indexOf(
                new Date(note.createdat).toLocaleDateString()
              ) != -1
            "
            class="pr-2 text-xs text-purple-200 opacity-80"
          >
            <i
              class="fas fa-angle-down transform hover:scale-150 transition-all duration-100"
            ></i>
          </p>
        </div>
        <!-- END DIVIDER -->
        <!-- START NOTE-DIV -->
        <div
          v-if="
            dateFilter.indexOf(new Date(note.createdat).toLocaleDateString()) ==
              -1
          "
          class="rounded-sm p-4"
          :class="{
            'border-b border-gray-500': checkIfBorder(note),
          }"
        >
          <EditNote
            class="transform-none hover:scale-100"
            v-if="currentlyEditingNote == note.id"
            @note-updated="fetchAllNotes(), (currentlyEditingNote = '')"
            :note="note"
            @click.prevent=""
            @notedeleted="runOnDeleteByEdit"
          />
          <!-- START NOTE MAIN -->
          <div v-else class="">
            <div class="flex justify-between">
              <h3 class="text-sm text-indigo-500">
                <!-- {{
                  tags.filter((tag) => {
                    return tag.tag_id == note.collection;
                  })[0].tag_name
                }} -->
                {{ tagName(note) }}
              </h3>
              <button
                class="hover:text-red-400 text-gray-400 text-sm"
                @click.prevent="deleteFunction(note.id)"
              >
                Delete this one
              </button>
            </div>
            <h2 class="mt-2 text-lg font-semibold text-gray-300">
              {{ note.title }}
            </h2>
            <div class="relative">
              <div
                v-if="
                  note.content.length > maxContentLength &&
                    expandNote != note.id
                "
                class="text-gray-400"
              >
                {{ note.content.substr(0, maxContentLength - 4) }}
                <span
                  class="text-purple-600 text-lg cursor-pointer hover:scale-120 transform transition-all duration-200"
                  @click="expandNote = note.id"
                >
                  ... see more</span
                >
              </div>
              <div v-else class="text-gray-400">{{ note.content }}</div>
              <i
                class="absolute right-0 bottom-0 far fa-edit text-gray-500 text-sm hover:text-purple-600 hover:scale-110 transform transition-all duration-150 cursor-pointer"
                @click="currentlyEditingNote = note.id"
              ></i>
            </div>
          </div>
          <!-- END NOTE MAIN -->
          <!-- START NOTE-BOTTOM -->
          <div class="flex justify-between">
            <p class="flex text-sm text-gray-500 mt-2 text-right">
              Created by
              <router-link
                :to="{
                  name: 'Profile',
                  params: { userid: $store.state.user.id },
                }"
              >
                <span class="flex ml-2">
                  {{
                    userSettings.nickname == "name yourself here"
                      ? $store.state.user.email
                      : userSettings.nickname
                  }}
                  <img
                    class="rounded-full ml-2"
                    v-if="userSettings"
                    :src="pictures[parseInt(userSettings.profilepic) - 1]"
                    style="height: 20px; width: 20px;"
                    alt="Profilepic"
                /></span>
              </router-link>
            </p>
            <p class="text-sm text-gray-400 mt-2 text-right">
              {{ new Date(note.createdat).toLocaleDateString() }}
            </p>
          </div>
          <!-- END NOTE-BOTTOM -->
        </div>
        <!-- END NOTE-DIV -->
      </div>
    </div>

    <!-- END V-FOR NOTES -->
    <!-- START BOTTOM BAR -->
    <div
      v-if="!checkIfNoResults() && error == '' && !isLoading"
      class="flex justify-center pt-4 "
      :class="{ 'border-t border-gray-500': notes != [] }"
    >
      <div class="w-8 h-8">
        <a
          class="bg-gray-800 rounded-full block w-full h-full text-center hover:bg-gray-700 hover:scale-105 transform transition-all duration-100"
          href="#top-anchor"
          style="padding-top: 3px;"
          ><i class="fas fa-arrow-up text-sm"></i
        ></a>
      </div>
    </div>
    <!-- END BOTTOM BAR -->
    <a id="bottom-anchor" href="#"></a>
  </div>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import swal from "sweetalert2";
import NavBar from "@/components/NavBar.vue";
import CreateNew from "@/components/CreateNew.vue";
import EditNote from "@/components/EditNote.vue";
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

export default Vue.extend({
  name: "Dashboard",
  components: { NavBar, CreateNew, EditNote },
  data() {
    return {
      notes: [],
      query: "",
      isReady: false,
      collection: 0,
      showCreate: false,
      userSettings: {},
      tags: [
        { tag_id: 1, tag_name: "Personal" },
        { tag_id: 2, tag_name: "Todo" },
      ],
      dateFilter: [],
      pictures,
      maxContentLength: 128,
      currentlyEditingNote: "",
      expandNote: "",
      reverseList: false,
      isLoading: true,
      error: "",
      loading,
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
        await axios.delete("http://localhost:3000/notes/" + id);
        this.$store.dispatch("notify", "Note deleted");
        this.fetchAllNotes();
      } catch (err) {
        this.$store.dispatch("notify", "Ooops something went wrong!");
        console.log(err.message);
      }
    },
    async fetchAllNotes() {
      try {
        this.isLoading = true;
        this.error = "";
        await this.fetchUser();
        await this.fetchTags();
        const response = await axios.get("http://localhost:3000/notes");
        this.notes = response.data;
        // filter to only display notes created by current user
        // this.notes = this.notes.filter((note) => {
        //   return note.createdBy == this.$store.state.user.id;
        // });
        //------------------------------
        if (this.reverseList) this.notes.reverse();
        this.isReady = true;
      } catch (err) {
        this.$store.dispatch("notify", err.message);
        this.error = "Something went wrong! Sorry!";
      } finally {
        this.isLoading = false;
      }
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
          background: "#272727",
        })
        .then((res) => {
          if (!res.isConfirmed) return;
          this.deleteNote(id);
        });
    },
    checkForQuery(note) {
      if (!this.isReady) return false;
      const arr = this.query.split(" ");
      let matches = true;
      const date = new Date(note.createdat).toLocaleDateString();
      let dateString =
        date.replace("/", ".").replace("/", ".") +
        " 0" +
        date.replace("/", " ").replace("/", " ") +
        " 0" +
        date +
        " " +
        date.replace("/", ".0").replace("/", ".") +
        " 0" +
        date.replace("/", " 0").replace("/", " ") +
        " 0" +
        date.replace("/", "/0") +
        " " +
        this.$store.state.user.email +
        " " +
        this.userSettings.nickname +
        " ";
      if (!this.isLoading && this.isReady && this.tags) {
        //console.log(this.tags, note.collection);
        let tag = this.tags.filter((tag) => {
          return tag.tag_id == note.collection;
        })[0]; //.tag_name;
        if (tag) dateString += tag.tag_name;
      }
      arr.forEach((word) => {
        if (
          (note.content.toLowerCase().indexOf(word.toLowerCase()) !== -1 ||
            dateString.toLowerCase().indexOf(word.toLowerCase()) !== -1 ||
            note.title.toLowerCase().indexOf(word.toLowerCase()) !== -1) &&
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
    async fetchTags() {
      try {
        const res = await axios.get(
          "http://localhost:3000/tags/" + this.userSettings.id
        );
        this.tags = await res.data.tags;
        //console.log(this.tags);
      } catch (error) {
        this.$store.dispatch("notify", error.message);
      }
    },
    async fetchUser() {
      try {
        const res2 = await axios.get(
          "http://localhost:3000/users/" + this.$store.state.user.id
        );
        this.userSettings = await res2.data[0];
        //await this.fetchTags();
      } catch (err) {
        console.log(err);
      }
    },
    checkIfBorder(note) {
      //if (this.maxContentLength > 1) return true;
      if (this.notes == []) return false;
      const index = this.notes.indexOf(note);
      if (index == this.notes.length - 1) return false;
      for (let i = index + 1; i < this.notes.length; i++) {
        if (
          this.checkForQuery(this.notes[i]) &&
          (this.collection == 0 || this.collection == this.notes[i].collection)
        ) {
          if (this.checkIfDivider(this.notes[i])) {
            return false;
          } else {
            return true;
          }
        }
      }
      return false;
    },
    checkIfDivider(note) {
      if (this.notes == []) return false;
      const index = this.notes.indexOf(note);
      if (index == 0) return true;
      for (let i = index - 1; i >= 0; i--) {
        if (
          this.checkForQuery(this.notes[i]) &&
          (this.collection == 0 || this.collection == this.notes[i].collection)
        ) {
          if (
            new Date(this.notes[index].createdat).toLocaleDateString() !=
            new Date(this.notes[i].createdat).toLocaleDateString()
          ) {
            return true;
          } else {
            return false;
          }
        }
      }
      return true;
    },
    toggleDateByDay(noteDate) {
      if (
        this.dateFilter.indexOf(new Date(noteDate).toLocaleDateString()) == -1
      ) {
        this.dateFilter.push(new Date(noteDate).toLocaleDateString());
        console.log(this.dateFilter);
      } else {
        this.dateFilter = this.dateFilter.filter((date) => {
          return date != new Date(noteDate).toLocaleDateString();
        });
      }
    },
    checkIfNoResults() {
      if (!this.notes) return true;
      for (let i = 0; i < this.notes.length; i++) {
        if (
          this.checkForQuery(this.notes[i]) &&
          (this.collection == 0 || this.collection == this.notes[i].collection)
        ) {
          return false;
        }
      }
      return true;
    },
    async runOnDeleteByEdit() {
      this.currentlyEditingNote = "";
      await this.fetchAllNotes();
    },
    tagName(note) {
      //console.log("tagName() here");
      for (let i = 0; i < this.tags.length; i++) {
        if (this.tags[i].tag_id == note.collection) {
          //console.log("was here");
          return this.tags[i].tag_name;
        }
      }
      return "";
    },
  },
});
</script>
