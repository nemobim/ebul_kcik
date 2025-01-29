import { memo } from 'react'

const ComboEffect = memo(({ x, y, combo }: { x: number; y: number; combo: number }) => (
  <div
    className="pointer-events-none absolute"
    style={{
      left: x,
      top: y,
    }}
  >
    <div className="animate-combo-pop">
      <div className="animate-float text-4xl font-bold text-blue-400">{combo}</div>
      <div className="text-center text-sm text-yellow-400">COMBO</div>
    </div>
    <div className="animate-ripple absolute left-1/2 top-1/2 h-16 w-16 rounded-full border-2 border-blue-400" />
  </div>
))

export default ComboEffect
