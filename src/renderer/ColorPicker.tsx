import React from 'react'
import { CompactPicker } from 'react-color'
import { PICKER_COLORS } from '../common/constants'

export function ColorPicker (
  { color, setBackgroundColor }: { color: string, setBackgroundColor: (_color: string) => void }
): React.ReactElement {
  return <div>
    <CompactPicker
      styles={{ default: { compact: { width: 260 } } }}
      color={color}
      colors={PICKER_COLORS}
      onChangeComplete={({ hex }) => setBackgroundColor(hex) }
    />
  </div>
}
