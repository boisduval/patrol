<script setup lang="ts">
import type { SlotOpeningFeatures } from '../types'

const props = defineProps<{
  modelValue: SlotOpeningFeatures
  options: { text: string, value: string }[]
}>()

const emit = defineEmits(['update:modelValue'])

function updateValue(index: number, val: string) {
  const newValue = { ...props.modelValue, [`opening${index}`]: val }
  emit('update:modelValue', newValue)
}
</script>

<template>
  <div class="border border-gray-100 rounded-2xl bg-white shadow-sm overflow-hidden">
    <div
      v-for="i in 6"
      :key="i"
      class="p-4 border-b border-gray-50 flex transition-colors items-center justify-between last:border-0 hover:bg-gray-50/30"
    >
      <div
        class="text-h2 font-bold mr-4 rounded-xl flex h-10 w-10 items-center justify-center"
        style="color: var(--color-primary); background-color: var(--color-primary-light)"
      >
        {{ i }}
      </div>
      <div class="flex flex-1 gap-2 justify-end">
        <div
          v-for="opt in options"
          :key="opt.value"
          class="text-tip font-medium border border-transparent rounded-xl flex h-10 w-14 cursor-pointer transition-all items-center justify-center"
          :class="modelValue[`opening${i}`] === opt.value
            ? 'selected-chip'
            : 'bg-gray-50 text-gray-400 hover:bg-gray-100'"
          @click="updateValue(i, opt.value)"
        >
          {{ opt.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.selected-chip {
  background-color: var(--color-primary);
  color: white;
  box-shadow: 0 4px 10px -2px var(--color-primary-light);
  font-weight: 600;
}
</style>
