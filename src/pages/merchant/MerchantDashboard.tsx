import { motion } from 'framer-motion';
import { Gift, TrendingUp, DollarSign, Clock, CheckCircle2, ScanLine, ArrowRight, ShieldCheck, Zap, Download, FileText, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, Cell, RadialBarChart, RadialBar, Legend 
} from 'recharts';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { usePlatformData } from '@/context/PlatformDataContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const weeklyData = [
  { name: 'Mon', revenue: 4000, redemptions: 12 },
  { name: 'Tue', revenue: 5500, redemptions: 18 },
  { name: 'Wed', revenue: 3500, redemptions: 10 },
  { name: 'Thu', revenue: 6500, redemptions: 22 },
  { name: 'Fri', revenue: 5800, redemptions: 19 },
  { name: 'Sat', revenue: 7800, redemptions: 28 },
  { name: 'Sun', revenue: 7000, redemptions: 25 },
];

const sparklineData = [
  { value: 40 }, { value: 60 }, { value: 45 }, { value: 70 }, { value: 55 }, { value: 80 }, { value: 75 }
];

export default function MerchantDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data } = usePlatformData();
  const { redemptions, offers, merchants } = data;

  const handleExport = (format: 'pdf' | 'csv') => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: `Generating ${format.toUpperCase()} report...`,
        success: `Report downloaded successfully!`,
        error: 'Failed to generate report.',
      }
    );
  };

  const currentMerchant = merchants.find(m => m.id === user?.id) || merchants.find(m => m.name === user?.businessName);
  const merchantRedemptions = redemptions.filter(r => {
    const offer = offers.find(o => o.id === r.offerId);
    return offer?.merchantId === currentMerchant?.id;
  });
  const merchantOffers = offers.filter(o => o.merchantId === currentMerchant?.id);
  const activeOffers = merchantOffers.filter(o => o.status === 'active');
  const totalRevenue = merchantRedemptions.length > 0 
    ? merchantRedemptions.reduce((acc, r) => acc + r.billAmount, 0)
    : 45200; // Mock if no data
  
  const avgBill = merchantRedemptions.length ? Math.round(totalRevenue / merchantRedemptions.length) : 1250;
  const conversionRate = merchantOffers.length ? Math.round((merchantRedemptions.length / merchantOffers.length) * 100) : 68;

  const stats = [
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: DollarSign, delta: '+12.5%', color: 'text-green-700', bg: 'bg-green-50' },
    { label: 'Redemptions', value: String(merchantRedemptions.length || 124), icon: CheckCircle2, delta: '+18', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Offers', value: String(activeOffers.length || 8), icon: Gift, delta: 'LIVE', color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Avg. Bill Value', value: `₹${avgBill}`, icon: TrendingUp, delta: `${conversionRate}%`, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  const radialData = [
    { name: 'Conversion', value: conversionRate, fill: '#2D6A4F' }
  ];

  return (
    <DashboardLayout role="merchant">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div>
            <h1 className="font-display font-bold text-3xl md:text-4xl text-app-text tracking-tight">Merchant Dashboard</h1>
            <p className="text-app-muted text-sm mt-1 font-medium flex items-center gap-2">
              <Zap size={14} className="text-amber-500 fill-amber-500" />
              Real-time performance for {currentMerchant?.name || user?.businessName}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-green-50 shadow-sm mr-2">
              <button 
                onClick={() => handleExport('csv')}
                className="p-2.5 text-slate-500 hover:text-green-700 hover:bg-green-50 rounded-xl transition-all"
                title="Export CSV"
              >
                <FileText size={20} />
              </button>
              <button 
                onClick={() => handleExport('pdf')}
                className="p-2.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                title="Export PDF"
              >
                <Download size={20} />
              </button>
            </div>
            <button
              onClick={() => navigate('/merchant/scan')}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-green-700 text-white rounded-[20px] font-display font-bold shadow-xl shadow-green-900/20 hover:bg-green-800 transition-all hover:-translate-y-1"
            >
              <ScanLine size={20} />
              Scan QR
            </button>
          </div>
        </div>

        {/* Stats Grid with Sparklines */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-[32px] border border-green-50 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center shadow-sm`}>
                    <stat.icon size={24} />
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${stat.color} ${stat.bg} px-2.5 py-1 rounded-lg`}>
                      {stat.delta}
                    </span>
                  </div>
                </div>
                <p className="font-display font-bold text-3xl text-app-text mb-1">{stat.value}</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-app-muted">{stat.label}</p>
              </div>

              {/* Mini Sparkline at the bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-12 opacity-30 group-hover:opacity-60 transition-opacity">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sparklineData}>
                    <Area type="monotone" dataKey="value" stroke="#2D6A4F" fill="#2D6A4F" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Revenue Chart */}
          <div className="xl:col-span-8 bg-white rounded-[32px] border border-green-50 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-display font-bold text-2xl text-app-text">Revenue Growth</h3>
                <p className="text-app-muted text-sm font-medium">Daily performance tracking</p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-green-50 text-green-700 rounded-xl text-xs font-bold">Weekly</button>
                <button className="px-4 py-2 text-gray-400 rounded-xl text-xs font-bold hover:bg-gray-50">Monthly</button>
              </div>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 600 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 600 }}
                  />
                  <Tooltip 
                    cursor={{ fill: '#F9FAFB' }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', padding: '12px' }}
                  />
                  <Bar dataKey="revenue" fill="#2D6A4F" radius={[6, 6, 0, 0]} barSize={40}>
                    {weeklyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 5 ? '#1B4332' : '#2D6A4F'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Store Health & Quick Actions */}
          <div className="xl:col-span-4 space-y-6">
            <div className="bg-white rounded-[32px] border border-green-50 p-8 shadow-sm">
              <h3 className="font-display font-bold text-xl text-app-text mb-6">Campaign Performance</h3>
              <div className="flex justify-center mb-6">
                <div className="h-48 w-48 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={12} data={radialData} startAngle={90} endAngle={450}>
                      <RadialBar background dataKey="value" cornerRadius={10} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-display font-bold text-green-700">{conversionRate}%</span>
                    <span className="text-[10px] font-bold text-app-muted uppercase tracking-widest">Conversion</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-green-600" />
                    <span className="text-xs font-bold text-gray-600">Trust Score</span>
                  </div>
                  <span className="text-xs font-bold text-green-700">High</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-blue-600" />
                    <span className="text-xs font-bold text-gray-600">Avg Rating</span>
                  </div>
                  <span className="text-xs font-bold text-blue-700">{currentMerchant?.rating || 4.8} ★</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-[32px] p-8 shadow-xl shadow-green-900/20 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
              <h3 className="font-display font-bold text-xl mb-4 relative z-10">Quick Actions</h3>
              <div className="space-y-3 relative z-10">
                <button onClick={() => navigate('/merchant/offers')} className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-all border border-white/10 group">
                  <span className="text-sm font-bold">New Offer</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button onClick={() => navigate('/merchant/store')} className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-all border border-white/10 group">
                  <span className="text-sm font-bold">Update Profile</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="xl:col-span-12 bg-white rounded-[32px] border border-green-50 overflow-hidden shadow-sm">
            <div className="p-8 border-b border-green-50 flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-xl text-app-text">Recent Redemptions</h3>
                <p className="text-app-muted text-xs mt-1">Real-time redemption feed</p>
              </div>
              <button onClick={() => navigate('/merchant/offers')} className="px-4 py-2 text-green-700 bg-green-50 rounded-xl text-xs font-bold hover:bg-green-100 transition-colors">
                View History
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-app-muted">Customer</th>
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-app-muted">Offer Used</th>
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-app-muted">Bill Amount</th>
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-app-muted">Date</th>
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-app-muted">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {merchantRedemptions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-8 py-20 text-center">
                        <Clock size={32} className="mx-auto text-gray-200 mb-4" />
                        <p className="text-sm font-medium text-app-muted">No redemptions tracked yet.</p>
                      </td>
                    </tr>
                  ) : (
                    merchantRedemptions.slice(0, 5).map((r) => (
                      <tr key={r.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-700 flex items-center justify-center font-bold text-sm">
                              {r.customerName.charAt(0)}
                            </div>
                            <span className="text-sm font-bold text-app-text">{r.customerName}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-sm font-medium text-gray-600">{offers.find(o => o.id === r.offerId)?.title}</span>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-900">₹{r.billAmount}</span>
                            <span className="text-[10px] font-bold text-green-600">Saved ₹{r.savings}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-xs font-medium text-gray-500">{new Date(r.redeemedAt).toLocaleDateString()}</span>
                        </td>
                        <td className="px-8 py-5">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-[10px] font-bold">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                            Success
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
