<template>
  <div id="app" class="bg-gray-900 min-h-screen text-gray-300">
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

<style lang="scss">
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
