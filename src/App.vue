<template>
  <div ref="container" class="relative w-[100vw] h-[100vh]">
    <div class="fixed top-0 left-0 h-[100vh] w-[100vw] text-white">
      <RouterView v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component"></component>
        </transition>
      </RouterView>
    </div>
  </div>
</template>
<script setup lang="ts">
import { MainStore } from './store/mainStore'
import './assets/css/app.scss'
const mainStore = MainStore()
const container = ref()
onMounted(() => {
  mainStore.init(container.value as HTMLElement)
  mainStore.animate()
})
</script>
<style lang="scss" scoped></style>
