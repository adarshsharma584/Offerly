import { motion } from 'framer-motion';
import { Store, Gift, Users, DollarSign, CheckCircle2, AlertCircle, Percent, Activity, ShieldCheck, Calendar, ChevronRight, TrendingUp } from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, RadialBarChart, RadialBar, Legend 
} from 'recharts';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { usePlatformData } from '@/context/PlatformDataContext';

const revenueData = [
  { name: 'Jan', revenue: 45000, commission: 5400 },
  { name: 'Feb', revenue: 52000, commission: 6240 },
  { name: 'Mar', revenue: 48000, commission: 5760 },
  { name: 'Apr', revenue: 61000, commission: 7320 },
  { name: 'May', revenue: 55000, commission: 6600 },
  { name: 'Jun', revenue: 67000, commission: 8040 },
  { name: 'Jul', revenue: 72000, commission: 8640 },
  { name: 'Aug', revenue: 68000, commission: 8160 },
  { name: 'Sep', revenue: 79000, commission: 9480 },
  { name: 'Oct', revenue: 84000, commission: 10080 },
  { name: 'Nov', revenue: 92000, commission: 11040 },
  { name: 'Dec', revenue: 98000, commission: 11760 },
];

const bookingTrendData = [
  { name: 'Mon', bookings: 120, users: 450 },
  { name: 'Tue', bookings: 150, users: 520 },
  { name: 'Wed', bookings: 130, users: 480 },
  { name: 'Thu', bookings: 180, users: 610 },
  { name: 'Fri', bookings: 240, users: 750 },
  { name: 'Sat', bookings: 210, users: 890 },
  { name: 'Sun', bookings: 190, users: 820 },
];

const cityData = [
  { city: 'Golaghat', merchants: 124, active: 85 },
  { city: 'Jorhat', merchants: 86, active: 62 },
  { city: 'Guwahati', merchants: 210, active: 145 },
  { city: 'Tezpur', merchants: 54, active: 38 },
];

const sparklineData = [
  { v: 30 }, { v: 45 }, { v: 35 }, { v: 55 }, { v: 40 }, { v: 65 }, { v: 50 }
];

const COLORS = ['#2D6A4F', '#40916C', '#52B788', '#74C69D', '#95D5B2'];

const systemStatus = [
  { label: 'API Gateway', status: 'Online', latency: '12ms', color: 'bg-green-500' },
  { label: 'Payment Engine', status: 'Healthy', latency: '45ms', color: 'bg-green-500' },
  { label: 'Auth Service', status: 'Online', latency: '8ms', color: 'bg-green-500' },
  { label: 'Cloud Storage', status: 'Online', latency: '22ms', color: 'bg-green-500' },
];

