import { Info } from 'lucide-react'

export default function Tooltip({ text, size = 14 }) {
  return (
    <span className="relative group inline-flex items-center">
      <Info size={size} className="text-gray-400 hover:text-gray-600 cursor-help transition-colors" />
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-lg">
        {text}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
      </span>
    </span>
  )
}
