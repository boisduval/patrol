<script setup lang="ts">
import { inject } from 'vue'
import type { PatrolFormData } from '../types'
import FormSectionTitle from './FormSectionTitle.vue'

const formData = inject<PatrolFormData>('patrolFormData')!
</script>

<template>
  <div class="step-content">
    <FormSectionTitle title="备注与提交" class="mb-4" />

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
          <span class="text-badge-tiny tracking-wider font-bold uppercase !text-white/70">当前槽号</span>
          <span class="text-h1 tracking-widest font-bold !text-white">{{ formData.ebName || '---' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
