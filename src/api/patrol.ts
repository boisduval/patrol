import type { PatrolFormData } from '@/pages/patrol/types'
import request from '@/utils/request'

export async function createPatrol(data: PatrolFormData) {
  return request('/patrols', { method: 'POST', data })
}
