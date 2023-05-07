<script setup lang="ts">
import { ref } from 'vue'
import NumericString from './components/NumericString.vue';
import DateTimeString from './components/DateTimeString.vue';

const tabs = [
  {
    name: 'Numeric',
    key: 'numeric',
    component: NumericString
  },
  {
    name: 'DateTime',
    key: 'dateTime',
    component: DateTimeString
  }
]

const currentTab = ref<typeof tabs[0]>(tabs[0])

function onTabChange (tab: typeof tabs[0]) {
  currentTab.value = tab
  parent.postMessage({
    pluginMessage: {
      tab: tab.key,
      action: 'tabChange'
    }
  }, '*')
}

</script>

<template>
  <main>
    <div class="flex border-b-solid border border-gray-100">
      <label
        v-for="tab in tabs"
        :key="tab.name"
        class="py-2 px-4 text-gray-300 cursor-pointer"
        :class="{
          'text-gray-900': currentTab.name === tab.name
        }"
        @click="onTabChange(tab)">{{ tab.name }}</label>
    </div>
    <KeepAlive>
      <component :is="currentTab.component" />
    </KeepAlive>
  </main>
</template>