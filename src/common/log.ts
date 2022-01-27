import get from 'lodash.get'

export const logger = {
  log: get('console', 'log')
}
