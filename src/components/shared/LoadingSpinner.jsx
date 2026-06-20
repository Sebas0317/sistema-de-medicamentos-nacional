export default function LoadingSpinner({ color = 'text-blue-600', size = 8 }) {
  return (
    <div className="flex items-center justify-center p-8">
      <div
        className={`animate-spin rounded-full border-4 border-gray-200 border-t-current ${color}`}
        style={{ width: `${size * 4}px`, height: `${size * 4}px` }}
      />
    </div>
  )
}
