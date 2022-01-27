import { Entry } from 'type-fest'
import { NavigatorUAData } from '../@types/typings'

export default function getBrowserData (): Entry<NavigatorUAData['brands']>['1'] {
  return window.navigator.userAgentData.brands[1] ?? {}
}
