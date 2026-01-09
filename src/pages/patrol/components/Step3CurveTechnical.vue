<script setup lang="ts">
import { inject } from 'vue'
import type { PatrolFormData } from '../types'
import FormSectionTitle from './FormSectionTitle.vue'
import ObservationItem from './ObservationItem.vue'
import {
  durationStatusOptions,
  needleSwing1Options,
  needleSwing2Options,
  otherConditionsOptions,
  voltCurveShapeOptions,
} from '../constants'

const formData = inject<PatrolFormData>('patrolFormData')!

// 技术指标配置
const techMetrics = [
  { key: 'avgVoltage', label: '平均电压', unit: 'V', icon: 'i-carbon:flash' },
  { key: 'slotTemperature', label: '槽温', unit: '℃', icon: 'i-carbon:temperature' },
  { key: 'aluminumLevel', label: '铝水平', unit: 'cm', icon: 'i-carbon:chart-bar' },
  { key: 'electrolyteLevel', label: '质水平', unit: 'cm', icon: 'i-carbon:humidity' },
] as const

const anomalyLabels: Record<string, string> = {
  postPoleChangeDrop: '换极后下滑',
  postTappingDrop: '出铝后下滑',
  otherDrop: '其余下滑',
  flickering: '闪烁',
  effects: '效应',
}
</script>

<template>
  <div class="step-content">
    <!-- 运行曲线评价 -->
    <section class="mb-8">
      <FormSectionTitle title="运行曲线评价" class="mb-4" />

      <div class="border border-gray-100 rounded-xl bg-white shadow-sm overflow-hidden">
        <ObservationItem
          v-model="formData.operatingCurve.voltageCurveShape"
          label="电压曲线形态"
          icon="i-carbon:chart-line"
          type="select"
          :options="voltCurveShapeOptions"
          :cols="1"
        />
        <ObservationItem
          v-model="formData.operatingCurve.increaseDecreaseDuration"
          label="增减量时长"
          icon="i-carbon:timer"
          type="select"
          :options="durationStatusOptions"
          :cols="1"
        />
      </div>
    </section>

    <!-- 针摆与异常 -->
    <section class="mb-8">
      <FormSectionTitle title="针摆与异常" class="mb-4" />

      <div class="border border-gray-100 rounded-xl bg-white shadow-sm overflow-hidden">
        <ObservationItem
          v-model="formData.operatingCurve.needleSwing1"
          label="针摆情况 (1)"
          icon="i-carbon:activity"
          type="select"
          :options="needleSwing1Options"
          :cols="3"
          small
        />
        <ObservationItem
          v-model="formData.operatingCurve.needleSwing2"
          label="针摆情况 (2)"
          icon="i-carbon:activity"
          type="select"
          :options="needleSwing2Options"
          :cols="3"
          small
        />

        <!-- 电压异常情况 (次数) -->
        <div class="p-5 border-b border-gray-50 bg-red-50">
          <div class="text-label font-bold mb-4 flex items-center !text-red-600">
            <div class="i-carbon:flash-filled text-xl mr-2" /> 电压异常情况 (次数)
          </div>
          <div class="gap-3 grid grid-cols-2">
            <div
              v-for="(_val, key) in formData.operatingCurve.voltageAnomalies" :key="key"
              class="p-3 border border-red-100 rounded-lg bg-white flex flex-col shadow-sm items-center"
              :class="{ 'col-span-2': key === 'effects' }"
            >
              <span class="text-tip text-gray-400 font-bold mb-1 uppercase">
                {{ anomalyLabels[key] }}
              </span>
              <van-field v-model.number="formData.operatingCurve.voltageAnomalies[key]" type="digit" input-align="center" class="text-xl text-gray-800 font-bold !p-0 !bg-transparent" placeholder="0" />
            </div>
          </div>
        </div>

        <ObservationItem
          v-model="formData.operatingCurve.otherConditions"
          label="其他情况"
          icon="i-carbon:information"
          type="multiple"
          :options="otherConditionsOptions"
          :cols="1"
        />
      </div>
    </section>

    <!-- 当日测量化验数据 -->
    <section class="mb-4">
      <FormSectionTitle title="当日测量化验数据" class="mb-4" />

      <div class="p-2 border border-gray-100 rounded-xl bg-white shadow-sm overflow-hidden">
        <div class="gap-2 grid grid-cols-1">
          <div
            v-for="item in techMetrics" :key="item.key"
            class="p-4 rounded-lg bg-[#f7f8fa] flex transition-colors items-center justify-between"
          >
            <div class="flex items-center">
              <div class="border border-gray-100 rounded-full bg-white flex h-10 w-10 items-center justify-center" style="color: var(--color-primary)">
                <div class="text-xl" :class="[item.icon]" />
              </div>
              <span class="text-item font-bold ml-3">{{ item.label }}</span>
            </div>
            <div class="flex items-center">
              <van-field v-model.number="formData.technicalData[item.key]" type="number" placeholder="0.0" input-align="right" class="text-xl text-gray-800 font-bold !p-0 !bg-transparent !w-24" />
              <span class="text-badge-tiny text-gray-400 font-bold ml-2 w-6">{{ item.unit }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
</style>
