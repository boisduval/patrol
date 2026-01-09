<script setup lang="ts">
import { inject } from 'vue'
import type { PatrolFormData } from '../types'
import FormSectionTitle from './FormSectionTitle.vue'

const props = defineProps<{
  missingFields?: { step: number, label: string }[]
}>()

const emit = defineEmits<{
  (e: 'changeStep', step: number): void
}>()

const formData = inject<PatrolFormData>('patrolFormData')!

function handleJump(step: number) {
  // Convert 1-indexed step to 0-indexed
  emit('changeStep', step - 1)
}
</script>

<template>
  <div class="step-content">
    <FormSectionTitle title="备注与提交" class="mb-4" />

    <!-- Missing Fields Visual FeedBack -->
    <div v-if="props.missingFields && props.missingFields.length > 0" class="mb-6">
      <div class="mb-3 flex items-center justify-between">
        <div class="text-label-sm text-amber-600 font-bold flex items-center">
          <div class="i-carbon:warning-alt text-lg mr-2" />
          待完善项 ({{ props.missingFields.length }})
        </div>
        <span class="text-[10px] text-gray-400 tracking-wider uppercase">Required Items</span>
      </div>

      <div class="space-y-2">
        <div
          v-for="(item, idx) in props.missingFields"
          :key="idx"
          class="p-3 border border-amber-100 rounded-xl bg-amber-50/50 flex cursor-pointer shadow-sm transition-all items-center justify-between active:scale-[0.98]"
          @click="handleJump(item.step)"
        >
          <div class="flex items-center">
            <div class="text-[10px] text-amber-600 font-bold mr-3 rounded-md bg-amber-100/50 flex h-6 w-10 items-center justify-center">
              STEP {{ item.step }}
            </div>
            <span class="text-tip text-gray-700 font-medium">{{ item.label }}</span>
          </div>
          <div class="i-carbon:chevron-right text-gray-300" />
        </div>
      </div>
    </div>

    <!-- Notes Card -->
    <div class="mb-6 border border-gray-100 rounded-xl bg-white shadow-sm overflow-hidden">
      <van-field
        v-model="formData.notes"
        rows="6"
        autosize
        type="textarea"
        maxlength="500"
        placeholder="请输入特殊情况记录..."
        show-word-limit
        class="text-item min-h-[160px] placeholder:text-gray-300 !p-4"
      />
    </div>

    <!-- Confirmation Card -->
    <div
      class="text-white p-6 rounded-xl shadow-sm relative overflow-hidden"
      :style="{
        backgroundColor: 'var(--color-primary)',
        backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.05) 100%)',
      }"
    >
      <div class="text-white opacity-10 absolute -right-4 -top-4">
        <div class="i-carbon:checkmark-filled text-9xl" />
      </div>

      <div class="relative z-10">
        <div class="mb-4 flex items-center">
          <div class="mr-3 rounded-lg bg-white/20 flex h-10 w-10 items-center justify-center backdrop-blur-sm">
            <div class="i-carbon:send-alt text-xl" />
          </div>
          <div>
            <h3 class="text-lg font-bold">
              准备提交
            </h3>
            <p class="text-[10px] text-white/70 tracking-widest uppercase">
              Ready to Submit
            </p>
          </div>
        </div>

        <p class="text-item leading-relaxed mb-6 !text-white/90">
          请确认所有数据录入无误。您的巡检数据将被加密上传至服务器进行归档和分析。
        </p>

        <div class="p-4 border border-white/20 rounded-lg bg-black/10 flex items-center justify-between backdrop-blur-sm">
          <span class="tracking-wider font-bold uppercase !text-white/70">当前槽号</span>
          <span class="text-h1 tracking-widest font-bold !text-white">{{ formData.ebName || '---' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
