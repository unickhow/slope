<script setup lang="ts">
import { ref } from 'vue'

const show = ref(false)
</script>

<template>
  <div class="relative inline-block" @mouseover="show = true" @mouseleave="show = false">
    <slot></slot>
    <div
      v-if="show"
      class="absolute opacity-90 w-[150px] z-10 p-1 bg-gray-500 text-white rounded shadow-lg text-xs"
      style="bottom: 150%; left: 50%; transform: translateX(-50%);"
    >
      <slot name="content"></slot>
    </div>
  </div>
</template>
