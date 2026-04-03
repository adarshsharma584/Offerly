import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Download, Calendar, DollarSign, Users, ShoppingBag, Percent, ArrowUp, ArrowDown } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import DashboardLayout from '@/components/layout/DashboardLayout';

const revenueData = [
  { month: 'Jan', revenue: 45000, users: 1200, bookings: 450 },
  { month: 'Feb', revenue: 52000, users: 1450, bookings: 520 },
  { month: 'Mar', revenue: 48000, users: 1380, bookings: 480 },
  { month: 'Apr', revenue: 61000, users: 1650, bookings: 610 },
  { month: 'May', revenue: 55000, users: 1520, bookings: 550 },
  { month: 'Jun', revenue: 67000, users: 1890, bookings: 670 },
  { month: 'Jul', revenue: 72000, users: 2100, bookings: 720 },
  { month: 'Aug', revenue: 68000, users: 1980, bookings: 680 },
  { month: 'Sep', revenue: 79000, users: 2250, bookings: 790 },
  { month: 'Oct', revenue: 84000, users: 2450, bookings: 840 },
  { month: 'Nov', revenue: 92000, users: 2680, bookings: 920 },
  { month: 'Dec', revenue: 98000, users: 2890, bookings: 980 },
];

const categoryData = [
  { name: 'Food', value: 35, color: '#10B981' },
  { name: 'Saloon', value: 25, color: '#8B5CF6' },
  { name: 'Gym', value: 20, color: '#F59E0B' },
  { name: 'Services', value: 15, color: '#3B82F6' },
  { name: 'Others', value: 5, color: '#6B7280' },
];

const cityPerformance = [
  { city: 'Guwahati', revenue: 45000, growth: 18 },
  { city: 'Golaghat', revenue: 32000, growth: 12 },
  { city: 'Jorhat', revenue: 28000, growth: 15 },
  { city: 'Tezpur', revenue: 18000, growth: 8 },
  { city: 'Dibrugarh', revenue: 15000, growth: 10 },
];

const hourlyActivity = [
  { hour: '6AM', activity: 120 },
  { hour: '9AM', activity: 450 },
  { hour: '12PM', activity: 890 },
  { hour: '3PM', activity: 650 },
  { hour: '6PM', activity: 1200 },
  { hour: '9PM', activity: 780 },
];

export default function AdminAnalytics() {
  const kpis = [
    { label: 'Monthly Revenue', value: '₹98,000', change: '+14.2%', trend: 'up', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Total Users', value: '2,890', change: '+8.5%', trend: 'up', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Bookings', value: '980', change: '+6.5%', trend: 'up', icon: ShoppingBag, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Conversion Rate', value: '3.4%', change: '-0.2%', trend: 'down', icon: Percent, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <DashboardLayout role="admin">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="font-display font-bold text-3xl md:text-4xl text-app-text tracking-tight">Advanced Analytics</h1>
            <p className="text-app-muted text-sm mt-1 font-medium">Comprehensive business intelligence and performance metrics</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-5 py-3 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm">
              <Calendar size={16} />
              Last 12 Months
            </button>
            <button className="px-5 py-3 bg-green-700 text-white rounded-xl text-xs font-bold hover:bg-green-800 transition-all flex items-center gap-2 shadow-lg shadow-green-900/20">
              <Download size={16} />
              Export CSV
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${kpi.bg} flex items-center justify-center`}>
                  <kpi.icon size={22} className={kpi.color} />
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${
                  kpi.trend === 'up' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  {kpi.trend === 'up' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                  {kpi.change}
                </div>
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{kpi.label}</p>
              <p className="text-3xl font-display font-bold text-gray-900">{kpi.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Revenue Trend */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-display font-bold text-xl text-gray-900">Revenue Trend</h3>
                <p className="text-gray-500 text-sm mt-1">Monthly performance over the year</p>
              </div>
              <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-xl">
                <TrendingUp size={14} className="text-green-700" />
                <span className="text-xs font-bold text-green-700">+14.2% YoY</span>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 11}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 11}} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }} />
                  <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Distribution */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <h3 className="font-display font-bold text-xl text-gray-900 mb-6">Category Split</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 mt-6">
              {categoryData.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-xs font-bold text-gray-600">{cat.name}</span>
                  </div>
                  <span className="text-xs font-bold text-gray-900">{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* City Performance */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <h3 className="font-display font-bold text-xl text-gray-900 mb-6">City Performance</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cityPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                  <XAxis dataKey="city" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 11}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 11}} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                  <Bar dataKey="revenue" fill="#10B981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Hourly Activity */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <h3 className="font-display font-bold text-xl text-gray-900 mb-6">Peak Hours</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hourlyActivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                  <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 11}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 11}} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                  <Line type="monotone" dataKey="activity" stroke="#8B5CF6" strokeWidth={3} dot={{ fill: '#8B5CF6', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Growth Metrics */}
          <div className="lg:col-span-12 bg-gradient-to-br from-green-700 to-emerald-600 rounded-2xl p-8 text-white shadow-xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h3 className="font-display font-bold text-2xl mb-2">Growth Metrics</h3>
                <p className="text-green-100 text-sm">Year-over-year comparison</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: 'Revenue Growth', value: '+14.2%' },
                  { label: 'User Growth', value: '+8.5%' },
                  { label: 'Merchant Growth', value: '+12.3%' },
                  { label: 'Booking Growth', value: '+6.5%' },
                ].map((metric) => (
                  <div key={metric.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <p className="text-green-100 text-[10px] font-bold uppercase tracking-widest mb-1">{metric.label}</p>
                    <p className="text-2xl font-display font-bold">{metric.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
