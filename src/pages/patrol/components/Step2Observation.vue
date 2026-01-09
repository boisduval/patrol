<script setup lang="ts">
import { inject } from 'vue'
import type { PatrolFormData } from '../types'
import FormSectionTitle from './FormSectionTitle.vue'
import ObservationItem from './ObservationItem.vue'
import SlotOpeningGrid from './SlotOpeningGrid.vue'
import {
  electrolyteOptions,
  fireEyeOptions,
  flameColorOptions,
  sizeOptions,
  soundSmokeOptions,
} from '../constants'

const formData = inject<PatrolFormData>('patrolFormData')!

// 定义需要循环生成的观察项配置
const observationConfigs = [
  { key: 'flueObservation', title: '烟道端观察' },
  { key: 'tappingObservation', title: '出铝端观察' },
] as const
</script>

<template>
  <div class="step-content">
    <!-- 烟道端与出铝端观察 (逻辑完全一致，循环生成) -->
    <section v-for="config in observationConfigs" :key="config.key" class="mb-8">
      <FormSectionTitle :title="config.title" class="mb-4" />

      <div class="border border-gray-100 rounded-2xl bg-white shadow-sm overflow-hidden">
        <ObservationItem
          v-model="formData[config.key].fireEyeCondition"
          label="火眼情况"
          icon="i-carbon:view"
          type="multiple"
          :options="fireEyeOptions"
        />

        <div class="border-b border-gray-50 grid grid-cols-2 divide-gray-50 divide-x">
          <ObservationItem
            v-model="formData[config.key].openingSize"
            label="开口大小"
            icon="i-carbon:maximize"
            type="select"
            :options="sizeOptions"
            :cols="1"
            class="!border-b-0"
          />
          <ObservationItem
            v-model="formData[config.key].flameSize"
            label="火苗大小"
            icon="i-carbon:fire"
            type="select"
            :options="sizeOptions"
            :cols="1"
            class="!border-b-0"
          />
        </div>

        <ObservationItem
          v-model="formData[config.key].electrolyteState"
          label="电解质状态"
          icon="i-carbon:chemistry"
          type="multiple"
          :options="electrolyteOptions"
          :cols="4"
          small
        />

        <ObservationItem
          v-model="formData[config.key].flameColorForce"
          label="火苗色/力"
          icon="i-carbon:color-palette"
          type="multiple"
          :options="flameColorOptions"
          :cols="4"
          small
        />

        <ObservationItem
          v-model="formData[config.key].soundSmoke"
          label="声音/烟气"
          icon="i-carbon:smoke"
          type="multiple"
          :options="soundSmokeOptions"
          :cols="3"
          small
        />
      </div>
    </section>

    <!-- 槽口特征 (火苗大小) -->
    <section class="mb-4">
      <FormSectionTitle title="槽口特征 (火苗大小)" class="mb-4" />

      <SlotOpeningGrid v-model="formData.slotOpeningFeatures" :options="sizeOptions" />
    </section>
  </div>
</template>
