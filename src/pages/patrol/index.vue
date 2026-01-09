<script setup lang="ts">
import { provide, reactive, ref, watch } from 'vue'
import './styles/typography.css'
import { showToast } from 'vant'
import type { PatrolFormData } from './types'
import Step1BasicInfo from './components/Step1BasicInfo.vue'
import Step2Observation from './components/Step2Observation.vue'
import Step3CurveTechnical from './components/Step3CurveTechnical.vue'
import Step4Notes from './components/Step4Notes.vue'

// --- State Management ---

const active = ref(0)
const loading = ref(false)

// Form Data Structure
const formData = reactive<PatrolFormData>({
  ebName: '',
  patrolDate: new Date().toLocaleDateString().replace(/\//g, '-'),
  cellAge: '',
  cellType: '',
  flueObservation: {
    fireEyeCondition: [],
    openingSize: '',
    flameSize: '',
    electrolyteState: [],
    flameColorForce: [],
    soundSmoke: [],
  },
  tappingObservation: {
    fireEyeCondition: [],
    openingSize: '',
    flameSize: '',
    electrolyteState: [],
    flameColorForce: [],
    soundSmoke: [],
  },
  slotOpeningFeatures: {
    opening1: '',
    opening2: '',
    opening3: '',
    opening4: '',
    opening5: '',
    opening6: '',
  },
  operatingCurve: {
    voltageCurveShape: '',
    increaseDecreaseDuration: '',
    needleSwing1: '',
    needleSwing2: '',
    voltageAnomalies: {
      postPoleChangeDrop: 0,
      postTappingDrop: 0,
      otherDrop: 0,
      flickering: 0,
      effects: 0,
    },
    otherConditions: [],
  },
  technicalData: {
    avgVoltage: null,
    slotTemperature: null,
    aluminumLevel: null,
    electrolyteLevel: null,
  },
  notes: '',
})

provide('patrolFormData', formData)

// --- Local Storage Persistence ---
const STORAGE_KEY = 'patrol_form_draft'

function onSave(silent = false) {
  const payload = {
    formData: JSON.parse(JSON.stringify(formData)),
    activeStep: active.value,
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  if (!silent)
    showToast({ message: '暂存成功', type: 'success' })
}

// Restore data on mount
const savedData = localStorage.getItem(STORAGE_KEY)
if (savedData) {
  try {
    const { formData: savedForm, activeStep } = JSON.parse(savedData)
    Object.assign(formData, savedForm)
    active.value = activeStep || 0
  }
  catch (e) {
    console.error('Failed to parse saved data', e)
  }
}
// Auto save on any change
watch([() => formData, active], () => {
  onSave(true)
}, { deep: true })

function nextStep() {
  if (active.value < 3)
    active.value += 1
}

function prevStep() {
  if (active.value > 0)
    active.value -= 1
}

function onSubmit() {
  if (!formData.ebName) {
    showToast({ message: '请输入槽号', icon: 'warning-o' })
    return
  }
  loading.value = true
  setTimeout(() => {
    loading.value = false
    showToast({ message: '提交成功', type: 'success' })
    localStorage.removeItem(STORAGE_KEY) // Clear draft after successful submit
  }, 1000)
}
</script>

<template>
  <div class="page-container bg-[#fafafa] flex flex-col inset-0 fixed overflow-hidden">
    <!-- Steps Header -->
    <div class="px-4 py-3 border-b border-gray-100 bg-white shadow-sm z-40">
      <van-steps :active="active" active-color="var(--color-primary)" inactive-color="#ebedf0">
        <van-step>基础项目</van-step>
        <van-step>重点观测</van-step>
        <van-step>曲线指标</van-step>
        <van-step>确认提交</van-step>
      </van-steps>
    </div>

    <!-- Independent Scrollable Content Area -->
    <div
      :key="active"
      class="px-4 py-6 pb-24 flex-1 overflow-y-auto"
    >
      <transition name="van-fade" mode="out-in">
        <component :is="[Step1BasicInfo, Step2Observation, Step3CurveTechnical, Step4Notes][active]" />
      </transition>
    </div>

    <!-- Fixed Footer Actions -->
    <div class="p-4 border-t border-gray-100 bg-white flex w-full items-center bottom-0 left-0 justify-between fixed z-50">
      <!-- Steps Navigation -->
      <div v-if="active > 0" class="pr-2 w-1/4">
        <van-button
          block
          class="!font-bold !rounded-xl !h-11"
          @click="prevStep"
        >
          上一步
        </van-button>
      </div>

      <!-- Main Action Area -->
      <div class="flex flex-1 gap-2 items-center" :class="active === 0 ? 'w-full' : 'w-3/4'">
        <!-- Intermediate Steps: Draft + Next -->
        <template v-if="active < 3">
          <van-button
            v-if="active > 0"
            plain
            type="primary"
            class="w-1/3 !font-bold !rounded-xl !h-11"
            @click="onSave()"
          >
            暂存
          </van-button>
          <van-button
            block
            type="primary"
            class="shadow-sm !font-bold !rounded-xl !h-11"
            :class="active > 0 ? 'flex-1' : ''"
            @click="nextStep"
          >
            下一步
          </van-button>
        </template>

        <!-- Final Step: Submit -->
        <van-button
          v-if="active === 3"
          block
          type="primary"
          :loading="loading"
          loading-text="提交中..."
          class="shadow-sm !font-bold !rounded-xl !h-11"
          @click="onSubmit"
        >
          确认提交
        </van-button>
      </div>
    </div>
  </div>
</template>

<route lang="json5">
{
  name: 'Patrol',
}
</route>

<style scoped>
.page-container {
  background-color: #f7f8fa; /* Vant background color */
  top: var(--van-nav-bar-height);
}
.van-button {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
}
/* Transitions */
.van-fade-enter-active,
.van-fade-leave-active {
  transition: opacity 0.2s ease;
}
.van-fade-enter-from,
.van-fade-leave-to {
  opacity: 0;
}
</style>
