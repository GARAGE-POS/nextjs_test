import { BASE_PATH } from './constants'

export const getAssetPath = (path: string) => {
  return `${BASE_PATH}${path}`
}
