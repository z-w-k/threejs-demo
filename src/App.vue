<template>
  <div ref="container" class="w-[100vw] h-[100vh] relative">
    <div class="fixed top-0 left-0 h-[100vh] w-[100vw] text-white">
      <RouterView v-slot="{ Component }">
        <transition :name="route.fullPath.includes('loading') ? 'loadingMask' : 'fade'" mode="out-in">
          <component :is="Component"></component>
        </transition>
      </RouterView>
    </div>
  </div>
</template>
<script setup lang="ts">
import { MainStore } from './store/mainStore'
const mainStore = MainStore()
const container = ref()
const route = useRoute()
const router = useRouter()
if (route.fullPath !== '/loading') {
  router.replace({ name: 'loading' })
}
onMounted(() => {
  mainStore.init(container.value as HTMLElement)
  mainStore.animate()
})
</script>
<style lang="scss">
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.loadingMask-leave-to {
  opacity: 0;
}

.loadingMask-leave-from {
  opacity: 1;
}

.loadingMask-leave-active {
  transition: opacity 0.4s ease;
}

.threeScene {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
}
</style>
