import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import { nanoid } from "nanoid";

Vue.use(Vuex);

interface Notification {
  id: string;
  text: string;
}

export default new Vuex.Store({
  plugins: [createPersistedState({ paths: ["user", "token"] })],
  state: {
    user: null,
    token: null,
    notifications: [] as Notification[],
  },
  mutations: {
    SET_USER(state, { user, token }) {
      state.user = user;
      state.token = token;
    },
    CLEAR(state) {
      state.user = null;
      state.token = null;
    },
    ADD_NOTIFICATION(state, payload) {
      state.notifications.push(payload);
    },
    REMOVE_NOTIFICATION(state, id) {
      state.notifications = state.notifications.filter((notification) => {
        return notification.id != id;
      });
    },
  },
  actions: {
    notify(store, text) {
      const id = nanoid();
      store.commit("ADD_NOTIFICATION", {
        id,
        text,
      });

      setTimeout(() => {
        store.commit("REMOVE_NOTIFICATION", id);
      }, 2000);
    },
  },
  modules: {},
});
