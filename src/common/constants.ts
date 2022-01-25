import { Accessories, AlpacaFeatures, Color, Ears, Eyes, Hair, Legs, Mouths, Necks, Noses } from '../@types/typings'

export const COLORS: Color[] = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark']

export const HAIR_FEATURES: Hair[] = ['Bang', 'Curls', 'Elegant', 'Fancy', 'Default', 'Quiff', 'Short']

export const EAR_FEATURES: Ears[] = ['Default', 'Tilt Backward', 'Tilt Forward']

export const EYES_FEATURES: Eyes[] = ['Default', 'Angry', 'Naughty', 'Panda', 'Smart', 'Star']

export const MOUTH_FEATURES: Mouths[] = ['Default', 'Astonished', 'Eating', 'Laugh', 'Tongue']

export const LEGS_FEATURES: Legs[] = ['Default', 'Bubble Tea', 'Cookie', 'Game Console', 'Tilt Backward', 'Tilt Forward']

export const NECKS_FEATURES: Necks[] = ['Default', 'Bend Backward', 'Bend Forward', 'Thick']

export const ACCESSORIES_FEATURES: Accessories[] = ['Earings', 'Flower', 'Glasses', 'HeadPhone']

export const NOSES_FEATURES: Noses[] = ['Default']

export const ALPACA_FEATURES: Array<keyof Omit<AlpacaFeatures, 'Backgrounds'>> = [
  'Hair',
  'Ears',
  'Eyes',
  'Mouths',
  'Necks',
  'Legs',
  'Accessories',
  'Noses'
]

export const PICKER_COLORS = [
  '#4D4D4D',
  '#999999',
  '#334DE5',
  '#F44E3B',
  '#FE9200',
  '#8B8000',
  '#DBAF00',
  '#A4DD00',
  '#68CCCA',
  '#73D8FF',
  '#AEA1FF',
  '#FDA1FF',
  '#333333',
  '#808080',
  '#cccccc',
  '#D33115',
  '#E27300',
  '#FCC400',
  '#B0BC00',
  '#68BC00',
  '#16A5A5',
  '#009CE0',
  '#7B64FF',
  '#FA28FF',
  '#000000',
  '#666666',
  '#B3B3B3',
  '#9F0500',
  '#C45100',
  '#FB9E00',
  '#808900',
  '#194D33',
  '#0C797D',
  '#0062B1',
  '#653294',
  '#AB149E',
  '#3004E0',
  '#FF5300',
  '#A4A4A5'
]

export const ALPACA_SUB_FEATURES = [
  HAIR_FEATURES,
  EAR_FEATURES,
  EYES_FEATURES,
  MOUTH_FEATURES,
  NECKS_FEATURES,
  LEGS_FEATURES,
  ACCESSORIES_FEATURES,
  NOSES_FEATURES
]
