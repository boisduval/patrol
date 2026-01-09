export interface ValidationRule {
  path: string
  label: string
  step: number
  required: boolean
  type?: 'string' | 'number' | 'array' | 'object'
}

export const patrolValidationRules: ValidationRule[] = [
  // Step 1
  { path: 'ebName', label: '槽号', step: 1, required: true },
  { path: 'patrolDate', label: '巡检时间', step: 1, required: true },
  { path: 'cellAge', label: '槽龄', step: 1, required: false },
  { path: 'cellType', label: '型号', step: 1, required: false },

  // Step 2
  { path: 'flueObservation.openingSize', label: '烟道观测-开口', step: 2, required: true },
  { path: 'tappingObservation.openingSize', label: '出铝观测-开口', step: 2, required: true },
  { path: 'slotOpeningFeatures.opening1', label: '槽孔特征-1号', step: 2, required: true },
  { path: 'slotOpeningFeatures.opening2', label: '槽孔特征-2号', step: 2, required: true },
  { path: 'slotOpeningFeatures.opening3', label: '槽孔特征-3号', step: 2, required: true },
  { path: 'slotOpeningFeatures.opening4', label: '槽孔特征-4号', step: 2, required: true },
  { path: 'slotOpeningFeatures.opening5', label: '槽孔特征-5号', step: 2, required: true },
  { path: 'slotOpeningFeatures.opening6', label: '槽孔特征-6号', step: 2, required: true },

  // Step 3
  { path: 'operatingCurve.voltageCurveShape', label: '电压曲线形态', step: 3, required: true },
  { path: 'operatingCurve.increaseDecreaseDuration', label: '增减量时长', step: 3, required: true },
  { path: 'operatingCurve.needleSwing1', label: '针摆情况(1)', step: 3, required: true },
  { path: 'operatingCurve.needleSwing2', label: '针摆情况(2)', step: 3, required: true },
  { path: 'operatingCurve.otherConditions', label: '运行曲线-其他情况', step: 3, required: true, type: 'array' },
  
  // 电压异常次数
  { path: 'operatingCurve.voltageAnomalies.postPoleChangeDrop', label: '换极后下滑', step: 3, required: true, type: 'number' },
  { path: 'operatingCurve.voltageAnomalies.postTappingDrop', label: '出铝后下滑', step: 3, required: true, type: 'number' },
  { path: 'operatingCurve.voltageAnomalies.otherDrop', label: '其余下滑', step: 3, required: true, type: 'number' },
  { path: 'operatingCurve.voltageAnomalies.flickering', label: '闪烁', step: 3, required: true, type: 'number' },
  { path: 'operatingCurve.voltageAnomalies.effects', label: '效应', step: 3, required: true, type: 'number' },

  // 化验数据
  { path: 'technicalData.avgVoltage', label: '化验数据-平均电压', step: 3, required: true, type: 'number' },
  { path: 'technicalData.slotTemperature', label: '化验数据-槽温', step: 3, required: true, type: 'number' },
  { path: 'technicalData.aluminumLevel', label: '化验数据-铝水平', step: 3, required: true, type: 'number' },
  { path: 'technicalData.electrolyteLevel', label: '化验数据-质水平', step: 3, required: true, type: 'number' },

  // Step 5 (Notes)
  { path: 'notes', label: '备注', step: 5, required: false },
]
