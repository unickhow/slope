<script setup lang="ts">
import { computed } from 'vue'
import { ORDER } from '../types/Order'

interface Props {
  modelValue: string,
  hideRandom?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: ORDER.ASC,
  hideRandom: false
})

const emit = defineEmits(['update:modelValue'])

const orderTypes = computed(() => ([
  {
    name: ORDER.ASC,
    icon: 'i-mdi-arrow-up'
  },
  {
    name: ORDER.DESC,
    icon: 'i-mdi-arrow-down'
  },
  ...(props.hideRandom ? [] : [{
    name: ORDER.RANDOM,
    icon: 'i-mdi-dice-6'
  }])
]))
</script>

<template>
  <div class="flex gap-6">
    <label
      v-for="type in orderTypes"
      :key="type.name"
      :for="`radioButton__${type.name}`"
      class="radio__label cursor-pointer flex items-center gap-1">
      <input
        :id="`radioButton__${type.name}`"
        name="radioGroup"
        type="radio"
        class="m-0"
        :checked="props.modelValue === type.name"
        :value="type.name"
        @change="emit('update:modelValue', type.name)">
      <span :class="[{ 'opacity-50': modelValue !== type.name }, type.icon]" />
      <span>{{ type.name.toUpperCase() }}</span>
    </label>
  </div>
</template>
