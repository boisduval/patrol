export interface ObservationData {
  fireEyeCondition: string[]
  openingSize: string
  flameSize: string
  electrolyteState: string[]
  flameColorForce: string[]
  soundSmoke: string[]
}

export interface SlotOpeningFeatures {
  opening1: string
  opening2: string
  opening3: string
  opening4: string
  opening5: string
  opening6: string
  [key: string]: string
}

export interface VoltageAnomalies {
  postPoleChangeDrop: number
  postTappingDrop: number
  otherDrop: number
  flickering: number
  effects: number
}

export interface OperatingCurve {
  voltageCurveShape: string
  increaseDecreaseDuration: string
  needleSwing1: string
  needleSwing2: string
  voltageAnomalies: VoltageAnomalies
  otherConditions: string[]
}

export interface TechnicalData {
  avgVoltage: number | null
  slotTemperature: number | null
  aluminumLevel: number | null
  electrolyteLevel: number | null
}

export interface PatrolFormData {
  ebName: string
  patrolDate: string
  cellAge: string
  cellType: string
  flueObservation: ObservationData
  tappingObservation: ObservationData
  slotOpeningFeatures: SlotOpeningFeatures
  operatingCurve: OperatingCurve
  technicalData: TechnicalData
  notes: string
}
