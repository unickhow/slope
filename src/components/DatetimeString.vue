<script setup lang="ts">
import { reactive, computed, ref } from 'vue'
// @ts-ignore
import { DatePicker } from 'v-calendar';
import 'v-calendar/style.css';
import { ORDER } from '../types/Order'
import OrderTypes from './OrderTypes.vue';
import dayjs from 'dayjs'
import { DateFormats } from '../types/DateFormats'
import AppTooltip from './AppTooltip.vue';

const state = reactive<{
  orderType: ORDER,
  selectedDate: string,
  format: DateFormats
}>({
  orderType: ORDER.ASC,
  selectedDate: dayjs().format(DateFormats.dL),
  format: DateFormats.dL
})

const datePicker = ref(null)
const masks = computed(() => ({
  weekdays: 'WWW'
}))

const formattedDate = computed(() => {
  return dayjs(state.selectedDate).format(state.format)
})
const dateFormatOptions = Object.entries(DateFormats).map(([key, value]) => ({
  label: key,
  value
}))

function handleGenerate () {
  const orderType = state.orderType
  parent.postMessage({
    pluginMessage: {
      tab: 'dateTime',
      action: 'generate',
      orderType,
      selectedDate: state.selectedDate,
      format: state.format
    }
  }, '*')
}

function handleCancel () {
  parent.postMessage({ pluginMessage: { action: 'cancel' } }, '*')
}
</script>

<template>
  <div class="date-time-string flex flex-col gap-3 m-4">
    <DatePicker
      ref="datePicker"
      v-model.string="state.selectedDate"
      borderless
      expanded
      locale="en-US"
      :masks="masks"
      color="slope-primary"
      title-position="left" />

    <p class="text-center m-0">{{ formattedDate }}</p>
    <div class="flex flex-wrap justify-center">
      <select
        v-model="state.format"
        name="format"
        id="formatSelect"
        class="p-2 rounded-md">
        <option v-for="format in dateFormatOptions" :key="format.label" :value="format.value">
          {{ format.value }}
        </option>
      </select>
    </div>

    <div class="flex gap-2 items-center justify-center">
      <OrderTypes
        v-model="state.orderType"
        hideRandom
        class="justify-center" />
      <AppTooltip>
        <template #content>
          <p class="text-center m-0">Generate order works on date only. ('D' part)</p>
        </template>
        <i class="i-mdi-alert-box text-primary block cursor-help" />
      </AppTooltip>
    </div>

    <div class="flex gap-2 fixed bottom-0 left-0 w-full p-4 bg-white">
      <button
        id="cancelButton"
        class="button button-ghost text-gray-500 active:text-gray-900 w-1/3"
        @click="handleCancel">
        <i class="i-mdi-close"></i>
        <span>Cancel</span>
      </button>
      <button
        id="generateButton"
        class="button button-primary flex-1"
        @click="handleGenerate">
        <i class="i-mdi-check"></i>
        <span>Generate</span>
      </button>
    </div>
  </div>
</template>
