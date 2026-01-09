<script setup lang="ts">
import { inject, ref } from 'vue'
import type { PatrolFormData } from '../types'

import FormSectionTitle from './FormSectionTitle.vue'

const formData = inject<PatrolFormData>('patrolFormData')!

const showDatePicker = ref(false)
const currentDate = ref([new Date().getFullYear().toString(), (new Date().getMonth() + 1).toString().padStart(2, '0'), new Date().getDate().toString().padStart(2, '0')])

function onConfirmDate({ selectedValues }: { selectedValues: string[] }) {
  formData.patrolDate = selectedValues.join('-')
  showDatePicker.value = false
}
</script>

<template>
  <div class="step-content">
    <FormSectionTitle title="基础信息" class="mb-6" />

    <!-- Main Card -->
    <div class="p-2 rounded-xl bg-white ring-1 ring-gray-100 shadow-sm">
      <van-cell-group :border="false">
        <div class="p-2 space-y-4">
          <!-- Cell No Field -->
          <div class="focus-within:border-primary-light px-4 py-3 border border-transparent rounded-lg bg-[#f7f8fa]">
            <div class="text-tip font-bold mb-1">
              槽号
            </div>
            <van-field
              v-model="formData.ebName"
              placeholder="请输入槽号"
              :border="false"
              class="text-item placeholder:text-gray-400 !p-0 !bg-transparent"
            >
              <template #left-icon>
                <div class="i-carbon:mac-shift text-lg mr-2" style="color: var(--color-primary)" />
              </template>
            </van-field>
          </div>

          <!-- Date Field -->
          <div class="px-4 py-3 rounded-lg bg-[#f7f8fa] cursor-pointer" @click="showDatePicker = true">
            <div class="text-tip font-bold mb-1">
              巡检日期
            </div>
            <van-field
              v-model="formData.patrolDate"
              readonly
              is-link
              :border="false"
              class="text-item !p-0 !bg-transparent"
            >
              <template #left-icon>
                <div class="i-carbon:calendar text-lg mr-2" style="color: var(--color-primary)" />
              </template>
            </van-field>
          </div>

          <!-- <div class="gap-4 grid grid-cols-2">
            <!~~ Cell Age ~~>
            <div class="px-4 py-3 rounded-lg bg-[#f7f8fa]">
              <div class="text-tip font-bold mb-1">
                槽龄
              </div>
              <van-field
                v-model="formData.cellAge"
                type="number"
                placeholder="0"
                :border="false"
                class="text-item !p-0 !bg-transparent"
              >
                <template #left-icon>
                  <div class="i-carbon:time text-lg mr-2" style="color: var(--color-primary)" />
                </template>
              </van-field>
            </div>

            <!~~ Cell Type ~~>
            <div class="px-4 py-3 rounded-lg bg-[#f7f8fa]">
              <div class="text-tip font-bold mb-1">
                槽类型
              </div>
              <van-field
                v-model="formData.cellType"
                placeholder="类型"
                :border="false"
                class="text-item !p-0 !bg-transparent"
              >
                <template #left-icon>
                  <div class="i-carbon:cube text-lg mr-2" style="color: var(--color-primary)" />
                </template>
              </van-field>
            </div>
          </div> -->
        </div>
      </van-cell-group>
    </div>

    <!-- Info Tip -->
    <!-- <div class="mt-6 px-4 py-3 border border-orange-100 rounded-lg bg-orange-50 flex items-start">
      <div class="i-carbon:information-filled text-lg text-orange-400 mr-3 mt-0.5" />
      <p class="text-tip text-orange-700 leading-normal">
        数据将用于生产分析，请确保 <span class="font-bold underline">槽号</span> 输入准确。
      </p>
    </div> -->

    <van-popup v-model:show="showDatePicker" position="bottom" round>
      <van-date-picker
        v-model="currentDate"
        title="选择日期"
        @confirm="onConfirmDate"
        @cancel="showDatePicker = false"
      />
    </van-popup>
  </div>
</template>
