<script setup lang="ts">
import { reactive } from 'vue'
import NumericString from './components/NumericString.vue';
import DatetimeString from './components/DatetimeString.vue';

const tabs = [
  {
    name: 'Numeric',
    component: NumericString
  },
  {
    name: 'Datetime',
    component: DatetimeString
  }
]

const state = reactive<{
  currentTab: typeof tabs[0]
}>({
  currentTab: tabs[0]
})

</script>

<template>
  <main>
    <div class="flex border-b-solid border border-gray-100">
      <label
        v-for="tab in tabs"
        :key="tab.name"
        class="py-2 px-4 text-gray-300 cursor-pointer"
        :class="{
          'text-gray-900': state.currentTab.name === tab.name
        }"
        @click="state.currentTab = tab">{{ tab.name }}</label>
    </div>
    <component :is="state.currentTab.component" />
  </main>
</template>