<script setup lang="ts">
import { reactive, computed } from 'vue'
const state = reactive({
  textString: '',
  numberString: '',
  orderDirection: 'asc',
  isReverseStringNumber: false,
})

const isAllowGenerate = computed(() => {
  return !!state.textString && !!state.numberString
})

function handleGenerate () {
  const prefix = state.textString;
  const baseNumber = state.numberString;
  const order = state.orderDirection;
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
  <div class="flex flex-col gap-3">
    <div class="flex items-center">
      <div class="w-full">
        <input v-show="!state.isReverseStringNumber" v-model="state.textString" type="text" id="prefix-head" class="input__field" style="text-align: right;" placeholder="SKU" tabindex="1">
        <input v-show="state.isReverseStringNumber" v-model="state.numberString" type="text" id="base-number-head" class="input__field" style="text-align: right;" placeholder="0013845" tabindex="2">
      </div>
      <button class="p-3 bg-transparent outline-non border-none focus:outline-none hover:outline-none hover:border-none" @click="state.isReverseStringNumber = !state.isReverseStringNumber">
        <div class="icon icon--swap cursor-pointer"></div>
      </button>
      <div class="w-full">
        <input v-show="!state.isReverseStringNumber" v-model="state.numberString" type="text" id="base-number-tail" class="input__field" placeholder="0013845" tabindex="2">
        <input v-show="state.isReverseStringNumber" v-model="state.textString" type="text" id="prefix-tail" class="input__field" placeholder="SKU" tabindex="1">
      </div>
    </div>
    <div class="radio">
      <input id="radioButton" v-model="state.orderDirection" type="radio" class="radio__button" value="asc" name="radioGroup">
      <label for="radioButton" class="radio__label cursor-pointer">Asc</label>

      <input id="radioButton2" v-model="state.orderDirection" type="radio" class="radio__button" value="desc" name="radioGroup">
      <label for="radioButton2" class="radio__label cursor-pointer">Desc</label>
    </div>
    <div class="flex gap-2">
      <button id="cancel" class="button button--tertiary flex-1" tabindex="6" @click="handleCancel">Cancel</button>
      <button id="generate" class="button button--primary flex-1" :disabled="!isAllowGenerate" tabindex="5" @click="handleGenerate">Generate</button>
    </div>
  </div>
</template>