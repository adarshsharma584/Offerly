import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, MessageSquare, Clock, CheckCircle2, AlertCircle, LifeBuoy } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { usePlatformData } from '@/context/PlatformDataContext';
import AppShell from '@/components/layout/AppShell';
import { toast } from 'sonner';

export default function SupportPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, addTicket } = usePlatformData();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setSubmitting(true);
    const newTicket = {
      id: `T${Date.now()}`,
      userId: user.id,
      userName: user.name,
      subject,
      message,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setTimeout(() => {
      addTicket(newTicket);
      setSubject('');
      setMessage('');
      setSubmitting(false);
      toast.success('Support ticket submitted successfully!');
    }, 1000);
  };

  const userTickets = data.tickets.filter(t => t.userId === user?.id);

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto px-5 pt-4 pb-20">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-green-50 rounded-full transition-colors">
            <ArrowLeft size={24} className="text-slate-900" />
          </button>
          <h1 className="text-2xl font-display font-bold text-slate-900">Help & Support</h1>
        </div>

        <div className="space-y-10">
          {/* New Ticket Form */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-green-700 flex items-center justify-center text-white shadow-lg shadow-green-900/10">
                <LifeBuoy size={20} />
              </div>
              <div>
                <h2 className="font-display font-bold text-lg text-slate-900 leading-none">New Inquiry</h2>
                <p className="text-slate-400 text-xs mt-1">Our team typically responds within 24 hours.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-xl shadow-black/[0.02] space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Subject</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Issue with QR Code redemption"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-display font-bold text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-green-700/20 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Message</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="Describe your issue in detail..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-display font-bold text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-green-700/20 outline-none transition-all resize-none"
                />
              </div>

              <button 
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-green-700 text-white rounded-2xl font-display font-bold shadow-xl shadow-green-900/20 hover:bg-green-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : (
                  <>
                    <Send size={18} />
                    Submit Inquiry
                  </>
                )}
              </button>
            </form>
          </section>

          {/* Previous Inquiries */}
          <section>
            <h3 className="text-sm font-display font-bold text-slate-400 uppercase tracking-[0.2em] mb-6 ml-2">Your Previous Inquiries</h3>
            <div className="space-y-4">
              {userTickets.map((ticket, i) => (
                <motion.div 
                  key={ticket.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:border-green-700/20 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-xl ${
                        ticket.status === 'resolved' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {ticket.status === 'resolved' ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${
                        ticket.status === 'resolved' ? 'text-green-700' : 'text-amber-600'
                      }`}>
                        {ticket.status}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h4 className="font-display font-bold text-slate-900 text-sm mb-1">{ticket.subject}</h4>
                  <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">{ticket.message}</p>
                </motion.div>
              ))}
              {userTickets.length === 0 && (
                <div className="bg-slate-50 border border-dashed border-slate-200 p-10 rounded-[32px] text-center">
                  <MessageSquare size={32} className="mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-400 text-sm font-medium">No previous inquiries found.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
