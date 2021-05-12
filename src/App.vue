<template>
  <div id="app" class="bg-gray-50 min-h-screen">
    <router-view />
    <div class="fixed bottom-0 right-0 p-4">
      <transition-group name="notification" tag="div" class="space-y-2">
        <div
          v-for="notification of $store.state.notifications"
          :key="notification.id"
          class="notification-item flex justify-end"
        >
          <div
            class="px-4 py-2 bg-green-500 border-2 border-green-800 text-green-700 rounded-lg"
            @click="$store.commit('REMOVE_NOTIFICATION', notification.id)"
          >
            {{ notification.text }}
          </div>
        </div>
      </transition-group>
    </div>
    <!-- <button @click="$store.dispatch('notify', 'my new notification')">
      notify
    </button> -->
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
</style>
