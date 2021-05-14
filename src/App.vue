<template>
  <div id="app" class="bg-gray-900 min-h-screen text-gray-300">
    <p
      class="text-purple-800 opacity-50 fixed w-full h-full top-0 bottom-0 right-0 left-0 text-center"
      style="font-size: 48rem; pointer-events: none"
    >
      Spark
    </p>
    <img
      class="fixed w-full h-full top-0 bottom-0 right-0 left-0 bg-cover opacity-10"
      style="pointer-events: none"
      :src="bgimage"
      alt="why not?"
    />
    <router-view />
    <!-- notifications start -->
    <div class="fixed bottom-0 right-0 p-4">
      <transition-group name="notification" tag="div" class="space-y-2">
        <div
          v-for="notification of $store.state.notifications"
          :key="notification.id"
          class="notification-item flex justify-end"
        >
          <div
            class="px-4 py-2 border-b-2 border-green-600 text-green-500"
            @click="$store.commit('REMOVE_NOTIFICATION', notification.id)"
          >
            {{ notification.text }}
          </div>
        </div>
      </transition-group>
    </div>
    <!-- notifications end -->
  </div>
</template>

<script>
import bg from "/src/assets/bg01.png";
const bgimage = bg;
export default {
  data() {
    return {
      bgimage,
    };
  },
};
</script>

<style lang="scss">
#app {
  background-image: url("/src/assets/bg01.png");
}
.notification-item {
  transition: all 1s;
}
.notification-enter,
.notification-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.notification-leave-active {
  position: absolute;
}
html {
  scroll-behavior: smooth;
}
</style>
