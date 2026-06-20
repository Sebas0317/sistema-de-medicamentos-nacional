export default function StatCard({ label, value, icon: Icon, colorClass, trend }) {
  const trendColor = trend && trend.startsWith('+') ? 'text-green-600' : 'text-red-600'

  return (
    <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        {Icon && (
          <div className={`p-2 rounded-lg ${colorClass || 'bg-gray-100 text-gray-600'}`}>
            <Icon size={20} />
          </div>
        )}
      </div>
      <div className="mt-2">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        {trend && (
          <span className={`ml-2 text-sm font-medium ${trendColor}`}>{trend}</span>
        )}
      </div>
    </div>
  )
}