export default function AdminDashboard() {
  const { data } = usePlatformData();
  const { merchants, offers, liveActivity, redemptions, users } = data;

  const totalRevenue = redemptions.reduce((acc, item) => acc + item.billAmount, 0) || 1245000;
  const totalCommission = Math.round(totalRevenue * 0.12);
  const approvedMerchants = merchants.filter(m => m.status === 'approved' || m.status === 'verified');
  const pendingMerchants = merchants.filter(m => m.status === 'pending');
  const pendingOffers = offers.filter(o => o.status === 'pending');
  const activeOffers = offers.filter(o => o.status === 'active');
  const cancellationRate = `${Math.max(1, Math.round((pendingOffers.length / Math.max(offers.length, 1)) * 100))}%`;

  const kpis = [
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: DollarSign, badge: '+18%', tone: 'bg-green-50 text-green-700 border-green-100' },
    { label: 'Commission Earned', value: `₹${totalCommission.toLocaleString()}`, icon: Percent, badge: '+12%', tone: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
    { label: 'Total Bookings', value: String(redemptions.length || 4520), icon: Calendar, badge: `${activeOffers.length} active`, tone: 'bg-lime-50 text-lime-700 border-lime-100' },
    { label: 'Active Merchants', value: String(approvedMerchants.length), icon: Activity, badge: 'live', tone: 'bg-green-50 text-green-700 border-green-100' },
    { label: 'Vendors', value: String(merchants.length), icon: Store, badge: `${pendingMerchants.length} pending`, tone: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
    { label: 'Customers', value: String(users.length), icon: Users, badge: '+25%', tone: 'bg-lime-50 text-lime-700 border-lime-100' },
    { label: 'Cancellation Rate', value: cancellationRate, icon: AlertCircle, badge: 'Normal', tone: 'bg-red-50 text-red-700 border-red-100' },
    { label: 'SOS Alerts', value: String(liveActivity.filter(i => i.type === 'flag').length), icon: ShieldCheck, badge: 'secure', tone: 'bg-green-50 text-green-700 border-green-100' },
  ];

  const healthData = [
    { name: 'Uptime', value: 99.9, fill: '#2D6A4F' },
    { name: 'Stability', value: 97.4, fill: '#059669' }
  ];

  return (
    <DashboardLayout role="admin">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div>
            <h1 className="font-display font-bold text-3xl md:text-4xl text-app-text tracking-tight">Admin Dashboard</h1>
            <p className="text-app-muted text-sm mt-1 font-medium">Global overview of merchants, bookings and earnings</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-2xl border border-gray-100 px-5 py-3 text-xs font-bold text-gray-600 shadow-sm flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              All Cities
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 px-5 py-3 text-xs font-bold text-gray-600 shadow-sm">Mar 2026</div>
          </div>
        </div>

        {/* KPI Grid with Sparklines */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {kpis.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-[32px] border border-gray-50 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shadow-sm ${item.tone}`}>
                    <item.icon size={22} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-green-700 bg-green-50 px-2.5 py-1 rounded-lg">
                    {item.badge}
                  </span>
                </div>
                <p className="font-display font-bold text-3xl text-app-text leading-none mb-1">{item.value}</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-app-muted">{item.label}</p>
              </div>
              
              {/* Mini Sparkline SVG */}
              <div className="absolute bottom-0 left-0 right-0 h-10 opacity-20 group-hover:opacity-40 transition-opacity">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sparklineData}>
                    <Area type="monotone" dataKey="v" stroke="#2D6A4F" fill="#2D6A4F" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Revenue Area Chart */}
          <div className="xl:col-span-7 bg-white rounded-[32px] border border-gray-50 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-display font-bold text-2xl text-app-text">Revenue & Commission</h3>
                <p className="text-app-muted text-sm font-medium">Monthly performance analytics</p>
              </div>
              <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-xl">
                <TrendingUp size={14} className="text-green-700" />
                <span className="text-xs font-bold text-green-700">+14.2%</span>
              </div>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2D6A4F" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#2D6A4F" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 11}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 11}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#2D6A4F" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                  <Area type="monotone" dataKey="commission" stroke="#10B981" strokeWidth={3} fill="none" strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Booking Bar Chart */}
          <div className="xl:col-span-5 bg-white rounded-[32px] border border-gray-50 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-display font-bold text-2xl text-app-text">Booking Trend</h3>
                <p className="text-app-muted text-sm font-medium">Weekly traffic analysis</p>
              </div>
              <div className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl">Peak Friday</div>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bookingTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 11}} dy={10} />
                  <Tooltip cursor={{fill: '#F9FAFB'}} contentStyle={{ borderRadius: '16px', border: 'none' }} />
                  <Bar dataKey="bookings" radius={[6, 6, 0, 0]} barSize={32}>
                    {bookingTrendData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.name === 'Fri' ? '#F59E0B' : '#2D6A4F'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Live Activity with Side Accent */}
          <div className="xl:col-span-8 bg-white rounded-[32px] border border-gray-50 overflow-hidden shadow-sm">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-xl text-app-text">Live Activity</h3>
                <p className="text-app-muted text-xs mt-1">Real-time system events</p>
              </div>
              <button className="px-4 py-2 text-green-700 bg-green-50 rounded-xl text-xs font-bold hover:bg-green-100 transition-colors">
                View All Events
              </button>
            </div>
            <div className="p-4 space-y-2">
              {liveActivity.map((activity, i) => (
                <div key={activity.id} className={`flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors border-l-4 ${
                  activity.type === 'merchant' ? 'border-green-600 bg-green-50/20' :
                  activity.type === 'redemption' ? 'border-emerald-500 bg-emerald-50/20' :
                  activity.type === 'offer' ? 'border-lime-500 bg-lime-50/20' :
                  'border-red-500 bg-red-50/20'
                }`}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-app-text">{activity.text}</p>
                    <p className="text-[10px] font-bold text-app-muted mt-1 uppercase tracking-wider">{activity.time}</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-300" />
                </div>
              ))}
            </div>
          </div>

          {/* Operational Health & Category Stats */}
          <div className="xl:col-span-4 space-y-6">
            <div className="bg-white rounded-[32px] border border-gray-50 p-8 shadow-sm text-center">
              <h3 className="font-display font-bold text-xl text-app-text mb-8">System Health</h3>
              <div className="flex justify-center mb-6">
                <div className="h-48 w-48 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="100%" barSize={10} data={healthData} startAngle={90} endAngle={450}>
                      <RadialBar background dataKey="value" cornerRadius={10} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-display font-bold text-green-700">99.9%</span>
                    <span className="text-[10px] font-bold text-app-muted uppercase tracking-widest">Uptime</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-4 text-[10px] font-bold uppercase tracking-widest">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-700" /> Uptime</div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-600" /> Stability</div>
              </div>
            </div>

            <div className="bg-[#0B2519] rounded-[32px] p-8 shadow-xl shadow-green-900/20 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
              <h3 className="font-display font-bold text-xl mb-6 relative z-10">Approval Queue</h3>
              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/10 border border-white/10">
                  <span className="text-sm font-bold">Merchants</span>
                  <span className="px-3 py-1 bg-amber-500 text-white text-[10px] font-bold rounded-full">{pendingMerchants.length}</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/10 border border-white/10">
                  <span className="text-sm font-bold">Offers</span>
                  <span className="px-3 py-1 bg-lime-500 text-white text-[10px] font-bold rounded-full">{pendingOffers.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* City Distribution & Growth */}
          <div className="xl:col-span-4 space-y-6">
            <div className="bg-white rounded-[32px] border border-gray-50 p-8 shadow-sm">
              <h3 className="font-display font-bold text-xl text-app-text mb-6">Market Share</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="100%" barSize={10} data={cityData}>
                    <RadialBar
                      label={{ position: 'insideStart', fill: '#fff', fontSize: 10 }}
                      background
                      dataKey="active"
                    >
                      {cityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </RadialBar>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                    <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{fontSize: '10px', fontWeight: 'bold'}} />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-green-700 rounded-[32px] p-8 text-white shadow-xl shadow-green-900/20 relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-green-200 text-[10px] font-bold uppercase tracking-widest mb-1">Growth Target</p>
                <h3 className="text-3xl font-display font-bold mb-4">84% Achieved</h3>
                <div className="w-full bg-white/10 h-2 rounded-full mb-6">
                  <div className="bg-white h-full rounded-full" style={{ width: '84%' }} />
                </div>
                <button className="w-full py-3 bg-white text-green-700 rounded-xl font-display font-bold text-sm hover:bg-green-50 transition-colors">
                  View Full Report
                </button>
              </div>
              <Activity className="absolute -bottom-4 -right-4 w-32 h-32 text-white/5" />
            </div>

            {/* System Status */}
            <div className="bg-white rounded-[32px] border border-gray-50 p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-bold text-xl text-app-text">Infrastructure</h3>
                <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest bg-green-50 px-2 py-1 rounded-md">Optimal</span>
              </div>
              <div className="space-y-4">
                {systemStatus.map((service) => (
                  <div key={service.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-1.5 h-1.5 rounded-full ${service.color}`} />
                      <span className="text-xs font-bold text-slate-600">{service.label}</span>
                    </div>
                    <span className="text-[10px] font-display font-bold text-slate-400">{service.latency}</span>
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
