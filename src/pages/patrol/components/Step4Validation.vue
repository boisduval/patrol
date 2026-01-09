<script setup lang="ts">
import FormSectionTitle from './FormSectionTitle.vue'

const props = defineProps<{
  missingFields: { step: number, label: string }[]
}>()

const emit = defineEmits<{
  (e: 'changeStep', step: number): void
}>()

function handleJump(step: number) {
  emit('changeStep', step - 1)
}
</script>

<template>
  <div class="step-content">
    <FormSectionTitle title="数据完整性检查" class="mb-4" />

    <div v-if="props.missingFields.length === 0" class="py-12 flex flex-col items-center justify-center">
      <div class="text-green-500 mb-4 rounded-full bg-green-50 flex h-20 w-20 items-center justify-center">
        <div class="i-carbon:checkmark-filled text-5xl" />
      </div>
      <h3 class="text-xl text-gray-800 font-bold mb-2">
        所有项已填妥
      </h3>
      <p class="text-sm text-gray-500">
        您可以放心进入下一步提交数据
      </p>
    </div>

    <div v-else>
      <div class="mb-4 p-4 border border-amber-100 rounded-xl bg-amber-50">
        <div class="flex items-start">
          <div class="i-carbon:warning-alt text-xl text-amber-500 mr-3 mt-0.5" />
          <div>
            <h4 class="text-md text-amber-800 font-bold">
              发现待完善内容
            </h4>
            <p class="text-sm text-amber-700/80 leading-relaxed mt-1">
              为了确保巡检数据的完整性，请补全以下 {{ props.missingFields.length }} 项后再进行提交。
            </p>
          </div>
        </div>
      </div>

      <div class="space-y-3">
        <div
          v-for="(item, idx) in props.missingFields"
          :key="idx"
          class="p-4 border border-white rounded-xl bg-white flex cursor-pointer shadow-sm transition-all items-center justify-between active:scale-[0.98]"
          @click="handleJump(item.step)"
        >
          <div class="flex items-center">
            <div class="text-[10px] text-gray-500 tracking-tighter font-bold mr-3 rounded-lg bg-gray-100 flex h-6 w-12 uppercase items-center justify-center">
              STEP {{ item.step }}
            </div>
            <span class="text-item text-gray-700 font-bold">{{ item.label }}</span>
          </div>
          <div class="text-primary text-xs font-bold flex items-center">
            去补全
            <div class="i-carbon:chevron-right text-lg ml-1" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
