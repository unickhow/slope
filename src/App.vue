<script setup lang="ts">
import { reactive, computed } from 'vue'

const state = reactive<{
  textString: string;
  numberString: string;
  orderDirection: 'asc' | 'desc'
  isReverseStringNumber: boolean
}>({
  textString: '',
  numberString: '',
  orderDirection: 'asc',
  isReverseStringNumber: false
})

const isAllowGenerate = computed(() => {
  return !!state.numberString
})

function sanitizeInput() {
  state.numberString = state.numberString.replace(/[^0-9\.]/g, '')
}

function handleGenerate () {
  if (!isAllowGenerate.value) return false

  const prefix = state.textString
  const baseNumber = state.numberString
  const order = state.orderDirection
  const isReverse = state.isReverseStringNumber
  parent.postMessage({
    pluginMessage: {
      type: 'generate',
      prefix,
      baseNumber,
      order,
      isReverse
    }
  }, '*')
}

function handleCancel () {
  parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*')
}
</script>

<template>
  <div class="flex flex-col gap-3 m-4">
    <div class="flex items-center gap-1">
      <div class="w-full">
        <input
          v-show="!state.isReverseStringNumber"
          v-model="state.textString"
          type="text"
          id="prefix-head"
          class="input__field w-full text-right"
          placeholder="e.g. SKU (optional)"
          @keydown.enter="handleGenerate">
        <input
          v-show="state.isReverseStringNumber"
          v-model="state.numberString"
          type="text"
          id="base-number-head"
          class="input__field w-full text-right"
          placeholder="e.g. 0013845"
          @input="sanitizeInput"
          @keydown.enter="handleGenerate">
      </div>
      <button
        class="button button-ghost text-gray-800"
        @click="state.isReverseStringNumber = !state.isReverseStringNumber">
        <div class="i-mdi-swap-horizontal text-2xl active:text-primary-400"></div>
      </button>
      <div class="w-full">
        <input
          v-show="!state.isReverseStringNumber"
          v-model="state.numberString"
          type="text"
          id="base-number-tail"
          class="input__field w-full"
          placeholder="e.g. 0013845"
          @input="sanitizeInput"
          @keydown.enter="handleGenerate">
        <input
          v-show="state.isReverseStringNumber"
          v-model="state.textString"
          type="text"
          id="prefix-tail"
          class="input__field w-full"
          placeholder="e.g. SKU (optional)"
          @keydown.enter="handleGenerate">
      </div>
    </div>
    <div class="flex gap-6">
      <label
        for="radioButtonAsc"
        class="radio__label cursor-pointer flex items-center gap-1">
        <input
          id="radioButtonAsc"
          v-model="state.orderDirection"
          type="radio"
          class="m-0"
          value="asc"
          name="radioGroup">
        <span class="i-mdi-sort-numeric-ascending" :class="{ 'opacity-50': state.orderDirection !== 'asc' }"></span>
        <span class="">ASC</span>
      </label>

      <label
        for="radioButtonDesc"
        class="radio__label cursor-pointer flex items-center gap-1">
        <input
          id="radioButtonDesc"
          v-model="state.orderDirection"
          type="radio"
          class="m-0"
          value="desc"
          name="radioGroup">
        <i class="i-mdi-sort-numeric-descending" :class="{ 'opacity-50': state.orderDirection !== 'desc' }"></i>
        <span class="">DESC</span>
      </label>
    </div>
    <div class="flex gap-2 fixed bottom-0 left-0 w-full p-4">
      <button
        id="cancelButton"
        class="button button-ghost w-1/3"
        @click="handleCancel">
        <i class="i-mdi-close"></i>
        <span>Cancel</span>
      </button>
      <button
        id="generateButton"
        class="button button-primary flex-1"
        :class="{
          'is-disabled': !isAllowGenerate
        }"
        :disabled="!isAllowGenerate"
        @click="handleGenerate">
        <i class="i-mdi-check"></i>
        <span>Generate</span>
      </button>
    </div>
  </div>
</template>