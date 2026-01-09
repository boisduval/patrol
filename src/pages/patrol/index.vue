<script setup lang="ts">
import { provide, reactive, ref, watch } from 'vue'
import './styles/typography.css'
import { showToast } from 'vant'
import type { PatrolFormData } from './types'
import Step1BasicInfo from './components/Step1BasicInfo.vue'
import Step2Observation from './components/Step2Observation.vue'
import Step3CurveTechnical from './components/Step3CurveTechnical.vue'
import Step4Validation from './components/Step4Validation.vue'
import Step5Notes from './components/Step4Notes.vue'
import { patrolValidationRules } from './validationRules'
import { createPatrol } from '@/api/patrol'

// --- State Management ---

function getInitialFormData(): PatrolFormData {
  return {
    ebName: '',
    patrolDate: (() => {
      const d = new Date()
      return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`
    })(),
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
  }
}

const active = ref(0)
const loading = ref(false)

// Form Data Structure
const formData = reactive<PatrolFormData>(getInitialFormData())

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

const missingFields = computed(() => validateForm())

function nextStep() {
  if (active.value === 3 && missingFields.value.length > 0) {
    showToast({
      message: '请先完善所有必填项',
      icon: 'warning-o',
    })
    return
  }
  if (active.value < 4)
    active.value += 1
}

function prevStep() {
  if (active.value > 0)
    active.value -= 1
}

function getValueByPath(obj: any, path: string) {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj)
}

function validateForm() {
  const missing: { step: number, label: string }[] = []

  patrolValidationRules.forEach((rule) => {
    if (!rule.required)
      return

    const value = getValueByPath(formData, rule.path)

    let isEmpty = false
    if (value === null || value === undefined) {
      isEmpty = true
    }
    else if (typeof value === 'string' && value.trim() === '') {
      isEmpty = true
    }
    else if (Array.isArray(value) && value.length === 0) {
      isEmpty = true
    }
    else if (rule.type === 'number') {
      // 业务逻辑：化验测量数据 (technicalData) 不允许为 0，但异常次数允许为 0
      if (rule.path.startsWith('technicalData.') && (value === 0 || value === '0'))
        isEmpty = true
      // 如果是 null 或空字符串在上面已经处理过了
    }

    if (isEmpty) {
      missing.push({ step: rule.step, label: rule.label })
    }
  })

  return missing
}

function onClickStep(index: number) {
  // 允许随时向回跳
  if (index < active.value) {
    active.value = index
    return
  }

  // 向上跳时的逻辑
  // 如果想跳过检查直接到提交页，且有未填项，则强制拦截到检查页
  if (index === 4 && missingFields.value.length > 0) {
    active.value = 3
    showToast({
      message: '请先完善所有必填项',
      icon: 'warning-o',
    })
    return
  }

  active.value = index
}

function onSubmit() {
  const missingFields = validateForm()
  if (missingFields.length > 0) {
    showToast({
      message: `以下项未填写：\n${missingFields.map(f => f.label).slice(0, 3).join('、')}${missingFields.length > 3 ? '...' : ''}`,
      icon: 'warning-o',
    })
    return
  }

  loading.value = true
  createPatrol(formData).then(() => {
    showToast({
      message: '提交成功',
      type: 'success',
    })
    // 1. 清除本地缓存
    localStorage.removeItem(STORAGE_KEY)

    // 2. 重置表单回到初始状态
    Object.assign(formData, getInitialFormData())

    // 3. 返回第一步
    setTimeout(() => {
      active.value = 0
    }, 500)
  }).catch().finally(() => {
    loading.value = false
  })
}
</script>

<template>
  <div class="page-container bg-[#fafafa] flex flex-col inset-0 fixed overflow-hidden">
    <!-- Steps Header -->
    <div class="px-4 py-3 border-b border-gray-100 bg-white shadow-sm z-40">
      <van-steps :active="active" active-color="var(--color-primary)" inactive-color="#ebedf0" @click-step="onClickStep">
        <van-step>基础项目</van-step>
        <van-step>重点观测</van-step>
        <van-step>曲线指标</van-step>
        <van-step>检查</van-step>
        <van-step>提交</van-step>
      </van-steps>
    </div>

    <!-- Independent Scrollable Content Area -->
    <div
      :key="active"
      class="px-4 py-6 pb-24 flex-1 overflow-y-auto"
    >
      <transition name="van-fade" mode="out-in">
        <component
          :is="[Step1BasicInfo, Step2Observation, Step3CurveTechnical, Step4Validation, Step5Notes][active]"
          :missing-fields="missingFields"
          @change-step="active = $event"
        />
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
        <template v-if="active < 4">
          <van-button
            v-if="active > 0 && active !== 3"
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
            :class="(active > 0 && active !== 3) ? 'flex-1' : ''"
            :disabled="active === 3 && missingFields.length > 0"
            @click="nextStep"
          >
            {{ active === 3 ? '完善后的下一步' : '下一步' }}
          </van-button>
        </template>

        <!-- Final Step: Submit -->
        <van-button
          v-if="active === 4"
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
