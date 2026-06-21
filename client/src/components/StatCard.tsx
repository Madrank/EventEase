interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color?: 'primary' | 'green' | 'amber' | 'red' | 'blue' | 'purple';
  trend?: { value: string; positive: boolean };
}

const colorMap: Record<string, string> = {
  primary: 'from-primary-50 to-indigo-50 text-primary-600',
  green: 'from-emerald-50 to-green-50 text-emerald-600',
  amber: 'from-amber-50 to-yellow-50 text-amber-600',
  red: 'from-red-50 to-rose-50 text-red-600',
  blue: 'from-blue-50 to-cyan-50 text-blue-600',
  purple: 'from-purple-50 to-fuchsia-50 text-purple-600',
};

export default function StatCard({ icon, label, value, color = 'primary', trend }: StatCardProps) {
  return (
    <div className="card p-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${trend.positive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
            {trend.positive ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900 mt-4">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  );
}
