import { motion } from 'framer-motion';
import { 
  Users, Store, Gift, MessageSquare, ShieldCheck, 
  TrendingUp, AlertCircle, CheckCircle2, Clock, Filter, X,
  Megaphone, DollarSign
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { usePlatformData } from '@/context/PlatformDataContext';

export default function SubAdminDesk() {
  const { user } = useAuth();
  const { data, updateOffer, updateMerchant, updateTicket } = usePlatformData();
  const cat = user?.subAdminCategory || 'support';

  const renderOfferMgmt = () => {
    const pendingOffers = data.offers.filter(o => o.status === 'pending');
    
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Pending Offers', value: pendingOffers.length.toString(), icon: Gift, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Approved Today', value: '45', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Total Active', value: data.offers.filter(o => o.status === 'active').length.toString(), icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
          ].map((s, i) => (
            <div key={i} className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
              <div className={`w-12 h-12 rounded-xl ${s.bg} ${s.color} flex items-center justify-center mb-4`}>
                <s.icon size={24} />
              </div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{s.label}</p>
              <h3 className="text-2xl font-display font-bold text-slate-900 mt-1">{s.value}</h3>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-display font-bold text-lg text-slate-900">Offers Awaiting Approval</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Offer Title</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Merchant</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Benefit</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {pendingOffers.map(o => {
                  const merchant = data.merchants.find(m => m.id === o.merchantId);
                  return (
                    <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-display font-bold text-sm text-slate-900">{o.title}</span>
                          <span className="text-slate-400 text-[10px] line-clamp-1 max-w-xs">{o.desc}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-600 text-sm font-medium">{merchant?.name || 'Unknown'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-green-700 text-xs font-bold px-2 py-1 bg-green-50 rounded-md">
                          {o.type === 'percent' ? `${o.value}% OFF` : `₹${o.value} OFF`}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => updateOffer(o.id, { status: 'rejected' })}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                          >
                            <X size={18} />
                          </button>
                          <button 
                            onClick={() => updateOffer(o.id, { status: 'active' })}
                            className="p-2 text-green-700 hover:bg-green-50 rounded-xl transition-colors"
                          >
                            <CheckCircle2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {pendingOffers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-medium italic">
                      No offers pending approval
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderAdMgmt = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Pending Ads', value: '8', icon: Megaphone, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Active Campaigns', value: '42', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Ad Revenue', value: '₹4.2L', icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50' },
        ].map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
            <div className={`w-12 h-12 rounded-xl ${s.bg} ${s.color} flex items-center justify-center mb-4`}>
              <s.icon size={24} />
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{s.label}</p>
            <h3 className="text-2xl font-display font-bold text-slate-900 mt-1">{s.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50">
          <h3 className="font-display font-bold text-lg text-slate-900">Advertisements Awaiting Approval</h3>
        </div>
        <div className="divide-y divide-slate-50">
          {[
            { id: 'ad1', business: 'Burger King', title: 'Summer Feast', budget: '₹5,000', type: 'Banner' },
            { id: 'ad2', business: 'Nike Store', title: 'New Arrival Boost', budget: '₹12,000', type: 'Featured' },
          ].map(ad => (
            <div key={ad.id} className="p-6 hover:bg-slate-50 transition-colors flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-400">AD</div>
                <div>
                  <h4 className="font-display font-bold text-sm text-slate-900">{ad.title}</h4>
                  <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">{ad.business} · {ad.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Budget</p>
                  <p className="font-display font-bold text-slate-900">{ad.budget}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                    <X size={18} />
                  </button>
                  <button className="p-2 text-green-700 hover:bg-green-50 rounded-xl transition-colors">
                    <CheckCircle2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSupportDesk = () => {
    const pendingTickets = data.tickets.filter(t => t.status !== 'resolved');
    
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Open Tickets', value: pendingTickets.length.toString(), icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Avg. Response', value: '12m', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Resolved today', value: data.tickets.filter(t => t.status === 'resolved').length.toString(), icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
          ].map((s, i) => (
            <div key={i} className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
              <div className={`w-12 h-12 rounded-xl ${s.bg} ${s.color} flex items-center justify-center mb-4`}>
                <s.icon size={24} />
              </div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{s.label}</p>
              <h3 className="text-2xl font-display font-bold text-slate-900 mt-1">{s.value}</h3>
            </div>
          ))}
        </div>
        
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-display font-bold text-lg text-slate-900">Recent Customer Inquiries</h3>
            <button className="text-green-700 text-sm font-bold flex items-center gap-2 px-4 py-2 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
              <Filter size={16} /> Filter
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {data.tickets.map(ticket => (
              <div key={ticket.id} className="p-6 hover:bg-slate-50 transition-colors cursor-pointer group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                      {ticket.userName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-sm text-slate-900 group-hover:text-green-700 transition-colors">{ticket.userName}</h4>
                      <p className="text-slate-400 text-[10px]">{new Date(ticket.createdAt).toLocaleTimeString()} via Web</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 ${
                      ticket.status === 'resolved' ? 'bg-green-50 text-green-700 border-green-100' : 
                      ticket.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                      'bg-blue-50 text-blue-600 border-blue-100'
                    } text-[10px] font-bold rounded-md border capitalize`}>
                      {ticket.status}
                    </span>
                    {ticket.status !== 'resolved' && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          updateTicket(ticket.id, { status: 'resolved' });
                        }}
                        className="p-1.5 hover:bg-green-50 text-green-700 rounded-lg transition-colors"
                      >
                        <CheckCircle2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-slate-900 font-bold text-xs mb-1 ml-13 pl-13">{ticket.subject}</p>
                <p className="text-slate-600 text-sm line-clamp-1 ml-13 pl-13">"{ticket.message}"</p>
              </div>
            ))}
            {data.tickets.length === 0 && (
              <div className="p-12 text-center text-slate-400 font-medium italic">
                No tickets found
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderMerchantMgmt = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Pending Approvals', value: '12', icon: Store, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'New Signups (24h)', value: '45', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Active Merchants', value: '524', icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50' },
        ].map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
            <div className={`w-12 h-12 rounded-xl ${s.bg} ${s.color} flex items-center justify-center mb-4`}>
              <s.icon size={24} />
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{s.label}</p>
            <h3 className="text-2xl font-display font-bold text-slate-900 mt-1">{s.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50">
          <h3 className="font-display font-bold text-lg text-slate-900">Merchants Awaiting Verification</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Business Name</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Applied Date</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.merchants.filter(m => m.status === 'pending').map(m => (
                <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-700 font-bold text-xs">{m.name.charAt(0)}</div>
                      <span className="font-display font-bold text-sm text-slate-900">{m.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4"><span className="text-xs text-slate-600 capitalize">{m.category}</span></td>
                  <td className="px-6 py-4"><span className="text-xs text-slate-400">22 Mar 2026</span></td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => updateMerchant(m.id, { status: 'rejected' })}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <X size={18} />
                      </button>
                      <button 
                        onClick={() => updateMerchant(m.id, { status: 'verified', isVerified: true })}
                        className="p-2 text-green-700 hover:bg-green-50 rounded-xl transition-colors"
                      >
                        <CheckCircle2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout role="sub_admin">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Sub-Admin Desk</h1>
        <p className="text-slate-500 text-sm mt-1">
          Managing: <span className="font-bold text-green-700 uppercase">{cat.replace('_', ' ')}</span>
        </p>
      </div>

      {cat === 'support' && renderSupportDesk()}
      {cat === 'merchant_mgmt' && renderMerchantMgmt()}
      {cat === 'offer_mgmt' && renderOfferMgmt()}
      {cat === 'ad_mgmt' && renderAdMgmt()}
      
      {cat !== 'support' && cat !== 'merchant_mgmt' && cat !== 'offer_mgmt' && cat !== 'ad_mgmt' && (
        <div className="bg-white p-12 rounded-[32px] border border-slate-100 shadow-sm text-center">
          <ShieldCheck size={48} className="mx-auto text-slate-200 mb-4" />
          <h3 className="text-xl font-display font-bold text-slate-900">Assigned Dashboard Loading...</h3>
          <p className="text-slate-500 mt-2">Your dedicated administrative panel for {cat.replace('_', ' ')} is being prepared.</p>
        </div>
      )}
    </DashboardLayout>
  );
}
