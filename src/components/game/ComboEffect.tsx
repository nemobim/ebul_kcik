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
      <div className="animate-float text-6xl font-bold text-red-400">{combo}</div>
    </div>
    <div className="animate-ripple absolute left-1/2 top-1/2 h-16 w-16 rounded-full border-[3px] border-white" />
  </div>
))

export default ComboEffect
