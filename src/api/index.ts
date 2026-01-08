import request from '@/utils/request'

export async function queryProse(): Promise<any> {
  return request('/prose')
}

export async function testApi(): Promise<any> {
  return request('/patrols')
}
