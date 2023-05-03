<script setup lang="ts">
import { reactive, computed } from 'vue'

enum ORDER {
  ASC = 'asc',
  DESC = 'desc',
  RANDOM = 'random'
}

const orderTypes = [
  {
    name: ORDER.ASC,
    icon: 'i-mdi-sort-numeric-ascending'
  },
  {
    name: ORDER.DESC,
    icon: 'i-mdi-sort-numeric-descending'
  },
  {
    name: ORDER.RANDOM,
    icon: 'i-mdi-dice-6'
  }
]

const state = reactive<{
  textString: string;
  numberString: string;
  orderType: ORDER
  isReverseStringNumber: boolean
}>({
  textString: '',
  numberString: '',
  orderType: ORDER.ASC,
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
  const orderType = state.orderType
  const isReverse = state.isReverseStringNumber
  parent.postMessage({
    pluginMessage: {
      action: 'generate',
      prefix,
      baseNumber,
      orderType,
      isReverse
    }
  }, '*')
}

function handleCancel () {
  parent.postMessage({ pluginMessage: { action: 'cancel' } }, '*')
}
</script>

<template>
  <div class="numeric-string flex flex-col gap-3 m-4">
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

    <!-- TODO: customize radio but will lost a11y on tabindex -->
    <!-- <div class="flex gap-6">
      <div
        v-for="type in orderTypes"
        :key="type.name"
        class="radio-field">
        <input
          type="radio"
          name="radioGroup"
          :value="type.name"
          :for="`radioButton__${type.name}`"
          class="hidden" />
        <label
          :for="`radioButton__${type.name}`"
          class="flex items-center justify-center cursor-pointer gap-1"
          :class="{
            'text-primary': state.orderType === type.name
          }"
          @click="state.orderType = type.name">
          <span :class="[type.icon]" />
          <span>{{ type.name.toUpperCase() }}</span>
        </label>
      </div>
    </div> -->

    <div class="flex gap-6">
      <label
        v-for="type in orderTypes"
        :key="type.name"
        :for="`radioButton__${type.name}`"
        class="radio__label cursor-pointer flex items-center gap-1">
        <input
          :id="`radioButton__${type.name}`"
          v-model="state.orderType"
          type="radio"
          class="m-0"
          :value="type.name"
          name="radioGroup">
        <span :class="[{ 'opacity-50': state.orderType !== type.name }, type.icon]" />
        <span>{{ type.name.toUpperCase() }}</span>
      </label>
    </div>
    <div class="flex gap-2 fixed bottom-0 left-0 w-full p-4">
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
