const variants = {
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  danger: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
  neutral: 'bg-gray-100 text-gray-700',
  purple: 'bg-purple-100 text-purple-800'
}

export default function Badge({ text, variant = 'neutral' }) {
  return (
    <span
      className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap ${variants[variant] || variants.neutral}`}
    >
      {text}
    </span>
  )
}
