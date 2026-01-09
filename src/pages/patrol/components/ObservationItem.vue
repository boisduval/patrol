<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: string | string[]
  options: { text: string, value: string }[]
  label: string
  icon?: string
  type: 'select' | 'multiple'
  cols?: number
  small?: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const isMultiple = computed(() => props.type === 'multiple')

function handleClick(val: string) {
  if (isMultiple.value) {
    const list = Array.isArray(props.modelValue) ? [...props.modelValue] : []
    const index = list.indexOf(val)
    if (index > -1) {
      list.splice(index, 1)
    }
    else {
      list.push(val)
    }
    emit('update:modelValue', list)
  }
  else {
    emit('update:modelValue', val)
  }
}

function isActive(val: string) {
  if (isMultiple.value) {
    return Array.isArray(props.modelValue) && props.modelValue.includes(val)
  }
  return props.modelValue === val
}
</script>

<template>
  <div class="observation-item p-5 border-b border-slate-50 last:border-b-0">
    <div class="text-label mb-4 flex items-center">
      <div v-if="icon" class="text-xl mr-2" :class="[icon]" style="color: var(--color-primary)" />
      {{ label }}
      <span v-if="isMultiple" class="text-badge-tiny tracking-wider ml-2 px-1.5 border border-slate-200 rounded-md bg-slate-50 uppercase">
        多选
      </span>
    </div>

    <div class="gap-2.5 grid" :style="{ gridTemplateColumns: `repeat(${cols || 2}, 1fr)` }">
      <div
        v-for="opt in options"
        :key="opt.value"
        class="chip transition-all duration-200"
        :class="{
          active: isActive(opt.value),
          small,
          pill: !isMultiple,
        }"
        @click="handleClick(opt.value)"
      >
        {{ opt.text }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.chip {
  width: 100%;
  padding: 10px 4px;
  border-radius: 8px; /* 遵循 Vant 默认圆角规范 */
  background-color: #f7f8fa; /* Vant bg-color-2 */
  color: var(--van-text-color-2);
  font-size: var(--van-font-size-md);
  font-weight: 500;
  text-align: center;
  border: 1px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
}

.chip.active {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  border-color: var(--color-primary);
  font-weight: var(--van-font-bold);
}

.chip.small {
  padding: 6px 4px;
  font-size: var(--van-font-size-sm);
  border-radius: 4px;
}

.chip.pill.active {
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}
</style>
