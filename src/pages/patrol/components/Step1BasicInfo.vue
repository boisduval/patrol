<script setup lang="ts">
import { inject, ref } from 'vue'
import type { PatrolFormData } from '../types'

import FormSectionTitle from './FormSectionTitle.vue'

const formData = inject<PatrolFormData>('patrolFormData')!

const showDatePicker = ref(false)
const showTimePicker = ref(false)

const now = new Date()
const currentDate = ref([
  now.getFullYear().toString(),
  (now.getMonth() + 1).toString().padStart(2, '0'),
  now.getDate().toString().padStart(2, '0'),
])
const currentTime = ref([
  now.getHours().toString().padStart(2, '0'),
  now.getMinutes().toString().padStart(2, '0'),
  now.getSeconds().toString().padStart(2, '0'),
])

function setNow() {
  const d = new Date()
  const dateStr = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`
  formData.patrolDate = dateStr
  // 同步更新 picker 的内部值
  currentDate.value = [d.getFullYear().toString(), (d.getMonth() + 1).toString().padStart(2, '0'), d.getDate().toString().padStart(2, '0')]
  currentTime.value = [d.getHours().toString().padStart(2, '0'), d.getMinutes().toString().padStart(2, '0'), d.getSeconds().toString().padStart(2, '0')]
}

// 如果当前没有值（例如执行了重置或新打开），则默认为当前时间
if (!formData.patrolDate) {
  setNow()
}
else {
  // 如果已有值（如从草稿恢复），解析并同步到 picker 状态
  try {
    const [datePart, timePart] = formData.patrolDate.split(' ')
    if (datePart && timePart) {
      currentDate.value = datePart.split('-')
      currentTime.value = timePart.split(':')
    }
  }
  catch (e) {
    console.error('解析日期失败', e)
  }
}

function onConfirmDate({ selectedValues }: { selectedValues: string[] }) {
  currentDate.value = selectedValues
  showDatePicker.value = false
  // 选完日期自动弹时间
  showTimePicker.value = true
}

function onConfirmTime({ selectedValues }: { selectedValues: string[] }) {
  currentTime.value = selectedValues
  const [Y, M, D] = currentDate.value
  const [h, m, s] = selectedValues
  formData.patrolDate = `${Y}-${M}-${D} ${h}:${m}:${s}`
  showTimePicker.value = false
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
          <div class="px-4 py-3 rounded-lg bg-[#f7f8fa] relative">
            <div class="mb-1 flex items-center justify-between">
              <div class="text-tip font-bold">
                巡检时间
              </div>
              <div
                class="bg-primary-light text-primary text-xs font-bold px-2 py-0.5 rounded cursor-pointer transition-opacity active:opacity-70"
                @click="setNow"
              >
                此刻
              </div>
            </div>
            <van-field
              v-model="formData.patrolDate"
              readonly
              is-link
              :border="false"
              class="text-item cursor-pointer !p-0 !bg-transparent"
              @click="showDatePicker = true"
            >
              <template #left-icon>
                <div class="i-carbon:timer text-lg mr-2" style="color: var(--color-primary)" />
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

    <!-- Auto-save Notice -->
    <div class="text-tip mt-8 opacity-60 flex items-center justify-center space-x-2">
      <div class="i-carbon:cloud-auditing text-base" />
      <span>您的输入将实时自动保存至本地草稿</span>
    </div>

    <!-- Info Tip (if previously commented out, let's restore/re-enable it if needed, but the user specifically asked for auto-save hint) -->
    <div class="mt-4 px-4 py-3 border border-blue-50 rounded-lg bg-blue-50/50 flex items-start">
      <div class="i-carbon:information-filled text-lg text-blue-400 mr-3 mt-0.5" />
      <p class="text-tip text-blue-700 leading-normal">
        系统已开启 <span class="font-bold">自动暂存</span>。即便刷新页面或意外退出，您之前填写的内容也会被完整保留。
      </p>
    </div>

    <!-- 日期选择 -->
    <van-popup v-model:show="showDatePicker" position="bottom" round>
      <van-date-picker
        v-model="currentDate"
        title="选择日期"
        @confirm="onConfirmDate"
        @cancel="showDatePicker = false"
      />
    </van-popup>

    <!-- 时间选择 -->
    <van-popup v-model:show="showTimePicker" position="bottom" round>
      <van-time-picker
        v-model="currentTime"
        title="选择精确时间"
        :columns-type="['hour', 'minute', 'second']"
        @confirm="onConfirmTime"
        @cancel="showTimePicker = false"
      />
    </van-popup>
  </div>
</template>
