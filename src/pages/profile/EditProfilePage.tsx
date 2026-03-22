import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export default function EditProfilePage() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [location, setLocation] = useState(user?.location || '');

  const handleSave = () => {
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }
    updateUser({ name: name.trim(), email: email.trim(), location: location.trim() });
    toast.success('Profile updated!');
    navigate('/profile');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-app-bg"
    >
      <div className="sticky top-0 bg-white z-20 px-5 py-4 flex items-center justify-between shadow-card">
        <div onClick={() => navigate(-1)} className="p-1 cursor-pointer">
          <ArrowLeft size={24} className="text-app-text" />
        </div>
        <span className="font-display font-bold text-base text-app-text">Edit Profile</span>
        <div className="w-10" />
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center pt-8 pb-6">
        <div className="w-[72px] h-[72px] rounded-full bg-green-700 flex items-center justify-center text-white font-display font-bold text-2xl mb-2">
          {(name || 'U').split(' ').map(n => n[0]).join('').slice(0, 2)}
        </div>
        <span
          onClick={() => toast.info('Feature coming soon')}
          className="text-app-muted text-xs cursor-pointer"
        >
          Change Photo
        </span>
      </div>

      {/* Form */}
      <div className="mx-5 bg-white rounded-2xl shadow-card p-5 space-y-4">
        <div>
          <label className="block text-xs font-display font-bold text-app-muted mb-1.5 uppercase tracking-wider">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full bg-app-bg border border-app-border rounded-xl py-3 px-4 text-sm text-app-text font-body outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-display font-bold text-app-muted mb-1.5 uppercase tracking-wider">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full bg-app-bg border border-app-border rounded-xl py-3 px-4 text-sm text-app-text font-body outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-display font-bold text-app-muted mb-1.5 uppercase tracking-wider">Phone</label>
          <input
            type="text"
            value={user?.phone || ''}
            disabled
            className="w-full bg-gray-100 border border-app-border rounded-xl py-3 px-4 text-sm text-app-muted font-body outline-none cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-xs font-display font-bold text-app-muted mb-1.5 uppercase tracking-wider">Location / City</label>
          <input
            type="text"
            value={location}
            onChange={e => setLocation(e.target.value)}
            className="w-full bg-app-bg border border-app-border rounded-xl py-3 px-4 text-sm text-app-text font-body outline-none"
          />
        </div>
      </div>

      <div className="px-5 pt-6 pb-10">
        <motion.div
          whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          className="w-full bg-green-700 text-white font-display font-bold text-center py-4 rounded-full cursor-pointer hover:bg-green-600 transition-colors"
        >
          Save Changes
        </motion.div>
      </div>
    </motion.div>
  );
}
